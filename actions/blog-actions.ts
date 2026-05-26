"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/slug";

export type CreateBlogState = {
  errors?: {
    title?: string[];
    description?: string[];
    content?: string[];
    thumbnail?: string[];
    status?: string[];
    _form?: string[];
  };
};

const createBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  thumbnail: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .pipe(z.string().url("Invalid thumbnail URL").optional()),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export async function createBlogAction(
  _prevState: CreateBlogState,
  formData: FormData
): Promise<CreateBlogState> {
  const session = await auth();

  if (!session?.user) {
    return {
      errors: {
        _form: ["You must be logged in to create a blog."],
      },
    };
  }

  if (session.user.role !== "PUBLISHER") {
    return {
      errors: {
        _form: ["Only publishers can create blogs."],
      },
    };
  }

  const parsed = createBlogSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const baseSlug = generateSlug(parsed.data.title);
  const slug = `${baseSlug}-${Date.now()}`;

  await db.blog.create({
    data: {
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      content: parsed.data.content,
      thumbnail: parsed.data.thumbnail ?? null,
      status: parsed.data.status,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      authorId: session.user.id,
    },
  });

  redirect("/dashboard");
}