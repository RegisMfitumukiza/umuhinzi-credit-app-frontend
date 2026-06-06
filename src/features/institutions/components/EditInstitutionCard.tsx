import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";

import { useUpdateInstitution } from "../hooks/useUpdateInstitution";
import {
  updateInstitutionSchema,
  type UpdateInstitutionSchemaType,
} from "../schemas/institution.schema";
import {
  INSTITUTION_TYPE_LABELS,
  REGULATED_INSTITUTION_TYPES,
  type Institution,
  type UpdateInstitutionPayload,
} from "../types";
import { InstitutionStatusBadge } from "./InstitutionStatusBadge";

const CRITICAL_FIELDS: (keyof UpdateInstitutionSchemaType)[] = [
  "name",
  "type",
  "registrationNumber",
  "licenseNumber",
  "email",
  "phone",
  "address",
  "province",
  "district",
];

type Props = { institution: Institution };

export const EditInstitutionCard = ({ institution }: Props) => {
  const { mutate, isPending } = useUpdateInstitution();

  const defaultValues: UpdateInstitutionSchemaType = {
    name: institution.name,
    type: institution.type,
    registrationNumber: institution.registrationNumber ?? "",
    licenseNumber: institution.licenseNumber ?? "",
    email: institution.email ?? "",
    phone: institution.phone ?? "",
    address: institution.address ?? "",
    province: institution.province ?? "",
    district: institution.district ?? "",
    sector: institution.sector ?? "",
    cell: institution.cell ?? "",
    village: institution.village ?? "",
  };

  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<UpdateInstitutionSchemaType>({
    resolver: zodResolver(updateInstitutionSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institution.id]);

  const selectedType = watch("type");
  const isRegulated = selectedType
    ? REGULATED_INSTITUTION_TYPES.includes(selectedType as any)
    : REGULATED_INSTITUTION_TYPES.includes(institution.type);

  const hasCriticalChange =
    institution.status === "ACTIVE" &&
    CRITICAL_FIELDS.some((f) => dirtyFields[f]);

  const onSubmit = (data: UpdateInstitutionSchemaType) => {
    const payload: UpdateInstitutionPayload = {};

    for (const key of Object.keys(dirtyFields) as (keyof UpdateInstitutionSchemaType)[]) {
      const value = data[key];
      (payload as Record<string, unknown>)[key] =
        value === "" ? undefined : value;
    }

    if (Object.keys(payload).length === 0) return;

    mutate(
      { id: institution.id, payload },
      {
        onSuccess: () => {
          toast.success("Institution profile updated.");
          reset(data);
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Institution profile</CardTitle>
            <CardDescription className="mt-0.5">
              Update your institution details
            </CardDescription>
          </div>
          <InstitutionStatusBadge status={institution.status} />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {hasCriticalChange && (
            <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Saving changes to critical fields will reset your status to{" "}
                <strong>Pending</strong> for admin re-review.
              </span>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
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

          {/* Regulated fields */}
          {isRegulated && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-reg">Registration number</Label>
                <Input id="edit-reg" {...register("registrationNumber")} />
                {errors.registrationNumber && (
                  <p className="text-sm text-destructive">
                    {errors.registrationNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-lic">License number</Label>
                <Input id="edit-lic" {...register("licenseNumber")} />
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
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-address">Address</Label>
            <Input id="edit-address" {...register("address")} />
          </div>

          {/* Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-province">Province</Label>
              <Input id="edit-province" {...register("province")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-district">District</Label>
              <Input id="edit-district" {...register("district")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-sector">Sector</Label>
              <Input id="edit-sector" {...register("sector")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-cell">Cell</Label>
              <Input id="edit-cell" {...register("cell")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="edit-village">Village</Label>
              <Input id="edit-village" {...register("village")} />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending || !isDirty}
            className="w-full"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
