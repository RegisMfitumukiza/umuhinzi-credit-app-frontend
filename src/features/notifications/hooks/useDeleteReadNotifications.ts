import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReadNotifications } from "../api/notifications.api";

export const useDeleteReadNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReadNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
