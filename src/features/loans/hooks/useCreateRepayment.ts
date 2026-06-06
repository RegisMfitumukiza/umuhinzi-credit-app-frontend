import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRepayment } from "../api/loans.api";

export const useCreateRepayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRepayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["repayments"] });
      // Repayment updates schedule status + may complete the loan
      qc.invalidateQueries({ queryKey: ["loans"] });
      qc.invalidateQueries({ queryKey: ["repayment-schedules"] });
    },
  });
};
