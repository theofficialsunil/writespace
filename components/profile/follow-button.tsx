"use client";

import { useTransition } from "react";
import { UserPlus, UserCheck } from "lucide-react";

import { toggleFollowAction } from "@/actions/follow-actions";
import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  followingId: string;
  username: string;
  isFollowing: boolean;
  isLoggedIn: boolean;
}

export function FollowButton({
  followingId,
  username,
  isFollowing,
  isLoggedIn,
}: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleFollow() {
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }

    startTransition(async () => {
      await toggleFollowAction(followingId, username);
    });
  }

  return (
    <Button onClick={handleFollow} disabled={isPending} variant={isFollowing ? "outline" : "default"}>
      {isFollowing ? (
        <UserCheck className="mr-2 h-4 w-4" />
      ) : (
        <UserPlus className="mr-2 h-4 w-4" />
      )}
      {isPending ? "Updating..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}