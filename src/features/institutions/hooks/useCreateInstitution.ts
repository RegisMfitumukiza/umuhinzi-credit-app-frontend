import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInstitution } from "../api/institution.api";

export const useCreateInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "mine"] });
    },
  });
};
