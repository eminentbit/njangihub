import Invite from "../models/invite.model.js";
import User from "../models/user.model.js";
import GroupMember from "../models/group.member.model.js";
import NjangiGroup from "../models/njangi.group.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendWelcomeEmail } from "../mail/emails.js";
import NjangiActivityLog from "../models/njangi.activity.log.model.js";
import validator from "validator";
import { config } from "dotenv";
config();

const acceptInvite = async (req, res) => {
  const { token } = req.query;
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  if (typeof email != "string" || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email", status: "failed" });
  }
  try {
    const invite = await Invite.findOne({ inviteToken: token });

    if (!invite || invite.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "Invite token is invalid or expired." });
    }

    // Check if user already exists by email or phone number
    let existingUser = await User.findOne({
      $or: [{ email: { $eq: email } }, { phoneNumber }],
    });
    if (existingUser) {
      let duplicateField =
        existingUser.email === email ? "email" : "phone number";
      return res.status(400).json({
        message: `User with this ${duplicateField} already exists. Please log in instead or use a different ${duplicateField}.`,
      });
    }

    // Check if an invite already exists for this email or phone number (and is still pending)
    let existingInvite = await Invite.findOne({
      $or: [{ email }, { phoneNumber }],
      status: "pending",
    });
    if (existingInvite && existingInvite.inviteToken !== token) {
      let duplicateField =
        existingInvite.email === email ? "email" : "phone number";
      return res.status(400).json({
        message: `An invite with this ${duplicateField} already exists. Please check your email or phone for the invite link.`,
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 1. Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: passwordHash,
      role: "member",
      status: "active",
      isVerified: false,
      groups: [invite.groupId],
    });

    // generate token and set cookie
    generateTokenAndSetCookie(res, newUser._id);

    // Add to GroupMember (if not already added)
    const alreadyMember = await GroupMember.findOne({
      groupId: invite.groupId,
      userId: newUser._id,
    });

    if (!alreadyMember) {
      await GroupMember.create({
        groupId: invite.groupId,
        userId: newUser._id,
        role: "member",
        status: "active",
        joinedAt: new Date(),
      });
    }

    // 3. Update NjangiGroup
    const group = await NjangiGroup.findById(invite.groupId);
    if (group && !group.groupMembers.includes(newUser._id)) {
      group.groupMembers.push(newUser._id);
      await group.save();
    }

    // 4. Update Invite
    invite.status = "accepted";
    await invite.save();

    //send welcome email to the new user
    await sendWelcomeEmail(
      newUser.email,
      `${newUser.firstName} ${newUser.lastName}`,
      `${process.env.USER_DASHBOARD_URL}?groupId=${invite.groupId}`
    );

    await NjangiActivityLog.create({
      groupId: group._id,
      activityType: "MEMBER_JOIN",
      performedBy: group.adminId,
      description: "Njangi group created by admin.",
    });

    return res.status(201).json({
      success: true,
      message: `Account created successfully. Redirecting to ${group.name} group dashboard!`,
      userId: newUser._id,
      groupId: invite.groupId,
      groupName: group.name,
    });
  } catch (err) {
    console.log("Error accepting invite:", err);
    return res
      .status(500)
      .json({ message: "Internal server error! Please try again later" });
  }
};

export default acceptInvite;
