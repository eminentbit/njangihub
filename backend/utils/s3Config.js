// AWS S3 client (v3). Used for chat attachments and other uploads.
import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

const requiredVars = [
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET_NAME",
];

const missing = requiredVars.filter((name) => !process.env[name]);
if (missing.length) {
  // Surface misconfiguration early instead of failing on the first upload.
  console.warn(
    `⚠️  Missing AWS S3 env vars: ${missing.join(", ")}. File uploads will fail until these are set.`
  );
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
