import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMarketPrice } from "../api/marketPrices.api";
import type { UpdateMarketPricePayload } from "../types";

export const useUpdateMarketPrice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMarketPricePayload }) =>
      updateMarketPrice(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["market-prices"] });
    },
  });
};
