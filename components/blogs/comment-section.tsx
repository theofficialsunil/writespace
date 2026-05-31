import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { CommentForm } from "@/components/blogs/comment-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    username: string | null;
  };
}

interface CommentSectionProps {
  blogId: string;
  slug: string;
  comments: Comment[];
  isLoggedIn: boolean;
}

export function CommentSection({
  blogId,
  slug,
  comments,
  isLoggedIn,
}: CommentSectionProps) {
  return (
    <section className="mt-16 space-y-8">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      {isLoggedIn ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add a Comment</CardTitle>
          </CardHeader>

          <CardContent>
            <CommentForm blogId={blogId} slug={slug} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4 text-muted-foreground">
              Sign in to leave a comment and join the discussion.
            </p>

            <Button variant="outline" asChild>
              <Link href="/auth">Sign In to Comment</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {comments.length === 0 ? (
        <div className="py-12 text-center">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No comments yet</h3>
          <p className="text-muted-foreground">
            Be the first to share your thoughts on this article.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {comment.author.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {comment.author.username ? (
                          <Link
                            href={`/profile/${comment.author.username}`}
                            className="font-semibold hover:underline"
                          >
                            {comment.author.name}
                          </Link>
                        ) : (
                          <span className="font-semibold">
                            {comment.author.name}
                          </span>
                        )}

                        <span className="text-sm text-muted-foreground">
                          {comment.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}