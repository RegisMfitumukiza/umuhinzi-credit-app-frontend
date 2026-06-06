import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCooperative } from "../api/cooperative.api";

export const useCreateCooperative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCooperative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperative", "mine"] });
    },
  });
};
