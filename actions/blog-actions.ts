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
    tags?: string[];
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
  tags: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

function parseTags(tagsInput?: string) {
  return Array.from(
    new Set(
      (tagsInput ?? "")
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 5)
    )
  );
}

async function connectTagsToBlog(blogId: string, tags: string[]) {
  if (tags.length === 0) return;

  await Promise.all(
    tags.map(async (tagName) => {
      const tag = await db.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });

      await db.blogTag.upsert({
        where: {
          blogId_tagId: {
            blogId,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          blogId,
          tagId: tag.id,
        },
      });
    })
  );
}

export async function createBlogAction(
  _prevState: CreateBlogState,
  formData: FormData
): Promise<CreateBlogState> {
  const session = await auth();

  if (!session?.user) {
    return { errors: { _form: ["You must be logged in to create a blog."] } };
  }

  if (session.user.role !== "PUBLISHER") {
    return { errors: { _form: ["Only publishers can create blogs."] } };
  }

  const parsed = createBlogSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    tags: formData.get("tags"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const baseSlug = generateSlug(parsed.data.title);
  const slug = `${baseSlug}-${Date.now()}`;
  const tags = parseTags(parsed.data.tags);

  try {
    const blog = await db.blog.create({
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

    await connectTagsToBlog(blog.id, tags);
  } catch {
    return {
      errors: {
        _form: ["Database error. Please try again."],
      },
    };
  }

  redirect("/dashboard");
}

export async function deleteBlogAction(blogId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const blog = await db.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  if (!blog) {
    throw new Error("Blog not found");
  }

  if (blog.authorId !== session.user.id) {
    throw new Error("You cannot delete this blog");
  }

  await db.blog.delete({
    where: {
      id: blogId,
    },
  });
}

export async function updateBlogAction(
  blogId: string,
  _prevState: CreateBlogState,
  formData: FormData
): Promise<CreateBlogState> {
  const session = await auth();

  if (!session?.user) {
    return { errors: { _form: ["You must be logged in."] } };
  }

  const blog = await db.blog.findUnique({
    where: { id: blogId },
  });

  if (!blog) {
    return { errors: { _form: ["Blog not found."] } };
  }

  if (blog.authorId !== session.user.id) {
    return { errors: { _form: ["You are not allowed to edit this blog."] } };
  }

  const parsed = createBlogSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    tags: formData.get("tags"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const tags = parseTags(parsed.data.tags);

  try {
    await db.blog.update({
      where: { id: blogId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        content: parsed.data.content,
        thumbnail: parsed.data.thumbnail ?? null,
        status: parsed.data.status,
        publishedAt:
          parsed.data.status === "PUBLISHED"
            ? blog.publishedAt ?? new Date()
            : null,
      },
    });

    await db.blogTag.deleteMany({
      where: { blogId },
    });

    await connectTagsToBlog(blogId, tags);
  } catch {
    return {
      errors: {
        _form: ["Database error. Please try again."],
      },
    };
  }

  redirect("/dashboard");
}