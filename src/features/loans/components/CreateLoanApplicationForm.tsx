import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
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

import { useCreateLoanApplication } from "../hooks/useCreateLoanApplication";
import { useActiveInstitutions } from "../hooks/useActiveInstitutions";
import {
  createLoanApplicationSchema,
  type CreateLoanApplicationSchemaType,
} from "../schemas/loan.schema";
import { LOAN_PURPOSE_LABELS } from "../types";

interface Props {
  onSuccess?: () => void;
}

const INSTITUTION_TYPE_LABELS: Record<string, string> = {
  SACCO: "SACCO",
  MICROFINANCE: "Microfinance",
  BANK: "Bank",
  NGO: "NGO",
  GOVERNMENT_PROGRAM: "Government Program",
  OTHER: "Other",
};

export const CreateLoanApplicationForm = ({ onSuccess }: Props) => {
  const { mutate, isPending } = useCreateLoanApplication();
  const { data: institutionsData } = useActiveInstitutions();
  const institutions = institutionsData?.data ?? [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLoanApplicationSchemaType>({
    resolver: zodResolver(createLoanApplicationSchema),
    defaultValues: {
      institutionId: undefined,
      requestedAmount: undefined,
      purpose: undefined,
      purposeDescription: "",
    },
  });

  const onSubmit = (values: CreateLoanApplicationSchemaType) => {
    const payload = {
      ...values,
      institutionId: values.institutionId || undefined,
      purposeDescription: values.purposeDescription || undefined,
    };
    mutate(payload, {
      onSuccess: () => {
        toast.success("Loan application submitted.");
        reset();
        onSuccess?.();
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Institution picker */}
      <div className="space-y-1.5">
        <Label>Institution</Label>
        {institutions.length === 0 ? (
          <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2.5 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 shrink-0" />
            <span>No registered institutions available yet. Your application will enter the general queue.</span>
          </div>
        ) : (
          <Controller
            name="institutionId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an institution (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      <span className="font-medium">{inst.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {INSTITUTION_TYPE_LABELS[inst.type] ?? inst.type}
                        {inst.district ? ` · ${inst.district}` : ""}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        {errors.institutionId && (
          <p className="text-sm text-destructive">{errors.institutionId.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="requestedAmount">Requested amount (RWF)</Label>
        <Input
          id="requestedAmount"
          type="number"
          min={0}
          step={1000}
          placeholder="e.g. 500000"
          {...register("requestedAmount", { valueAsNumber: true })}
        />
        {errors.requestedAmount && (
          <p className="text-sm text-destructive">{errors.requestedAmount.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Purpose</Label>
        <Controller
          name="purpose"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
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
          )}
        />
        {errors.purpose && (
          <p className="text-sm text-destructive">{errors.purpose.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="purposeDescription">Description (optional)</Label>
        <Textarea
          id="purposeDescription"
          placeholder="Describe how you plan to use the loan…"
          className="resize-none"
          rows={3}
          {...register("purposeDescription")}
        />
        {errors.purposeDescription && (
          <p className="text-sm text-destructive">{errors.purposeDescription.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit application
      </Button>
    </form>
  );
};
