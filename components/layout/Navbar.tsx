"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BookOpen, LayoutDashboard, PenTool, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PenTool className="h-6 w-6" />
            <span className="text-xl font-semibold">WriteSpace</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/blogs" className="hidden sm:flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Browse Blogs
            </Link>

            {session?.user ? (
              <>
                {session.user.role === "PUBLISHER" && (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>

                    <Button asChild>
                      <Link href="/blogs/new">
                        <PenTool className="mr-2 h-4 w-4" />
                        Write
                      </Link>
                    </Button>
                  </>
                )}

                <Button variant="outline" onClick={() => signOut()}>
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}