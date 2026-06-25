import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/s3Config.js";
import { config } from "dotenv";

config();

// === 1. Upload to AWS S3 ===

export const uploadChatFileToS3 = async (
  buffer,
  fileName,
  mimetype,
  folder
) => {
  const key = `${folder}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  });

  await s3Client.send(command);

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

// === 2. Multer Config ===

const chatStorage = multer.memoryStorage();

export const uploadChatAttachment = multer({
  storage: chatStorage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Unsupported file type. Allowed: images, videos, documents.")
      );
    }
  },
}).single("attachment");
