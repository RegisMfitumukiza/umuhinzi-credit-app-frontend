import { useQuery } from "@tanstack/react-query";

import { getMyFarms } from "../api/farm.api";

export const useMyFarms = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["farms", "me", params],
    queryFn: async () => {
      const res = await getMyFarms(params);
      return { farms: res.data, pagination: res.pagination };
    },
  });
};
