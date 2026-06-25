import NjangiDraft from "../models/njangi.draft.model.js";
import NjangiGroup from "../models/njangi.group.model.js";
import User from "../models/user.model.js";
import validator from "validator";
import { config } from "dotenv";
import NjangiActivityLog from "../models/njangi.activity.log.model.js";
import Invite from "../models/invite.model.js";
import GroupMember from "../models/group.member.model.js";
import {
  generateToken,
  inviteMembersToGroup,
} from "../services/invite.service.js";
import {
  sendDueReminder,
  sendNjangiAleadyAddMemberEmail,
} from "../mail/emails.js";
import { Types } from "mongoose";
import NjangiNotification from "../models/notification.model.js";
import { createRedisClient } from "../redisClient.js";
import CACHE_NAMES from "../utils/cache.names.js";

config();

/**
 * Fetch members of a specific group created by an admin
 */
export const getMembersOfGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await NjangiGroup.findOne({
      _id: { $eq: groupId },
      adminId: req.user.id,
    }).populate("groupMembers", "-password"); // exclude password

    if (!group) {
      return res
        .status(404)
        .json({ message: "Group not found or not owned by this admin." });
    }

    res.status(200).json({
      groupId: group._id,
      groupName: group.name,
      members: group.groupMembers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching group members", error });
  }
};

/**
 * Fetch all members of all groups created by an admin (no duplicates)
 */
export const getAllMembersOfAdminGroups = async (req, res) => {
  try {
    const adminId = req.user.id;
    const groups = await NjangiGroup.find({ adminId }).populate(
      "groupMembers",
      "-password",
    );

    const allMembersMap = new Map();

    for (const group of groups) {
      for (const member of group.groupMembers) {
        allMembersMap.set(member._id.toString(), member);
      }
    }

    const uniqueMembers = Array.from(allMembersMap.values());

    res.status(200).json({
      adminId,
      totalGroups: groups.length,
      totalUniqueMembers: uniqueMembers.length,
      members: uniqueMembers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching members of admin's groups", error });
  }
};

/**
 * Fetch all groups created by an admin
 */
export const getAdminGroups = async (req, res) => {
  try {
    const groups = await NjangiGroup.find({ adminId: req.user.id }).populate(
      "groupMembers",
    );
    const groupsWithIsAdmin = groups.map((group) => {
      const nextDue = group.getNextPaymentDate(req.user.id);
      const groupObj = group.toObject();
      const { position, totalRounds } = group.getPositionAndRounds();
      const { totalContributed, totalReceived } = group.getUserFinancialSummary(
        req.user.id,
      );
      groupObj.isAdmin = String(group.adminId) === String(req.user.id);
      groupObj.position = position;
      groupObj.totalRounds = totalRounds;
      groupObj.totalContributed = totalContributed;
      groupObj.totalReceived = totalReceived;
      groupObj.nextDue = nextDue;
      return groupObj;
    });

    console.log(groupsWithIsAdmin);
    res.status(200).json(groupsWithIsAdmin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin's groups", error });
  }
};

/**
 * Create a new njangi group
 */
export const createGroup = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (admin.groupsCreated >= 1) {
      return res.status(403).json({
        message:
          "Maximum number of groups (1) reached, Please upgrade your plan to create more groups.",
      });
    }
    const newGroup = new NjangiGroup({
      ...req.body,
      adminId: req.user.id,
    });
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
};

/**
 * Fetch a specific group by ID
 */
export const fetchGroupById = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await NjangiGroup.findOne({
      _id: { $eq: groupId },
      adminId: req.user.id,
    });

    if (!group) {
      return res.status(404).json({
        message: "Group not found or not owned by this admin.",
      });
    }

    const totalFunds = group.memberContributions.reduce(
      (sum, mc) => sum + (mc.totalAmountPaid || 0),
      0,
    );

    const groupInfo = {
      ...group.toObject(),
      totalFunds,
    };

    res.status(200).json(groupInfo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching group", error });
  }
};

export const fetchGroupByIdWithoutToken = async (req, res) => {
  const { groupId } = req.query;

  try {
    const group = await NjangiGroup.findOne({
      _id: { $eq: groupId },
    });

    if (!group) {
      return res.status(404).json({
        message: "Group not found or not owned by this admin.",
      });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error fetching group", error });
  }
};

/**
 * Get submission statistics for a group
 */
export const getSubmissionStats = async (req, res) => {
  const { email } = req.query;
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const user = await User.findOne({ email: { $eq: email } });

    let createdGroups = [];
    if (user) {
      createdGroups = await NjangiGroup.find({
        adminId: user._id,
      });
    }

    const drafts = await NjangiDraft.find({
      "accountSetup.email": { $eq: email },
    });

    let createdGroupsCount = 0;
    if (createdGroups && createdGroups.length)
      createdGroupsCount = createdGroups.length;
    const draftGroupsCount = drafts.length;
    res.status(200).json({
      approved: createdGroupsCount,
      pending: draftGroupsCount,
      rejected: 0,
      total: createdGroupsCount + draftGroupsCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching submission statistics", error });
  }
};

export const getRecentActivity = async (req, res) => {
  const { email } = req.query;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const user = await User.findOne({ email: { $eq: email } });
    const createdGroups = user
      ? await NjangiGroup.find({
          adminId: user?.id,
        })
      : [];

    const pendingGroups = await NjangiDraft.find({
      "accountSetup.email": { $eq: email },
    });

    return res.status(200).json({ createdGroups, pendingGroups });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent activity", error });
  }
};

export const getDraftInfo = async (req, res) => {
  const { groupId } = req.query;
  try {
    const draft = await NjangiDraft.findOne({
      _id: { $eq: groupId },
    });

    if (!draft || draft.length === 0) {
      return res.status(404).json({
        message: "No drafts found for this user.",
      });
    }

    res.status(200).json(draft);
  } catch (error) {
    res.status(500).json({ message: "Error fetching drafts", error });
  }
};

export const getStatusHistory = async (req, res) => {
  const { email } = req.query;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const user = await User.findOne({ email: { $eq: email } });

    const createdGroups = user
      ? await NjangiGroup.find({ adminId: user._id })
          .select("name status createdAt")
          .sort({ createdAt: -1 })
      : [];

    const drafts = await NjangiDraft.find({
      "accountSetup.email": { $eq: email },
    }).sort({ createdAt: -1 });

    const formatGroup = (group, isDraft = false) => {
      const timeline = [
        {
          status: "submitted",
          date: new Date(group?.createdAt).toLocaleDateString(),
          time: new Date(group?.createdAt).toLocaleTimeString(),
          description: "Application submitted successfully",
          completed: true,
        },
      ];

      // For approved groups (in createdGroups)
      if (!isDraft) {
        timeline.push({
          status: "approved",
          date: new Date(group?.createdAt).toLocaleDateString(),
          time: new Date(group?.createdAt).toLocaleTimeString(),
          description: "Application approved by board",
          completed: true,
        });
      }

      return {
        id: group._id,
        groupName: isDraft ? group.groupDetails.groupName : group.name,
        currentStatus: isDraft ? "pending" : "approved",
        timeline,
      };
    };

    const formattedGroups = createdGroups.map((group) => formatGroup(group));
    const formattedDrafts = drafts.map((draft) => formatGroup(draft, true));

    const combinedHistory = [...formattedGroups, ...formattedDrafts].sort(
      (a, b) => new Date(b.timeline[0].date) - new Date(a.timeline[0].date),
    );

    res.status(200).json(combinedHistory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching status history", error });
  }
};
export const getGroupRecentActivities = async (req, res) => {
  const { groupId } = req.params;
  try {
    const activities = await NjangiActivityLog.find({ groupId })
      .populate("performedBy")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching recent activities", error });
  }
};

export const getInvitedMembersOfGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const invites = await Invite.find({ groupId }).select(
      "email phone status invitedBy expiresAt createdAt updatedAt",
    );
    res.status(200).json(invites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invited members", error });
  }
};

export const inviteMemberToGroup = async (req, res) => {
  const { groupId } = req.params;
  const adminId = req.user.id;
  const {
    groupName,
    adminFirstName,
    adminLastName,
    contributionFrequency,
    contributionAmount,
  } = req.body;
  // Accepts a single invite or an array of invites
  const invites = Array.isArray(req.body.invites)
    ? req.body.invites
    : [req.body.invite || req.body];

  console.log("Invites form frontend: ", invites);

  try {
    const result = await inviteMembersToGroup(
      { invites },
      groupId,
      adminId,
      groupName,
      adminFirstName,
      adminLastName,
      contributionFrequency,
      contributionAmount,
    );
    res
      .status(201)
      .json({ message: "Invites sent successfully", invites: result });

    console.log("Invite sent in backend, from admin: ", invites);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error inviting member(s)", error });
  }
};

export const getActivityTimeline = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Fetch logs for the group, most recent first, and populate user info
    const logs = await NjangiActivityLog.find({ groupId })
      .sort({ createdAt: -1 })
      .populate("performedBy", "firstName lastName email profilePicUrl")
      .populate("affectedMember", "firstName lastName email profilePicUrl")
      .lean();

    res.status(200).json({ success: true, timeline: logs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity timeline",
      error: error.message,
    });
  }
};

export const addMemberToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Prevent admin from inviting themselves
  const admin = await User.findById(req.user.id);
  if (admin.email.toLowerCase().trim() === normalizedEmail) {
    return res.status(400).json({
      message: "You cannot invite yourself.",
    });
  }

  // Prevent inviting users that already exist in the system
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(400).json({
      message: "This user is already registered in the system.",
    });
  }

  // Check if the user is already invited to this group
  const existingInvite = await Invite.findOne({
    groupId,
    email: normalizedEmail,
  });

  if (existingInvite) {
    return res.status(400).json({
      message: "Invitation has already been sent to this user.",
    });
  }

  // Prevent inviting a user who is in a NjangiDraft's pending invite list
  const draftHasInvite = await NjangiDraft.findOne({
    "inviteMembers.contact": normalizedEmail,
    "accountSetup.email": normalizedEmail,
    "groupDetails.status": "pending",
  });

  if (draftHasInvite) {
    return res.status(400).json({
      message: "This user is already listed as a pending invite.",
    });
  }

  // proceed with invitation
  const group = await NjangiGroup.findById(groupId);
  const token = generateToken();

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  await Invite.create({
    groupId,
    inviteToken: token,
    email: normalizedEmail,
    invitedBy: req.user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
  });

  const user = await User.findById(req.user.id);
  const registrationUrl = `${process.env.REGISTER_URL}/members?inviteToken=${token}&email=${normalizedEmail}`;

  await sendNjangiAleadyAddMemberEmail(
    normalizedEmail,
    "Hi there",
    `${user.lastName} ${user.firstName}`,
    group.contributionAmount,
    group.contributionFrequency,
    group.name,
    registrationUrl,
  );

  return res
    .status(200)
    .json({ message: "Invitation sent to user successfully!" });
};

export const cancelInvite = async (req, res) => {
  const { groupId } = req.params;
  const identifier = req.body;

  if (!identifier.email && !identifier.phone) {
    return res
      .status(400)
      .json({ error: "Missing invite identifier (email or phone)" });
  }

  try {
    // Count how many invites exist for this group
    const count = await Invite.countDocuments({ groupId });

    if (count <= 1) {
      return res.status(400).json({
        error: "Cannot delete invite: group must have at least one member",
      });
    }
    // Validate and sanitize email/phone inputs
    if (identifier.email) {
      if (!validator.isEmail(identifier.email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      identifier.email = validator.normalizeEmail(identifier.email);
    }

    if (identifier.phone) {
      // Remove any non-digit characters
      const sanitizedPhone = identifier.phone.replace(/\D/g, "");
      if (!validator.isMobilePhone(sanitizedPhone)) {
        return res.status(400).json({ error: "Invalid phone format" });
      }
      identifier.phone = sanitizedPhone;
    }
    // Build query to find the invite to delete
    const query = { groupId };
    if (identifier.email) {
      query.email = identifier.email;
    } else if (identifier.phone) {
      query.phone = identifier.phone;
    }

    const deletedInvite = await Invite.findOneAndDelete(query);

    if (!deletedInvite) {
      return res.status(404).json({ error: "Invite not found" });
    }

    return res.status(200).json({
      message: "Invite cancelled!",
      cancelledInvite: {
        email: deletedInvite.email,
        phone: deletedInvite.phone,
      },
    });
  } catch (error) {
    console.error("Error canceling invite:", error);
    return res.status(500).json({
      message: "Failed to cancel invite!",
      error: error.message,
    });
  }
};

// remove member
export const removeMember = async (req, res) => {
  const { groupId, userId } = req.params;

  console.log("GroupId in backend: ", groupId);
  console.log("User in backend: ", userId);

  if (!groupId || !userId) {
    return res.status(400).json({ error: "Missing groupId or userId" });
  }

  try {
    // Count how many members exist in GroupMember for this group
    const groupMemberCount = await GroupMember.countDocuments({ groupId });

    // Fetch NjangiGroup to access groupMembers array
    const njangiGroup =
      await NjangiGroup.findById(groupId).select("groupMembers");

    if (!njangiGroup) {
      return res.status(404).json({ error: "Njangi group not found" });
    }

    // Ensure both counts are greater than 1 before deletion
    if (groupMemberCount <= 1 || njangiGroup.groupMembers.length <= 1) {
      return res.status(400).json({
        error: "Cannot remove member: group must have more than one member.",
      });
    }

    //Remove from GroupMember
    await GroupMember.findOneAndDelete({ groupId, userId });

    //Remove from NjangiGroup.groupMembers
    await NjangiGroup.findByIdAndUpdate(groupId, {
      $pull: { groupMembers: userId },
    });

    //Remove related Invite (if you store groupId/userId in Invite)
    await Invite.findOneAndDelete({ groupId, userId });

    //If user.status === 'member', delete the user
    const user = await User.findById(userId);
    if (user?.status === "member") {
      await User.findByIdAndDelete(userId);
    }

    return res.status(200).json({
      message: "Member removed successfully.",
      removedUserId: userId,
    });
  } catch (error) {
    console.error("Error removing member:", error);
    return res.status(500).json({
      error: "Failed to remove member.",
      details: error.message,
    });
  }
};

export const getAdminGroupPaymentStatus = async (req, res) => {
  try {
    const adminId = req.user.id;

    if (!Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ error: "Invalid admin ID" });
    }

    const groups = await NjangiGroup.find({ adminId })
      .populate("groupMembers", "name email")
      .populate("memberContributions.member", "name email");

    const result = groups.map((group) => {
      const paidMembers = group.memberContributions
        .filter((mc) => mc.totalAmountPaid > 0)
        .map((mc) => mc.member);

      const paidMemberIds = new Set(paidMembers.map((m) => m._id.toString()));

      const unpaidMembers = group.groupMembers.filter(
        (member) => !paidMemberIds.has(member._id.toString()),
      );

      return {
        groupId: group._id,
        groupName: group.name,
        paidMembers,
        unpaidMembers,
      };
    });

    return res.json(result);
  } catch (err) {
    console.error("Error in getAdminGroupPaymentStatus:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const redis = createRedisClient();

export const notifyDefaulters = async (req, res) => {
  try {
    const adminId = req.user.id;

    if (!Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ error: "Invalid admin ID" });
    }

    const groups = await NjangiGroup.find({ adminId })
      .populate("groupMembers", "name email firstName lastName role")
      .populate("memberContributions.member", "name email");

    let notificationsSent =
      parseInt(await redis.get(CACHE_NAMES.NOTIFYCOUNT)) || 0;

    for (const group of groups) {
      const paidMemberIds = new Set(
        group.memberContributions
          .filter((mc) => mc.totalAmountPaid > 0)
          .map((mc) => mc.member._id.toString()),
      );

      const defaulters = group.groupMembers.filter(
        (member) => !paidMemberIds.has(member._id.toString()),
      );

      const nextDue = group.getNextPaymentDate();

      for (const member of defaulters) {
        await sendDueReminder(
          member.email,
          group.contributionAmount,
          nextDue,
          group.name,
          group.startDate,
          member.lastName || "",
          member.firstName || "",
          `${process.env.FRONTEND_URL}/${member.role}/payments`,
        );

        notificationsSent++;
      }

      if (defaulters.length > 0) {
        await NjangiNotification.create({
          recipients: defaulters.map((m) => m._id),
          type: "reminder",
          content: `Don't forget to pay ${group.contributionAmount} to ${group.name}`,
          sender: adminId,
        });
      }
    }

    await redis.set(CACHE_NAMES.NOTIFYCOUNT, notificationsSent.toString());

    return res.status(200).json({
      message: `${notificationsSent} defaulter(s) notified successfully.`,
    });
  } catch (err) {
    console.error("Error notifying defaulters:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
