import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfile } from "../api/users.api";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
};
