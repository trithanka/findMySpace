/**
 * Browser-side photo upload. Shared by the admin property form and the host
 * wizard: photos go browser → Cloudinary directly, because routing them through
 * a server action would put the raw bytes in the POST body, which Vercel rejects
 * with 413 beyond ~4.5MB.
 */

type UploadCredentials = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

/** Cloudinary rejects anything larger on the free plan. */
export const CLOUDINARY_MAX_BYTES = 10 * 1024 * 1024;
/** Listings never render wider than ~1200px, so 2000px is ample. */
const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.82;

export const formatMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;

/**
 * Shrinks a photo before it is uploaded. Phones produce 12MB+ files that
 * Cloudinary refuses outright, and the full resolution is wasted on a listing
 * page. Falls back to the original file if anything goes wrong (an unsupported
 * codec, no canvas) rather than blocking the save.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    // Re-encoding can inflate an already-optimised file; keep the smaller one.
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
}

async function getUploadCredentials(): Promise<UploadCredentials> {
  const res = await fetch("/api/cloudinary/sign", { method: "POST" });
  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? "Your session expired — sign in again and retry."
        : "Image uploads are not configured on the server.",
    );
  }
  return res.json();
}

async function uploadOne(
  file: File,
  { cloudName, apiKey, timestamp, folder, signature }: UploadCredentials,
): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("folder", folder);
  body.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body },
  );

  if (!res.ok) {
    const detail = await res
      .json()
      .then((json) => json?.error?.message)
      .catch(() => null);
    throw new Error(detail ?? `${file.name} failed to upload (${res.status})`);
  }

  return (await res.json()).secure_url as string;
}

/**
 * Compresses and uploads a batch, reporting progress as human-readable text.
 * Returns the secure URLs in the order the files were given.
 */
export async function uploadPhotos(
  files: File[],
  onProgress: (message: string) => void,
): Promise<string[]> {
  if (files.length === 0) return [];

  onProgress(`Compressing ${files.length} photo(s)…`);
  const prepared = await Promise.all(files.map(compressImage));

  const tooBig = prepared.find((file) => file.size > CLOUDINARY_MAX_BYTES);
  if (tooBig) {
    throw new Error(
      `${tooBig.name} is still ${formatMb(tooBig.size)} after compression — Cloudinary's limit is 10MB.`,
    );
  }

  // One signature covers every upload: it signs the folder and timestamp, not
  // the file, so there is no need to round-trip per photo.
  const credentials = await getUploadCredentials();

  let done = 0;
  onProgress(`Uploading 0 of ${prepared.length} photos…`);
  return Promise.all(
    prepared.map(async (file) => {
      const url = await uploadOne(file, credentials);
      done += 1;
      onProgress(`Uploaded ${done} of ${prepared.length} photos…`);
      return url;
    }),
  );
}
