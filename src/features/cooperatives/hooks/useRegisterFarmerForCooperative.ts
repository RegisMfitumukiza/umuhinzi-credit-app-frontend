import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerFarmerForCooperative } from "../api/cooperative.api";

export const useRegisterFarmerForCooperative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerFarmerForCooperative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cooperative", "members"] });
    },
  });
};
