import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, PenTool, UserPlus } from "lucide-react";

export function Navbar() {
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

            <Button asChild>
              <Link href="/auth">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}