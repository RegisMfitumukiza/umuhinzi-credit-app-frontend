import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2, Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/lib/utils";

import { ROLE_LABELS } from "@/shared/constants/role-labels";
import { useAllUsers } from "@/features/users/hooks/useAllUsers";
import { useSendNotification } from "../hooks/useSendNotification";
import { NOTIFICATION_TYPE_LABELS, type NotificationPriority, type NotificationType } from "../types";

const schema = z.object({
  userId: z.string().min(1, "Please select a user"),
  type: z.enum([
    "LOAN_APPROVAL",
    "REPAYMENT_REMINDER",
    "CREDIT_SCORE_UPDATE",
    "MISSING_DATA_ALERT",
    "COOPERATIVE_ANNOUNCEMENT",
    "SYSTEM",
    "GENERAL",
  ] as const),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).optional(),
  title: z.string().trim().min(2, "At least 2 characters").max(120, "Max 120 characters"),
  message: z.string().trim().min(5, "At least 5 characters").max(1000, "Max 1000 characters"),
  actionUrl: z.string().trim().max(300).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export const SendNotificationDialog = () => {
  const [open, setOpen] = useState(false);
  const [userPickerOpen, setUserPickerOpen] = useState(false);
  const { mutate, isPending } = useSendNotification();

  const { data: usersData } = useAllUsers({ limit: 200 });
  const users = usersData?.data ?? [];

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "GENERAL", priority: "MEDIUM" },
  });

  const selectedUserId = watch("userId");
  const selectedUser = users.find((u) => u.id === selectedUserId);

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        userId: data.userId,
        type: data.type as NotificationType,
        priority: data.priority as NotificationPriority | undefined,
        title: data.title,
        message: data.message,
        ...(data.actionUrl && { actionUrl: data.actionUrl }),
      },
      {
        onSuccess: () => {
          toast.success("Notification sent.");
          reset();
          setOpen(false);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Send className="h-4 w-4" />
          Send notification
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send notification</DialogTitle>
          <DialogDescription>
            Send a manual notification to a specific user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* User picker */}
          <div className="space-y-1.5">
            <Label>
              Recipient <span className="text-destructive">*</span>
            </Label>
            <Popover open={userPickerOpen} onOpenChange={setUserPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal"
                >
                  {selectedUser ? (
                    <span className="truncate">
                      {selectedUser.fullName}
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        {ROLE_LABELS[selectedUser.role]} · {selectedUser.email}
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Search users…</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search by name or email…" />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {users.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={`${user.fullName} ${user.email}`}
                          onSelect={() => {
                            setValue("userId", user.id, { shouldValidate: true });
                            setUserPickerOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedUserId === user.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{user.fullName}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {ROLE_LABELS[user.role]} · {user.email}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.userId && (
              <p className="text-sm text-destructive">{errors.userId.message}</p>
            )}
          </div>

          {/* Type + Priority */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>
                Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(NOTIFICATION_TYPE_LABELS) as [NotificationType, string][]).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? "MEDIUM"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input id="title" placeholder="Notification title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="message">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Write the notification message…"
              rows={3}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          {/* Action URL */}
          <div className="space-y-1.5">
            <Label htmlFor="actionUrl">Action URL (optional)</Label>
            <Input id="actionUrl" placeholder="/farmer/loans" {...register("actionUrl")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-1.5">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
