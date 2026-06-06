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

import { useCreateInstitution } from "../hooks/useCreateInstitution";
import {
  createInstitutionSchema,
  type CreateInstitutionSchemaType,
} from "../schemas/institution.schema";
import {
  INSTITUTION_TYPE_LABELS,
  REGULATED_INSTITUTION_TYPES,
  type CreateInstitutionPayload,
} from "../types";

export const CreateInstitutionForm = () => {
  const { mutate, isPending, error } = useCreateInstitution();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInstitutionSchemaType>({
    resolver: zodResolver(createInstitutionSchema),
  });

  const selectedType = watch("type");
  const isRegulated = selectedType
    ? REGULATED_INSTITUTION_TYPES.includes(selectedType as any)
    : false;

  const onSubmit = (data: CreateInstitutionSchemaType) => {
    const payload: CreateInstitutionPayload = {
      name: data.name,
      type: data.type as CreateInstitutionPayload["type"],
      ...(data.registrationNumber && { registrationNumber: data.registrationNumber }),
      ...(data.licenseNumber && { licenseNumber: data.licenseNumber }),
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
      ...(data.address && { address: data.address }),
      ...(data.province && { province: data.province }),
      ...(data.district && { district: data.district }),
      ...(data.sector && { sector: data.sector }),
      ...(data.cell && { cell: data.cell }),
      ...(data.village && { village: data.village }),
    };
    mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">
          Institution name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g. Kigali Farmers SACCO"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Type */}
      <div className="space-y-1.5">
        <Label>
          Institution type <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INSTITUTION_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      {/* Regulated fields: shown only for SACCO / MICROFINANCE / BANK */}
      {isRegulated && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="registrationNumber">
              Registration number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="registrationNumber"
              placeholder="e.g. RCA/2024/001"
              {...register("registrationNumber")}
            />
            {errors.registrationNumber && (
              <p className="text-sm text-destructive">
                {errors.registrationNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="licenseNumber">
              License number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="licenseNumber"
              placeholder="e.g. BNR/2024/LIC/001"
              {...register("licenseNumber")}
            />
            {errors.licenseNumber && (
              <p className="text-sm text-destructive">
                {errors.licenseNumber.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="institution@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="+250700000000"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Street address or P.O. Box"
          {...register("address")}
        />
      </div>

      {/* Location */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="province">Province</Label>
          <Input id="province" placeholder="e.g. Kigali" {...register("province")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="district">
            District{" "}
            <span className="text-xs text-muted-foreground">(required for activation)</span>
          </Label>
          <Input id="district" placeholder="e.g. Gasabo" {...register("district")} />
          {errors.district && (
            <p className="text-sm text-destructive">{errors.district.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sector">Sector</Label>
          <Input id="sector" placeholder="e.g. Remera" {...register("sector")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cell">Cell</Label>
          <Input id="cell" placeholder="e.g. Rukiri I" {...register("cell")} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="village">Village</Label>
          <Input id="village" {...register("village")} />
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit institution profile
      </Button>
    </form>
  );
};
