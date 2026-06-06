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
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useUpdateLoanStatus } from "../hooks/useUpdateLoanStatus";
import {
  updateLoanStatusSchema,
  type UpdateLoanStatusSchemaType,
} from "../schemas/loan.schema";
import { LOAN_STATUS_LABELS, type Loan, type LoanStatus } from "../types";

const ALLOWED_TRANSITIONS: Record<
  LoanStatus,
  Array<"ACTIVE" | "COMPLETED" | "DEFAULTED" | "CANCELLED">
> = {
  APPROVED: ["ACTIVE", "CANCELLED"],
  DISBURSED: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["COMPLETED", "DEFAULTED", "CANCELLED"],
  COMPLETED: [],
  DEFAULTED: [],
  CANCELLED: [],
};

interface Props {
  loan: Loan;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export const UpdateLoanStatusDialog = ({ loan, open, onOpenChange }: Props) => {
  const { mutate, isPending } = useUpdateLoanStatus();
  const allowed = ALLOWED_TRANSITIONS[loan.status] ?? [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateLoanStatusSchemaType>({
    resolver: zodResolver(updateLoanStatusSchema),
    defaultValues: {
      status: allowed[0] ?? "CANCELLED",
      note: "",
    },
  });

  const onSubmit = (values: UpdateLoanStatusSchemaType) => {
    const payload = {
      status: values.status,
      ...(values.note && { note: values.note }),
    };
    mutate(
      { id: loan.id, payload },
      {
        onSuccess: () => {
          toast.success("Loan status updated.");
          onOpenChange(false);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  if (allowed.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update loan status</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            No status transitions available for a{" "}
            <strong>{LOAN_STATUS_LABELS[loan.status]}</strong> loan.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update loan status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>New status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allowed.map((s) => (
                      <SelectItem key={s} value={s}>
                        {LOAN_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Reason for this status change…"
              className="resize-none"
              rows={2}
              {...register("note")}
            />
            {errors.note && (
              <p className="text-sm text-destructive">{errors.note.message}</p>
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
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
