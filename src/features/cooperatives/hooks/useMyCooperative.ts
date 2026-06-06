import { useQuery } from "@tanstack/react-query";
import { getMyCooperative } from "../api/cooperative.api";

export const useMyCooperative = () =>
  useQuery({
    queryKey: ["cooperative", "mine"],
    queryFn: async () => {
      const res = await getMyCooperative();
      return res.data ?? null;
    },
  });
