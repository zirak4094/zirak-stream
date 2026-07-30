import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 is S3-API-compatible, so the standard AWS SDK v3 S3 client
 * works against it directly — just point `endpoint` at the R2 account
 * endpoint and use the R2 access key pair instead of AWS IAM credentials.
 *
 * Server-only: never construct this in a Client Component or expose the
 * secret access key to the browser.
 */
export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;

/** Media categories map to top-level prefixes inside the bucket. */
export const R2_PREFIXES = {
  posters: "posters",
  backdrops: "backdrops",
  trailers: "trailers",
  videos: "videos",
  subtitles: "subtitles",
  avatars: "avatars",
} as const;

export type R2Prefix = (typeof R2_PREFIXES)[keyof typeof R2_PREFIXES];

/** Builds the public playback/CDN URL for an object key. */
export function getPublicR2Url(key: string): string {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;
  return `${base.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}
