"use client";

import Image from "next/image";
import { ChangeEvent, useActionState, useState } from "react";
import { Upload } from "lucide-react";

import {
  updateProfileAction,
  type ProfileState,
} from "@/actions/profile-actions";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileSettingsFormProps {
  user: {
    name: string;
    username: string | null;
    bio: string | null;
    image: string | null;
  };
}

const initialState: ProfileState = {};

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [imageUrl, setImageUrl] = useState(user.image ?? "");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

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

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="image" value={imageUrl} />

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

      <div className="space-y-3">
        <Label>Profile Image</Label>

        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            {imageUrl ? (
              <div className="relative h-full w-full">
                <Image
                  src={imageUrl}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
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
          </div>
        </div>

        {uploadError && (
          <p className="text-sm text-destructive">{uploadError}</p>
        )}

        {imageUrl && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setImageUrl("")}
          >
            Remove Image
          </Button>
        )}
      </div>

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

      <Button type="submit" disabled={isPending || isUploading}>
        {isUploading ? (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Uploading...
          </>
        ) : isPending ? (
          "Saving..."
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}