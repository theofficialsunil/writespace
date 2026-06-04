import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
export default function NotFoundPage() {
  return (
    <main className="container mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-muted p-4 text-muted-foreground">
        <FileQuestion className="h-8 w-8" />
      </div>

      <h1 className="mt-6 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        The page you are looking for does not exist or may have been removed.
      </p>

      <Button className="mt-6" asChild>
        <Link href="/">Go home</Link>
      </Button>
    </main>
  );
}