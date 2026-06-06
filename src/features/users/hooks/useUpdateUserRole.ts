import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../api/users.api";

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: Parameters<typeof updateUserRole>) =>
      updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] });
    },
  });
};
