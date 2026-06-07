import { useQuery } from "@tanstack/react-query";
import { getPendingCooperatives } from "../api/cooperative.api";

export const usePendingCooperatives = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["cooperatives", "pending", params],
    queryFn: () => getPendingCooperatives(params),
  });
};
