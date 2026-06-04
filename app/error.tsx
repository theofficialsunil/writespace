"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="container mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="mt-6 text-3xl font-bold">Something went wrong</h1>

      <p className="mt-3 text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>

      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}