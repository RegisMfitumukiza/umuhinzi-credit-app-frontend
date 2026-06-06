import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../api/users.api";
import type { UserRole } from "../types";

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] });
    },
  });
};
