import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "../api/expenses.api";
import type { CreateExpensePayload } from "../types";

export const useCreateExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => createExpense(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses", "me"] });
      qc.invalidateQueries({ queryKey: ["financial-summaries"] });
      qc.invalidateQueries({ queryKey: ["financial-dashboard"] });
      qc.invalidateQueries({ queryKey: ["credit-scores"] });
    },
  });
};
