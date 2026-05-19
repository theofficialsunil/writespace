import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function NewBlogPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth");
  }

  if (session.user.role !== "PUBLISHER") {
    redirect("/blogs");
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">Create New Blog</h1>
      <p className="mt-2 text-muted-foreground">
        Only publishers can access this page.
      </p>
    </main>
  );
}