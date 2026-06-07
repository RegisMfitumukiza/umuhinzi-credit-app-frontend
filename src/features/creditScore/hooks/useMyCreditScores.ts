import { useQuery } from "@tanstack/react-query";

import { getMyCreditScores } from "../api/creditScore.api";

export const useMyCreditScores = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["credit-scores", "me", params],
    queryFn: async () => {
      const res = await getMyCreditScores(params);
      return { scores: res.data, pagination: res.pagination };
    },
  });
};
