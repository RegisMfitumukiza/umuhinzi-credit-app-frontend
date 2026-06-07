import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecommendation } from "../api/recommendations.api";

export const useCreateRecommendation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRecommendation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
};
