import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteLivestock } from "../api/livestock.api";

export const useDeleteLivestock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLivestock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestock", "me"] });
      queryClient.invalidateQueries({ queryKey: ["farmer", "me"] });
    },
  });
};
