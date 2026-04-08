import { model, Schema } from "mongoose";
import MODEL_NAMES from "../utils/model.names.js";
import { notifyAdminOfPayment } from "../mail/emails.js";

const transactionSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
    enum: ["income", "expense"],
  },
  memberId: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.USER,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "XAF",
    uppercase: true,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.GROUP,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  campay_reference: {
    type: String,
  },
  reference: {
    type: String,
  },
  paymentProvider: {
    type: String,
    enum: ["campay", "stripe", "mpesa", "mtn", "paystack"],
    default: "campay",
  },
  stripePaymentIntentId: {
    type: String,
  },
  note: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Async post hook
transactionSchema.post("save", async function (doc, next) {
  if (doc.status === "completed") {
    try {
      await notifyAdminOfPayment(doc.memberId, doc.amount, doc.groupId);
    } catch (error) {
      console.error("Error notifying admin of payment:", error);
    }
  }
  next();
});

const Transaction = model(MODEL_NAMES.TRANSACTION, transactionSchema);
export default Transaction;
