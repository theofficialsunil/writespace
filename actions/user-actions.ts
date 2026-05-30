"use server";

import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export type UsernameState = {
  error?: string;
  success?: boolean;
  username?: string;
};

const usernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Only lowercase letters, numbers, and underscores"
    ),
});

export async function setUsernameAction(
  _prevState: UsernameState,
  formData: FormData
): Promise<UsernameState> {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in.",
    };
  }

  const parsed = usernameSchema.safeParse({
    username: formData.get("username"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors.username?.[0],
    };
  }

  const existingUser = await db.user.findUnique({
    where: {
      username: parsed.data.username,
    },
  });

  if (existingUser && existingUser.id !== session.user.id) {
    return {
      error: "Username already taken",
    };
  }

  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      username: parsed.data.username,
    },
  });

  return {
    success: true,
    username: parsed.data.username,
  };
}