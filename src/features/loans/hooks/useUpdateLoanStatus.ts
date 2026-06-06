import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLoanStatus } from "../api/loans.api";
import type { UpdateLoanStatusPayload } from "../types";

export const useUpdateLoanStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLoanStatusPayload }) =>
      updateLoanStatus(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loans"] });
    },
  });
};
