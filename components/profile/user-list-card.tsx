import Image from "next/image";
import Link from "next/link";
import { BookOpen, Users } from "lucide-react";

import { FollowButton } from "@/components/profile/follow-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface UserListCardProps {
  user: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
    bio: string | null;
    role: string;
    blogs: {
      id: string;
    }[];
    followers: {
      id: string;
    }[];
  };
  currentUserId?: string;
  isFollowing: boolean;
  isLoggedIn: boolean;
}

export function UserListCard({
  user,
  currentUserId,
  isFollowing,
  isLoggedIn,
}: UserListCardProps) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const isOwnProfile = currentUserId === user.id;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={user.username ? `/profile/${user.username}` : "#"}
          className="flex min-w-0 items-center gap-4"
        >
          <Avatar className="h-14 w-14">
            {user.image ? (
              <div className="relative h-full w-full">
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>

          <div className="min-w-0">
            <h2 className="truncate font-semibold transition hover:text-primary">
              {user.name}
            </h2>

            <p className="truncate text-sm text-muted-foreground">
              @{user.username}
            </p>

            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
              {user.bio ?? "Writer at WriteSpace"}
            </p>

            <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {user.blogs.length} blogs
              </span>

              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {user.followers.length} followers
              </span>
            </div>
          </div>
        </Link>

        {!isOwnProfile && user.username && (
          <FollowButton
            followingId={user.id}
            username={user.username}
            isFollowing={isFollowing}
            isLoggedIn={isLoggedIn}
          />
        )}
      </CardContent>
    </Card>
  );
}