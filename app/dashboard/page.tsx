import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  Heart,
  MessageCircle,
  Plus,
  Trophy,
} from "lucide-react";

import { DeleteBlogButton } from "@/components/blogs/delete-blog-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  if (session.user.role !== "PUBLISHER") {
    redirect("/blogs");
  }

  const blogs = await db.blog.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      likes: true,
      comments: true,
      author: {
        select: {
          username: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((blog) => blog.status === "PUBLISHED");
  const draftBlogs = blogs.filter((blog) => blog.status === "DRAFT");

  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes.length, 0);
  const totalComments = blogs.reduce(
    (sum, blog) => sum + blog.comments.length,
    0
  );

  const topBlog = publishedBlogs
    .slice()
    .sort((a, b) => b.likes.length - a.likes.length)[0];

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Publisher Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your blogs, drafts, and performance.
          </p>
        </div>

        <div className="flex gap-2">
          {session.user.username && (
            <Button variant="outline" asChild>
              <Link href={`/profile/${session.user.username}`}>
                Public Profile
              </Link>
            </Button>
          )}

          <Button asChild>
            <Link href="/blogs/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Blog
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalBlogs}</p>
              <p className="text-sm text-muted-foreground">Total Blogs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{publishedBlogs.length}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{draftBlogs.length}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Heart className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalLikes}</p>
              <p className="text-sm text-muted-foreground">Likes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <MessageCircle className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalComments}</p>
              <p className="text-sm text-muted-foreground">Comments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>
              Quick overview of your publishing activity.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Publish Rate</p>
              <p className="mt-1 text-2xl font-bold">
                {totalBlogs === 0
                  ? "0%"
                  : `${Math.round((publishedBlogs.length / totalBlogs) * 100)}%`}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Avg Likes / Blog</p>
              <p className="mt-1 text-2xl font-bold">
                {totalBlogs === 0
                  ? 0
                  : Math.round((totalLikes / totalBlogs) * 10) / 10}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Avg Comments / Blog
              </p>
              <p className="mt-1 text-2xl font-bold">
                {totalBlogs === 0
                  ? 0
                  : Math.round((totalComments / totalBlogs) * 10) / 10}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Top Blog
            </CardTitle>
            <CardDescription>Most liked published blog.</CardDescription>
          </CardHeader>

          <CardContent>
            {topBlog ? (
              <div className="space-y-3">
                <Link
                  href={`/blogs/${topBlog.slug}`}
                  className="font-semibold transition hover:text-primary"
                >
                  {topBlog.title}
                </Link>

                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{topBlog.likes.length} likes</span>
                  <span>{topBlog.comments.length} comments</span>
                </div>

                <Button size="sm" variant="outline" asChild>
                  <Link href={`/blogs/${topBlog.slug}`}>View Blog</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No published blogs yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Blogs</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Recent blogs, drafts, tags, and engagement.
          </p>
        </div>
      </div>

      {blogs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No blogs yet</CardTitle>
            <CardDescription>
              Create your first blog to see it in your dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button asChild>
              <Link href="/blogs/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Blog
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant={
                          blog.status === "PUBLISHED" ? "default" : "secondary"
                        }
                      >
                        {blog.status}
                      </Badge>

                      {blog.tags.map((blogTag) => (
                        <Badge key={blogTag.tag.id} variant="outline">
                          #{blogTag.tag.name}
                        </Badge>
                      ))}
                    </div>

                    <CardTitle className="line-clamp-2">
                      {blog.title}
                    </CardTitle>

                    <CardDescription className="mt-2 line-clamp-2">
                      {blog.description}
                    </CardDescription>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{blog.likes.length} likes</span>
                      <span>{blog.comments.length} comments</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {blog.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {blog.status === "PUBLISHED" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blogs/${blog.slug}`}>View</Link>
                      </Button>
                    )}

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blogs/${blog.slug}/edit`}>Edit</Link>
                    </Button>

                    <DeleteBlogButton blogId={blog.id} />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}