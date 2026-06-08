import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateYieldRecord } from "../api/yields.api";
import type { UpdateYieldPayload } from "../types";

export const useUpdateYield = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateYieldPayload }) =>
      updateYieldRecord(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["yields"] });
    },
  });
};
