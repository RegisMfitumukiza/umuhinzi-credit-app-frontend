import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMarketPrice } from "../api/marketPrices.api";
import type { CreateMarketPricePayload } from "../types";

export const useCreateMarketPrice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMarketPricePayload) => createMarketPrice(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["market-prices"] });
    },
  });
};
