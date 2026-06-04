import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { UserListCard } from "@/components/profile/user-list-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface FollowingPageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({
  params,
}: FollowingPageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `@${username} Following | WriteSpace`,
    description: `People followed by @${username} on WriteSpace.`,
  };
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  const { username } = await params;
  const session = await auth();

  const profileUser = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      name: true,
      username: true,
      following: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              bio: true,
              role: true,
              blogs: {
                where: {
                  status: "PUBLISHED",
                },
                select: {
                  id: true,
                },
              },
              followers: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!profileUser) {
    notFound();
  }

  const currentFollowing = session?.user
    ? await db.follow.findMany({
        where: {
          followerId: session.user.id,
        },
        select: {
          followingId: true,
        },
      })
    : [];

  const currentFollowingIds = new Set(
    currentFollowing.map((follow) => follow.followingId)
  );

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={`/profile/${profileUser.username}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to profile
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Following</h1>
        <p className="mt-2 text-muted-foreground">
          People followed by {profileUser.name}.
        </p>
      </div>

      {profileUser.following.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            Not following anyone yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {profileUser.following.map((follow) => (
            <UserListCard
              key={follow.following.id}
              user={follow.following}
              currentUserId={session?.user?.id}
              isLoggedIn={Boolean(session?.user)}
              isFollowing={currentFollowingIds.has(follow.following.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}