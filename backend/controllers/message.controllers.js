// controllers/message.controller.js

import Messages from "../models/message.model.js";
import { uploadChatFileToS3 } from "../middleware/upload.js";

// Get all messages (optional: for admin/debugging)
export const getMessages = async (req, res) => {
  try {
    const messages = await Messages.find()
      .populate("senderId", "name email")
      .populate("groupId", "name");

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Send a new message (text and/or attachment)
export const sendMessage = async (req, res) => {
  try {
    // 1️⃣ Run multer’s single-file middleware (uploadChatAttachment)
    // We assume this controller is mounted behind that middleware in your route.
    // So by the time we reach here, `req.file` may be populated if a file was sent.

    const { content, senderId, groupId } = req.body;

    // 2️⃣ Validate required fields
    if (!senderId || !groupId || (!content && !req.file)) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: senderId, groupId, and either content or attachment.",
      });
    }

    // 3️⃣ If there’s an uploaded file, push it to S3 (or Spaces) and build `attachment`
    let attachmentObj = null;
    if (req.file) {
      const { buffer, originalname, mimetype } = req.file;
      // You can swap this with uploadChatFileToSpace(...) if you prefer DO Spaces
      const fileUrl = await uploadChatFileToS3(
        buffer,
        originalname,
        mimetype,
        "chat-attachments"
      );

      attachmentObj = {
        type: mimetype.startsWith("image/")
          ? "image"
          : mimetype.startsWith("video/")
          ? "video"
          : "document",
        url: fileUrl,
        name: originalname,
      };
    }

    // 4️⃣ Create and save the message document
    const message = new Messages({
      content: content || "",
      senderId,
      senderName: req.body.senderName || "", // if you pass senderName separately
      groupId,
      attachment: attachmentObj,
    });

    await message.save();

    // 5️⃣ Populate before sending back
    // Mongoose 6+: document.populate() returns a promise; execPopulate() was removed.
    const populatedMessage = await message.populate("senderId", "name");

    // 6️⃣ Return the newly created message (so Front-End can emit via socket)
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get messages for a specific group (sorted by timestamp)
export const getMessagesByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: "Missing required param: groupId",
      });
    }

    const messages = await Messages.find({ groupId })
      .populate("senderId", "name")
      .sort({ createdAt: 1 });

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("getMessagesByGroup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch group messages",
      error: error.message,
    });
  }
};
