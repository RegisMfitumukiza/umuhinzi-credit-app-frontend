import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useCreateFarmer } from "../hooks/useCreateFarmer";
import {
  createFarmerSchema,
  type CreateFarmerSchemaType,
} from "../schemas/farmer.schema";
import type { CreateFarmerPayload } from "../types";

export const CreateFarmerProfileForm = () => {
  const { mutate, isPending, error } = useCreateFarmer();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFarmerSchemaType>({
    resolver: zodResolver(createFarmerSchema),
  });

  const onSubmit = (data: CreateFarmerSchemaType) => {
    const payload: CreateFarmerPayload = {
      nationalId: data.nationalId,
      ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
      ...(data.gender && { gender: data.gender }),
      ...(data.farmingExperienceYears != null && {
        farmingExperienceYears: data.farmingExperienceYears,
      }),
      ...(data.primaryCrop && { primaryCrop: data.primaryCrop }),
    };
    mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* National ID */}
      <div className="space-y-1.5">
        <Label htmlFor="nationalId">
          National ID <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nationalId"
          placeholder="16-digit national ID"
          maxLength={16}
          {...register("nationalId")}
        />
        {errors.nationalId && (
          <p className="text-sm text-destructive">{errors.nationalId.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Date of Birth */}
        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth">Date of birth</Label>
          <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
          {errors.dateOfBirth && (
            <p className="text-sm text-destructive">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <Label>Gender</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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

        {/* Experience */}
        <div className="space-y-1.5">
          <Label htmlFor="farmingExperienceYears">
            Farming experience (years)
          </Label>
          <Input
            id="farmingExperienceYears"
            type="number"
            min={0}
            max={80}
            placeholder="e.g. 5"
            {...register("farmingExperienceYears")}
          />
          {errors.farmingExperienceYears && (
            <p className="text-sm text-destructive">
              {errors.farmingExperienceYears.message}
            </p>
          )}
        </div>

        {/* Primary Crop */}
        <div className="space-y-1.5">
          <Label htmlFor="primaryCrop">Primary crop</Label>
          <Input
            id="primaryCrop"
            placeholder="e.g. Maize, Beans"
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

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create profile
      </Button>
    </form>
  );
};
