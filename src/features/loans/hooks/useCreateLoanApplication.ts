import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLoanApplication } from "../api/loans.api";

export const useCreateLoanApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLoanApplication,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loan-applications"] });
    },
  });
};
