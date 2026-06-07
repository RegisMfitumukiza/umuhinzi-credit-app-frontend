import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLivestock } from "../api/livestock.api";
import type { UpdateLivestockPayload } from "../types";

export const useUpdateLivestock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLivestockPayload }) =>
      updateLivestock(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestock", "me"] });
    },
  });
};
