import { useQuery } from "@tanstack/react-query";
import { getCooperativeMembers } from "../api/cooperative.api";

export const useCooperativeMembers = (params?: {
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["cooperative", "members", params],
    queryFn: () => getCooperativeMembers(params),
    select: (res) => res.data,
  });
