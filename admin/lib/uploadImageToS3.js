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
    // `content-length` is part of the signature, and the browser sets it from
    // the File — so the bytes sent must match the `size` declared above. They
    // do here because both come from the same File object.
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    // S3 errors are XML, and a bare "failed" message makes these very hard to
    // diagnose. 403 is almost always an expired URL (60s) or a signature
    // mismatch; surface enough to tell them apart.
    const detail = await uploadResponse.text().catch(() => "");
    const code = /<Code>([^<]+)<\/Code>/.exec(detail)?.[1];
    console.error("[upload] S3 rejected the upload:", uploadResponse.status, detail.slice(0, 300));

    if (uploadResponse.status === 403) {
      throw new Error(
        code === "RequestTimeTooSkewed"
          ? "Upload link expired — please try again"
          : "Storage rejected the upload (check AWS credentials and bucket policy)"
      );
    }
    throw new Error(`Upload to storage failed (${uploadResponse.status}${code ? `: ${code}` : ""})`);
  }

  return url;
}
