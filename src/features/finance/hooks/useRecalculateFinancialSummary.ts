import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recalculateFinancialSummary } from "../api/financialSummaries.api";

export const useRecalculateFinancialSummary = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recalculateFinancialSummary(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["financial-summaries"] });
      qc.invalidateQueries({ queryKey: ["financial-dashboard"] });
      qc.invalidateQueries({ queryKey: ["credit-scores"] });
    },
  });
};
