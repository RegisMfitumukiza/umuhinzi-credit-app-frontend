import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSeasonApi } from "../api/crop.api";

export const useCreateSeason = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSeasonApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
    },
  });
};
