import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFarm } from "../api/farm.api";

export const useDeleteFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFarm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms", "me"] });
      queryClient.invalidateQueries({ queryKey: ["farmer", "me"] });
      queryClient.invalidateQueries({ queryKey: ["farmer", "completeness"] });
    },
  });
};
