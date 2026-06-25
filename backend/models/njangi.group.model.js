import { model, Schema } from "mongoose";
import MODEL_NAMES from "../utils/model.names.js";

const njangiGroupSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
    },
    draftId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.NJANGIDRAFT,
    },
    contributionAmount: { type: Number, required: true },
    currency: { type: String, default: "XAF", uppercase: true }, // ISO 4217 currency code
    contributionFrequency: {
      type: String,
      enum: ["Weekly", "Monthly", "Bi-weekly"],
      required: true,
    },
    payoutMethod: {
      type: String,
      enum: ["Rotation", "Lottery", "Bidding"],
      required: true,
    },
    groupMembers: [{ type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER }],
    memberContributions: [
      {
        member: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER },
        paymentsCount: { type: Number, default: 0 },
        lastPaymentDate: { type: Date },
        totalAmountPaid: { type: Number, default: 0 },
      },
    ],
    payoutHistory: [
      {
        member: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USER },
        amount: { type: Number },
        status: { type: String, enum: ["failed", "completed", "pending"] },
        method: {
          type: String,
          enum: [
            "credit-card",
            "momo",
            "paypal",
            "bank-transfer",
            "debit-card",
          ],
        },
        date: { type: Date, required: true },
      },
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    expectedMembers: { type: Number },
    rules: { type: String },
    penaltyPercentage: { type: String, default: 20 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isPublic: { type: Boolean, default: false },
    description: { type: String },
  },
  { timestamps: true }
);

njangiGroupSchema.methods.getPositionAndRounds = function () {
  const totalMembers = this.groupMembers.length;

  // Total number of rounds (1 payout per member)
  const totalRounds = totalMembers;

  // Count completed payouts
  const completedPayouts = this.payoutHistory.filter(
    (p) => p.status === "completed"
  ).length;

  const currentPosition = completedPayouts + 1;

  return {
    position: currentPosition > totalRounds ? totalRounds : currentPosition,
    totalRounds,
  };
};

njangiGroupSchema.methods.getNextPaymentDate = function (memberId = null) {
  const now = new Date();

  // Helper: Add days safely to a date
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  };

  // Determine interval in days
  const frequencyToDays = {
    Weekly: 7,
    "Bi-weekly": 14,
    Monthly: 30,
  };

  const intervalDays = frequencyToDays[this.contributionFrequency];
  if (!intervalDays) {
    throw new Error(
      `Unknown contribution frequency: ${this.contributionFrequency}`
    );
  }

  let baseDate;

  if (memberId) {
    // Get the specific member's last payment date
    const member = this.memberContributions.find((m) =>
      m.member.equals(memberId)
    );
    baseDate = member?.lastPaymentDate || this.startDate;
  } else {
    // Use latest date from all members
    const allDates = this.memberContributions
      .map((m) => m.lastPaymentDate)
      .filter(Boolean);
    baseDate =
      allDates.length > 0
        ? new Date(Math.max(...allDates.map((d) => new Date(d).getTime())))
        : this.startDate;
  }

  // Calculate next date after baseDate
  let nextDate = addDays(new Date(baseDate), intervalDays);

  // If the baseDate is in the future, we don’t need to push it forward
  while (nextDate <= now) {
    nextDate = addDays(nextDate, intervalDays);
  }

  return nextDate;
};

njangiGroupSchema.methods.getFinancialSummary = function () {
  const totalContributed = this.memberContributions.reduce(
    (sum, mc) => sum + (mc.totalAmountPaid || 0),
    0
  );

  const totalReceived = this.payoutHistory.reduce((sum, payout) => {
    if (payout.status === "completed") {
      return sum + (payout.amount || 0);
    }
    return sum;
  }, 0);

  return { totalContributed, totalReceived };
};

njangiGroupSchema.methods.getUserFinancialSummary = function (userId) {
  const userIdStr = userId.toString();

  // 1. Get total contributed by this user
  const contribution = this.memberContributions.find(
    (mc) => mc.member.toString() === userIdStr
  );
  const totalContributed = contribution?.totalAmountPaid || 0;

  // 2. Get total received from payout history
  const totalReceived = this.payoutHistory.reduce((sum, payout) => {
    if (
      payout.member.toString() === userIdStr &&
      payout.status === "completed"
    ) {
      return sum + (payout.amount || 0);
    }
    return sum;
  }, 0);

  return {
    totalContributed,
    totalReceived,
  };
};

const NjangiGroup = model(MODEL_NAMES.GROUP, njangiGroupSchema);

export default NjangiGroup;
