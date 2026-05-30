import { notFound } from "next/navigation";
import { BookOpen, Calendar, UserRound } from "lucide-react";

import { BlogCard } from "@/components/blogs/blog-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: {
      username,
    },
    include: {
      blogs: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          publishedAt: "desc",
        },
        include: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const blogs = user.blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    content: blog.content,
    author: user.name,
    publishDate: blog.publishedAt
      ? blog.publishedAt.toLocaleDateString()
      : blog.createdAt.toLocaleDateString(),
    thumbnail: blog.thumbnail ?? "",
    tags: [],
    category: "General",
    likes: blog.likes.length,
    readTime: `${Math.ceil(blog.content.length / 800)} min read`,
    status: blog.status.toLowerCase() as "published" | "draft",
  }));

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <Card className="mb-8">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {user.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                {user.role}
              </span>
            </div>

            <p className="mt-1 text-muted-foreground">@{user.username}</p>

            <p className="mt-3 max-w-2xl text-muted-foreground">
              {user.bio ?? "Writer at WriteSpace"}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {blogs.length} published blogs
              </span>

              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {user.createdAt.toLocaleDateString()}
              </span>

              <span className="flex items-center gap-1">
                <UserRound className="h-4 w-4" />
                @{user.username}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-6 text-2xl font-bold">Published Blogs</h2>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            No published blogs yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </main>
  );
}