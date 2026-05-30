"use client";

import { useActionState } from "react";

import {
  updateProfileAction,
  type ProfileState,
} from "@/actions/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileSettingsFormProps {
  user: {
    name: string;
    username: string | null;
    bio: string | null;
  };
}

const initialState: ProfileState = {};

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {state.success}
        </p>
      )}

      <div className="space-y-2">
        <Label>Name</Label>
        <Input name="name" defaultValue={user.name} />
      </div>

      <div className="space-y-2">
        <Label>Username</Label>
        <Input value={user.username ?? ""} disabled />
        <p className="text-sm text-muted-foreground">
          Username editing will be added later.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea
          name="bio"
          defaultValue={user.bio ?? ""}
          placeholder="Write a short bio..."
          className="min-h-28"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}