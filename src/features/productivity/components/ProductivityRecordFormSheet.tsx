import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Separator } from "@/shared/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";

import { useSeasons } from "@/features/crops/hooks/useSeasons";
import { useCreateProductivityRecord } from "../hooks/useCreateProductivityRecord";
import { useUpdateProductivityRecord } from "../hooks/useUpdateProductivityRecord";
import {
  createProductivityRecordSchema, updateProductivityRecordSchema,
  type CreateProductivityRecordSchemaType, type UpdateProductivityRecordSchemaType,
} from "../schemas/productivityRecord.schema";
import type { ProductivityRecord, UpdateProductivityRecordPayload } from "../types";
import { AGRICULTURAL_UNITS } from "../types";

type Props = { record?: ProductivityRecord; children: React.ReactNode };

export const ProductivityRecordFormSheet = ({ record, children }: Props) => {
  const [open, setOpen] = useState(false);
  const isEdit = !!record;

  const { data: seasons } = useSeasons();
  const { mutate: createMutate, isPending: isCreating, error: createError } = useCreateProductivityRecord();
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = useUpdateProductivityRecord();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  const {
    register, control, handleSubmit, reset,
    formState: { errors, dirtyFields },
  } = useForm<UpdateProductivityRecordSchemaType>({
    resolver: zodResolver(isEdit ? updateProductivityRecordSchema : createProductivityRecordSchema),
    defaultValues: record
      ? {
          totalActualYield: record.totalActualYield,
          totalExpectedYield: record.totalExpectedYield ?? undefined,
          unit: record.unit,
          productivityRate: record.productivityRate,
          notes: record.notes ?? "",
        }
      : { unit: "kg" },
  });

  const onSubmit = (
    data: CreateProductivityRecordSchemaType | UpdateProductivityRecordSchemaType
  ) => {
    if (isEdit && record) {
      const payload: UpdateProductivityRecordPayload = {};
      const dirty = dirtyFields as Record<string, boolean | undefined>;
      (Object.keys(dirty) as (keyof UpdateProductivityRecordSchemaType)[]).forEach((key) => {
        if (!dirty[key as string]) return;
        const val = (data as Record<string, unknown>)[key as string];
        (payload as Record<string, unknown>)[key as string] =
          typeof val === "string" && val === "" ? undefined : val;
      });
      updateMutate({ id: record.id, payload }, {
        onSuccess: () => { toast.success("Record updated."); setOpen(false); },
        onError: (err) => toast.error(err.message),
      });
    } else {
      const d = data as CreateProductivityRecordSchemaType;
      createMutate(
        { ...d, notes: d.notes || undefined, unit: d.unit || "kg" },
        {
          onSuccess: () => { toast.success("Productivity record created."); reset(); setOpen(false); },
          onError: (err) => toast.error(err.message),
        }
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit productivity record" : "Create productivity record"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? `Editing ${record.season.name} ${record.season.year}. Records are usually auto-calculated from verified yields.`
              : "Manually create a seasonal productivity record. These are auto-generated when yields are verified."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5 pb-8">
          {!isEdit && (
            <div className="space-y-1.5">
              <Label>Season <span className="text-destructive">*</span></Label>
              <Controller
                name={"seasonId" as keyof UpdateProductivityRecordSchemaType}
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value as string | undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder={seasons ? "Select a season" : "Loading…"} />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name} {s.year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {"seasonId" in errors && (
                <p className="text-sm text-destructive">
                  {(errors as Record<string, { message?: string }>)["seasonId"]?.message}
                </p>
              )}
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pr-actual">
                Total actual yield <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pr-actual" type="number" min="0" step="any" placeholder="1200"
                {...register("totalActualYield", {
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                })}
              />
              {errors.totalActualYield && (
                <p className="text-sm text-destructive">{errors.totalActualYield.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pr-expected">Total expected yield</Label>
              <Input
                id="pr-expected" type="number" min="0" step="any" placeholder="1500"
                {...register("totalExpectedYield", {
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? "kg"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AGRICULTURAL_UNITS.map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pr-rate">
                Productivity rate (%) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pr-rate" type="number" min="0" step="0.01" placeholder="80"
                {...register("productivityRate", {
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                })}
              />
              {errors.productivityRate && (
                <p className="text-sm text-destructive">{errors.productivityRate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pr-notes">Notes</Label>
            <Textarea id="pr-notes" rows={2} placeholder="Optional notes…" {...register("notes")} />
          </div>

          {apiError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {apiError.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create record"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
