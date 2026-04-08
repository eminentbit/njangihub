import { verifyWebhookSignature } from "../services/stripe.service.js";
import Transaction from "../models/transaction.model.js";
import NjangiGroup from "../models/njangi.group.model.js";
import NjangiActivityLog from "../models/njangi.activity.log.model.js";
import NjangiNotification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { fromSmallestUnit } from "../utils/currency.utils.js";

/**
 * Stripe Webhook Handler
 * Handles Stripe events for payment processing
 */
export async function handleStripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];
  
  let event;
  
  try {
    // Verify webhook signature
    event = verifyWebhookSignature(req.body, signature);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  console.log(`✅ Received Stripe webhook: ${event.type}`);

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      case "payment_intent.canceled":
        await handlePaymentCanceled(event.data.object);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(paymentIntent) {
  const { id, amount, currency, metadata } = paymentIntent;
  
  console.log(`💰 Payment succeeded: ${id}`);

  try {
    // Find transaction by payment intent ID
    const transaction = await Transaction.findOne({
      stripePaymentIntentId: id,
    });

    if (!transaction) {
      console.warn(`No transaction found for payment intent: ${id}`);
      return;
    }

    // Skip if already processed
    if (transaction.status === "completed") {
      console.log("Transaction already processed");
      return;
    }

    // Update transaction status
    transaction.status = "completed";
    await transaction.save();

    const { groupId, memberId, amount: txAmount } = transaction;

    // Update NjangiGroup contribution
    const updatedGroup = await NjangiGroup.findOneAndUpdate(
      { _id: groupId, "memberContributions.member": memberId },
      {
        $inc: {
          "memberContributions.$.paymentsCount": 1,
          "memberContributions.$.totalAmountPaid": txAmount,
        },
        $set: {
          "memberContributions.$.lastPaymentDate": new Date(),
        },
      },
      { new: true }
    );

    // If member doesn't have contribution record yet
    if (!updatedGroup) {
      await NjangiGroup.findByIdAndUpdate(groupId, {
        $push: {
          memberContributions: {
            member: memberId,
            paymentsCount: 1,
            totalAmountPaid: txAmount,
            lastPaymentDate: new Date(),
          },
        },
      });
    }

    const group = await NjangiGroup.findById(groupId);
    const user = await User.findById(memberId);

    // Log activity
    await NjangiActivityLog.create({
      activityType: "CONTRIBUTION_MADE",
      performedBy: memberId,
      amount: txAmount,
      groupId,
      description: `${user.lastName} ${user.firstName} paid ${txAmount} ${transaction.currency} in ${group.name}`,
    });

    // Notify admin
    await NjangiNotification.create({
      content: `${user.lastName} ${user.firstName} made a payment of ${txAmount} ${transaction.currency}`,
      type: "payment",
      recipients: [group.adminId],
      sender: user._id,
    });

    console.log(`✅ Payment processed for transaction ${transaction.id}`);
  } catch (error) {
    console.error("Error handling payment success:", error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
  const { id } = paymentIntent;
  
  console.log(`❌ Payment failed: ${id}`);

  try {
    const transaction = await Transaction.findOne({
      stripePaymentIntentId: id,
    });

    if (transaction) {
      transaction.status = "failed";
      await transaction.save();
      console.log(`Transaction ${transaction.id} marked as failed`);
    }
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

/**
 * Handle canceled payment
 */
async function handlePaymentCanceled(paymentIntent) {
  const { id } = paymentIntent;
  
  console.log(`🚫 Payment canceled: ${id}`);

  try {
    const transaction = await Transaction.findOne({
      stripePaymentIntentId: id,
    });

    if (transaction) {
      transaction.status = "failed";
      transaction.note = "Payment canceled by user";
      await transaction.save();
      console.log(`Transaction ${transaction.id} marked as canceled`);
    }
  } catch (error) {
    console.error("Error handling payment cancellation:", error);
  }
}

/**
 * Handle refunded charge
 */
async function handleChargeRefunded(charge) {
  const { payment_intent, amount, currency } = charge;
  
  console.log(`🔄 Charge refunded: ${payment_intent}`);

  try {
    const transaction = await Transaction.findOne({
      stripePaymentIntentId: payment_intent,
    });

    if (transaction) {
      const refundAmount = fromSmallestUnit(amount, currency.toUpperCase());
      transaction.note = `${transaction.note || ""} | Refunded: ${refundAmount} ${currency.toUpperCase()}`;
      await transaction.save();
      
      console.log(`Refund recorded for transaction ${transaction.id}`);
    }
  } catch (error) {
    console.error("Error handling refund:", error);
  }
}

export default handleStripeWebhook;
