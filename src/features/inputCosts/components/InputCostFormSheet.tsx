import { useState, useEffect } from "react";
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

import { useMyFarms } from "@/features/farms/hooks/useMyFarms";
import { useFarmCrops } from "@/features/crops/hooks/useFarmCrops";
import { useCreateInputCost } from "../hooks/useCreateInputCost";
import { useUpdateInputCost } from "../hooks/useUpdateInputCost";
import {
  createInputCostSchema, updateInputCostSchema,
  type CreateInputCostSchemaType, type UpdateInputCostSchemaType,
} from "../schemas/inputCost.schema";
import type { InputCost, UpdateInputCostPayload } from "../types";
import { INPUT_TYPE_LABELS } from "../types";

type Props = { inputCost?: InputCost; children: React.ReactNode };

const TYPES = Object.entries(INPUT_TYPE_LABELS) as [string, string][];

export const InputCostFormSheet = ({ inputCost, children }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");
  const isEdit = !!inputCost;

  const { data: farmsData } = useMyFarms();
  const farms = farmsData?.farms;
  const { data: crops } = useFarmCrops(selectedFarmId, !!selectedFarmId && !isEdit);

  const { mutate: createMutate, isPending: isCreating, error: createError } = useCreateInputCost();
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = useUpdateInputCost();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  const {
    register, control, handleSubmit, reset, watch, setValue,
    formState: { errors, dirtyFields },
  } = useForm<UpdateInputCostSchemaType>({
    resolver: zodResolver(isEdit ? updateInputCostSchema : createInputCostSchema),
    defaultValues: inputCost
      ? {
          type: inputCost.type,
          name: inputCost.name,
          description: inputCost.description ?? "",
          quantity: inputCost.quantity ?? undefined,
          unit: inputCost.unit ?? "",
          unitCost: inputCost.unitCost ?? undefined,
          totalCost: inputCost.totalCost,
          dateUsed: inputCost.dateUsed.split("T")[0],
        }
      : {},
  });

  const quantity = watch("quantity");
  const unitCost = watch("unitCost");

  // Auto-compute totalCost when quantity × unitCost changes
  useEffect(() => {
    if (!isEdit && quantity && unitCost) {
      setValue("totalCost", parseFloat((quantity * unitCost).toFixed(2)), { shouldDirty: false });
    }
  }, [quantity, unitCost, isEdit, setValue]);

  const onSubmit = (data: CreateInputCostSchemaType | UpdateInputCostSchemaType) => {
    if (isEdit && inputCost) {
      const payload: UpdateInputCostPayload = {};
      const dirty = dirtyFields as Record<string, boolean | undefined>;
      (Object.keys(dirty) as (keyof UpdateInputCostSchemaType)[]).forEach((key) => {
        if (!dirty[key as string]) return;
        const val = (data as Record<string, unknown>)[key as string];
        (payload as Record<string, unknown>)[key as string] =
          typeof val === "string" && val === "" ? undefined : val;
      });
      updateMutate({ id: inputCost.id, payload }, {
        onSuccess: () => { toast.success("Input cost updated."); setOpen(false); },
        onError: (err) => toast.error(err.message),
      });
    } else {
      const d = data as CreateInputCostSchemaType;
      createMutate(
        {
          ...d,
          description: d.description || undefined,
          unit: d.unit || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Input cost recorded.");
            reset();
            setSelectedFarmId("");
            setOpen(false);
          },
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
          <SheetTitle>{isEdit ? "Edit input cost" : "Record input cost"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? `Editing cost for ${inputCost.crop.cropName} — only changed fields will be saved.`
              : "Log the cost of inputs used for a specific crop."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5 pb-8">
          {/* Crop selection (create only) */}
          {!isEdit && (
            <>
              <div className="space-y-1.5">
                <Label>Farm <span className="text-destructive">*</span></Label>
                <Select value={selectedFarmId} onValueChange={(v) => { setSelectedFarmId(v); }}>
                  <SelectTrigger>
                    <SelectValue placeholder={farms?.length ? "Select a farm" : "No farms available"} />
                  </SelectTrigger>
                  <SelectContent>
                    {farms?.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.name} — {f.district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Crop <span className="text-destructive">*</span></Label>
                <Controller
                  name={"cropId" as keyof UpdateInputCostSchemaType}
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string | undefined}
                      disabled={!selectedFarmId || !crops?.length}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedFarmId
                              ? "Select a farm first"
                              : crops?.length
                              ? "Select a crop"
                              : "No crops in this farm"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {crops?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.cropName} — {c.season.name} {c.season.year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {"cropId" in errors && (
                  <p className="text-sm text-destructive">
                    {(errors as Record<string, { message?: string }>)["cropId"]?.message}
                  </p>
                )}
              </div>

              <Separator />
            </>
          )}

          {/* Type & name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type <span className="text-destructive">*</span></Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {TYPES.map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ic-name">Name <span className="text-destructive">*</span></Label>
              <Input id="ic-name" placeholder="e.g. Urea fertilizer" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ic-desc">Description</Label>
            <Textarea id="ic-desc" rows={2} placeholder="Optional details…" {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <Separator />

          {/* Quantity / unit / unit cost */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ic-qty">Quantity</Label>
              <Input
                id="ic-qty"
                type="number"
                min="0"
                step="any"
                placeholder="50"
                {...register("quantity", {
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                })}
              />
              {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ic-unit">Unit</Label>
              <Input id="ic-unit" placeholder="kg, L, bags…" {...register("unit")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ic-ucost">Unit cost (RWF)</Label>
              <Input
                id="ic-ucost"
                type="number"
                min="0"
                step="any"
                placeholder="500"
                {...register("unitCost", {
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                })}
              />
              {errors.unitCost && <p className="text-sm text-destructive">{errors.unitCost.message}</p>}
            </div>
          </div>

          {/* Total cost & date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ic-total">
                Total cost (RWF) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ic-total"
                type="number"
                min="0"
                step="any"
                placeholder="25000"
                {...register("totalCost", {
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                })}
              />
              {errors.totalCost && <p className="text-sm text-destructive">{errors.totalCost.message}</p>}
              <p className="text-xs text-muted-foreground">Auto-filled when qty × unit cost are set</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ic-date">Date used <span className="text-destructive">*</span></Label>
              <Input id="ic-date" type="date" {...register("dateUsed")} />
              {errors.dateUsed && <p className="text-sm text-destructive">{errors.dateUsed.message}</p>}
            </div>
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
              {isEdit ? "Save changes" : "Record cost"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
