import express from "express";
import {
  getMessages,
  getMessagesByGroup,
  sendMessage,
} from "../controllers/message.controllers.js";
import { uploadChatAttachment } from "../middleware/upload.js";
import limiter from "../middleware/limiter.js";

const router = express.Router();

router.use("/", limiter);

// Get all messages
router.get("/", getMessages);

// Send a new message
router.post("/send", uploadChatAttachment, sendMessage);

// Get messages for a specific group
router.get("/group/:groupId", getMessagesByGroup);

export default router;
