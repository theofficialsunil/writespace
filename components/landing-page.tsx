import Link from "next/link";
import { ArrowRight, BookOpen, PenTool, Star, Users } from "lucide-react";

import { Blog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LandingPageProps {
  featuredBlogs: Blog[];
}

export function LandingPage({ featuredBlogs }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                Share Your Stories,
                <span className="block text-primary">Connect With Readers</span>
              </h1>

              <p className="max-w-lg text-xl text-muted-foreground">
                WriteSpace is a modern publishing platform for writers, readers,
                educators, and creators.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth">
                  <PenTool className="mr-2 h-5 w-5" />
                  Start Writing
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/blogs">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Blogs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Writers</span>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Articles</span>
              </div>

              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Reader focused</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-muted p-8">
            <div className="rounded-xl bg-background p-8 shadow-sm">
              <p className="text-sm text-muted-foreground">Featured idea</p>
              <h2 className="mt-2 text-3xl font-bold">
                Publish clean articles with rich editing, comments, likes, and
                analytics.
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold lg:text-4xl">
              For Content Creators
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Create, draft, publish, and track articles from one dashboard.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <PenTool className="mx-auto mb-4 h-12 w-12 text-primary" />
                <CardTitle>Rich Editor</CardTitle>
                <CardDescription>
                  Write formatted blogs using a real editor.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Readers can like, comment, and bookmark posts.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="mx-auto mb-4 h-12 w-12 text-primary" />
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Track views, likes, comments, and post performance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold lg:text-4xl">
              Featured Stories
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover recent posts from the community.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredBlogs.slice(0, 6).map((blog) => (
              <Card key={blog.id} className="overflow-hidden">
                <CardHeader>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {blog.description}
                  </CardDescription>

                  <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                    <span>By {blog.author}</span>
                    <span>{blog.publishDate}</span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/blogs">
                View All Blogs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}