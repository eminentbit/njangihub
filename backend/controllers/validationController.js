import NjangiDrafts from "../models/njangi.draft.model.js";
import User from "../models/user.model.js";
import NjangiGroup from "../models/njangi.group.model.js";
import Invite from "../models/invite.model.js";
import validator from "validator";

const isValidEmail = (contact) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

const isValidPhone = (contact) => /^\+?[1-9]\d{6,14}$/.test(contact);

/**
 * Validates whether an email is already used in a NjangiDraft (temporary creation).
 * This helps prevent duplicate signups during the Njangi creation process.
 */
export const validateEmail = async (req, res) => {
  const { email } = req.query;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // if (!email) {
  //   return res.status(400).json({ valid: false, message: "Email is required" });
  // }

  try {
    console.log(`Validating email: ${email}`);

    const [inDraft, inInviteMembers, inUsers] = await Promise.all([
      NjangiDrafts.exists({ "accountSetup.email": { $eq: email } }),
      NjangiDrafts.exists({ "inviteMembers.value": { $eq: email } }),
      User.exists({ email: { $eq: email } }),
    ]);

    const exists = inDraft || inInviteMembers || inUsers;

    return res.json({ valid: !exists });
  } catch (error) {
    res
      .status(500)
      .json({ valid: false, message: "Server error validating email" });
  }
};

/**
 * Validates whether a phone number is already used in a NjangiDraft, NjangiGroup or User.
 * This helps prevent duplicate signups during the Njangi creation process.
 */
export const validatePhoneNumber = async (req, res) => {
  let { phoneNumber } = req.query;

  if (!phoneNumber || typeof phoneNumber !== "string") {
    return res
      .status(400)
      .json({ valid: false, message: "Phone number is required." });
  }

  // Trim and sanitize
  phoneNumber = phoneNumber.trim();

  // Reject if it's too short (e.g., only a country code)
  if (phoneNumber.length < 7) {
    return res.status(400).json({
      valid: false,
      message: "Phone number is too short to be valid.",
    });
  }

  try {
    console.log(`Validating phone number: ${phoneNumber}`);

    const [inDrafts, inUsers] = await Promise.all([
      NjangiDrafts.exists({ "accountSetup.phoneNumber": phoneNumber }),
      // NjangiGroup.exists({ phoneNumber }),
      User.exists({ phoneNumber }),
    ]);

    console.log(inDrafts, inUsers);

    const exists = inDrafts || inUsers;
    return res.json({ valid: !exists });
  } catch (error) {
    console.error("Phone number validation error:", error);
    res.status(500).json({
      valid: false,
      message: "Server error validating phone number.",
    });
  }
};

/**
 * Validates whether a Njangi group name is already used in a NjangiDraft.
 * Prevents users from creating drafts with conflicting names.
 */
export const validateGroupName = async (req, res) => {
  const { groupName } = req.query;

  if (!groupName) {
    return res
      .status(400)
      .json({ valid: false, message: "Group name is required" });
  }

  try {
    console.log(`Validating group name: ${groupName}`);

    // Trim and sanitize the group name
    const sanitizedGroupName = groupName.trim();

    const [inDrafts, inGroups] = await Promise.all([
      NjangiDrafts.exists({
        "groupDetails.groupName": {
          $regex: new RegExp(`^${sanitizedGroupName}$`, "i"),
        },
      }),
      NjangiGroup.exists({
        name: { $regex: new RegExp(`^${sanitizedGroupName}$`, "i") },
      }),
    ]);

    const exists = inDrafts || inGroups;
    console.log({ inDrafts, inGroups, exists });
    res.json({ valid: !exists });
  } catch (error) {
    res
      .status(500)
      .json({ valid: false, message: "Server error validating group name" });
  }
};

/**
 * Validates whether a contact (email or phone) is already used in a NjangiDraft.
 * This helps prevent duplicate signups or invites during the Njangi creation process.
 */
export const validateInviteContact = async (req, res) => {
  let { contact } = req.query;

  if (!contact) {
    return res
      .status(400)
      .json({ valid: false, message: "Contact is required." });
  }

  // Sanitize contact input (trim and remove spaces)
  contact = contact.trim();
  let sanitizedContact = contact.replace(/\s+/g, ""); // Removes spaces

  // Normalize email to lowercase if it's an email
  if (sanitizedContact.includes("@")) {
    sanitizedContact = sanitizedContact.toLowerCase();
  }

  const isEmail = isValidEmail(sanitizedContact);
  const isPhone = isValidPhone(sanitizedContact);

  if (!isEmail && !isPhone) {
    return res
      .status(400)
      .json({ valid: false, message: "Invalid contact format." });
  }

  try {
    console.log(`Validating invite contact from backend: ${sanitizedContact}`);

    // Check if contact already exists in a Njangi draft's invite list
    const draftConflict = await NjangiDrafts.exists({
      "inviteMembers.value": sanitizedContact,
    });

    // prevent inviting already registered users
    const userConflict = await User.exists({
      $or: [
        ...(isEmail ? [{ email: sanitizedContact }] : []),
        ...(isPhone ? [{ phoneNumber: sanitizedContact }] : []),
      ],
    });

    // Check for pending invite by email or phone
    const inviteOrConditions = [];
    if (isEmail) inviteOrConditions.push({ email: sanitizedContact });
    if (isPhone) inviteOrConditions.push({ phone: sanitizedContact });

    let pendingInvite = null;
    if (inviteOrConditions.length > 0) {
      pendingInvite = await Invite.exists({
        $or: inviteOrConditions,
        status: { $in: ["pending", "accepted", "expired"] },
      });
    }

    if (pendingInvite) {
      return res.status(200).json({
        valid: false,
        message: "This contact has already received an invite.",
      });
    }

    if (draftConflict) {
      return res.status(200).json({
        valid: false,
        message:
          "This contact has already been invited to a Njangi group in setup.",
      });
    }

    if (userConflict) {
      return res.status(200).json({
        valid: false,
        message: "This contact is already registered.",
      });
    }

    return res.json({ valid: true });
  } catch (err) {
    console.error("Validation error:", err);
    return res.status(500).json({
      valid: false,
      message: "Internal server error during contact validation.",
    });
  }
};
