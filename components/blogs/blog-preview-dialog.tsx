"use client";

import Image from "next/image";
import { Calendar, Clock, Eye, User } from "lucide-react";

import { BlogContent } from "@/components/blogs/blog-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BlogPreviewDialogProps {
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  tags: string[];
}

export function BlogPreviewDialog({
  title,
  description,
  content,
  thumbnail,
  tags,
}: BlogPreviewDialogProps) {
  const safeTitle = title.trim() || "Untitled Blog";
  const safeDescription =
    description.trim() || "Blog description will appear here.";
  const safeContent =
    content.trim() ||
    "<p>Start writing your blog content to preview it here.</p>";

  const readTime = `${Math.max(1, Math.ceil(safeContent.length / 800))} min read`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[95vw] max-w-5xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Blog Preview</DialogTitle>
        </DialogHeader>

        <article className="mx-auto w-full max-w-4xl overflow-hidden px-1 py-4">
          <div className="mb-6 flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary">#general</Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {safeTitle}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            {safeDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              You
            </span>

            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Today
            </span>

            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readTime}
            </span>
          </div>

          {thumbnail && (
            <div className="relative mt-8 aspect-video overflow-hidden rounded-xl bg-muted">
              <Image
                src={thumbnail}
                alt={safeTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          <BlogContent content={safeContent} />
        </article>
      </DialogContent>
    </Dialog>
  );
}