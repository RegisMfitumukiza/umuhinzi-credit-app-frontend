import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/notifications.api";
import type { NotificationFilters } from "../types";

export const useNotifications = (filters?: NotificationFilters) =>
  useQuery({
    queryKey: ["notifications", "list", filters],
    queryFn: () => getNotifications(filters),
    placeholderData: (prev) => prev,
  });
