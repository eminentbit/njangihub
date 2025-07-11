import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { profanityList } from "../utils/profanityList";

// Step 1: Account Setup Schema
export const accountSetupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .trim()
      .regex(
        /^[A-Za-z\s'-]+$/,
        "First name cannot contain numbers or special characters"
      ),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .trim()
      .regex(
        /^[A-Za-z\s'-]+$/,
        "Last name cannot contain numbers or special characters"
      ),
    phoneNum: z
      .string()
      .min(1, "Phone number is required")
      .refine((val) => {
        if (!val) return false;
        const phoneNumber = parsePhoneNumberFromString(val);
        return phoneNumber ? phoneNumber.isValid() : false;
      }, "Invalid phone number"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format")
      .trim(),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .trim(),
    confirmPassword: z.string().min(1, "Confirm password is required").trim(),
    profilePic: z
      .instanceof(FileList)
      .optional()
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          return files.length === 1;
        },
        { message: "Please upload only one file" }
      )
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          const file = files[0];
          return ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
        },
        { message: "Only .jpg, .jpeg, and .png files are supported" }
      )
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          const file = files[0];
          return file.size <= 5 * 1024 * 1024; // 5MB
        },
        { message: "File size must be less than 5MB" }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Step 2: Njangi Group Details Schema
export const groupDetailsSchema = z.object({
  groupName: z
    .string()
    .min(1, "Group name is required")
    .max(50, "Group name cannot exceed 50 characters")
    .refine(
      (name) => {
        return !profanityList.some((word) =>
          name.toLowerCase().includes(word.toLowerCase())
        );
      },
      {
        message:
          "Group name contains inappropriate language! Please choose another name",
      }
    ),
  contributionAmount: z
    .string()
    .min(1, "Contribution amount is required")
    .refine((value) => !isNaN(Number(value.replace(/,/g, ""))), {
      message: "Contribution amount must be a number",
    })
    .refine((value) => Number(parseInt(value)) > 0, {
      message: "Contribution amount must be greater than 0",
    }),

  contributionFrequency: z
    .enum(["Weekly", "Monthly", "Bi-weekly"], {
      required_error: "Please select a contribution frequency",
    })
    .refine((value) => !!value, {
      message: "Please select a contribution frequency",
    }),
  payoutMethod: z.enum(["Rotation", "Lottery", "Bidding"], {
    required_error: "Please select a payout method",
  }),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Start date must be in the future"),
  endDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        return date.trim().length > 0;
      },
      { message: "End date cannot be empty if provided" }
    )
    .superRefine((date, ctx) => {
      if (!date) return; // Skip validation if no end date is provided

      // Access sibling fields from the `data` parameter
      const data = ctx as { startDate?: string; endDate?: string };
      if (!data.startDate) return; // Skip validation if no start date is provided

      const startDate = new Date(data.startDate);
      const endDate = new Date(date);

      if (endDate <= startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date",
        });
      }
    }),

  numOfMembers: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim() === "") return true;
        return !isNaN(Number(value));
      },
      { message: "Number of members must be a number" }
    )
    .refine(
      (value) => {
        if (!value || value.trim() === "") return true;
        return Number(value) > 0;
      },
      { message: "Number of members must be greater than 0" }
    ),
  rules: z.string().optional(),
});

// Step 3: Invite Members Schema
export const inviteMembersSchema = z.object({
  invites: z
    .array(
      z
        .object({
          type: z.enum(["email", "phone"], {
            required_error:
              "Please select how you'd like to invite this member",
          }),
          value: z.string().min(1, "This field is required"),
        })
        .superRefine((data, ctx) => {
          if (data.type === "email") {
            const isEmail = z.string().email().safeParse(data.value).success;
            if (!isEmail) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please enter a valid email address",
                path: ["value"],
              });
            }
          } else if (data.type === "phone") {
            const phone = parsePhoneNumberFromString(data.value);
            if (!phone || !phone.isValid()) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "Please enter a valid phone number and include your country code",
                path: ["value"],
              });
            }
          }
        })
    )
    .min(1, "At least one member must be invited")
    .max(3, "You can only invite up to 3 members"),
});

// Combined form schema types
export type AccountSetupFormData = z.infer<typeof accountSetupSchema>;
export type GroupDetailsFormData = z.infer<typeof groupDetailsSchema>;
export type InviteMembersFormData = z.infer<typeof inviteMembersSchema>;

export type FormData = AccountSetupFormData &
  GroupDetailsFormData &
  InviteMembersFormData;
