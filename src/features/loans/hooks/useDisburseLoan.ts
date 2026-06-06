import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disburseLoan } from "../api/loans.api";
import type { DisburseLoanPayload } from "../types";

export const useDisburseLoan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DisburseLoanPayload }) =>
      disburseLoan(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loans"] });
      qc.invalidateQueries({ queryKey: ["repayment-schedules"] });
    },
  });
};
