import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
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

import { useCreateLoanApplication } from "../hooks/useCreateLoanApplication";
import {
  createLoanApplicationSchema,
  type CreateLoanApplicationSchemaType,
} from "../schemas/loan.schema";
import { LOAN_PURPOSE_LABELS } from "../types";

interface Props {
  onSuccess?: () => void;
}

export const CreateLoanApplicationForm = ({ onSuccess }: Props) => {
  const { mutate, isPending } = useCreateLoanApplication();

  const form = useForm<CreateLoanApplicationSchemaType>({
    resolver: zodResolver(createLoanApplicationSchema),
    defaultValues: {
      requestedAmount: undefined,
      purpose: undefined,
      purposeDescription: "",
    },
  });

  const onSubmit = (values: CreateLoanApplicationSchemaType) => {
    const payload = {
      ...values,
      purposeDescription: values.purposeDescription || undefined,
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Loan application submitted.");
        form.reset();
        onSuccess?.();
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="requestedAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested amount (RWF)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="e.g. 500000"
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
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(Object.entries(LOAN_PURPOSE_LABELS) as [string, string][]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purposeDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe how you plan to use the loan…"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit application
        </Button>
      </form>
    </Form>
  );
};
