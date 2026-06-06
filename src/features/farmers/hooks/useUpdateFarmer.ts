import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMyFarmerProfile } from "../api/farmer.api";
import type { UpdateFarmerPayload } from "../types";

export const useUpdateFarmer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFarmerPayload) =>
      updateMyFarmerProfile(payload),
    onSuccess: (res) => {
      queryClient.setQueryData(["farmer", "me"], res.data);
      queryClient.invalidateQueries({ queryKey: ["farmer", "completeness"] });
    },
  });
};
