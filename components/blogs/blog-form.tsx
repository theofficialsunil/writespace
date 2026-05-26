"use client";

import { useActionState } from "react";

import {
  createBlogAction,
  updateBlogAction,
  type CreateBlogState,
} from "@/actions/blog-actions";
import { Button } from "@/components/ui/button";
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

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.errors?._form && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.errors._form[0]}
        </p>
      )}

      <div className="space-y-2">
        <Input
          name="title"
          placeholder="Blog title"
          defaultValue={blog?.title}
        />
        {state.errors?.title && (
          <p className="text-sm text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          name="description"
          placeholder="Short description"
          defaultValue={blog?.description}
        />
        {state.errors?.description && (
          <p className="text-sm text-destructive">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          name="thumbnail"
          placeholder="Thumbnail URL"
          defaultValue={blog?.thumbnail ?? ""}
        />
        {state.errors?.thumbnail && (
          <p className="text-sm text-destructive">
            {state.errors.thumbnail[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          name="content"
          placeholder="Write your blog content..."
          className="min-h-80"
          defaultValue={blog?.content}
        />
        {state.errors?.content && (
          <p className="text-sm text-destructive">{state.errors.content[0]}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          name="status"
          value="DRAFT"
          variant="secondary"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Draft"}
        </Button>

        <Button
          type="submit"
          name="status"
          value="PUBLISHED"
          disabled={isPending}
        >
          {isPending ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </form>
  );
}