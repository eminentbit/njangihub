// this file is responsible for handling the logic of inviting members to a group
// and sending them an invite link. It includes functions to create invites,
import crypto from "crypto";
import Invite from "../models/invite.model.js";
import NjangiGroup from "../models/njangi.group.model.js";
import User from "../models/user.model.js";
import { sendNjangiAleadyAddMemberEmail } from "../mail/emails.js";
import { config } from "dotenv";
config();

export const generateToken = () => crypto.randomBytes(20).toString("hex");

// Utility functions
const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

export const inviteMembersToGroup = async (
  inviteMembers,
  groupId,
  adminId,
  groupName,
  adminFirstName,
  adminLastName,
  contributionFrequency,
  contributionAmount
) => {
  const group = await NjangiGroup.findById(groupId);
  if (!group) throw new Error("Group not found");

  const invites = await Promise.all(
    inviteMembers.invites.map(async (invite) => {
      // Accept both email and phone in the invite object
      const email =
        invite.email || (isEmail(invite.contact) ? invite.contact : null);
      const phone =
        invite.phone || (!isEmail(invite.contact) ? invite.contact : null);

      if (!email && !phone) throw new Error("Missing contact for invite");

      // Avoid duplicate invites (by email or phone)
      const inviteOrConditions = [];
      if (email) inviteOrConditions.push({ email });
      if (phone) inviteOrConditions.push({ phone });

      let existingInvite = null;
      if (inviteOrConditions.length > 0) {
        existingInvite = await Invite.findOne({
          groupId,
          $or: inviteOrConditions,
        });
      }
      if (existingInvite) return existingInvite;

      // Only build $or array with non-null values
      const userOrConditions = [];
      if (email) userOrConditions.push({ email });
      if (phone) userOrConditions.push({ phoneNumber: phone });

      let existingUser = null;
      if (userOrConditions.length > 0) {
        existingUser = await User.findOne({ $or: userOrConditions });
      }

      if (existingUser) {
        // Optionally, check if an invite already exists for this user in this group
        const inviteOrConditions = [];
        if (email) inviteOrConditions.push({ email });
        if (phone) inviteOrConditions.push({ phone });
        const existingInvite = await Invite.findOne({
          groupId,
          $or: inviteOrConditions,
        });
        if (existingInvite) return existingInvite;
      }

      // Generate invite token
      const Invitetoken = generateToken();

      // Build registration URL
      let registrationUrl = `${process.env.REGISTER_URL}/members?inviteToken=${Invitetoken}&email=${email}`;
      if (email) registrationUrl += `&email=${encodeURIComponent(email)}`;
      if (phone) registrationUrl += `&phone=${encodeURIComponent(phone)}`;

      // Save invite
      const newInvite = await Invite.create({
        groupId,
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
        inviteToken: Invitetoken,
        invitedBy: adminId,
        status: "pending",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      });

      // Send email invite if contact is email
      if (email) {
        await sendNjangiAleadyAddMemberEmail(
          email,
          "Hi there",
          `${adminFirstName} ${adminLastName}`,
          contributionAmount,
          contributionFrequency,
          groupName,
          registrationUrl
        );
      }

      // Send SMS invite if contact is phone
      if (phone) {
        // Here you would integrate with an SMS service to send the invite
        // For example, using Twilio or another SMS provider
        console.log(`SMS invite sent to ${phone}: ${registrationUrl}`);
      }

      return newInvite;
    })
  );

  return invites;
};
