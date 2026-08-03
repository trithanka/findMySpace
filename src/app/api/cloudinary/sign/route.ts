import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/server/auth-guard";

/**
 * Hands the browser a short-lived signature so it can upload straight to
 * Cloudinary. Image bytes never touch our server, which is what keeps uploads
 * under Vercel's 4.5MB request-body cap. The API secret stays here.
 */
export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 500 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "findmyspace/properties";

  // Must sign exactly the params the browser sends (file/api_key excluded).
  const signature = cloudinary.utils.api_sign_request(
    { folder, timestamp },
    apiSecret,
  );

  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
