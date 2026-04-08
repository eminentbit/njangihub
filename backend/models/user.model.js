// Account set up

import { Schema, model } from "mongoose";
import MODEL_NAMES from "../utils/model.names.js";
import { type } from "os";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicUrl: { type: String },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    role: { type: String, enum: ["admin", "member", "bod"], default: "member" },
    creditScore: { type: Number, default: 0 },
    location: { type: String },
    country: { type: String }, // ISO country code (e.g., CM, US, GB)
    countryName: { type: String }, // Full country name
    currency: { type: String, default: "USD" }, // ISO 4217 currency code
    preferredPaymentMethod: { 
      type: String, 
      enum: ["mobile_money", "card"], 
      default: "card" 
    },
    paymentProvider: {
      type: String,
      enum: ["campay", "stripe", "mpesa", "mtn", "paystack"],
      default: "stripe"
    },
    status: {
      type: String,
      enum: ["active", "pending", "invited", "suspended"],
      default: "pending",
    },
    lastlogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    paymentMode: {
      type: String,
      enum: ["free", "starter", "enterprise"],
      default: "free",
    },
    groupsCreated: Number,
    groupsJoined: Number,
    resetPasswordToken: String,
    resetPasswordExpireAt: Date,
    verificationToken: String,
    verificationTokenExpireAt: Date,
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = model(MODEL_NAMES.USER, userSchema);

export default User;
