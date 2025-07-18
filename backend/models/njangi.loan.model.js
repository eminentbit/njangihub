import { model, Schema } from "mongoose";
import MODEL_NAMES from "../utils/model.names.js";

const njangiLoanSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.GROUP,
      required: true,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
    },
    amount: { type: Number, required: true },
    interest: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },
    repayments: [
      {
        amountPaid: { type: Number, required: true },
        datePaid: { type: Date, default: Date.now },
      },
    ],
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    dueDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

const NjangiLoan = model(MODEL_NAMES.NJANGILOAN, njangiLoanSchema);

export default NjangiLoan;
