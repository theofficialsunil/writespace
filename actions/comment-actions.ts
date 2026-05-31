"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export type CommentState = {
  error?: string;
  success?: boolean;
};

const commentSchema = z.object({
  blogId: z.string().min(1),
  slug: z.string().min(1),
  content: z
    .string()
    .trim()
    .min(4, "Comment must be at least 4 characters")
    .max(500, "Comment must be at most 500 characters"),
});

export async function createCommentAction(
  _prevState: CommentState,
  formData: FormData
): Promise<CommentState> {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in to comment.",
    };
  }

  const parsed = commentSchema.safeParse({
    blogId: formData.get("blogId"),
    slug: formData.get("slug"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().fieldErrors.content?.[0] ||
        "Invalid comment data",
    };
  }

  await db.comment.create({
    data: {
      content: parsed.data.content,
      blogId: parsed.data.blogId,
      authorId: session.user.id,
    },
  });

  revalidatePath(`/blogs/${parsed.data.slug}`);

  return {
    success: true,
  };
}

export async function deleteCommentAction(commentId: string, slug: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const comment = await db.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.authorId !== session.user.id) {
    throw new Error("You cannot delete this comment");
  }

  await db.comment.delete({
    where: {
      id: commentId,
    },
  });

  revalidatePath(`/blogs/${slug}`);
}