export function calculateNextDueDate({
  startDate,
  contributionFrequency,
  lastPaymentDate,
}) {
  const now = new Date();

  const frequencyToDays = {
    Weekly: 7,
    "Bi-weekly": 14,
    Monthly: 30,
  };

  const interval = frequencyToDays[contributionFrequency];
  if (!interval) throw new Error("Invalid frequency: " + contributionFrequency);

  let baseDate = lastPaymentDate ?? startDate;
  let nextDate = new Date(baseDate);

  // Add interval until it's in the future
  while (nextDate <= now) {
    nextDate.setDate(nextDate.getDate() + interval);
  }

  return nextDate;
}
