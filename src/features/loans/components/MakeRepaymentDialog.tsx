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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
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

  const form = useForm<CreateRepaymentSchemaType>({
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
        form.reset({ loanId: loan.id, repaymentScheduleId: "", amountPaid: undefined, paymentMethod: undefined });
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {payableSchedules.length > 0 && (
              <FormField
                control={form.control}
                name="repaymentScheduleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Link to installment{" "}
                      <span className="text-xs text-muted-foreground">
                        — optional
                      </span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select installment (optional)" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount paid (RWF)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Enter amount"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(
                        Object.entries(PAYMENT_METHOD_LABELS) as [
                          string,
                          string,
                        ][]
                      ).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transactionReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Transaction reference{" "}
                    <span className="text-xs text-muted-foreground">
                      — optional
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. TXN-123456"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Notes{" "}
                    <span className="text-xs text-muted-foreground">
                      — optional
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes…"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Record payment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
