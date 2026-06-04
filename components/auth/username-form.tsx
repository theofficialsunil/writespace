"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BookOpen, PenTool } from "lucide-react";

import { setUsernameAction, type UsernameState } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    if (
      !state.success ||
      !state.username ||
      !state.role ||
      hasRedirected.current
    ) {
      return;
    }

    hasRedirected.current = true;

    async function refreshSessionAndRedirect() {
      await update({
        user: {
          username: state.username,
          role: state.role,
        },
      });

      if (state.role === "PUBLISHER") {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    }

    refreshSessionAndRedirect();
  }, [state.success, state.username, state.role, update, router]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" placeholder="nagar_01" required />
        <p className="text-sm text-muted-foreground">
          Only lowercase letters, numbers, and underscores.
        </p>
      </div>

      <div className="space-y-3">
        <Label>I want to join as:</Label>

        <RadioGroup defaultValue="READER" name="role">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="READER" id="reader" />
            <Label
              htmlFor="reader"
              className="flex cursor-pointer items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Reader
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PUBLISHER" id="publisher" />
            <Label
              htmlFor="publisher"
              className="flex cursor-pointer items-center gap-2"
            >
              <PenTool className="h-4 w-4" />
              Publisher
            </Label>
          </div>
        </RadioGroup>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}