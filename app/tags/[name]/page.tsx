import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blogs/blog-card";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

interface TagPageProps {
  params: Promise<{
    name: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  return {
    title: `#${decodedName} Blogs | WriteSpace`,
    description: `Read blogs tagged with ${decodedName} on WriteSpace.`,
    openGraph: {
      title: `#${decodedName} Blogs | WriteSpace`,
      description: `Read blogs tagged with ${decodedName} on WriteSpace.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `#${decodedName} Blogs | WriteSpace`,
      description: `Read blogs tagged with ${decodedName} on WriteSpace.`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).toLowerCase();

  const tag = await db.tag.findUnique({
    where: {
      name: decodedName,
    },
    include: {
      blogs: {
        where: {
          blog: {
            status: "PUBLISHED",
          },
        },
        orderBy: {
          blog: {
            publishedAt: "desc",
          },
        },
        include: {
          blog: {
            include: {
              author: {
                select: {
                  name: true,
                  username: true,
                },
              },
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
      },
    },
  });

  if (!tag) {
    notFound();
  }

  const blogs = tag.blogs.map(({ blog }) => ({
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
    tags: blog.tags.map((blogTag) => blogTag.tag.name),
    category: "General",
    likes: blog.likes.length,
    readTime: `${Math.ceil(blog.content.length / 800)} min read`,
    status: blog.status.toLowerCase() as "published" | "draft",
  }));

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Tag</p>
        <h1 className="mt-1 text-3xl font-bold">#{tag.name}</h1>
        <p className="mt-2 text-muted-foreground">
          {blogs.length} {blogs.length === 1 ? "blog" : "blogs"} found for this
          tag.
        </p>
      </div>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            No published blogs available for this tag.
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