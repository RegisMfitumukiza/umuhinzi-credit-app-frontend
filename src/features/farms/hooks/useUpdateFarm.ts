import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateFarm } from "../api/farm.api";
import type { UpdateFarmPayload } from "../types";

export const useUpdateFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFarmPayload }) =>
      updateFarm(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms", "me"] });
    },
  });
};
