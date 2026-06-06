import { useRef } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

import { useUpdateAvatar } from "../hooks/useUpdateAvatar";
import type { User as UserType } from "../types";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_MB = 5;

type Props = { user: UserType };

export const AvatarUpload = ({ user }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUpdateAvatar();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, or GIF images are accepted.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_MB} MB.`);
      return;
    }

    mutate(file, {
      onSuccess: () => toast.success("Profile photo updated."),
      onError: (err) => toast.error(err.message),
    });

    // Reset so the same file can be re-selected if needed
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar display */}
      <div className="relative">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-muted">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Overlay spinner when uploading */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={handleFile}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        className="gap-1.5"
      >
        <Camera className="h-3.5 w-3.5" />
        {user.profileImageUrl ? "Change photo" : "Upload photo"}
      </Button>

      <p className="text-xs text-muted-foreground">
        JPEG, PNG, WebP or GIF · Max {MAX_MB} MB
      </p>
    </div>
  );
};
