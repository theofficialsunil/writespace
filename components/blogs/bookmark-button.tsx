"use client";

import { useTransition } from "react";
import { Bookmark } from "lucide-react";

import { toggleBookmarkAction } from "@/actions/bookmark-actions";
import { Button } from "@/components/ui/button";

interface BookmarkButtonProps {
  blogId: string;
  slug: string;
  isBookmarked: boolean;
  isLoggedIn: boolean;
}

export function BookmarkButton({
  blogId,
  slug,
  isBookmarked,
  isLoggedIn,
}: BookmarkButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleBookmark() {
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }

    startTransition(async () => {
      await toggleBookmarkAction(blogId, slug);
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleBookmark}
      className={isBookmarked ? "text-primary" : ""}
    >
      <Bookmark
        className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
      />
      {isBookmarked ? "Saved" : "Save"}
    </Button>
  );
}