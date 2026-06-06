import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCooperativeMember } from "../api/cooperative.api";
import type { UpdateMemberPayload } from "../types";

export const useUpdateCooperativeMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMemberPayload }) =>
      updateCooperativeMember(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperative", "members"] });
    },
  });
};
