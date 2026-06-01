"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function toggleFollowAction(
  followingId: string,
  username: string
) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (session.user.id === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const existingFollow = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId,
      },
    },
  });

  if (existingFollow) {
    await db.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });
  } else {
    await db.follow.create({
      data: {
        followerId: session.user.id,
        followingId,
      },
    });
  }

  revalidatePath(`/profile/${username}`);
}