import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, FileText, Heart, MessageCircle, Plus } from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DeleteBlogButton } from "@/components/blogs/delete-blog-button";

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
        },
    });

    const publishedBlogs = blogs.filter((blog) => blog.status === "PUBLISHED");
    const draftBlogs = blogs.filter((blog) => blog.status === "DRAFT");

    const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes.length, 0);
    const totalComments = blogs.reduce(
        (sum, blog) => sum + blog.comments.length,
        0,
    );

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

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center gap-4 p-6">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">
                                {publishedBlogs.length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Published
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-6">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">
                                {draftBlogs.length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Drafts
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-6">
                        <Heart className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">{totalLikes}</p>
                            <p className="text-sm text-muted-foreground">
                                Likes
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 p-6">
                        <MessageCircle className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold">
                                {totalComments}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Comments
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {blogs.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No blogs yet</CardTitle>
                        <CardDescription>
                            Create your first blog to see it in your dashboard.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <div className="space-y-4">
                    {blogs.map((blog) => (
                        <Card key={blog.id}>
                            <CardHeader>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    blog.status === "PUBLISHED"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {blog.status}
                                            </Badge>
                                        </div>

                                        <CardTitle>{blog.title}</CardTitle>
                                        <CardDescription className="mt-2">
                                            {blog.description}
                                        </CardDescription>

                                        <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                                            <span>
                                                {blog.likes.length} likes
                                            </span>
                                            <span>
                                                {blog.comments.length} comments
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {blog.status === "PUBLISHED" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/blogs/${blog.slug}`}
                                                >
                                                    View
                                                </Link>
                                            </Button>
                                        )}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/blogs/${blog.slug}/edit`}
                                            >
                                                Edit
                                            </Link>
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
