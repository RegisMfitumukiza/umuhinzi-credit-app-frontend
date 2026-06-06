import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disburseLoan } from "../api/loans.api";

export const useDisburseLoan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: Parameters<typeof disburseLoan>) =>
      disburseLoan(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loans"] });
      qc.invalidateQueries({ queryKey: ["repayment-schedules"] });
    },
  });
};
