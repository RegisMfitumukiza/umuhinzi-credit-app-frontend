import { useForm } from "react-hook-form";
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

import { useDisburseLoan } from "../hooks/useDisburseLoan";
import {
  disburseLoanSchema,
  type DisburseLoanSchemaType,
} from "../schemas/loan.schema";
import { formatCurrency, type Loan } from "../types";

interface Props {
  loan: Loan;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const DisburseDialog = ({ loan, open, onOpenChange }: Props) => {
  const { mutate, isPending } = useDisburseLoan();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DisburseLoanSchemaType>({
    resolver: zodResolver(disburseLoanSchema),
    defaultValues: {
      disbursedAmount: loan.principalAmount,
      startDate: new Date().toISOString().split("T")[0],
      durationMonths: 12,
    },
  });

  const onSubmit = (values: DisburseLoanSchemaType) => {
    mutate(
      { id: loan.id, payload: values },
      {
        onSuccess: () => {
          toast.success("Loan disbursed and repayment schedule generated.");
          onOpenChange(false);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Disburse loan</DialogTitle>
        </DialogHeader>

        <div className="rounded-md border p-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Principal</span>
            <span className="font-medium">{formatCurrency(loan.principalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Interest rate</span>
            <span>{loan.interestRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total payable</span>
            <span className="font-semibold">{formatCurrency(loan.totalPayable)}</span>
          </div>
          {loan.farmer && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Farmer</span>
              <span>{loan.farmer.user.fullName}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="disbursedAmount">Disbursed amount (RWF)</Label>
            <Input
              id="disbursedAmount"
              type="number"
              min={0}
              {...register("disbursedAmount", { valueAsNumber: true })}
            />
            {errors.disbursedAmount && (
              <p className="text-sm text-destructive">{errors.disbursedAmount.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="startDate">Start date</Label>
            <Input id="startDate" type="date" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="durationMonths">Duration (months)</Label>
            <Input
              id="durationMonths"
              type="number"
              min={1}
              max={120}
              {...register("durationMonths", { valueAsNumber: true })}
            />
            {errors.durationMonths && (
              <p className="text-sm text-destructive">{errors.durationMonths.message}</p>
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
              Disburse
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
