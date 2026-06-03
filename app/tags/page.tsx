import Link from "next/link";
import { Hash } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export default async function TagsPage() {
  const tags = await db.tag.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      blogs: {
        where: {
          blog: {
            status: "PUBLISHED",
          },
        },
      },
    },
  });

  const visibleTags = tags.filter((tag) => tag.blogs.length > 0);

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore Tags</h1>
        <p className="mt-2 text-muted-foreground">
          Browse articles by topic and discover related blogs.
        </p>
      </div>

      {visibleTags.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            No tags available yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTags.map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.name}`}>
              <Card className="transition hover:-translate-y-1 hover:shadow-md">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Hash className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="font-semibold">#{tag.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {tag.blogs.length}{" "}
                        {tag.blogs.length === 1 ? "blog" : "blogs"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}