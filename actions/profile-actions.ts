"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export type ProfileState = {
  error?: string;
  success?: boolean;
  role?: "READER" | "PUBLISHER";
};

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  bio: z
    .string()
    .trim()
    .max(200, "Bio must be at most 200 characters")
    .optional(),
  image: z.string().trim().optional(),
  role: z.enum(["READER", "PUBLISHER"]),
});

export async function updateProfileAction(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in.",
    };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio"),
    image: formData.get("image"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;

    return {
      error:
        errors.name?.[0] ||
        errors.bio?.[0] ||
        errors.image?.[0] ||
        errors.role?.[0] ||
        "Invalid profile data",
    };
  }

  const updatedUser = await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      image: parsed.data.image || null,
      role: parsed.data.role,
    },
    select: {
      username: true,
      role: true,
    },
  });

  revalidatePath("/settings/profile");

  if (updatedUser.username) {
    revalidatePath(`/profile/${updatedUser.username}`);
  }

  return {
    success: true,
    role: updatedUser.role as "READER" | "PUBLISHER",
  };
}