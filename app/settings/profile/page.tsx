import { redirect } from "next/navigation";

import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function ProfileSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      username: true,
      bio: true,
      image: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/auth");
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>

        <CardContent>
          <ProfileSettingsForm
            user={{
              name: user.name,
              username: user.username,
              bio: user.bio,
              image: user.image,
              role: user.role === "ADMIN" ? "PUBLISHER" : user.role,
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}