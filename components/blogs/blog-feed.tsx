"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Search, User } from "lucide-react";

import { Blog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogFeedProps {
  blogs: Blog[];
}

export function BlogFeed({ blogs }: BlogFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(blogs.map((blog) => blog.category)))];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const search = searchQuery.toLowerCase();

      const matchesSearch =
        blog.title.toLowerCase().includes(search) ||
        blog.description.toLowerCase().includes(search) ||
        blog.author.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold lg:text-4xl">
          Discover Stories
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore articles from writers and educators.
        </p>
      </div>

      <div className="mb-8 rounded-lg border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blogs, authors, or keywords..."
              className="pl-10"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Showing {filteredBlogs.length} of {blogs.length} articles
      </p>

      {filteredBlogs.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold">No blogs found</h2>
          <p className="mt-2 text-muted-foreground">
            Try changing your search or category filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Link key={blog.id} href={`/blogs/${blog.slug}`}>
              <Card key={blog.id} className="h-full overflow-hidden transition hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden">
                    <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="h-full w-full object-cover"
                    />
                </div>

                <CardHeader>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant="outline">{blog.category}</Badge>
                    {blog.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <CardTitle className="line-clamp-2">
                    {blog.title}
                  </CardTitle>

                  <CardDescription className="line-clamp-3">
                    {blog.description}
                  </CardDescription>

                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{blog.author}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{blog.publishDate}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}