import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";

import { useUpdateProfile } from "../hooks/useUpdateProfile";
import {
  updateProfileSchema,
  type UpdateProfileSchemaType,
} from "../schemas/profile.schema";
import type { User, UpdateProfilePayload } from "../types";

type Props = { user: User };

export const UserProfileForm = ({ user }: Props) => {
  const { mutate, isPending } = useUpdateProfile();

  const defaultValues: UpdateProfileSchemaType = {
    fullName: user.fullName,
    phone: user.phone ?? "",
    province: user.province ?? "",
    district: user.district ?? "",
    sector: user.sector ?? "",
    cell: user.cell ?? "",
    village: user.village ?? "",
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const onSubmit = (data: UpdateProfileSchemaType) => {
    const payload: UpdateProfilePayload = {};
    for (const key of Object.keys(dirtyFields) as (keyof UpdateProfileSchemaType)[]) {
      const value = data[key];
      (payload as Record<string, unknown>)[key] = value === "" ? undefined : value;
    }
    if (Object.keys(payload).length === 0) return;

    mutate(payload, {
      onSuccess: () => {
        toast.success("Profile updated.");
        reset(data);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Identity */}
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Personal info
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" {...register("fullName")} />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+250700000000" {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Location
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="province">Province</Label>
          <Input id="province" placeholder="e.g. Kigali" {...register("province")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="district">District</Label>
          <Input id="district" placeholder="e.g. Gasabo" {...register("district")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sector">Sector</Label>
          <Input id="sector" placeholder="e.g. Remera" {...register("sector")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cell">Cell</Label>
          <Input id="cell" {...register("cell")} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="village">Village</Label>
          <Input id="village" {...register("village")} />
        </div>
      </div>

      <Button type="submit" disabled={isPending || !isDirty} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
};
