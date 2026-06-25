// services/createNjangiFlow.js
import bcrypt from "bcryptjs";
import NjangiDraft from "../models/njangi.draft.model.js";
import NjangiGroup from "../models/njangi.group.model.js";
import User from "../models/user.model.js";
import { config } from "dotenv";
import emailQueue from "../bullMQ/queues/emailQueue.js";
import CACHE_NAMES from "../utils/cache.names.js";
config();

const viewURL = process.env.CREATED_NJANGI_STATE_URL;

/**
 * Creates a Njangi draft document from the given form data
 * @param {Object} formData - form data from the Njangi creation form
 * @returns {Object} An object with the created draftId
 * @throws {Error} If an error occurs while creating the draft
 *
 */
const createNjangiFlow = async (formData, njangiId, draftUserToken) => {
  try {
    const { accountSetup, groupDetails, inviteMembers } = formData;

    // Check for existing user
    const existingUser = await User.findOne({ email: accountSetup.email });
    if (existingUser) {
      console.log("User already exists with email:", accountSetup.email);
      throw new Error("A user with this email already exists.");
    }

    // Check for existing Njangi group
    const existingNjangi = await NjangiGroup.findOne({
      "groupDetails.groupName": groupDetails.groupName,
    });
    if (existingNjangi) {
      console.log("Group already exists with name:", groupDetails.groupName);
      throw new Error("A Njangi group with this name already exists.");
    }

    // Check for duplicate invite contacts
    const inviteContacts = inviteMembers.map((m) => m.contact);
    const uniqueContacts = new Set(inviteContacts);
    if (inviteContacts.length !== uniqueContacts.size) {
      console.log("Duplicate invite contacts found:", inviteContacts);
      throw new Error("Duplicate invites found in the invite list.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(accountSetup.password, 10);

    // Ensure groupDetails has proper Date objects
    const parsedGroupDetails = {
      ...groupDetails,
      startDate: groupDetails.startDate
        ? new Date(groupDetails.startDate)
        : null,
      endDate: groupDetails.endDate ? new Date(groupDetails.endDate) : null,
    };

    console.time("💾 Save draft to Mongo");

    // Create and save Njangi draft
    const draft = await NjangiDraft.create({
      accountSetup: {
        ...accountSetup,
        password: hashedPassword,
        role: "admin", // Default role for the creator
        status: "pending",
      },
      groupDetails: { ...parsedGroupDetails },
      inviteMembers,
      njangiRouteId: njangiId,
      draftUserToken, // Token to track user submissions
      status: "pending",
      createdAt: new Date(),
    });
    console.timeEnd("💾 Save draft to Mongo");

    // Add email job to Redis
    console.time("📬 Add email job to Redis");
    await emailQueue.add(
      CACHE_NAMES.SENDPENDINGEMAIL,
      {
        email: accountSetup.email,
        userName: `${accountSetup.firstName} ${accountSetup.lastName}`,
        groupName: groupDetails.groupName,
        creationDate: draft.createdAt,
        memberCount: groupDetails.numberOfMember || null,
        contributionAmount: groupDetails.contributionAmount,
        viewURL: `${viewURL}?draftId=${draft._id}`,
      },
      {
        removeOnComplete: true,
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 }, // Retry with delay
      }
    );
    console.timeEnd("📬 Add email job to Redis");

    console.log("Njangi draft created:", draft._id);
    return {
      draftId: draft._id,
      njangiId: draft.njangiRouteId,
      njangiURL: `${viewURL}?draftId=${draft._id}`,
    };
  } catch (error) {
    console.error("Error creating Njangi draft:", error.message);
    throw error;
  }
};

export default createNjangiFlow;
