import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

import { useUpdateCooperative } from "../hooks/useUpdateCooperative";
import {
  updateCooperativeSchema,
  type UpdateCooperativeSchemaType,
} from "../schemas/cooperative.schema";
import type { Cooperative, UpdateCooperativePayload } from "../types";
import { CooperativeStatusBadge } from "./CooperativeStatusBadge";

const clean = (v: string | undefined) => v?.trim() || undefined;

const InfoRow = ({ label, value }: { label: string; value: string | null }) =>
  value ? (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  ) : null;

type Props = { cooperative: Cooperative };

export const EditCooperativeCard = ({ cooperative }: Props) => {
  const [editing, setEditing] = useState(false);
  const [pendingData, setPendingData] = useState<UpdateCooperativeSchemaType | null>(null);
  const { mutate, isPending, error } = useUpdateCooperative();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCooperativeSchemaType>({
    resolver: zodResolver(updateCooperativeSchema),
    defaultValues: {
      name: cooperative.name,
      registrationNumber: cooperative.registrationNumber,
      description: cooperative.description ?? "",
      email: cooperative.email ?? "",
      phone: cooperative.phone ?? "",
      address: cooperative.address ?? "",
      province: cooperative.province ?? "",
      district: cooperative.district ?? "",
      sector: cooperative.sector ?? "",
      cell: cooperative.cell ?? "",
      village: cooperative.village ?? "",
    },
  });

  const willReturnToPending = (data: UpdateCooperativeSchemaType) =>
    cooperative.status === "ACTIVE" &&
    (data.name !== cooperative.name ||
      data.registrationNumber !== cooperative.registrationNumber);

  const submitData = (data: UpdateCooperativeSchemaType) => {
    const payload: UpdateCooperativePayload = {
      name: clean(data.name),
      registrationNumber: clean(data.registrationNumber),
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
    mutate(
      { id: cooperative.id, payload },
      {
        onSuccess: () => {
          toast.success("Cooperative updated.");
          setEditing(false);
        },
      }
    );
  };

  const onSubmit = (data: UpdateCooperativeSchemaType) => {
    if (willReturnToPending(data)) {
      setPendingData(data);
    } else {
      submitData(data);
    }
  };

  return (
    <>
    <AlertDialog
      open={!!pendingData}
      onOpenChange={(open) => !open && setPendingData(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Return cooperative to pending review?</AlertDialogTitle>
          <AlertDialogDescription>
            Changing the name or registration number will move your cooperative
            back to <strong>Pending</strong> status and require admin re-approval.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go back</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (pendingData) submitData(pendingData);
              setPendingData(null);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <CardTitle className="text-base">{cooperative.name}</CardTitle>
          <CooperativeStatusBadge status={cooperative.status} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? (
            <X className="h-4 w-4" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      <CardContent>
        {!editing ? (
          <div className="divide-y">
            <InfoRow label="Registration No." value={cooperative.registrationNumber} />
            <InfoRow label="Description" value={cooperative.description} />
            <InfoRow label="Email" value={cooperative.email} />
            <InfoRow label="Phone" value={cooperative.phone} />
            <InfoRow label="Address" value={cooperative.address} />
            <InfoRow
              label="Location"
              value={
                [cooperative.district, cooperative.sector, cooperative.province]
                  .filter(Boolean)
                  .join(", ") || null
              }
            />
            <div className="flex justify-between py-1 text-sm">
              <span className="text-muted-foreground">Members</span>
              <span className="font-medium">{cooperative._count?.members ?? 0}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Registration number</Label>
                <Input {...register("registrationNumber")} />
                {errors.registrationNumber && (
                  <p className="text-sm text-destructive">{errors.registrationNumber.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input type="tel" {...register("phone")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input {...register("description")} />
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input {...register("address")} />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              {(["province", "district", "sector", "cell", "village"] as const).map(
                (f) => (
                  <div key={f} className="space-y-1.5">
                    <Label className="capitalize">{f}</Label>
                    <Input {...register(f)} />
                  </div>
                )
              )}
            </div>

            {cooperative.status === "ACTIVE" && (
              <p className="text-xs text-muted-foreground">
                Changing name or registration number will return the cooperative to PENDING for re-review.
              </p>
            )}

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error.message}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
    </>
  );
};
