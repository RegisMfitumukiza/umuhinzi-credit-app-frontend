import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductivityRecord } from "../api/productivity.api";

export const useCreateProductivityRecord = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProductivityRecord,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productivity"] });
    },
  });
};
