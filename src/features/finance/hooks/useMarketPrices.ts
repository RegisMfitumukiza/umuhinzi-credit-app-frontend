import { useQuery } from "@tanstack/react-query";
import { getMarketPrices } from "../api/marketPrices.api";

export const useMarketPrices = (params?: {
  page?: number;
  limit?: number;
  cropName?: string;
  marketLocation?: string;
}) => {
  return useQuery({
    queryKey: ["market-prices", params],
    queryFn: async () => {
      const res = await getMarketPrices(params);
      return { prices: res.data, pagination: res.pagination };
    },
  });
};
