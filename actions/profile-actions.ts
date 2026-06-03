"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export type ProfileState = {
  error?: string;
  success?: string;
};

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(200, "Bio must be at most 200 characters").optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
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
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.name?.[0] ||
        parsed.error.flatten().fieldErrors.bio?.[0] ||
        parsed.error.flatten().fieldErrors.image?.[0] ||
        "Invalid profile data",
    };
  }

  const user = await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      image: parsed.data.image || null,
    },
    select: {
      username: true,
    },
  });

  if (user.username) {
    revalidatePath(`/profile/${user.username}`);
  }

  revalidatePath("/settings/profile");

  return {
    success: "Profile updated successfully.",
  };
}