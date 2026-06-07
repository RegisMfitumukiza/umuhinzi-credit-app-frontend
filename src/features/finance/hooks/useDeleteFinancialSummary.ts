import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFinancialSummary } from "../api/financialSummaries.api";

export const useDeleteFinancialSummary = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFinancialSummary(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["financial-summaries"] });
      qc.invalidateQueries({ queryKey: ["financial-dashboard"] });
    },
  });
};
