import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsRead } from "../api/notifications.api";

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
