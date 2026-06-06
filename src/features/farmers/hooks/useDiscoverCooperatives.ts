import { useQuery } from "@tanstack/react-query";

import { discoverCooperatives } from "../api/farmer.api";
import type { DiscoverScope } from "../types";

type Params = {
  scope?: DiscoverScope;
  search?: string;
  enabled?: boolean;
};

export const useDiscoverCooperatives = ({ scope = "district", search, enabled = true }: Params = {}) => {
  return useQuery({
    queryKey: ["cooperatives", "discover", { scope, search }],
    queryFn: async () => {
      const res = await discoverCooperatives({ scope, search, limit: 20 });
      return res.data;
    },
    enabled,
    staleTime: 60_000,
  });
};
