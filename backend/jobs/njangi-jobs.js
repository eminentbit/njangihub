import cron from "node-cron";
import NjangiGroup from "../models/njangi.group.model.js";
import { sendDueReminder } from "../mail/emails.js";
import User from "../models/user.model.js";
import { config } from "dotenv";
import { updateCreditScores } from "../services/loan.service.js";
import { processPayout } from "../services/process.payment.js";
config();

export function getNextDueDate(lastDate, frequency) {
  const date = new Date(lastDate || new Date());
  switch (frequency) {
    case "Weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "Bi-weekly":
      date.setDate(date.getDate() + 14);
      break;
    case "Monthly":
      date.setMonth(date.getMonth() + 1);
      break;
  }
  return date;
}

cron.schedule("0 8 * * *", async () => {
  console.log("🔔 Njangi due reminder job started...");

  const today = new Date();

  // Get all active Njangi groups
  const groups = await NjangiGroup.find({ status: "approved" }).populate(
    "groupMembers"
  );

  for (const group of groups) {
    for (const contribution of group.memberContributions) {
      try {
        const memberId = contribution.member;
        const member = group.groupMembers.find((m) => m._id.equals(memberId));

        if (!member) continue;

        const nextDueDate = group.getNextPaymentDate(memberId);
        const daysUntilDue = Math.ceil(
          (nextDueDate - today) / (1000 * 60 * 60 * 24)
        );

        const isOverdue = daysUntilDue < 0;
        const isTwoDaysAway = daysUntilDue === 2;

        if (isOverdue || isTwoDaysAway) {
          const user = await User.findById(memberId);

          if (!user?.email) continue;

          const dueDateFormatted = nextDueDate.toDateString();

          const paymentLink = `${process.env.FRONTEND_URL}/${user.role}/payments`;

          await sendDueReminder(
            user.email,
            group.contributionAmount + " FCFA",
            dueDateFormatted,
            group.name,
            user.lastName,
            user.firstName,
            paymentLink
          );

          console.log(`📧 Reminder sent to ${user.email}`);
        }
      } catch (err) {
        console.error("❌ Error processing member for group:", group.name, err);
      }
    }
  }

  console.log("✅ Njangi due reminder job finished.");
});

cron.schedule("0 2 * * *", () => {
  console.log("Running credit score update job...");
  updateCreditScores();
});

cron.schedule("0 2 * * *", async () => {
  console.log("Checking Njangi payouts...");

  const groups = await NjangiGroup.find({ status: "approved" });

  for (const group of groups) {
    try {
      const { position, totalRounds } = group.getPositionAndRounds();

      // If all members already paid out
      if (position > totalRounds) continue;

      const now = new Date();
      const nextPaymentDate = group.getNextPaymentDate();

      if (nextPaymentDate <= now) {
        await processPayout(group);
      }
    } catch (error) {
      console.error("Error processing group:", group._id, error);
    }
  }
});
