import { redirect } from "next/navigation";

import { BlogCard } from "@/components/blogs/blog-card";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function BookmarksPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      username: true,
    },
  });

  if (!user?.username) {
    redirect("/onboarding/username");
  }

  const bookmarks = await db.bookmark.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      blog: {
        include: {
          author: true,
          likes: true,
          comments: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      },
    },
  });

  const blogs = bookmarks
    .filter((bookmark) => bookmark.blog.status === "PUBLISHED")
    .map((bookmark) => ({
      id: bookmark.blog.id,
      title: bookmark.blog.title,
      slug: bookmark.blog.slug,
      description: bookmark.blog.description,
      content: bookmark.blog.content,
      author: bookmark.blog.author.name,
      authorUsername: bookmark.blog.author.username ?? "",
      publishDate: bookmark.blog.publishedAt
        ? bookmark.blog.publishedAt.toLocaleDateString()
        : bookmark.blog.createdAt.toLocaleDateString(),
      thumbnail: bookmark.blog.thumbnail ?? "",
      tags: bookmark.blog.tags.map((blogTag) => blogTag.tag.name),
      category: "General",
      likes: bookmark.blog.likes.length,
      readTime: `${Math.ceil(bookmark.blog.content.length / 800)} min read`,
      status: bookmark.blog.status.toLowerCase() as "published" | "draft",
    }));

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Saved Blogs</h1>

      <p className="mt-2 text-muted-foreground">
        Blogs you bookmarked for later reading.
      </p>

      {blogs.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="p-6 text-muted-foreground">
            No bookmarked blogs yet.
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </main>
  );
}