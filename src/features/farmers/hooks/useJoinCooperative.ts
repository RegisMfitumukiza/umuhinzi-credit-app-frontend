import { useMutation, useQueryClient } from "@tanstack/react-query";

import { joinCooperativeApi } from "../api/farmer.api";

export const useJoinCooperative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cooperativeId: string) => joinCooperativeApi(cooperativeId),
    onSuccess: (res) => {
      queryClient.setQueryData(["farmer", "me"], res.data);
      queryClient.invalidateQueries({ queryKey: ["cooperatives", "discover"] });
    },
  });
};
