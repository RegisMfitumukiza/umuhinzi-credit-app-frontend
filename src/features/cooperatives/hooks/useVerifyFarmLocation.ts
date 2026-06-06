import { useMutation, useQueryClient } from "@tanstack/react-query";

import { verifyFarmLocationApi } from "../api/cooperative.api";

export const useVerifyFarmLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      farmId,
      payload,
    }: {
      farmId: string;
      payload: { status: "VERIFIED" | "REJECTED"; note?: string };
    }) => verifyFarmLocationApi(farmId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member-farms"] });
    },
  });
};
