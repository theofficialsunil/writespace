"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Blog } from "@/lib/types";
import { BlogCard } from "@/components/blogs/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogFeedProps {
  blogs: Blog[];
  query: string;
  sort: string;
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
}

export function BlogFeed({
  blogs,
  query,
  sort,
  currentPage,
  totalPages,
  totalBlogs,
}: BlogFeedProps) {
  const router = useRouter();

  function buildUrl(nextParams: {
    query?: string;
    sort?: string;
    page?: number;
  }) {
    const params = new URLSearchParams();

    const nextQuery = nextParams.query ?? query;
    const nextSort = nextParams.sort ?? sort;
    const nextPage = nextParams.page ?? currentPage;

    if (nextQuery) params.set("query", nextQuery);
    if (nextSort) params.set("sort", nextSort);
    if (nextPage > 1) params.set("page", String(nextPage));

    return `/blogs?${params.toString()}`;
  }

  function updateSearch(nextQuery: string) {
    router.push(
      buildUrl({
        query: nextQuery,
        page: 1,
      })
    );
  }

  function updateSort(nextSort: string) {
    router.push(
      buildUrl({
        sort: nextSort,
        page: 1,
      })
    );
  }

  function goToPage(page: number) {
    router.push(
      buildUrl({
        page,
      })
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold lg:text-4xl">Discover Stories</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore articles from writers and educators.
        </p>
      </div>

      <div className="mb-8 rounded-lg border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              defaultValue={query}
              placeholder="Search blogs..."
              className="pl-10"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  updateSearch(event.currentTarget.value);
                }
              }}
            />
          </div>

          <Select value={sort} onValueChange={updateSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        Showing {blogs.length} of {totalBlogs} articles
      </p>

      {blogs.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold">No blogs found</h2>
          <p className="mt-2 text-muted-foreground">
            Try a different search query.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}