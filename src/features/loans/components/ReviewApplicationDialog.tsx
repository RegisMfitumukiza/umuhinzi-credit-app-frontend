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
import { Separator } from "@/shared/components/ui/separator";

import { useUpdateLoanApplicationStatus } from "../hooks/useUpdateLoanApplicationStatus";
import {
  updateLoanApplicationStatusSchema,
  type UpdateLoanApplicationStatusSchemaType,
} from "../schemas/loan.schema";
import { LoanApplicationStatusBadge } from "./LoanApplicationStatusBadge";
import {
  formatCurrency,
  LOAN_PURPOSE_LABELS,
  type LoanApplication,
  type LoanApplicationStatus,
} from "../types";

interface Props {
  application: LoanApplication;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  allowedStatusMoves: Array<"UNDER_REVIEW" | "APPROVED" | "REJECTED" | "CANCELLED">;
}

export const ReviewApplicationDialog = ({
  application,
  open,
  onOpenChange,
  allowedStatusMoves,
}: Props) => {
  const { mutate, isPending } = useUpdateLoanApplicationStatus();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateLoanApplicationStatusSchemaType>({
    resolver: zodResolver(updateLoanApplicationStatusSchema),
    defaultValues: {
      status: allowedStatusMoves[0],
      rejectionReason: "",
      recommendedAmount: undefined,
      approvedAmount: undefined,
      interestRate: undefined,
      totalPayable: undefined,
    },
  });

  const watchedStatus = watch("status");
  const isApproving = watchedStatus === "APPROVED";
  const isRejecting = watchedStatus === "REJECTED";

  const onSubmit = (values: UpdateLoanApplicationStatusSchemaType) => {
    const payload = {
      status: values.status,
      ...(values.rejectionReason && { rejectionReason: values.rejectionReason }),
      ...(values.recommendedAmount && { recommendedAmount: values.recommendedAmount }),
      ...(values.approvedAmount && { approvedAmount: values.approvedAmount }),
      ...(values.interestRate !== undefined && { interestRate: values.interestRate }),
      ...(values.totalPayable && { totalPayable: values.totalPayable }),
    };
    mutate(
      { id: application.id, payload },
      {
        onSuccess: () => {
          toast.success("Application status updated.");
          onOpenChange(false);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review loan application</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 rounded-md border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Current status</span>
            <LoanApplicationStatusBadge status={application.status as LoanApplicationStatus} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Requested</span>
            <span className="font-medium">{formatCurrency(application.requestedAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Purpose</span>
            <span>{LOAN_PURPOSE_LABELS[application.purpose]}</span>
          </div>
          {application.farmer && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Farmer</span>
              <span>{application.farmer.user.fullName}</span>
            </div>
          )}
          {application.institution && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Institution</span>
              <span>{application.institution.name}</span>
            </div>
          )}
          {application.purposeDescription && (
            <div>
              <span className="text-muted-foreground">Notes: </span>
              <span>{application.purposeDescription}</span>
            </div>
          )}
        </div>

        <Separator />

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
                    {allowedStatusMoves.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === "UNDER_REVIEW"
                          ? "Move to Under Review"
                          : s === "APPROVED"
                            ? "Approve"
                            : s === "REJECTED"
                              ? "Reject"
                              : "Cancel"}
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

          {isApproving && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="approvedAmount">
                  Approved amount (RWF){" "}
                  <span className="text-xs text-muted-foreground">
                    — defaults to requested
                  </span>
                </Label>
                <Input
                  id="approvedAmount"
                  type="number"
                  min={0}
                  placeholder={String(application.requestedAmount)}
                  {...register("approvedAmount", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.approvedAmount && (
                  <p className="text-sm text-destructive">{errors.approvedAmount.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="interestRate">
                  Interest rate (%){" "}
                  <span className="text-xs text-muted-foreground">
                    — optional, default 0%
                  </span>
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  placeholder="0"
                  {...register("interestRate", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                {errors.interestRate && (
                  <p className="text-sm text-destructive">{errors.interestRate.message}</p>
                )}
              </div>
            </>
          )}

          {isRejecting && (
            <div className="space-y-1.5">
              <Label htmlFor="rejectionReason">Rejection reason</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain why the application is being rejected…"
                className="resize-none"
                rows={3}
                {...register("rejectionReason")}
              />
              {errors.rejectionReason && (
                <p className="text-sm text-destructive">{errors.rejectionReason.message}</p>
              )}
            </div>
          )}

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
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
