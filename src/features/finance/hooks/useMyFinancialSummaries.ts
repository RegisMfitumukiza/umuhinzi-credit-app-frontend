import { useQuery } from "@tanstack/react-query";
import { getMyFinancialSummaries } from "../api/financialSummaries.api";

export const useMyFinancialSummaries = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["financial-summaries", "me", params],
    queryFn: async () => {
      const res = await getMyFinancialSummaries(params);
      return { summaries: res.data, pagination: res.pagination };
    },
  });
};
