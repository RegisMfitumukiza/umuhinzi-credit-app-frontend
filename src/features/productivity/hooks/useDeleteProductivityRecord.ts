import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductivityRecord } from "../api/productivity.api";

export const useDeleteProductivityRecord = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductivityRecord(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productivity"] });
    },
  });
};
