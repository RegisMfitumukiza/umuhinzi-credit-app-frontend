import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCooperativeMember } from "../api/cooperative.api";

export const useRemoveCooperativeMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeCooperativeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperative", "members"] });
    },
  });
};
