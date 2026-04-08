import { getGatewayForLocation } from "../services/payment.gateway.factory.js";
import { createRedisClient } from "../redisClient.js";
import Transaction from "../models/transaction.model.js";
import NjangiGroup from "../models/njangi.group.model.js";
import User from "../models/user.model.js";
import generatePaymentReference from "../utils/generateReference.js";
import { isValidObjectId } from "mongoose";
import { formatCurrency } from "../utils/currency.utils.js";
import { config } from "dotenv";

config();

const redis = createRedisClient();

/**
 * Unified payment initiation endpoint
 * Automatically selects payment gateway based on user location
 */
export async function initiatePayment(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { amount, phone, description, groupId, paymentMethod } = req.body;
  const location = req.userLocation; // Attached by location middleware

  // Validation
  if (!amount || isNaN(parseFloat(amount))) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  if (!groupId || !isValidObjectId(groupId)) {
    return res.status(400).json({ error: "Invalid group ID" });
  }

  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    // Fetch group and verify membership
    const group = await NjangiGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const isMember = group.groupMembers.includes(req.user.id);
    if (!isMember) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

    const user = await User.findById(req.user.id);

    // Update user's location and currency preferences if not set
    if (!user.country && location) {
      user.country = location.country;
      user.countryName = location.countryName;
      user.currency = location.currency;
      user.preferredPaymentMethod = location.paymentMethod;
      user.paymentProvider = location.provider;
      await user.save();
    }

    // Determine payment gateway (from location or explicit choice)
    const provider = paymentMethod || location.provider || user.paymentProvider;
    const currency = location.currency || user.currency || "XAF";
    
    const gateway = getGatewayForLocation({ provider });

    // Generate reference
    const reference = generatePaymentReference();

    // Initiate payment based on provider
    let paymentResult;
    
    if (provider === "campay") {
      // Mobile money payment (Campay)
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required for mobile money" });
      }

      if (!/^(\+237)?\d{8,15}$/.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }

      paymentResult = await gateway.initiatePayment({
        amount,
        phone,
        description,
        currency,
        reference,
        userName: `${user.lastName} ${user.firstName}`,
      });

      if (!paymentResult.success) {
        return res.status(400).json({
          success: false,
          message: paymentResult.message || "Payment initiation failed",
        });
      }

      // Create transaction record
      const transaction = await Transaction.create({
        type: "expense",
        amount,
        currency,
        campay_reference: reference,
        reference: paymentResult.campayReference,
        groupId,
        status: "pending",
        note: description,
        memberId: req.user.id,
        paymentProvider: "campay",
      });

      return res.status(200).json({
        success: true,
        message: "Mobile money payment initiated",
        provider: "campay",
        transactionId: transaction.id,
        reference: reference,
        campayReference: paymentResult.campayReference,
        currency,
        amount: formatCurrency(amount, currency),
      });

    } else if (provider === "stripe") {
      // Credit card payment (Stripe)
      paymentResult = await gateway.initiatePayment({
        amount,
        currency,
        description,
        metadata: {
          userId: req.user.id,
          groupId,
          userName: `${user.lastName} ${user.firstName}`,
          reference,
        },
      });

      if (!paymentResult.success) {
        return res.status(400).json({
          success: false,
          message: paymentResult.message || "Payment initiation failed",
        });
      }

      // Create transaction record
      const transaction = await Transaction.create({
        type: "expense",
        amount,
        currency,
        reference: reference,
        stripePaymentIntentId: paymentResult.paymentIntentId,
        groupId,
        status: "pending",
        note: description,
        memberId: req.user.id,
        paymentProvider: "stripe",
      });

      return res.status(200).json({
        success: true,
        message: "Payment intent created",
        provider: "stripe",
        transactionId: transaction.id,
        paymentIntentId: paymentResult.paymentIntentId,
        clientSecret: paymentResult.clientSecret,
        currency,
        amount: formatCurrency(amount, currency),
      });
    } else {
      return res.status(400).json({
        error: `Payment provider ${provider} not supported`,
      });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Payment initiation failed",
    });
  }
}

/**
 * Check payment status (unified for all providers)
 */
export async function checkPaymentStatus(req, res) {
  const { reference } = req.params;
  const { transactionId } = req.query;

  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Find transaction
    const transaction =
      (await Transaction.findOne({ reference })) ||
      (transactionId && (await Transaction.findById(transactionId)));

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Skip if already completed
    if (transaction.status === "completed") {
      return res.status(200).json({
        success: true,
        status: "completed",
        message: "Transaction already completed",
      });
    }

    const provider = transaction.paymentProvider;
    const gateway = getGatewayForLocation({ provider });

    // Check status based on provider
    let statusResult;

    if (provider === "campay") {
      statusResult = await gateway.checkStatus(transaction.reference);
    } else if (provider === "stripe") {
      statusResult = await gateway.checkStatus(transaction.stripePaymentIntentId);
    } else {
      return res.status(400).json({ error: "Unknown payment provider" });
    }

    if (!statusResult.success) {
      return res.status(500).json({
        error: statusResult.message || "Failed to check payment status",
      });
    }

    // Update transaction if completed (for Campay, Stripe webhooks handle this)
    if (provider === "campay" && statusResult.status === "completed") {
      transaction.status = "completed";
      await transaction.save();

      // Update group contributions (same logic as webhook for Stripe)
      const { groupId, amount, currency } = transaction;

      const updatedGroup = await NjangiGroup.findOneAndUpdate(
        { _id: groupId, "memberContributions.member": req.user.id },
        {
          $inc: {
            "memberContributions.$.paymentsCount": 1,
            "memberContributions.$.totalAmountPaid": amount,
          },
          $set: {
            "memberContributions.$.lastPaymentDate": new Date(),
          },
        },
        { new: true }
      );

      if (!updatedGroup) {
        await NjangiGroup.findByIdAndUpdate(groupId, {
          $push: {
            memberContributions: {
              member: req.user.id,
              paymentsCount: 1,
              totalAmountPaid: amount,
              lastPaymentDate: new Date(),
            },
          },
        });
      }

      // TODO: Send notifications (copy from webhook handler)
    }

    return res.status(200).json({
      success: true,
      status: statusResult.status,
      provider,
      transactionId: transaction.id,
      amount: formatCurrency(transaction.amount, transaction.currency),
      currency: transaction.currency,
    });
  } catch (error) {
    console.error("Check payment status error:", error);
    return res.status(500).json({
      error: error.message || "Failed to check payment status",
    });
  }
}

/**
 * Create Stripe Payment Intent (for frontend Stripe Elements)
 */
export async function createStripePaymentIntent(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { amount, currency, description, groupId } = req.body;

  if (!amount || !currency || !description || !groupId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await User.findById(req.user.id);
    const gateway = getGatewayForLocation({ provider: "stripe" });

    const result = await gateway.initiatePayment({
      amount,
      currency,
      description,
      metadata: {
        userId: req.user.id,
        groupId,
        userName: `${user.lastName} ${user.firstName}`,
      },
    });

    if (!result.success) {
      return res.status(400).json({
        error: result.message || "Failed to create payment intent",
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      type: "expense",
      amount,
      currency,
      stripePaymentIntentId: result.paymentIntentId,
      groupId,
      status: "pending",
      note: description,
      memberId: req.user.id,
      paymentProvider: "stripe",
    });

    return res.status(200).json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    return res.status(500).json({
      error: error.message || "Failed to create payment intent",
    });
  }
}

/**
 * Confirm Stripe Payment (optional, for server-side confirmation)
 */
export async function confirmStripePayment(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { paymentIntentId, paymentMethodId } = req.body;

  if (!paymentIntentId || !paymentMethodId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const gateway = getGatewayForLocation({ provider: "stripe" });
    const result = await gateway.confirmPayment(paymentIntentId, paymentMethodId);

    return res.status(200).json({
      success: true,
      status: result.status,
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return res.status(500).json({
      error: error.message || "Failed to confirm payment",
    });
  }
}

export default {
  initiatePayment,
  checkPaymentStatus,
  createStripePaymentIntent,
  confirmStripePayment,
};
