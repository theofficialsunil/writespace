"use client";

import Image from "next/image";
import { useState } from "react";
import { useActionState } from "react";
import { AlertCircle, Eye, ImageIcon, Save, Send } from "lucide-react";

import {
    createBlogAction,
    updateBlogAction,
    type CreateBlogState,
} from "@/actions/blog-actions";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BlogFormProps {
    mode: "create" | "edit";
    blog?: {
        id: string;
        title: string;
        description: string;
        content: string;
        thumbnail: string | null;
        status: "DRAFT" | "PUBLISHED";
    };
}

const initialState: CreateBlogState = {};

export function BlogForm({ mode, blog }: BlogFormProps) {
    const action =
        mode === "edit" && blog
            ? updateBlogAction.bind(null, blog.id)
            : createBlogAction;

    const [state, formAction, isPending] = useActionState(action, initialState);
    const [thumbnailPreview, setThumbnailPreview] = useState(
        blog?.thumbnail ?? "",
    );

    return (
        <form action={formAction} className="mt-8">
            {state.errors?._form && (
                <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4" />
                    <p>{state.errors._form[0]}</p>
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Blog Title</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Input
                                name="title"
                                placeholder="Enter an engaging title for your blog post..."
                                defaultValue={blog?.title}
                                className="text-lg"
                            />
                            {state.errors?.title && (
                                <p className="text-sm text-destructive">
                                    {state.errors.title[0]}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Short Description</CardTitle>
                            <CardDescription>
                                A brief summary that appears in blog previews
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Textarea
                                name="description"
                                placeholder="Write a compelling description..."
                                defaultValue={blog?.description}
                                className="min-h-24"
                            />
                            {state.errors?.description && (
                                <p className="text-sm text-destructive">
                                    {state.errors.description[0]}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Blog Content</CardTitle>
                            <CardDescription>
                                Write your blog post content here
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Textarea
                                name="content"
                                placeholder="Start writing your blog post..."
                                defaultValue={blog?.content}
                                className="min-h-96 resize-none"
                            />
                            {state.errors?.content && (
                                <p className="text-sm text-destructive">
                                    {state.errors.content[0]}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Thumbnail Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Input
                                name="thumbnail"
                                placeholder="Paste thumbnail image URL"
                                defaultValue={blog?.thumbnail ?? ""}
                                onChange={(e) =>
                                    setThumbnailPreview(e.target.value)
                                }
                            />
                            {thumbnailPreview && (
                                <div className="relative mt-4 aspect-video overflow-hidden rounded-lg border bg-muted">
                                    <Image
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            {state.errors?.thumbnail && (
                                <p className="text-sm text-destructive">
                                    {state.errors.thumbnail[0]}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview Later
                            </Button>

                            <Button
                                type="submit"
                                name="status"
                                value="DRAFT"
                                variant="secondary"
                                className="w-full"
                                disabled={isPending}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isPending ? "Saving..." : "Save Draft"}
                            </Button>

                            <Button
                                type="submit"
                                name="status"
                                value="PUBLISHED"
                                className="w-full"
                                disabled={isPending}
                            >
                                <Send className="mr-2 h-4 w-4" />
                                {isPending ? "Publishing..." : "Publish"}
                            </Button>

                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <p>
                                    Complete title, description, content, and
                                    optionally add a thumbnail URL.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
