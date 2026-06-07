import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCrop } from "../api/crop.api";
import type { CreateCropPayload } from "../types";

export const useCreateCrop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCropPayload) => createCrop(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["crops", "farm", variables.farmId] });
      qc.invalidateQueries({ queryKey: ["farms", "me"] });
      qc.invalidateQueries({ queryKey: ["farmer", "completeness"] });
    },
  });
};
