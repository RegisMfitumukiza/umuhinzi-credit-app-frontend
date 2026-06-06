import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createFarmerProfile } from "../api/farmer.api";
import type { CreateFarmerPayload } from "../types";

export const useCreateFarmer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFarmerPayload) => createFarmerProfile(payload),
    onSuccess: (res) => {
      queryClient.setQueryData(["farmer", "me"], res.data);
    },
  });
};
