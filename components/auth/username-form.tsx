"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  setUsernameAction,
  type UsernameState,
} from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: UsernameState = {};

export function UsernameForm() {
  const router = useRouter();
  const { update } = useSession();
  const hasRedirected = useRef(false);

  const [state, formAction, isPending] = useActionState(
    setUsernameAction,
    initialState
  );

  useEffect(() => {
    if (!state.success || !state.username || hasRedirected.current) return;
    hasRedirected.current = true;
    async function refreshSessionAndRedirect() {
      await update({
        user: {
          username: state.username,
        },
      });

      router.replace("/");
    }

    refreshSessionAndRedirect();
  }, [state.success, state.username, update, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>

        <Input id="username" name="username" placeholder="nagar_01" required />

        <p className="text-sm text-muted-foreground">
          Only lowercase letters, numbers, and underscores.
        </p>

        {state.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}