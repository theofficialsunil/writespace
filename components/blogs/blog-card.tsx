import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

import { Blog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="group h-full overflow-hidden rounded-xl transition-all duration-200 hover:shadow-lg">
      <Link href={`/blogs/${blog.slug}`} className="block">
        {blog.thumbnail && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="p-6">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {blog.category}
            </Badge>

            {blog.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <CardTitle className="line-clamp-2 transition-colors group-hover:text-primary">
            {blog.title}
          </CardTitle>

          <CardDescription className="line-clamp-3">
            {blog.description}
          </CardDescription>
        </CardHeader>
      </Link>

      <CardContent className="px-6 pb-6 pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {blog.authorUsername ? (
              <Link
                href={`/profile/${blog.authorUsername}`}
                className="hover:underline"
              >
                {blog.author}
              </Link>
            ) : (
              <span>{blog.author}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{blog.publishDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}