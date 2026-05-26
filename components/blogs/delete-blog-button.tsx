"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteBlogAction } from "@/actions/blog-actions";
import { Button } from "@/components/ui/button";

interface DeleteBlogButtonProps {
  blogId: string;
}

export function DeleteBlogButton({ blogId }: DeleteBlogButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");

    if (!confirmed) return;

    startTransition(async () => {
      await deleteBlogAction(blogId);
      router.refresh();
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleDelete}
      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}