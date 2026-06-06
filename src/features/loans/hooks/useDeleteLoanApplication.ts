import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLoanApplication } from "../api/loans.api";

export const useDeleteLoanApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteLoanApplication,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loan-applications"] });
    },
  });
};
