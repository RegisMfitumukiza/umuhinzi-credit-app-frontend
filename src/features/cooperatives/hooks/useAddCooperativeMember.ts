import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCooperativeMember } from "../api/cooperative.api";

export const useAddCooperativeMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCooperativeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperative", "members"] });
    },
  });
};
