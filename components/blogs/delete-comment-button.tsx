"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteCommentAction } from "@/actions/comment-actions";
import { Button } from "@/components/ui/button";

interface DeleteCommentButtonProps {
  commentId: string;
  slug: string;
}

export function DeleteCommentButton({
  commentId,
  slug,
}: DeleteCommentButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm("Delete this comment?");

    if (!confirmed) return;

    startTransition(async () => {
      await deleteCommentAction(commentId, slug);
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="mr-1 h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}