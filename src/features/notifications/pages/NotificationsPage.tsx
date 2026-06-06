import { useState } from "react";
import { Bell, CheckCheck, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppLoader } from "@/shared/components/common/AppLoader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { useNotifications } from "../hooks/useNotifications";
import { useMarkAllAsRead } from "../hooks/useMarkAllAsRead";
import { useDeleteReadNotifications } from "../hooks/useDeleteReadNotifications";
import { NotificationItem } from "../components/NotificationItem";
import type {
  NotificationFilters,
  NotificationPriority,
  NotificationType,
} from "../types";
import { NOTIFICATION_TYPE_LABELS } from "../types";

const ALL = "__all__";

type ReadTab = "all" | "unread" | "read";

const NotificationsPage = () => {
  const [tab, setTab] = useState<ReadTab>("all");
  const [type, setType] = useState<NotificationType | "">("");
  const [priority, setPriority] = useState<NotificationPriority | "">("");
  const [page, setPage] = useState(1);

  const filters: NotificationFilters = {
    page,
    limit: 20,
    ...(tab === "unread" && { isRead: false }),
    ...(tab === "read" && { isRead: true }),
    ...(type && { type }),
    ...(priority && { priority }),
  };

  const { data, isLoading, isFetching } = useNotifications(filters);
  const { mutate: markAll, isPending: markingAll } = useMarkAllAsRead();
  const { mutate: deleteRead, isPending: deletingRead } =
    useDeleteReadNotifications();

  const notifications = data?.data ?? [];
  const pagination = data?.pagination;
  const unreadCount = tab === "all"
    ? notifications.filter((n) => !n.isRead).length
    : tab === "unread"
      ? notifications.length
      : 0;

  const handleTabChange = (val: string) => {
    setTab(val as ReadTab);
    setPage(1);
  };

  const handleMarkAll = () => {
    markAll(undefined, {
      onSuccess: () => toast.success("All notifications marked as read."),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDeleteRead = () => {
    deleteRead(undefined, {
      onSuccess: () => toast.success("Read notifications deleted."),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay up to date with your account activity.
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={markingAll}
              onClick={handleMarkAll}
            >
              {markingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5" />
              )}
              Mark all read
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive"
                disabled={deletingRead}
              >
                {deletingRead ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Delete read
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all read notifications?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all notifications you have already
                  read. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteRead}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={handleTabChange} className="shrink-0">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={type || ALL}
          onValueChange={(v) => {
            setType(v === ALL ? "" : (v as NotificationType));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            {(Object.entries(NOTIFICATION_TYPE_LABELS) as [NotificationType, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select
          value={priority || ALL}
          onValueChange={(v) => {
            setPriority(v === ALL ? "" : (v as NotificationPriority));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>

        {isFetching && !isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <AppLoader message="Loading notifications…" />
      ) : notifications.length === 0 ? (
        <div className="py-20 text-center">
          <Bell className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            {tab === "unread"
              ? "No unread notifications."
              : "No notifications found."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages} ·{" "}
              {pagination.total} total
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
