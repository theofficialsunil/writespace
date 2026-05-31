import { notFound } from "next/navigation";

import { BlogView } from "@/components/blogs/blog-view";
import { CommentSection } from "@/components/blogs/comment-section";
import { LikeButton } from "@/components/blogs/like-button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const session = await auth();

  try {
    const blog = await db.blog.findUnique({
      where: {
        slug,
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
        likes: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!blog || blog.status !== "PUBLISHED") {
      notFound();
    }

    const isLiked = blog.likes.some(
      (like) => like.userId === session?.user?.id
    );

    const formattedBlog = {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      description: blog.description,
      content: blog.content,
      author: blog.author.name,
      authorUsername: blog.author.username ?? "",
      publishDate: blog.publishedAt
        ? blog.publishedAt.toLocaleDateString()
        : blog.createdAt.toLocaleDateString(),
      thumbnail: blog.thumbnail ?? "",
      tags: [],
      category: "General",
      likes: blog.likes.length,
      readTime: `${Math.ceil(blog.content.length / 800)} min read`,
      status: blog.status.toLowerCase() as "published" | "draft",
    };

    return (
      <>
        <BlogView
          blog={formattedBlog}
          actions={
            <LikeButton
              blogId={blog.id}
              slug={blog.slug}
              likesCount={blog.likes.length}
              isLiked={isLiked}
              isLoggedIn={Boolean(session?.user)}
            />
          }
        />

        <div className="container mx-auto max-w-4xl px-4">
          <CommentSection
            blogId={blog.id}
            slug={blog.slug}
            comments={blog.comments}
            isLoggedIn={Boolean(session?.user)}
            currentUserId={session?.user?.id}
          />
        </div>
      </>
    );
  } catch {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Blog unavailable</h1>
        <p className="mt-2 text-muted-foreground">
          Database connection failed. Check database connection.
        </p>
      </main>
    );
  }
}