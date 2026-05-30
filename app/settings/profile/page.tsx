import { redirect } from "next/navigation";

import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function ProfileSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      username: true,
      bio: true,
    },
  });

  if (!user?.username) {
    redirect("/onboarding/username");
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>

        <CardContent>
          <ProfileSettingsForm user={user} />
        </CardContent>
      </Card>
    </main>
  );
}