import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCooperativeStatus } from "../api/cooperative.api";
import type { UpdateCooperativeStatusPayload } from "../types";

export const useUpdateCooperativeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCooperativeStatusPayload }) =>
      updateCooperativeStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperatives", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["cooperatives"] });
    },
  });
};
