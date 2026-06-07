import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExpense } from "../api/expenses.api";
import type { UpdateExpensePayload } from "../types";

export const useUpdateExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpensePayload }) =>
      updateExpense(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses", "me"] });
      qc.invalidateQueries({ queryKey: ["financial-summaries"] });
      qc.invalidateQueries({ queryKey: ["financial-dashboard"] });
    },
  });
};
