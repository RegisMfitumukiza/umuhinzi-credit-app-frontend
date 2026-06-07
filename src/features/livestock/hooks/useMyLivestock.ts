import { useQuery } from "@tanstack/react-query";

import { getMyLivestock } from "../api/livestock.api";

export const useMyLivestock = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["livestock", "me", params],
    queryFn: async () => {
      const res = await getMyLivestock(params);
      return { livestock: res.data, pagination: res.pagination };
    },
  });
};
