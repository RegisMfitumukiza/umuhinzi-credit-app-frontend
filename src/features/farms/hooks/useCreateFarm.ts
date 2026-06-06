import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createFarm } from "../api/farm.api";
import type { CreateFarmPayload } from "../types";

export const useCreateFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFarmPayload) => createFarm(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms", "me"] });
      queryClient.invalidateQueries({ queryKey: ["farmer", "me"] });
      queryClient.invalidateQueries({ queryKey: ["farmer", "completeness"] });
    },
  });
};
