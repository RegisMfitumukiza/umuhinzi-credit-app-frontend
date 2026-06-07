import { useQuery } from "@tanstack/react-query";
import { getSeasons } from "../api/crop.api";

export const useSeasons = () => {
  return useQuery({
    queryKey: ["seasons"],
    queryFn: getSeasons,
    staleTime: 1000 * 60 * 60, // seasons rarely change
  });
};
