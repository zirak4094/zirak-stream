import "server-only";
import { randomUUID } from "node:crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { R2_BUCKET_NAME, r2Client, type R2Prefix } from "./client";

const PRESIGNED_UPLOAD_TTL_SECONDS = 60 * 10; // 10 minutes
const PRESIGNED_DOWNLOAD_TTL_SECONDS = 60 * 60 * 6; // 6 hours

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
}

/**
 * Generates a unique object key under the given prefix, e.g.
 * "videos/8f14e45f-episode-title.mp4"
 */
export function buildObjectKey(prefix: R2Prefix, originalFileName: string): string {
  const safeName = sanitizeFileName(originalFileName);
  return `${prefix}/${randomUUID()}-${safeName}`;
}

/**
 * Returns a presigned PUT URL the browser (admin dashboard) can upload
 * directly to R2 with — the file never passes through the Next.js server,
 * which matters for large video files.
 */
export async function getPresignedUploadUrl(params: {
  key: string;
  contentType: string;
}): Promise<{ uploadUrl: string; key: string }> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, {
    expiresIn: PRESIGNED_UPLOAD_TTL_SECONDS,
  });

  return { uploadUrl, key: params.key };
}

/**
 * Returns a short-lived signed GET URL. Only needed for content that isn't
 * served from the public bucket URL (e.g. private/unpublished previews).
 * Published, publicly-viewable media should use `getPublicR2Url` instead.
 */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2Client, command, {
    expiresIn: PRESIGNED_DOWNLOAD_TTL_SECONDS,
  });
}

export async function deleteObject(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }),
  );
}
