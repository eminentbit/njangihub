import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import NjangiDraft from "../models/njangi.draft.model.js";
import LastLogin from "../models/login.attempt.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { getBrowserType, getDeviceName, getInfo } from "../utils/getInfo.js";
import { sendPasswordResetEmail } from "../mail/emails.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import CACHE_NAMES from "../utils/cache.names.js";
import emailQueue from "../bullMQ/queues/emailQueue.js";
import dbQueue from "../bullMQ/queues/dbQueue.js";
import MODEL_NAMES from "../utils/model.names.js";
config();

// Helper: find pending or suspended draft user
async function checkDraftStatus(email) {
  if (typeof email != "string" || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  const draft = await NjangiDraft.findOne({
    "accountSetup.email": { $eq: email },
  });
  return draft?.accountSetup;
}

// Shared options
const LOGIN_QUERIES_PROJECTION = "email status lastName firstName role";
const USER_PROJECTION = "-password";
const SIGNIN_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000;

// Validate request results
function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

export const checkSession = async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized: No session found" });
  }
  try {
    const user = await User.findById(req.user.id).select(USER_PROJECTION);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("checkSession error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStatusMessage = (status, role) => {
  if (status === "pending" && role !== "bod")
    return "Account pending approval.";
  if (status === "pending" && role === "bod") return null; // allow BOD pending logins
  if (status === "suspended") return "Account suspended. Contact support.";
  return null;
};

export const login = async (req, res) => {
  console.log("Logging in...");
  if (handleValidation(req, res)) return;

  const { email, password } = req.body;

  console.log(email);

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    let user = await User.findOne({ email: { $eq: email } }).select(
      `password ${LOGIN_QUERIES_PROJECTION}`
    );

    if (!user) {
      console.log("User not found:", email);
      const draft = await checkDraftStatus(email);
      console.log("Draft is:", draft);
      if (draft) {
        const msgMap = {
          pending: "Your account is still pending BOD approval.",
          suspended: "Account suspended. Contact support.",
        };
        return res.status(403).json({
          success: false,
          message: msgMap[draft.status] || "Unauthorized.",
        });
      }
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    console.log("Checking if password is valid");

    const [valid, lastRecord] = await Promise.all([
      bcrypt.compare(password, user.password),
      LastLogin.findOne({ userId: user.id }).sort({ createdAt: -1 }).lean(),
    ]);

    console.log("isValid: ", valid);

    if (!valid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const statusMessage = getStatusMessage(user.status, user.role);
    if (statusMessage) {
      return res.status(403).json({ success: false, message: statusMessage });
    }

    console.log("Status Message:", statusMessage);

    generateTokenAndSetCookie(res, user.id);

    const { ip } = await getInfo(req);
    const userAgent = req.headers["user-agent"];
    const browser = getBrowserType(userAgent);
    console.log("Browser is:", browser);
    const device = getDeviceName(userAgent);
    console.log("Device is:", device);

    dbQueue.add(CACHE_NAMES.LOGINALERT, {
      tableName: MODEL_NAMES.LOGINATTEMPT,
      data: {
        userId: user.id,
        email: user.email,
        ipAddress: ip,
        status: user.status,
      },
    });

    console.log("Finsihed adding to queue");

    // Send alert only if last login is old
    const now = Date.now();
    const threshold = now - SIGNIN_THRESHOLD_MS;
    const shouldAlert = !lastRecord || lastRecord.createdAt < threshold;

    console.log("Checking if we should alert");

    if (shouldAlert) {
      emailQueue.add(CACHE_NAMES.LOGINALERT, {
        to: user.email,
        device,
        browser,
        lastName: user.lastName,
        firstName: user.firstName,
      });
    }

    req.user = { id: user.id, role: user.role };

    req.session.user = {
      id: user.id,
      role: user.role,
      loggedInAt: Date.now(),
      ip: req.ip,
    };

    console.log("Put user in session");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(`[LOGIN_ERROR] ${validator.escape(email)}:`, err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

export const resetPassword = async (req, res) => {
  if (handleValidation(req, res)) return;
  const { email, newPassword } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const user = await User.findOne({ email: { $eq: email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  if (handleValidation(req, res)) return;

  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select(
      "password email lastName firstName role"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid)
      return res.status(401).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await emailQueue.add(CACHE_NAMES.PASSWORDCHANGE, {
      to: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
      redirectURL: `${process.env.FRONTEND_URL}/${user.role}/settings`,
    });

    return res.json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendPasswordResetLink = async (req, res) => {
  if (handleValidation(req, res)) return;

  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const sanitizedEmail = validator.normalizeEmail(email.toLowerCase().trim());
    const user = await User.findOne({ email: sanitizedEmail }).select(
      "_id email"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    const token = generateTokenAndSetCookie(res, user._id);

    // ✅ Add to queue instead of sending directly
    await emailQueue.add(CACHE_NAMES.PASSWORDRESET, {
      to: user.email,
      token,
    });

    return res.json({ message: "Password reset link sent" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
