import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Separator } from "@/shared/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useCreateLivestock } from "../hooks/useCreateLivestock";
import { useUpdateLivestock } from "../hooks/useUpdateLivestock";
import {
  createLivestockSchema,
  updateLivestockSchema,
  type CreateLivestockSchemaType,
  type UpdateLivestockSchemaType,
} from "../schemas/livestock.schema";
import type { Livestock, UpdateLivestockPayload } from "../types";

type Props = {
  livestock?: Livestock;
  children: React.ReactNode;
};

export const LivestockFormSheet = ({ livestock, children }: Props) => {
  const [open, setOpen] = useState(false);
  const isEdit = !!livestock;

  const { mutate: createMutate, isPending: isCreating, error: createError } =
    useCreateLivestock();
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } =
    useUpdateLivestock();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  const schema = isEdit ? updateLivestockSchema : createLivestockSchema;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<UpdateLivestockSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: livestock
      ? {
          type: livestock.type,
          purpose: livestock.purpose,
          quantity: livestock.quantity,
          estimatedValue: livestock.estimatedValue ?? undefined,
          notes: livestock.notes ?? "",
          status: livestock.status,
        }
      : {
          purpose: "COMMERCIAL",
          quantity: 1,
        },
  });

  const onSubmit = (data: CreateLivestockSchemaType | UpdateLivestockSchemaType) => {
    if (isEdit && livestock) {
      const payload: UpdateLivestockPayload = {};
      const dirty = dirtyFields as Record<string, boolean | undefined>;
      (Object.keys(dirty) as (keyof UpdateLivestockSchemaType)[]).forEach((key) => {
        if (!dirty[key as string]) return;
        const val = (data as Record<string, unknown>)[key as string];
        (payload as Record<string, unknown>)[key as string] =
          typeof val === "string" && val === "" ? undefined : val;
      });

      updateMutate(
        { id: livestock.id, payload },
        {
          onSuccess: () => {
            toast.success("Livestock record updated.");
            setOpen(false);
          },
        }
      );
    } else {
      const payload = {
        ...(data as CreateLivestockSchemaType),
        notes:
          typeof data.notes === "string" && data.notes === ""
            ? undefined
            : data.notes,
      };
      createMutate(payload, {
        onSuccess: () => {
          toast.success("Livestock record added.");
          reset();
          setOpen(false);
        },
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Edit livestock record" : "Add livestock"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Only changed fields will be saved."
              : "Record the type and details of your livestock."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6 pb-8">
          {/* ── Type & Purpose ── */}
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Animal details
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>
                  Type <span className="text-destructive">*</span>
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
                        <SelectItem value="CATTLE">Cattle</SelectItem>
                        <SelectItem value="GOAT">Goat</SelectItem>
                        <SelectItem value="SHEEP">Sheep</SelectItem>
                        <SelectItem value="PIG">Pig</SelectItem>
                        <SelectItem value="CHICKEN">Chicken</SelectItem>
                        <SelectItem value="DUCK">Duck</SelectItem>
                        <SelectItem value="RABBIT">Rabbit</SelectItem>
                        <SelectItem value="FISH">Fish</SelectItem>
                        <SelectItem value="BEE">Bees</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Purpose</Label>
                <Controller
                  name="purpose"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? "COMMERCIAL"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MILK">Milk</SelectItem>
                        <SelectItem value="MEAT">Meat</SelectItem>
                        <SelectItem value="EGGS">Eggs</SelectItem>
                        <SelectItem value="BREEDING">Breeding</SelectItem>
                        <SelectItem value="FARM_WORK">Farm work</SelectItem>
                        <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* ── Quantity & Value ── */}
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quantity & value
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ls-qty">Quantity</Label>
                <Input
                  id="ls-qty"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 5"
                  {...register("quantity", {
                    setValueAs: (v) =>
                      v === "" ? undefined : parseInt(v as string, 10),
                  })}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ls-val">Est. value (RWF)</Label>
                <Input
                  id="ls-val"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="e.g. 500000"
                  {...register("estimatedValue", {
                    setValueAs: (v) =>
                      v === "" ? undefined : parseFloat(v as string),
                  })}
                />
                {errors.estimatedValue && (
                  <p className="text-sm text-destructive">
                    {errors.estimatedValue.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ── Status (edit only) ── */}
          {isEdit && (
            <>
              <Separator />
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </p>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="SOLD">Sold</SelectItem>
                        <SelectItem value="DECEASED">Deceased</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </section>
            </>
          )}

          <Separator />

          {/* ── Notes ── */}
          <section className="space-y-1.5">
            <Label htmlFor="ls-notes">Notes</Label>
            <Textarea
              id="ls-notes"
              placeholder="Optional notes about this livestock…"
              rows={3}
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </section>

          {apiError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {apiError.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add livestock"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
