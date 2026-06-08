import { useQuery } from "@tanstack/react-query";
import { getProductivityBenchmark } from "../api/productivity.api";

export const useProductivityBenchmark = (cropName: string) => {
  return useQuery({
    queryKey: ["productivity", "benchmark", cropName],
    queryFn: () => getProductivityBenchmark(cropName),
    enabled: cropName.trim().length > 0,
  });
};
