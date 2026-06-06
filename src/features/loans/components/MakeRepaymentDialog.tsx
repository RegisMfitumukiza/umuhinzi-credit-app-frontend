import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useCreateRepayment } from "../hooks/useCreateRepayment";
import {
  createRepaymentSchema,
  type CreateRepaymentSchemaType,
} from "../schemas/loan.schema";
import {
  PAYMENT_METHOD_LABELS,
  REPAYMENT_SCHEDULE_STATUS_LABELS,
  formatCurrency,
  type Loan,
  type RepaymentScheduleStatus,
} from "../types";

const PAYABLE_STATUSES: RepaymentScheduleStatus[] = [
  "DUE",
  "UPCOMING",
  "PARTIALLY_PAID",
  "OVERDUE",
];

interface Props {
  loan: Loan;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const MakeRepaymentDialog = ({ loan, open, onOpenChange }: Props) => {
  const { mutate, isPending } = useCreateRepayment();
  const payableSchedules = loan.repaymentSchedules.filter((s) =>
    PAYABLE_STATUSES.includes(s.status)
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRepaymentSchemaType>({
    resolver: zodResolver(createRepaymentSchema),
    defaultValues: {
      loanId: loan.id,
      repaymentScheduleId: "",
      amountPaid: undefined,
      paymentMethod: undefined,
      transactionReference: "",
      notes: "",
      paidAt: "",
    },
  });

  const onSubmit = (values: CreateRepaymentSchemaType) => {
    const payload = {
      loanId: values.loanId,
      amountPaid: values.amountPaid,
      paymentMethod: values.paymentMethod,
      ...(values.repaymentScheduleId && {
        repaymentScheduleId: values.repaymentScheduleId,
      }),
      ...(values.transactionReference && {
        transactionReference: values.transactionReference,
      }),
      ...(values.notes && { notes: values.notes }),
      ...(values.paidAt && { paidAt: new Date(values.paidAt).toISOString() }),
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Repayment recorded successfully.");
        onOpenChange(false);
        reset({
          loanId: loan.id,
          repaymentScheduleId: "",
          amountPaid: undefined,
          paymentMethod: undefined,
        });
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record repayment</DialogTitle>
        </DialogHeader>

        <div className="rounded-md border p-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total payable</span>
            <span className="font-medium">{formatCurrency(loan.totalPayable)}</span>
          </div>
          {loan.institution && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Institution</span>
              <span>{loan.institution.name}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {payableSchedules.length > 0 && (
            <div className="space-y-1.5">
              <Label>
                Link to installment{" "}
                <span className="text-xs text-muted-foreground">— optional</span>
              </Label>
              <Controller
                name="repaymentScheduleId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select installment (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {payableSchedules.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {new Date(s.dueDate).toLocaleDateString()} —{" "}
                          {formatCurrency(s.expectedAmount)}{" "}
                          ({REPAYMENT_SCHEDULE_STATUS_LABELS[s.status]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.repaymentScheduleId && (
                <p className="text-sm text-destructive">
                  {errors.repaymentScheduleId.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="amountPaid">Amount paid (RWF)</Label>
            <Input
              id="amountPaid"
              type="number"
              min={0}
              step={100}
              placeholder="Enter amount"
              {...register("amountPaid", { valueAsNumber: true })}
            />
            {errors.amountPaid && (
              <p className="text-sm text-destructive">{errors.amountPaid.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Payment method</Label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.entries(PAYMENT_METHOD_LABELS) as [string, string][]
                    ).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentMethod && (
              <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="transactionReference">
              Transaction reference{" "}
              <span className="text-xs text-muted-foreground">— optional</span>
            </Label>
            <Input
              id="transactionReference"
              placeholder="e.g. TXN-123456"
              {...register("transactionReference")}
            />
            {errors.transactionReference && (
              <p className="text-sm text-destructive">
                {errors.transactionReference.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">
              Notes{" "}
              <span className="text-xs text-muted-foreground">— optional</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes…"
              className="resize-none"
              rows={2}
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
