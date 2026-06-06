import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLoanApplicationStatus } from "../api/loans.api";

export const useUpdateLoanApplicationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: Parameters<typeof updateLoanApplicationStatus>) =>
      updateLoanApplicationStatus(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loan-applications"] });
      // Approval creates a Loan record, so invalidate loans too
      qc.invalidateQueries({ queryKey: ["loans"] });
    },
  });
};
