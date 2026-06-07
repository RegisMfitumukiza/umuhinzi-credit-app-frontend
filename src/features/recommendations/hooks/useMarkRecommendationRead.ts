import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markRecommendationRead } from "../api/recommendations.api";

export const useMarkRecommendationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markRecommendationRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recommendations"] });
      qc.invalidateQueries({ queryKey: ["farmer", "me"] });
    },
  });
};
