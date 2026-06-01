"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function toggleBookmarkAction(blogId: string, slug: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existingBookmark = await db.bookmark.findUnique({
    where: {
      blogId_userId: {
        blogId,
        userId: session.user.id,
      },
    },
  });

  if (existingBookmark) {
    await db.bookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });
  } else {
    await db.bookmark.create({
      data: {
        blogId,
        userId: session.user.id,
      },
    });
  }

  revalidatePath(`/blogs/${slug}`);
  revalidatePath("/bookmarks");
}