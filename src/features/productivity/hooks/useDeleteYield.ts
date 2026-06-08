import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteYieldRecord } from "../api/yields.api";

export const useDeleteYield = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteYieldRecord(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["yields"] });
      qc.invalidateQueries({ queryKey: ["productivity"] });
    },
  });
};
