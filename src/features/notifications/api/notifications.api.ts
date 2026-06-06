import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  Notification,
  NotificationFilters,
  NotificationPagination,
  SendNotificationPayload,
} from "../types";

type NotificationsResponse = ApiResponse<Notification[]> & {
  pagination: NotificationPagination;
};

export const getNotifications = async (
  filters?: NotificationFilters
): Promise<NotificationsResponse> => {
  const params: Record<string, unknown> = { ...filters };
  if (filters?.isRead !== undefined) {
    params.isRead = String(filters.isRead);
  }
  const { data } = await api.get<NotificationsResponse>("/notifications", {
    params,
  });
  return data;
};

export const getUnreadCount = async (): Promise<number> => {
  const { data } = await api.get<ApiResponse<{ unreadCount: number }>>(
    "/notifications/unread-count"
  );
  return data.data.unreadCount;
};

export const markNotificationRead = async (
  id: string
): Promise<ApiResponse<Notification>> => {
  const { data } = await api.patch<ApiResponse<Notification>>(
    `/notifications/${id}/read`
  );
  return data;
};

export const markAllNotificationsRead = async (): Promise<
  ApiResponse<null>
> => {
  const { data } = await api.patch<ApiResponse<null>>(
    "/notifications/read-all"
  );
  return data;
};

export const deleteNotification = async (
  id: string
): Promise<ApiResponse<null>> => {
  const { data } = await api.delete<ApiResponse<null>>(`/notifications/${id}`);
  return data;
};

export const deleteReadNotifications = async (): Promise<
  ApiResponse<null>
> => {
  const { data } = await api.delete<ApiResponse<null>>("/notifications/read");
  return data;
};

export const sendNotification = async (
  payload: SendNotificationPayload
): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>("/notifications", payload);
  return data;
};
