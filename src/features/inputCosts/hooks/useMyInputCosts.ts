import { useQuery } from "@tanstack/react-query";
import { getMyInputCosts } from "../api/inputCosts.api";
import type { InputCostFilters } from "../types";

export const useMyInputCosts = (params?: InputCostFilters) => {
  return useQuery({
    queryKey: ["input-costs", "me", params],
    queryFn: async () => {
      const res = await getMyInputCosts(params);
      return { inputCosts: res.data, pagination: res.pagination };
    },
  });
};
