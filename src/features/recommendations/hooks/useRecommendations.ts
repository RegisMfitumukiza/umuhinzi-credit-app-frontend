import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "../api/recommendations.api";
import type { RecommendationFilters } from "../types";

export const useRecommendations = (params?: RecommendationFilters) => {
  return useQuery({
    queryKey: ["recommendations", params],
    queryFn: async () => {
      const res = await getRecommendations(params);
      return { recommendations: res.data, pagination: res.pagination };
    },
  });
};
