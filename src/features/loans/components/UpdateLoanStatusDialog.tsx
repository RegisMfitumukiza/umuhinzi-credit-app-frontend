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

/* Valid transitions per current status */
const ALLOWED_TRANSITIONS: Record<LoanStatus, Array<"ACTIVE" | "COMPLETED" | "DEFAULTED" | "CANCELLED">> = {
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

  const form = useForm<UpdateLoanStatusSchemaType>({
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allowed.map((s) => (
                        <SelectItem key={s} value={s}>
                          {LOAN_STATUS_LABELS[s]}
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
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Reason for this status change…"
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
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
