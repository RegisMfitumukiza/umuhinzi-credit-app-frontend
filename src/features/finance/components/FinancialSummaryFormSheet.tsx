import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
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
import { useCreateFinancialSummary } from "../hooks/useCreateFinancialSummary";
import { useUpdateFinancialSummary } from "../hooks/useUpdateFinancialSummary";
import {
  createFinancialSummarySchema, updateFinancialSummarySchema,
  type CreateFinancialSummarySchemaType, type UpdateFinancialSummarySchemaType,
} from "../schemas/financialSummary.schema";
import type { FinancialSummary, UpdateFinancialSummaryPayload } from "../types";

type Props = { summary?: FinancialSummary; children: React.ReactNode };

export const FinancialSummaryFormSheet = ({ summary, children }: Props) => {
  const [open, setOpen] = useState(false);
  const isEdit = !!summary;

  const { data: seasons } = useSeasons();
  const { mutate: createMutate, isPending: isCreating, error: createError } = useCreateFinancialSummary();
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = useUpdateFinancialSummary();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  const {
    register, control, handleSubmit, reset,
    formState: { errors, dirtyFields },
  } = useForm<UpdateFinancialSummarySchemaType>({
    resolver: zodResolver(isEdit ? updateFinancialSummarySchema : createFinancialSummarySchema),
    defaultValues: summary
      ? {
          totalIncome: summary.totalIncome,
          totalExpenses: summary.totalExpenses,
          notes: summary.notes ?? "",
        }
      : {},
  });

  const onSubmit = (data: CreateFinancialSummarySchemaType | UpdateFinancialSummarySchemaType) => {
    if (isEdit && summary) {
      const payload: UpdateFinancialSummaryPayload = {};
      const dirty = dirtyFields as Record<string, boolean | undefined>;
      (Object.keys(dirty) as (keyof UpdateFinancialSummarySchemaType)[]).forEach((key) => {
        if (!dirty[key as string]) return;
        const val = (data as Record<string, unknown>)[key as string];
        (payload as Record<string, unknown>)[key as string] =
          typeof val === "string" && val === "" ? undefined : val;
      });
      updateMutate({ id: summary.id, payload }, {
        onSuccess: () => { toast.success("Summary updated."); setOpen(false); },
      });
    } else {
      const d = data as CreateFinancialSummarySchemaType;
      createMutate(
        { ...d, notes: d.notes || undefined },
        { onSuccess: () => { toast.success("Financial summary created."); reset(); setOpen(false); } }
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit summary" : "Create financial summary"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Manually adjust income or expenses. Use Recalculate to auto-compute from data."
              : "Totals are auto-calculated from your yield records and expenses if not provided."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5 pb-8">
          {!isEdit && (
            <div className="space-y-1.5">
              <Label>Season <span className="text-destructive">*</span></Label>
              <Controller
                name={"seasonId" as keyof UpdateFinancialSummarySchemaType}
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value as string | undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder={seasons ? "Select a season" : "Loading seasons…"} />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} {s.year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {"seasonId" in errors && errors["seasonId" as keyof typeof errors] && (
                <p className="text-sm text-destructive">
                  {(errors["seasonId" as keyof typeof errors] as { message?: string })?.message}
                </p>
              )}
            </div>
          )}

          {isEdit && (
            <div className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              Season: <strong>{summary.season.name} {summary.season.year}</strong>
            </div>
          )}

          <Separator />

          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Manual overrides (optional)
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fs-income">Total income (RWF)</Label>
              <Input
                id="fs-income"
                type="number"
                min="0"
                step="100"
                placeholder="Auto-calculated"
                {...register("totalIncome", {
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                })}
              />
              {errors.totalIncome && <p className="text-sm text-destructive">{errors.totalIncome.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fs-expenses">Total expenses (RWF)</Label>
              <Input
                id="fs-expenses"
                type="number"
                min="0"
                step="100"
                placeholder="Auto-calculated"
                {...register("totalExpenses", {
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                })}
              />
              {errors.totalExpenses && <p className="text-sm text-destructive">{errors.totalExpenses.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fs-notes">Notes</Label>
            <Textarea
              id="fs-notes"
              rows={3}
              placeholder="Optional notes about this season…"
              {...register("notes")}
            />
            {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
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
              {isEdit ? "Save changes" : "Create summary"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
