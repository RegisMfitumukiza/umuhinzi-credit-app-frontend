import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMarketPrice } from "../api/marketPrices.api";

export const useDeleteMarketPrice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMarketPrice(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["market-prices"] });
    },
  });
};
