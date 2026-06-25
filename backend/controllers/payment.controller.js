import { createRedisClient } from "../redisClient.js";
import { config } from "dotenv";
import CACHE_NAMES from "../utils/cache.names.js";
import generatePaymentReference from "../utils/generateReference.js";
import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import axios from "axios";
import NjangiGroup from "../models/njangi.group.model.js";
import NjangiActivityLog from "../models/njangi.activity.log.model.js";
import NjangiNotification from "../models/notification.model.js";
import { isValidObjectId } from "mongoose";
config();

const redis = createRedisClient();

export async function getCampayToken(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const url = `${process.env.CAMPAY_BASE_URL}/api/token/`;
  const data = {
    username: process.env.CAMPAY_APP_USERNAME,
    password: process.env.CAMPAY_APP_PASSWORD,
  };

  try {
    const cachedToken = await redis.get(CACHE_NAMES.CAMPAYTOKEN);
    if (cachedToken !== null) {
      return res.status(200).json({ token: cachedToken });
    }

    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });

    const token = response.data.token;
    await redis.set(CACHE_NAMES.CAMPAYTOKEN, token, "EX", 3600);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(
      "Campay token error:",
      error?.response?.data || error.message,
    );
    return res.status(500).json({ error: "Failed to fetch Campay token" });
  }
}

export const getPaymentLink = async (req, res) => {
  const { amount, description } = req.body;

  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = await redis.get(CACHE_NAMES.CAMPAYTOKEN);
    if (!token) {
      return res.status(401).json({ error: "Missing Campay token" });
    }

    const user = await User.findById(req.user.id);
    const reference = generatePaymentReference();
    const redirectUrl = `${process.env.FRONTEND_URL}/${
      user?.role || "user"
    }/dashboard`;

    const data = {
      currency: "XAF",
      description: description || "Njangi payment",
      external_reference: reference,
      redirect_url: redirectUrl,
      ...(amount && { amount }), // only include if present
    };

    const response = await axios.post(
      `${process.env.CAMPAY_BASE_URL}/api/get_payment_link/`,
      data,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const transaction = await Transaction.create({
      type: "expense",
      amount: data.amount || 0,
      currency: data.currency,
      reference: data.external_reference,
      note: data.description,
      memberId: req.user.id,
    });

    return res.status(200).json({
      link: response.data.link,
      transaction,
    });
  } catch (error) {
    console.error(
      "Payment link error:",
      error?.response?.data || error.message,
    );
    return res.status(error.response?.status || 500).json({
      error: error.response?.data || "Failed to create payment link",
    });
  }
};

export const initiatePayment = async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { amount, from, description, groupId } = req.body;

  if (!isValidObjectId(groupId)) {
    return res.status(400).json({ error: "Invalid Group ID format." });
  }

  if (!amount || isNaN(parseFloat(amount))) {
    return res.status(400).json({ error: "Invalid amount." });
  }

  if (!from || !/^(\+237)?\d{8,15}$/.test(from)) {
    return res.status(400).json({ error: "Invalid phone number format." });
  }

  if (!description) {
    return res.status(400).json({ error: "Description is required." });
  }

  if (!groupId) {
    return res.status(400).json({ error: "Group ID is required." });
  }

  try {
    const group = await NjangiGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    // Optional: check if user is a member
    const isMember = group.groupMembers.includes(req.user.id);
    if (!isMember) {
      return res
        .status(403)
        .json({ error: "You are not a member of this group." });
    }

    const user = await User.findById(req.user.id);

    const token = await redis.get(CACHE_NAMES.CAMPAYTOKEN);
    if (!token) {
      return res.status(401).json({ error: "Missing Campay token" });
    }

    const paymentAPIUrl = `${process.env.CAMPAY_BASE_URL}/api/collect/`;
    const reference = generatePaymentReference();

    const paymentData = {
      amount,
      from,
      description,
      currency: "XAF",
      external_reference: reference,
      external_user: `${user.lastName} ${user.firstName}`,
    };

    console.log("Payment Request Data", paymentData);

    const response = await axios.post(paymentAPIUrl, paymentData, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    const transaction = await Transaction.create({
      type: "expense",
      amount: paymentData.amount,
      campay_reference: paymentData.external_reference,
      reference: response.data.reference,
      groupId,
      status: "pending",
      note: response.data.description || "Payment initiated",
      memberId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      transactionId: transaction.id,
      paymentReference: reference,
      ...response.data,
    });
  } catch (error) {
    console.error(
      "Initiate payment error:",
      error?.response?.data || error.message,
    );
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Payment failed",
    });
  }
};

export const checkPaymentStatus = async (req, res) => {
  const { reference } = req.params;
  const { transactionId } = req.query;

  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (transactionId && typeof transactionId !== "string") {
    return res.status(400).json({ error: "Invalid transaction ID format." });
  }

  try {
    const transaction =
      (await Transaction.findOne({ reference })) ||
      (transactionId && (await Transaction.findById(transactionId)));

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Skip if already processed
    if (transaction.status === "completed") {
      return res
        .status(200)
        .json({ message: "Transaction already completed." });
    }

    const token = await redis.get(CACHE_NAMES.CAMPAYTOKEN);
    if (!token) {
      return res.status(401).json({ error: "Missing Campay token." });
    }

    // Query Campay for status update
    const url = `${process.env.CAMPAY_BASE_URL}/api/transaction/${reference}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    console.log(response.data);

    const status = response.data.status?.toLowerCase() || "";

    if (!status.includes("success")) {
      return res
        .status(200)
        .json({ status, message: "Payment not successful yet." });
    }

    // Mark transaction as completed
    transaction.status = "completed";
    await transaction.save();

    const { groupId, amount } = transaction;

    // Update NjangiGroup contribution
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
      { new: true },
    );

    // If the member doesn’t have a contribution record yet
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

    const group = await NjangiGroup.findById(groupId);
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the contribution
    await NjangiActivityLog.create({
      activityType: "CONTRIBUTION_MADE",
      performedBy: req.user.id,
      amount,
      groupId,
      description: `${user.lastName} ${user.firstName} paid ${amount} FCFA in ${group.name}`,
    });

    // Notify admin
    await NjangiNotification.create({
      content: `${user.lastName} ${user.firstName} made a payment of ${amount} FCFA`,
      type: "payment",
      recipients: [group.adminId],
      sender: user._id,
    });

    return res
      .status(200)
      .json({ success: true, message: "Payment verified and recorded." });
  } catch (error) {
    console.error(
      "checkPaymentStatus error:",
      error?.response?.data || error.message,
    );
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Error verifying payment",
    });
  }
};
