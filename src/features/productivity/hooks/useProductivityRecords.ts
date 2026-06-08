import { useQuery } from "@tanstack/react-query";
import { getProductivityRecords } from "../api/productivity.api";

export const useProductivityRecords = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["productivity", "records", params],
    queryFn: async () => {
      const res = await getProductivityRecords(params);
      return { records: res.data, pagination: res.pagination };
    },
  });
};
