import { useQuery } from "@tanstack/react-query";
import { getLatestMarketPrices } from "../api/marketPrices.api";

export const useLatestMarketPrices = () => {
  return useQuery({
    queryKey: ["market-prices", "latest"],
    queryFn: getLatestMarketPrices,
  });
};
