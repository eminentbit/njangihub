import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  role: z.enum(["bod", "user", "member", "admin"]),
});

export type ValidatedUser = {
  email: string;
  role: "bod" | "user" | "member" | "admin";
  image?: string;
};

export interface User {
  isActive: boolean;
  status: string;
  name?: string;
  initials?: string;
  _id?: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  phoneNumber?: string;
  role: "user" | "admin" | "bod" | "member";
  location?: string;
  groupName?: string;
  paymentMode?: string;
  totalPayouts?: number;
  profilePicUrl?: string;
  createdAt?: string;
}
