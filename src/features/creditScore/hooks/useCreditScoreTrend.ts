import { useQuery } from "@tanstack/react-query";

import { getCreditScoreTrend } from "../api/creditScore.api";

export const useCreditScoreTrend = (params?: { limit?: number }) => {
  return useQuery({
    queryKey: ["credit-scores", "trend", params],
    queryFn: async () => {
      const res = await getCreditScoreTrend(params);
      return res.data;
    },
  });
};
