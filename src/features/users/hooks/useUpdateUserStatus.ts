import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus } from "../api/users.api";

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: Parameters<typeof updateUserStatus>) =>
      updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] });
    },
  });
};
