import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLoanStatus } from "../api/loans.api";

export const useUpdateLoanStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: Parameters<typeof updateLoanStatus>) =>
      updateLoanStatus(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loans"] });
    },
  });
};
