import { v2 as cloudinary } from "cloudinary";

import { getCurrentSession } from "@/lib/auth-session";

export async function POST() {
  const session = await getCurrentSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Cloudinary environment variables are missing.");

    return Response.json(
      { message: "Avatar upload is not configured." },
      { status: 500 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "subtracker/avatars";
  const publicId = session.user.id;

  const paramsToSign = {
    timestamp,
    folder,
    public_id: publicId,
    overwrite: true,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return Response.json({
    signature,
    timestamp,
    folder,
    publicId,
    cloudName,
    apiKey,
  });
}
