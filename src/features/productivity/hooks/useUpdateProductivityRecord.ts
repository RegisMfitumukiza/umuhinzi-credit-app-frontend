import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductivityRecord } from "../api/productivity.api";
import type { UpdateProductivityRecordPayload } from "../types";

export const useUpdateProductivityRecord = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductivityRecordPayload }) =>
      updateProductivityRecord(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["productivity"] });
    },
  });
};
