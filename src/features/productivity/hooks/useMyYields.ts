import { useQuery } from "@tanstack/react-query";
import { getYieldRecords } from "../api/yields.api";
import type { YieldFilters } from "../types";

export const useMyYields = (params?: YieldFilters) => {
  return useQuery({
    queryKey: ["yields", "me", params],
    queryFn: async () => {
      const res = await getYieldRecords(params);
      return { yields: res.data, pagination: res.pagination };
    },
  });
};
