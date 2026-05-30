import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsernameForm } from "@/components/auth/username-form";

export default async function UsernameOnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      username: true,
      role: true,
    },
  });

  if (user?.username) {
    if (user.role === "PUBLISHER") {
      redirect("/dashboard");
    }

    redirect("/blogs");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Choose your username</CardTitle>

          <CardDescription>
            Your username will be used for your public profile URL.
          </CardDescription>
        </CardHeader>

        <CardContent>
            <UsernameForm />
        </CardContent>
      </Card>
    </main>
  );
}