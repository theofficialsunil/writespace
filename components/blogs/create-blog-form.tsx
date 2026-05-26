"use client";

import { useActionState } from "react";

import {
  createBlogAction,
  type CreateBlogState,
} from "@/actions/blog-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: CreateBlogState = {};

export function CreateBlogForm() {
  const [state, formAction, isPending] = useActionState(
    createBlogAction,
    initialState
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.errors?._form && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.errors._form[0]}
        </p>
      )}

      <div className="space-y-2">
        <Input name="title" placeholder="Blog title" />
        {state.errors?.title && (
          <p className="text-sm text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Textarea name="description" placeholder="Short description" />
        {state.errors?.description && (
          <p className="text-sm text-destructive">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input name="thumbnail" placeholder="Thumbnail URL" />
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