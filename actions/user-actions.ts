"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export type UsernameState = {
  error?: string;
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
    redirect("/auth");
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

  const updatedUser = await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      username: parsed.data.username,
    },
    select: {
      role: true,
    },
  });

  redirect("/auth?usernameSet=true");
}