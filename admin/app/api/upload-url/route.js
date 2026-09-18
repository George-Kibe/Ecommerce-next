import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { withAdmin, badRequest, serverError } from "@/lib/apiGuard";

// Credentials are read from server-only env vars and never reach the browser.
const REGION = process.env.AWS_S3_REGION;
const BUCKET = process.env.S3_BUCKET_NAME;

const ALLOWED_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const URL_TTL_SECONDS = 60;

function s3Client() {
  return new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Issues a short-lived presigned PUT URL so the browser can upload straight to
 * S3 without ever holding AWS credentials. Admin-only.
 */
export const POST = withAdmin(async (request) => {
  if (!REGION || !BUCKET) {
    return serverError(
      new Error("AWS_S3_REGION or S3_BUCKET_NAME is not set"),
      "upload-url config"
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { contentType, size } = body ?? {};

  const extension = ALLOWED_TYPES[contentType];
  if (!extension) {
    return badRequest(
      `Unsupported file type. Allowed: ${Object.keys(ALLOWED_TYPES).join(", ")}`
    );
  }

  if (!Number.isFinite(size) || size <= 0 || size > MAX_BYTES) {
    return badRequest(`File must be between 1 byte and ${MAX_BYTES} bytes`);
  }

  // The key is generated server-side so a caller cannot overwrite an existing
  // object by choosing its name.
  const key = `products/${Date.now()}-${randomUUID()}.${extension}`;

  try {
    const uploadUrl = await getSignedUrl(
      s3Client(),
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: contentType,
        ContentLength: size,
      }),
      { expiresIn: URL_TTL_SECONDS }
    );

    const publicUrl =
      process.env.S3_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
      `https://${BUCKET}.s3.${REGION}.amazonaws.com`;

    return NextResponse.json({ uploadUrl, url: `${publicUrl}/${key}` });
  } catch (error) {
    return serverError(error, "failed to presign upload");
  }
});
