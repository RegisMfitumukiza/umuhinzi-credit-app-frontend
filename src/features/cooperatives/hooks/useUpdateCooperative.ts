import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCooperative } from "../api/cooperative.api";
import type { UpdateCooperativePayload } from "../types";

export const useUpdateCooperative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCooperativePayload }) =>
      updateCooperative(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperative", "mine"] });
    },
  });
};
