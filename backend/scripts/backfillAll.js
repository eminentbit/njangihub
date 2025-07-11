/**
 * This script backfills missing fields in multiple models in the database.
 * It connects to the MongoDB database, updates the specified fields in each model,
 * and logs the number of documents updated for each model.
 * Usage: node scripts/backfillAll.js or npm run backfillAll

 * Make sure to set the MONGODB_URL environment variable before running the script.
 */

import { connect, connection } from "mongoose";
import { config } from "dotenv";
import User from "../models/user.model.js";
import Invite from "../models/invite.model.js";
import NjangiGroup from "../models/njangigroup.model.js";

config();

const backfillAll = async () => {
  try {
    await connect(process.env.MONGODB_URL);
    console.log("✅ Connected to DB");

    // 1. Add "bio" to User if missing
    const userResult = await User.updateMany(
      { bio: { $exists: false } },
      { $set: { bio: "" } }
    );
    console.log(`👤 Users updated: ${userResult.modifiedCount}`);

    // 2. Add "reviewed" to Invite if missing
    const inviteResult = await Invite.updateMany(
      { reviewed: { $exists: false } },
      { $set: { reviewed: false } }
    );
    console.log(`📨 Invites updated: ${inviteResult.modifiedCount}`);

    // 3. Add "approvedBy" to NjangiGroup if missing
    const groupResult = await NjangiGroup.updateMany(
      { approvedBy: { $exists: false } },
      { $set: { approvedBy: null } }
    );
    console.log(`👥 Njangi Groups updated: ${groupResult.modifiedCount}`);
  } catch (error) {
    console.error("❌ Error during multi-model backfill:", error);
  } finally {
    connection.close();
  }
};

backfillAll();
