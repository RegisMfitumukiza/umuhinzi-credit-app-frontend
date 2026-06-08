import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createYieldRecord } from "../api/yields.api";

export const useCreateYield = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createYieldRecord,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["yields"] });
      qc.invalidateQueries({ queryKey: ["productivity"] });
    },
  });
};
