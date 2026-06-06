import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus } from "../api/users.api";
import type { UserStatus } from "../types";

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] });
    },
  });
};
