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

import { useMyFarms } from "@/features/farms/hooks/useMyFarms";
import { useFarmCrops } from "@/features/crops/hooks/useFarmCrops";
import { useCreateYield } from "../hooks/useCreateYield";
import { useUpdateYield } from "../hooks/useUpdateYield";
import {
  createYieldSchema, updateYieldSchema,
  type CreateYieldSchemaType, type UpdateYieldSchemaType,
} from "../schemas/yield.schema";
import type { YieldRecord, UpdateYieldPayload } from "../types";
import { AGRICULTURAL_UNITS } from "../types";

type Props = { yieldRecord?: YieldRecord; children: React.ReactNode };

const GRADES = ["EXCELLENT", "GOOD", "AVERAGE", "POOR", "DAMAGED"] as const;

export const YieldFormSheet = ({ yieldRecord, children }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const isEdit = !!yieldRecord;

  const { data: farmsData } = useMyFarms();
  const farms = farmsData?.farms ?? [];
  const { data: crops } = useFarmCrops(selectedFarmId, !!selectedFarmId && !isEdit);

  const { mutate: createMutate, isPending: isCreating, error: createError } = useCreateYield();
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = useUpdateYield();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  const {
    register, control, handleSubmit, reset,
    formState: { errors, dirtyFields },
  } = useForm<UpdateYieldSchemaType>({
    resolver: zodResolver(isEdit ? updateYieldSchema : createYieldSchema),
    defaultValues: yieldRecord
      ? {
          actualYield: yieldRecord.actualYield,
          expectedYield: yieldRecord.expectedYield ?? undefined,
          unit: yieldRecord.unit,
          harvestDate: yieldRecord.harvestDate.split("T")[0],
          qualityGrade: yieldRecord.qualityGrade,
          notes: yieldRecord.notes ?? "",
        }
      : { qualityGrade: "AVERAGE", unit: "kg" },
  });

  const onSubmit = (data: CreateYieldSchemaType | UpdateYieldSchemaType) => {
    if (isEdit && yieldRecord) {
      const payload: UpdateYieldPayload = {};
      const dirty = dirtyFields as Record<string, boolean | undefined>;
      (Object.keys(dirty) as (keyof UpdateYieldSchemaType)[]).forEach((key) => {
        if (!dirty[key as string]) return;
        const val = (data as Record<string, unknown>)[key as string];
        (payload as Record<string, unknown>)[key as string] =
          typeof val === "string" && val === "" ? undefined : val;
      });
      updateMutate({ id: yieldRecord.id, payload }, {
        onSuccess: () => { toast.success("Yield record updated."); setOpen(false); },
        onError: (err) => toast.error(err.message),
      });
    } else {
      const d = data as CreateYieldSchemaType;
      createMutate(
        { ...d, notes: d.notes || undefined, unit: d.unit || "kg" },
        {
          onSuccess: () => {
            toast.success("Yield record created.");
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
          <SheetTitle>{isEdit ? "Edit yield record" : "Record harvest yield"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? `Editing yield for ${yieldRecord.crop.cropName}. Verified records require re-verification.`
              : "Log the actual harvest yield for a crop."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5 pb-8">
          {!isEdit && (
            <>
              <div className="space-y-1.5">
                <Label>Farm <span className="text-destructive">*</span></Label>
                <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
                  <SelectTrigger>
                    <SelectValue placeholder={farms.length ? "Select a farm" : "No farms"} />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.name} — {f.district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Crop <span className="text-destructive">*</span></Label>
                <Controller
                  name={"cropId" as keyof UpdateYieldSchemaType}
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string | undefined}
                      disabled={!selectedFarmId || !crops?.length}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={!selectedFarmId ? "Select farm first" : crops?.length ? "Select crop" : "No crops"}
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="y-actual">Actual yield <span className="text-destructive">*</span></Label>
              <Input
                id="y-actual" type="number" min="0" step="any" placeholder="500"
                {...register("actualYield", { setValueAs: (v) => v === "" ? undefined : parseFloat(v as string) })}
              />
              {errors.actualYield && <p className="text-sm text-destructive">{errors.actualYield.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="y-expected">Expected yield</Label>
              <Input
                id="y-expected" type="number" min="0" step="any" placeholder="600"
                {...register("expectedYield", { setValueAs: (v) => v === "" ? undefined : parseFloat(v as string) })}
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
              <Label htmlFor="y-date">Harvest date <span className="text-destructive">*</span></Label>
              <Input id="y-date" type="date" {...register("harvestDate")} />
              {errors.harvestDate && <p className="text-sm text-destructive">{errors.harvestDate.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Quality grade</Label>
            <Controller
              name="qualityGrade"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Average" /></SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="y-notes">Notes</Label>
            <Textarea id="y-notes" rows={2} placeholder="Optional harvest notes…" {...register("notes")} />
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
              {isEdit ? "Save changes" : "Record yield"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
