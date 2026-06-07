import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dismissRecommendation } from "../api/recommendations.api";

export const useDismissRecommendation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dismissRecommendation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });
};
