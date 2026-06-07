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

import { useCreateExpense } from "../hooks/useCreateExpense";
import { useUpdateExpense } from "../hooks/useUpdateExpense";
import {
  createExpenseSchema, updateExpenseSchema,
  type CreateExpenseSchemaType, type UpdateExpenseSchemaType,
} from "../schemas/expense.schema";
import type { FarmExpense, UpdateExpensePayload } from "../types";

type Props = { expense?: FarmExpense; children: React.ReactNode };

const EXPENSE_TYPES = [
  { value: "SEED", label: "Seeds" },
  { value: "FERTILIZER", label: "Fertilizer" },
  { value: "PESTICIDE", label: "Pesticide" },
  { value: "HERBICIDE", label: "Herbicide" },
  { value: "LABOR", label: "Labor" },
  { value: "IRRIGATION", label: "Irrigation" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "EQUIPMENT", label: "Equipment" },
  { value: "STORAGE", label: "Storage" },
  { value: "RENT", label: "Rent" },
  { value: "LOAN_REPAYMENT", label: "Loan repayment" },
  { value: "OTHER", label: "Other" },
] as const;

export const ExpenseFormSheet = ({ expense, children }: Props) => {
  const [open, setOpen] = useState(false);
  const isEdit = !!expense;

  const { mutate: createMutate, isPending: isCreating, error: createError } = useCreateExpense();
  const { mutate: updateMutate, isPending: isUpdating, error: updateError } = useUpdateExpense();

  const isPending = isCreating || isUpdating;
  const apiError = createError ?? updateError;

  const {
    register, control, handleSubmit, reset,
    formState: { errors, dirtyFields },
  } = useForm<UpdateExpenseSchemaType>({
    resolver: zodResolver(isEdit ? updateExpenseSchema : createExpenseSchema),
    defaultValues: expense
      ? {
          type: expense.type,
          amount: expense.amount,
          expenseDate: expense.expenseDate.split("T")[0],
          description: expense.description ?? "",
        }
      : {},
  });

  const onSubmit = (data: CreateExpenseSchemaType | UpdateExpenseSchemaType) => {
    if (isEdit && expense) {
      const payload: UpdateExpensePayload = {};
      const dirty = dirtyFields as Record<string, boolean | undefined>;
      (Object.keys(dirty) as (keyof UpdateExpenseSchemaType)[]).forEach((key) => {
        if (!dirty[key as string]) return;
        const val = (data as Record<string, unknown>)[key as string];
        (payload as Record<string, unknown>)[key as string] =
          typeof val === "string" && val === "" ? undefined : val;
      });
      updateMutate({ id: expense.id, payload }, {
        onSuccess: () => { toast.success("Expense updated."); setOpen(false); },
      });
    } else {
      const d = data as CreateExpenseSchemaType;
      createMutate(
        { ...d, description: d.description || undefined },
        { onSuccess: () => { toast.success("Expense recorded."); reset(); setOpen(false); } }
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit expense" : "Record expense"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Only changed fields will be saved." : "Log a farming-related cost."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5 pb-8">
          <div className="space-y-1.5">
            <Label>Type <span className="text-destructive">*</span></Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {EXPENSE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="exp-amount">Amount (RWF) <span className="text-destructive">*</span></Label>
              <Input
                id="exp-amount"
                type="number"
                min="0"
                step="100"
                placeholder="e.g. 25000"
                {...register("amount", {
                  setValueAs: (v) => v === "" ? undefined : parseFloat(v as string),
                })}
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exp-date">Date <span className="text-destructive">*</span></Label>
              <Input
                id="exp-date"
                type="date"
                {...register("expenseDate")}
              />
              {errors.expenseDate && <p className="text-sm text-destructive">{errors.expenseDate.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exp-desc">Description</Label>
            <Textarea
              id="exp-desc"
              rows={3}
              placeholder="Optional details about this expense…"
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
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
              {isEdit ? "Save changes" : "Record expense"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
