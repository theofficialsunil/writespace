"use client";

import Image from "next/image";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BookOpen, PenTool, Upload, User } from "lucide-react";

import {
  updateProfileAction,
  type ProfileState,
} from "@/actions/profile-actions";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface ProfileSettingsFormProps {
  user: {
    name: string;
    username: string | null;
    bio: string | null;
    image: string | null;
    role: "READER" | "PUBLISHER";
  };
}

const initialState: ProfileState = {};

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const { update } = useSession();

  const [imageUrl, setImageUrl] = useState(user.image ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!state.success || !state.role) return;

    update({
      user: {
        role: state.role,
      },
    });
  }, [state.success, state.role, update]);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadError("");

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be smaller than 2MB.");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImageToCloudinary(file);
      setImageUrl(uploadedUrl);
    } catch {
      setUploadError("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="image" value={imageUrl} readOnly />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20 overflow-hidden rounded-full">
          {imageUrl ? (
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src={imageUrl}
                alt={user.name}
                fill
                sizes="80px"
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <AvatarFallback className="rounded-full text-2xl">
              {initials || <User className="h-8 w-8" />}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
          />

          <p className="text-xs text-muted-foreground">
            JPG, PNG or WEBP. Max size 2MB.
          </p>

          {uploadError && (
            <p className="text-sm text-destructive">{uploadError}</p>
          )}

          {imageUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setImageUrl("")}
            >
              Remove Image
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" defaultValue={user.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={user.username ?? ""}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          Username cannot be changed currently.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={user.bio ?? ""}
          placeholder="Tell readers about yourself..."
          className="min-h-28"
        />
        <p className="text-xs text-muted-foreground">Maximum 200 characters.</p>
      </div>

      <div className="space-y-3">
        <Label>I want to use WriteSpace as:</Label>

        <RadioGroup defaultValue={user.role} name="role">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="READER" id="settings-reader" />
            <Label
              htmlFor="settings-reader"
              className="flex cursor-pointer items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Reader
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PUBLISHER" id="settings-publisher" />
            <Label
              htmlFor="settings-publisher"
              className="flex cursor-pointer items-center gap-2"
            >
              <PenTool className="h-4 w-4" />
              Publisher
            </Label>
          </div>
        </RadioGroup>

        <p className="text-xs text-muted-foreground">
          Readers can browse, like, comment, bookmark, and follow. Publishers
          can also create and manage blogs.
        </p>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      {state.success && (
        <p className="rounded-md bg-green-50 p-2 text-sm text-green-700">
          Profile updated successfully.
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || isUploading}
      >
        {isPending ? "Saving..." : isUploading ? "Uploading..." : "Save Changes"}
      </Button>
    </form>
  );
}