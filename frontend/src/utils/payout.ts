import { Group } from "../hooks/useAdmin";

export function getNextPayout(group: Group) {
  const payoutHistory = group.payoutHistory || [];
  const lastPaidMemberIds = payoutHistory.map((p) => p.member.toString());

  // Find the first member who hasn't received a payout
  const nextMemberId = group.groupMembers?.find(
    (m) => !lastPaidMemberIds.includes(m.toString())
  );

  // If all have received, start over or return null
  if (!nextMemberId) return null;

  // Calculate next payout date
  const payoutsDone = payoutHistory.length;
  const nextPayoutDate = new Date(group.startDate!);
  const freq = group.contributionFrequency;
  if (freq === "Weekly")
    nextPayoutDate.setDate(nextPayoutDate.getDate() + 7 * payoutsDone);
  if (freq === "Monthly")
    nextPayoutDate.setMonth(nextPayoutDate.getMonth() + payoutsDone);
  if (freq === "Bi-weekly")
    nextPayoutDate.setDate(nextPayoutDate.getDate() + 14 * payoutsDone);

  return {
    member: nextMemberId,
    amount: group.contributionAmount! * (group.groupMembers?.length || 0),
    date: nextPayoutDate,
  };
}

export function getNextPayoutDate(
  group: Group,
  userId: string,
  rotationOrder: string[]
) {
  const { startDate, contributionFrequency, payoutMethod } = group;

  const order = rotationOrder || group.groupMembers;
  const index = order.findIndex((id) => id === userId);

  if (index === -1) return null;

  const baseDate = new Date(startDate!);
  const nextDate = new Date(baseDate);

  let intervalDays = 0;
  if (contributionFrequency === "Weekly") intervalDays = 7;
  else if (contributionFrequency === "Bi-weekly") intervalDays = 14;
  else if (contributionFrequency === "Monthly") intervalDays = 30; // Approximate

  // For "Rotation" payout method
  if (payoutMethod === "Rotation") {
    const daysToAdd = intervalDays * index;
    nextDate.setDate(baseDate.getDate() + daysToAdd);
    return nextDate.toDateString();
  }

  // For Lottery or Bidding – can't predict without backend logic
  return "TBD by admin";
}
