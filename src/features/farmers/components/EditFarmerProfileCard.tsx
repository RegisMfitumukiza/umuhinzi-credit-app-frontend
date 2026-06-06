import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, X } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useUpdateFarmer } from "../hooks/useUpdateFarmer";
import {
  updateFarmerSchema,
  type UpdateFarmerSchemaType,
} from "../schemas/farmer.schema";
import type { Farmer, UpdateFarmerPayload } from "../types";

type Props = { farmer: Farmer };

const fmt = (val: string | number | null | undefined, fallback = "—") =>
  val != null && val !== "" ? String(val) : fallback;

const fmtDate = (val: string | null) =>
  val ? new Date(val).toLocaleDateString() : "—";

const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

export const EditFarmerProfileCard = ({ farmer }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate, isPending, error } = useUpdateFarmer();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateFarmerSchemaType>({
    resolver: zodResolver(updateFarmerSchema),
    defaultValues: {
      nationalId: farmer.nationalId,
      dateOfBirth: farmer.dateOfBirth
        ? farmer.dateOfBirth.substring(0, 10)
        : "",
      gender: farmer.gender ?? undefined,
      farmingExperienceYears: farmer.farmingExperienceYears ?? undefined,
      primaryCrop: farmer.primaryCrop ?? "",
    },
  });

  const onCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (data: UpdateFarmerSchemaType) => {
    const payload: UpdateFarmerPayload = {
      ...(data.nationalId && { nationalId: data.nationalId }),
      ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
      ...(data.gender && { gender: data.gender }),
      ...(data.farmingExperienceYears != null && {
        farmingExperienceYears: data.farmingExperienceYears,
      }),
      ...(data.primaryCrop && { primaryCrop: data.primaryCrop }),
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Profile updated.");
        setIsEditing(false);
      },
    });
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Farmer Profile</CardTitle>
        {!isEditing ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1.5"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 gap-1.5"
            onClick={onCancel}
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </Button>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {!isEditing ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">National ID</dt>
              <dd className="font-medium">{fmt(farmer.nationalId)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Date of birth</dt>
              <dd className="font-medium">{fmtDate(farmer.dateOfBirth)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Gender</dt>
              <dd className="font-medium">
                {farmer.gender ? GENDER_LABELS[farmer.gender] : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Experience</dt>
              <dd className="font-medium">
                {farmer.farmingExperienceYears != null
                  ? `${farmer.farmingExperienceYears} yr${farmer.farmingExperienceYears !== 1 ? "s" : ""}`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Primary crop</dt>
              <dd className="font-medium">{fmt(farmer.primaryCrop)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Farms / Livestock</dt>
              <dd className="font-medium">
                {farmer._count.farms} / {farmer._count.livestock}
              </dd>
            </div>
          </dl>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-nationalId">National ID</Label>
              <Input
                id="edit-nationalId"
                maxLength={16}
                {...register("nationalId")}
              />
              {errors.nationalId && (
                <p className="text-sm text-destructive">
                  {errors.nationalId.message}
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-dob">Date of birth</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  {...register("dateOfBirth")}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-exp">Experience (years)</Label>
                <Input
                  id="edit-exp"
                  type="number"
                  min={0}
                  max={80}
                  {...register("farmingExperienceYears", {
                    setValueAs: (v) =>
                      v === "" || v === null || v === undefined
                        ? undefined
                        : parseInt(v as string, 10),
                  })}
                />
                {errors.farmingExperienceYears && (
                  <p className="text-sm text-destructive">
                    {errors.farmingExperienceYears.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-crop">Primary crop</Label>
                <Input
                  id="edit-crop"
                  placeholder="e.g. Maize"
                  {...register("primaryCrop")}
                />
                {errors.primaryCrop && (
                  <p className="text-sm text-destructive">
                    {errors.primaryCrop.message}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error.message}
              </p>
            )}

            <Button type="submit" size="sm" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
