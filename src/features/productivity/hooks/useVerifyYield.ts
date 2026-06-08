import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyYieldRecord } from "../api/yields.api";
import type { VerifyYieldPayload } from "../types";

export const useVerifyYield = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VerifyYieldPayload }) =>
      verifyYieldRecord(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["yields"] });
      qc.invalidateQueries({ queryKey: ["productivity"] });
    },
  });
};
