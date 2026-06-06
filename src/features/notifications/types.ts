export type NotificationType =
  | "LOAN_APPROVAL"
  | "REPAYMENT_REMINDER"
  | "CREDIT_SCORE_UPDATE"
  | "MISSING_DATA_ALERT"
  | "COOPERATIVE_ANNOUNCEMENT"
  | "SYSTEM"
  | "GENERAL";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  actionUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationFilters = {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
};

export type NotificationPagination = {
  page: number;
  total: number;
  limit: number;
  skip: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type SendNotificationPayload = {
  userId: string;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  LOAN_APPROVAL: "Loan",
  REPAYMENT_REMINDER: "Repayment",
  CREDIT_SCORE_UPDATE: "Credit Score",
  MISSING_DATA_ALERT: "Missing Data",
  COOPERATIVE_ANNOUNCEMENT: "Cooperative",
  SYSTEM: "System",
  GENERAL: "General",
};

export const NOTIFICATION_PRIORITY_COLORS: Record<
  NotificationPriority,
  string
> = {
  LOW: "border-l-gray-300",
  MEDIUM: "border-l-blue-400",
  HIGH: "border-l-orange-400",
  URGENT: "border-l-red-500",
};
