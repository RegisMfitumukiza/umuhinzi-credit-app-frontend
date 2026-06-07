import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCrop } from "../api/crop.api";

export const useDeleteCrop = (farmId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCrop(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crops", "farm", farmId] });
      qc.invalidateQueries({ queryKey: ["farms", "me"] });
      qc.invalidateQueries({ queryKey: ["farmer", "completeness"] });
    },
  });
};
