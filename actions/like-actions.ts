"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function toggleLikeAction(blogId: string, slug: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existingLike = await db.like.findUnique({
    where: {
      blogId_userId: {
        blogId,
        userId: session.user.id,
      },
    },
  });

  if (existingLike) {
    await db.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await db.like.create({
      data: {
        blogId,
        userId: session.user.id,
      },
    });
  }

  revalidatePath(`/blogs/${slug}`);
}