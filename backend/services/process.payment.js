import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const API_KEY = process.env.CAMPAY_API_KEY;

export async function processPayout(group) {
  const { position } = group.getPositionAndRounds();
  const memberId = group.groupMembers[position - 1];

  const amount = group.contributionAmount * group.groupMembers.length;

  const user = await User.findById(memberId);

  // (rotation-based)
  group.payoutHistory.push({
    member: memberId,
    amount,
    status: "completed",
    method: "momo",
    date: new Date(),
  });

  await group.save();

  await withdrawFunds({
    amount,
    description: "Received Njangi payment",
    phone: user?.phoneNumber,
  });

  await Transaction.create({
    amount,
    status: "completed",
    type: "income",
    groupId: group._id,
  });

  console.log(
    `Payout of ${amount} to user ${memberId} in group ${group.name} completed`
  );
}

export async function withdrawFunds({ amount, phone, description }) {
  try {
    const response = await axios.post(
      `${process.env.CAMPAY_BASE_URL}/api/withdraw/`,
      {
        amount,
        to: phone,
        description,
        external_reference: uuidv4(),
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Withdrawal failed:", error.response?.data || error.message);
    throw error;
  }
}
