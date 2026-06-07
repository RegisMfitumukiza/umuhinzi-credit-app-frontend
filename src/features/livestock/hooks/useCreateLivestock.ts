import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createLivestock } from "../api/livestock.api";
import type { CreateLivestockPayload } from "../types";

export const useCreateLivestock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLivestockPayload) => createLivestock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestock", "me"] });
      queryClient.invalidateQueries({ queryKey: ["farmer", "me"] });
      queryClient.invalidateQueries({ queryKey: ["farmer", "completeness"] });
    },
  });
};
