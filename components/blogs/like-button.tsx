"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";

import { toggleLikeAction } from "@/actions/like-actions";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  blogId: string;
  slug: string;
  likesCount: number;
  isLiked: boolean;
  isLoggedIn: boolean;
}

export function LikeButton({
  blogId,
  slug,
  likesCount,
  isLiked,
  isLoggedIn,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleLike() {
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }

    startTransition(async () => {
      await toggleLikeAction(blogId, slug);
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={handleLike}
      className={isLiked ? "text-red-500" : ""}
    >
      <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
      {likesCount}
    </Button>
  );
}