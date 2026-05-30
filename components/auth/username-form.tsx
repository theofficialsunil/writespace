"use client";

import { useActionState } from "react";

import {
  setUsernameAction,
  type UsernameState,
} from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: UsernameState = {};

export function UsernameForm() {
  const [state, formAction, isPending] = useActionState(
    setUsernameAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>

        <Input
          id="username"
          name="username"
          placeholder="nagar_01"
          required
        />

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