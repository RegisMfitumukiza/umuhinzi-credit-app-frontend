import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFinancialSummary } from "../api/financialSummaries.api";
import type { UpdateFinancialSummaryPayload } from "../types";

export const useUpdateFinancialSummary = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFinancialSummaryPayload }) =>
      updateFinancialSummary(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["financial-summaries"] });
      qc.invalidateQueries({ queryKey: ["financial-dashboard"] });
    },
  });
};
