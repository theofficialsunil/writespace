// @/components/blogs/blog-form.tsx
"use client";

import Image from "next/image";
import { ChangeEvent, useActionState, useState } from "react";
import { AlertCircle, Eye, ImageIcon, Save, Send, Upload } from "lucide-react";

import {
  createBlogAction,
  updateBlogAction,
  type CreateBlogState,
} from "@/actions/blog-actions";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
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
  const [thumbnailUrl, setThumbnailUrl] = useState(blog?.thumbnail ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const action =
    mode === "edit" && blog
      ? updateBlogAction.bind(null, blog.id)
      : createBlogAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be smaller than 2MB.");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImageToCloudinary(file);
      setThumbnailUrl(uploadedUrl);
    } catch {
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form action={formAction} className="mt-8">
      <input type="hidden" name="thumbnail" value={thumbnailUrl} />

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
                <p className="text-sm text-destructive">{state.errors.title[0]}</p>
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
                <p className="text-sm text-destructive">{state.errors.description[0]}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
              <CardDescription>
                Use rich formatting for headings, lists, quotes, and code blocks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <TiptapEditor name="content" initialContent={blog?.content} />
              {state.errors?.content && (
                <p className="text-sm text-destructive">{state.errors.content[0]}</p>
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
              <CardDescription>
                Upload a thumbnail image for your blog card.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {thumbnailUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted text-sm text-muted-foreground">
                  No thumbnail uploaded
                </div>
              )}

              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or WEBP. Max size 2MB.
                </p>
              </div>

              {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

              {thumbnailUrl && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setThumbnailUrl("")}
                >
                  Remove Thumbnail
                </Button>
              )}

              {state.errors?.thumbnail && (
                <p className="text-sm text-destructive">{state.errors.thumbnail[0]}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button type="button" variant="outline" className="w-full" disabled>
                <Eye className="mr-2 h-4 w-4" />
                Preview Later
              </Button>

              <Button
                type="submit"
                name="status"
                value="DRAFT"
                variant="secondary"
                className="w-full"
                disabled={isPending || isUploading}
              >
                <Save className="mr-2 h-4 w-4" />
                {isPending ? "Saving..." : "Save Draft"}
              </Button>

              <Button
                type="submit"
                name="status"
                value="PUBLISHED"
                className="w-full"
                disabled={isPending || isUploading}
              >
                {isUploading ? (
                  <Upload className="mr-2 h-4 w-4" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isUploading
                  ? "Uploading..."
                  : isPending
                  ? "Publishing..."
                  : "Publish"}
              </Button>

              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Complete title, description, content, and optionally upload a thumbnail.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}