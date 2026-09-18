const MAX_BYTES = 5 * 1024 * 1024; // keep in sync with /api/upload-url

/**
 * Uploads one image to S3 via a short-lived presigned URL.
 *
 * The browser never holds AWS credentials: it asks our (admin-only) API for a
 * presigned PUT, then sends the bytes straight to S3.
 *
 * @returns {Promise<string>} the public URL of the uploaded object
 */
export default async function uploadImageToS3(file) {
  if (!file) throw new Error("No file provided");

  if (file.size > MAX_BYTES) {
    throw new Error("Image is larger than the 5MB limit");
  }

  const presignResponse = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });

  if (!presignResponse.ok) {
    const { error } = await presignResponse.json().catch(() => ({}));
    throw new Error(error || "Could not prepare the upload");
  }

  const { uploadUrl, url } = await presignResponse.json();

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Upload to storage failed");
  }

  return url;
}
