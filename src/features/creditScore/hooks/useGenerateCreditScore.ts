import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateCreditScore } from "../api/creditScore.api";

export const useGenerateCreditScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: { farmerId?: string }) => generateCreditScore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-scores"] });
      queryClient.invalidateQueries({ queryKey: ["farmer", "me"] });
    },
  });
};
