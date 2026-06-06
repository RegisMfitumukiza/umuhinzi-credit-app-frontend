import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../api/notifications.api";

export const useUnreadCount = () =>
  useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
