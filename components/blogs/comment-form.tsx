"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

import {
  createCommentAction,
  type CommentState,
} from "@/actions/comment-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  blogId: string;
  slug: string;
}

const initialState: CommentState = {};

export function CommentForm({ blogId, slug }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createCommentAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="blogId" value={blogId} />
      <input type="hidden" name="slug" value={slug} />

      <Textarea
        name="content"
        placeholder="Share your thoughts on this article..."
        className="min-h-24 resize-none"
      />

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          <Send className="mr-2 h-4 w-4" />
          {isPending ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}