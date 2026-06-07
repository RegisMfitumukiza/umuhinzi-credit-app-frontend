import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecommendation } from "../api/recommendations.api";

export const useDeleteRecommendation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRecommendation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
};
