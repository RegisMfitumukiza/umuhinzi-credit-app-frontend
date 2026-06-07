import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRecommendation } from "../api/recommendations.api";
import type { UpdateRecommendationPayload } from "../types";

export const useUpdateRecommendation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRecommendationPayload }) =>
      updateRecommendation(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
};
