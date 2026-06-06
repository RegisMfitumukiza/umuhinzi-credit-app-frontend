import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInstitution } from "../api/institution.api";
import type { UpdateInstitutionPayload } from "../types";

export const useUpdateInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInstitutionPayload }) =>
      updateInstitution(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "mine"] });
    },
  });
};
