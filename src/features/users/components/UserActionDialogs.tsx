import { useState } from "react";
import { Loader2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useUpdateUserStatus } from "../hooks/useUpdateUserStatus";
import { useUpdateUserRole } from "../hooks/useUpdateUserRole";
import { useDeactivateUser } from "../hooks/useDeactivateUser";
import type { User, UserRole, UserStatus } from "../types";

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "DEACTIVATED", label: "Deactivated" },
];

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "FARMER", label: "Farmer" },
  { value: "INSTITUTION", label: "Institution" },
  { value: "COOPERATIVE_MANAGER", label: "Cooperative Manager" },
  { value: "GOVERNMENT_PARTNER", label: "Government Partner" },
  { value: "ADMIN", label: "Admin" },
];

type Action = "status" | "role" | "deactivate" | null;

type Props = { user: User };

export const UserActionMenu = ({ user }: Props) => {
  const [action, setAction] = useState<Action>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setAction("status")}>
            Change status
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setAction("role")}>
            Change role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setAction("deactivate")}
            className="text-destructive focus:text-destructive"
          >
            Deactivate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {action === "status" && (
        <ChangeStatusDialog
          user={user}
          onClose={() => setAction(null)}
        />
      )}
      {action === "role" && (
        <ChangeRoleDialog
          user={user}
          onClose={() => setAction(null)}
        />
      )}
      {action === "deactivate" && (
        <DeactivateDialog
          user={user}
          onClose={() => setAction(null)}
        />
      )}
    </>
  );
};

/* ─── Change status ─── */

const ChangeStatusDialog = ({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) => {
  const [status, setStatus] = useState<UserStatus>(user.status);
  const { mutate, isPending } = useUpdateUserStatus();

  const handleConfirm = () => {
    if (status === user.status) { onClose(); return; }
    mutate(
      { id: user.id, status },
      {
        onSuccess: () => {
          toast.success(`${user.fullName}'s status updated to ${status}.`);
          onClose();
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change user status</DialogTitle>
          <DialogDescription>
            Update the account status for <strong>{user.fullName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>New status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as UserStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ─── Change role ─── */

const ChangeRoleDialog = ({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) => {
  const [role, setRole] = useState<UserRole>(user.role);
  const { mutate, isPending } = useUpdateUserRole();

  const handleConfirm = () => {
    if (role === user.role) { onClose(); return; }
    mutate(
      { id: user.id, role },
      {
        onSuccess: () => {
          toast.success(`${user.fullName}'s role updated to ${role}.`);
          onClose();
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change user role</DialogTitle>
          <DialogDescription>
            Change the role for <strong>{user.fullName}</strong>. This may affect their access.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>New role</Label>
          <Select
            value={role}
            onValueChange={(v) => setRole(v as UserRole)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ─── Deactivate ─── */

const DeactivateDialog = ({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) => {
  const { mutate, isPending } = useDeactivateUser();

  const handleConfirm = () => {
    mutate(user.id, {
      onSuccess: () => {
        toast.success(`${user.fullName} has been deactivated.`);
        onClose();
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Deactivate user</DialogTitle>
          <DialogDescription>
            This will deactivate <strong>{user.fullName}</strong> ({user.email}). They
            will no longer be able to log in. This action can be reversed by changing
            their status back to Active.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
