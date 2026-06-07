import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCrop } from "../api/crop.api";
import type { UpdateCropPayload } from "../types";

export const useUpdateCrop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCropPayload }) =>
      updateCrop(id, payload),
    onSuccess: (_data, { payload }) => {
      qc.invalidateQueries({ queryKey: ["crops"] });
      if (payload.seasonId !== undefined) {
        qc.invalidateQueries({ queryKey: ["farms", "me"] });
        qc.invalidateQueries({ queryKey: ["farmer", "completeness"] });
      }
    },
  });
};
