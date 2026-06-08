import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInputCost } from "../api/inputCosts.api";

export const useDeleteInputCost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInputCost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["input-costs"] });
      qc.invalidateQueries({ queryKey: ["financial-summaries"] });
      qc.invalidateQueries({ queryKey: ["financial-dashboard"] });
    },
  });
};
