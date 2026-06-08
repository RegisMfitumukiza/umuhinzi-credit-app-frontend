import { useQuery } from "@tanstack/react-query";
import { searchFarmersApi } from "../api/farmer.api";

export const useSearchFarmers = (q: string) => {
  return useQuery({
    queryKey: ["farmers", "search", q],
    queryFn: () => searchFarmersApi(q),
    enabled: q.trim().length >= 2,
    staleTime: 10_000,
  });
};
