import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyAvatar } from "../api/users.api";

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
};
