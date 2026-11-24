import { v2 as cloudinary } from "cloudinary";

import { getCurrentSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { publicId } = await request.json();

    const expectedPublicId = `subtracker/avatars/${session.user.id}`;

    if (publicId !== expectedPublicId) {
      return Response.json({ message: "Invalid avatar." }, { status: 400 });
    }

    configureCloudinary();

    const image = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: image.secure_url },
    });

    return Response.json({
      message: "Profile picture updated successfully.",
      image: image.secure_url,
    });
  } catch (error) {
    console.error("Avatar update failed:", error);

    return Response.json(
      { message: "Unable to update profile picture." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const session = await getCurrentSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    configureCloudinary();

    const publicId = `subtracker/avatars/${session.user.id}`;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("Cloudinary could not remove the avatar.");
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });

    return Response.json({
      message: "Profile picture removed successfully.",
    });
  } catch (error) {
    console.error("Avatar removal failed:", error);

    return Response.json(
      { message: "Unable to remove your profile picture." },
      { status: 500 },
    );
  }
}
