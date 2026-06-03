import { notFound, redirect } from "next/navigation";

import { BlogForm } from "@/components/blogs/blog-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface EditBlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { slug } = await params;

  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  const blog = await db.blog.findUnique({
    where: {
      slug,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!blog) {
    notFound();
  }

  if (blog.authorId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Edit Blog</h1>
      <p className="mt-2 text-muted-foreground">
        Update your blog content, tags, thumbnail, and publishing status.
      </p>

      <BlogForm mode="edit" blog={blog} />
    </main>
  );
}