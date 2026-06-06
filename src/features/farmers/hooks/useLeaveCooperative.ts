import { useMutation, useQueryClient } from "@tanstack/react-query";

import { leaveCooperativeApi } from "../api/farmer.api";

export const useLeaveCooperative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => leaveCooperativeApi(),
    onSuccess: (res) => {
      queryClient.setQueryData(["farmer", "me"], res.data);
    },
  });
};
