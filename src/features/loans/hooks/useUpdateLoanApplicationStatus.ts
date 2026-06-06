import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLoanApplicationStatus } from "../api/loans.api";
import type { UpdateLoanApplicationStatusPayload } from "../types";

export const useUpdateLoanApplicationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLoanApplicationStatusPayload }) =>
      updateLoanApplicationStatus(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loan-applications"] });
      // Approval creates a Loan record, so invalidate loans too
      qc.invalidateQueries({ queryKey: ["loans"] });
    },
  });
};
