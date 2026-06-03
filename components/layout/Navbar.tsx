"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  BookMarked,
  BookOpen,
  LayoutDashboard,
  Menu,
  PenTool,
  User,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Hash } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PenTool className="h-6 w-6" />
            <span className="text-xl font-semibold">WriteSpace</span>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/blogs" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Browse Blogs
            </Link>
            <Link
                href="/tags"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Tags
              </Link>

            {session?.user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/bookmarks">
                    <BookMarked className="mr-2 h-4 w-4" />
                    Bookmarks
                  </Link>
                </Button>

                {session.user.username && (
                  <Button variant="ghost" asChild>
                    <Link href={`/profile/${session.user.username}`}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                )}

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

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>WriteSpace</SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-3">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/blogs" onClick={() => setOpen(false)}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Blogs
                    </Link>
                  </Button>
                  <Link
                    href="/tags"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Hash className="h-4 w-4" />
                    Tags
                  </Link>

                  {session?.user ? (
                    <>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/bookmarks" onClick={() => setOpen(false)}>
                          <BookMarked className="mr-2 h-4 w-4" />
                          Bookmarks
                        </Link>
                      </Button>

                      {session.user.username && (
                        <Button
                          variant="ghost"
                          asChild
                          className="justify-start"
                        >
                          <Link href={`/profile/${session.user.username}`} onClick={() => setOpen(false)}>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </Button>
                      )}

                      {session.user.role === "PUBLISHER" && (
                        <>
                          <Button
                            variant="ghost"
                            asChild
                            className="justify-start"
                          >
                            <Link href="/dashboard" onClick={() => setOpen(false)}>
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              Dashboard
                            </Link>
                          </Button>

                          <Button asChild className="justify-start">
                            <Link href="/blogs/new" onClick={() => setOpen(false)}>
                              <PenTool className="mr-2 h-4 w-4" />
                              Write
                            </Link>
                          </Button>
                        </>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => signOut()}
                        className="justify-start"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button asChild className="justify-start">
                      <Link href="/auth" onClick={() => setOpen(false)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}