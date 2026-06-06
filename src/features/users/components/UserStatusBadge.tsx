import { Badge } from "@/shared/components/ui/badge";
import type { UserStatus } from "../types";

const CONFIG: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className: "border-green-300 bg-green-50 text-green-700",
  },
  PENDING: {
    label: "Pending",
    className: "border-yellow-300 bg-yellow-50 text-yellow-700",
  },
  SUSPENDED: {
    label: "Suspended",
    className: "border-orange-300 bg-orange-50 text-orange-700",
  },
  DEACTIVATED: {
    label: "Deactivated",
    className: "border-gray-300 bg-gray-50 text-gray-600",
  },
};

export const UserStatusBadge = ({ status }: { status: UserStatus }) => {
  const { label, className } = CONFIG[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};
