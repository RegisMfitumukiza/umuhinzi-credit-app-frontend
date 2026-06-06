import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";

import { useCreateCooperative } from "../hooks/useCreateCooperative";
import {
  createCooperativeSchema,
  type CreateCooperativeSchemaType,
} from "../schemas/cooperative.schema";
import type { CreateCooperativePayload } from "../types";

const clean = (v: string | undefined) => v?.trim() || undefined;

export const CreateCooperativeForm = () => {
  const { mutate, isPending, error } = useCreateCooperative();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCooperativeSchemaType>({
    resolver: zodResolver(createCooperativeSchema),
  });

  const onSubmit = (data: CreateCooperativeSchemaType) => {
    const payload: CreateCooperativePayload = {
      name: data.name,
      registrationNumber: data.registrationNumber,
      description: clean(data.description),
      email: clean(data.email),
      phone: clean(data.phone),
      address: clean(data.address),
      province: clean(data.province),
      district: clean(data.district),
      sector: clean(data.sector),
      cell: clean(data.cell),
      village: clean(data.village),
    };
    mutate(payload, {
      onSuccess: () => toast.success("Cooperative created — awaiting admin approval."),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Required */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="coop-name">Cooperative name <span className="text-destructive">*</span></Label>
          <Input id="coop-name" placeholder="Agakiriro Farmers Cooperative" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reg-number">Registration number <span className="text-destructive">*</span></Label>
          <Input id="reg-number" placeholder="RCA/2024/00123" {...register("registrationNumber")} />
          {errors.registrationNumber && (
            <p className="text-sm text-destructive">{errors.registrationNumber.message}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Contact */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Contact information</p>
        <p className="text-xs text-muted-foreground">
          At least a district and one contact (email or phone) are required before admin can activate your cooperative.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="coop-email">Email</Label>
            <Input id="coop-email" type="email" placeholder="info@cooperative.rw" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coop-phone">Phone</Label>
            <Input id="coop-phone" type="tel" placeholder="+250 7XX XXX XXX" {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coop-desc">Description</Label>
          <Input id="coop-desc" placeholder="Brief description of your cooperative..." {...register("description")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coop-address">Address</Label>
          <Input id="coop-address" placeholder="KG 234 St, Kigali" {...register("address")} />
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Location</p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["province", "Province"],
              ["district", "District"],
              ["sector", "Sector"],
              ["cell", "Cell"],
              ["village", "Village"],
            ] as const
          ).map(([field, label]) => (
            <div key={field} className="space-y-1.5">
              <Label htmlFor={`coop-${field}`}>{label}</Label>
              <Input id={`coop-${field}`} placeholder={label} {...register(field)} />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit cooperative
      </Button>
    </form>
  );
};
