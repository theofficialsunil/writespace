// @/components/blogs/blog-view.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, User } from "lucide-react";

import { Blog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogContent } from "@/components/blogs/blog-content";
import { ShareButton } from "@/components/blogs/share-button";

interface BlogViewProps {
  blog: Blog;
  actions?: React.ReactNode;
}

export function BlogView({ blog, actions }: BlogViewProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b bg-background/95">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>
        </div>
      </div>

      <article className="container mx-auto max-w-4xl px-4 py-8">
        {blog.thumbnail && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-xl">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="outline">{blog.category}</Badge>
          {blog.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold leading-tight lg:text-5xl">
          {blog.title}
        </h1>

        <p className="mt-4 text-xl leading-relaxed text-muted-foreground">
          {blog.description}
        </p>

        <div className="mt-6 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {blog.authorUsername ? (
                <Link
                  href={`/profile/${blog.authorUsername}`}
                  className="font-medium hover:underline"
                >
                  {blog.author}
                </Link>
              ) : (
                blog.author
              )}
            </span>

            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {blog.publishDate}
            </span>

            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {blog.readTime ?? "5 min read"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {actions}
            <ShareButton title={blog.title} slug={blog.slug} />
          </div>
        </div>

        <BlogContent content={blog.content} />
      </article>
    </main>
  );
}