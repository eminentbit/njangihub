import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const inviteFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  phoneNum: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => {
      if (!val) return false;
      const phoneNumber = parsePhoneNumberFromString(val);
      return phoneNumber ? phoneNumber.isValid() : false;
    }, "Invalid phone number. Please enter a valid phone number."),
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
});

export type InviteFormSchemaData = z.infer<typeof inviteFormSchema>;
