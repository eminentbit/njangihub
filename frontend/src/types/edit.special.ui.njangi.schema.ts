import { z } from "zod";

export const editNjangiSchema = z
  .object({
    groupName: z.string().min(3, "Group name must be at least 3 characters"),
    contributionAmount: z
      .number()
      .min(1000, "Minimum contribution is 1,000 FCFA"),
    contributionFrequency: z.string().min(1, "Please select frequency"),
    numberOfMember: z
      .number()
      .min(2, "Minimum 2 members required")
      .max(50, "Maximum 50 members allowed"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    payoutMethod: z.string().min(1, "Please select payout method"),
    rules: z.string().min(10, "Rules must be at least 10 characters"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    path: ["endDate"],
    message: "End date cannot be before start date",
  });
