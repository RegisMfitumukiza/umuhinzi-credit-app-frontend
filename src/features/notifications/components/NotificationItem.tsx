import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ExternalLink,
  Megaphone,
  Settings,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

import { useDeleteNotification } from "../hooks/useDeleteNotification";
import { useMarkAsRead } from "../hooks/useMarkAsRead";
import {
  NOTIFICATION_PRIORITY_COLORS,
  NOTIFICATION_TYPE_LABELS,
  type Notification,
} from "../types";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  LOAN_APPROVAL: <CreditCard className="h-4 w-4" />,
  REPAYMENT_REMINDER: <CreditCard className="h-4 w-4" />,
  CREDIT_SCORE_UPDATE: <TrendingUp className="h-4 w-4" />,
  MISSING_DATA_ALERT: <AlertTriangle className="h-4 w-4" />,
  COOPERATIVE_ANNOUNCEMENT: <Megaphone className="h-4 w-4" />,
  SYSTEM: <Settings className="h-4 w-4" />,
  GENERAL: <Bell className="h-4 w-4" />,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

type Props = {
  notification: Notification;
  compact?: boolean;
};

export const NotificationItem = ({ notification, compact = false }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { mutate: markRead, isPending: markingRead } = useMarkAsRead();
  const { mutate: remove, isPending: deleting } = useDeleteNotification();

  const borderColor = NOTIFICATION_PRIORITY_COLORS[notification.priority];
  const isUnread = !notification.isRead;

  const handleMarkRead = () => {
    if (notification.isRead) return;
    markRead(notification.id, {
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDelete = () => {
    remove(notification.id, {
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div
      className={[
        "border-l-4 rounded-r-lg border border-l-4 bg-card transition-colors",
        borderColor,
        isUnread ? "bg-muted/40" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Icon */}
        <div
          className={[
            "mt-0.5 shrink-0 rounded-full p-1.5",
            isUnread
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {TYPE_ICONS[notification.type] ?? <Bell className="h-4 w-4" />}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-1">
            <div className="flex items-center gap-2">
              <p
                className={[
                  "text-sm leading-snug",
                  isUnread ? "font-semibold" : "font-medium",
                ].join(" ")}
              >
                {notification.title}
              </p>
              {isUnread && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {timeAgo(notification.createdAt)}
            </span>
          </div>

          <p
            className={[
              "mt-0.5 text-sm text-muted-foreground",
              !expanded && !compact ? "line-clamp-2" : "",
            ].join(" ")}
          >
            {notification.message}
          </p>

          {/* Expand toggle for long messages */}
          {!compact && notification.message.length > 120 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mt-1 flex items-center gap-0.5 text-xs text-primary hover:underline"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3 w-3" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" /> Show more
                </>
              )}
            </button>
          )}

          {/* Type label + actions */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {NOTIFICATION_TYPE_LABELS[notification.type]}
            </span>

            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 text-xs text-primary hover:underline"
                onClick={handleMarkRead}
              >
                View <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {isUnread && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 px-2 text-xs"
                disabled={markingRead}
                onClick={handleMarkRead}
              >
                <CheckCheck className="h-3 w-3" />
                Mark read
              </Button>
            )}

            {!compact && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 px-2 text-xs text-destructive hover:text-destructive"
                disabled={deleting}
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
