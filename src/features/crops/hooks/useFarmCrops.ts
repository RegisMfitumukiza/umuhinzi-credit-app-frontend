import { useQuery } from "@tanstack/react-query";
import { getFarmCrops } from "../api/crop.api";

export const useFarmCrops = (farmId: string, enabled = true) => {
  return useQuery({
    queryKey: ["crops", "farm", farmId],
    queryFn: () => getFarmCrops(farmId, { limit: 100 }),
    enabled: !!farmId && enabled,
    select: (res) => res.data,
  });
};
