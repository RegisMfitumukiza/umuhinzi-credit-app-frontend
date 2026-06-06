import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { ROUTES } from "@/shared/constants/routes";

import { useNotifications } from "../hooks/useNotifications";
import { useUnreadCount } from "../hooks/useUnreadCount";
import { useMarkAllAsRead } from "../hooks/useMarkAllAsRead";
import { NotificationItem } from "./NotificationItem";

export const NotificationBell = () => {
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data, isLoading } = useNotifications({ limit: 8 });
  const { mutate: markAll, isPending: markingAll } = useMarkAllAsRead();

  const notifications = data?.data ?? [];

  const handleMarkAll = () => {
    markAll(undefined, {
      onSuccess: () => toast.success("All notifications marked as read."),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              disabled={markingAll}
              onClick={handleMarkAll}
            >
              {markingAll ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="h-3 w-3" />
              )}
              Mark all read
            </Button>
          )}
        </div>

        <Separator />

        {/* List */}
        <ScrollArea className="h-[420px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} compact />
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator />

        {/* Footer */}
        <div className="flex justify-center px-4 py-2">
          <Link
            to={ROUTES.NOTIFICATIONS}
            className="text-sm font-medium text-primary hover:underline"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};
