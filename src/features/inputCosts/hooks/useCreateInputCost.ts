import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInputCost } from "../api/inputCosts.api";

export const useCreateInputCost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createInputCost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["input-costs"] });
      qc.invalidateQueries({ queryKey: ["financial-summaries"] });
      qc.invalidateQueries({ queryKey: ["financial-dashboard"] });
    },
  });
};
