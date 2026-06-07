import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFinancialSummary } from "../api/financialSummaries.api";
import type { CreateFinancialSummaryPayload } from "../types";

export const useCreateFinancialSummary = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFinancialSummaryPayload) => createFinancialSummary(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["financial-summaries"] });
      qc.invalidateQueries({ queryKey: ["financial-dashboard"] });
      qc.invalidateQueries({ queryKey: ["credit-scores"] });
    },
  });
};
