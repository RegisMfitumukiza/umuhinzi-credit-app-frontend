import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInputCost } from "../api/inputCosts.api";
import type { UpdateInputCostPayload } from "../types";

export const useUpdateInputCost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInputCostPayload }) =>
      updateInputCost(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["input-costs"] });
      qc.invalidateQueries({ queryKey: ["financial-summaries"] });
      qc.invalidateQueries({ queryKey: ["financial-dashboard"] });
    },
  });
};
