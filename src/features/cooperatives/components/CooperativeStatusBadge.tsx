import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CooperativeStatus, MemberStatus } from "../types";

const COOPERATIVE_STATUS_STYLES: Record<CooperativeStatus, string> = {
  PENDING:     "bg-yellow-100 text-yellow-800 border-yellow-200",
  ACTIVE:      "bg-green-100 text-green-800 border-green-200",
  REJECTED:    "bg-red-100 text-red-800 border-red-200",
  SUSPENDED:   "bg-orange-100 text-orange-800 border-orange-200",
  DEACTIVATED: "bg-gray-100 text-gray-600 border-gray-200",
};

const MEMBER_STATUS_STYLES: Record<MemberStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ACTIVE:  "bg-green-100 text-green-800 border-green-200",
  REMOVED: "bg-red-100 text-red-800 border-red-200",
  LEFT:    "bg-gray-100 text-gray-600 border-gray-200",
};

export const CooperativeStatusBadge = ({
  status,
}: {
  status: CooperativeStatus;
}) => (
  <Badge
    variant="outline"
    className={cn("text-xs font-medium", COOPERATIVE_STATUS_STYLES[status])}
  >
    {status}
  </Badge>
);

export const MemberStatusBadge = ({ status }: { status: MemberStatus }) => (
  <Badge
    variant="outline"
    className={cn("text-xs font-medium", MEMBER_STATUS_STYLES[status])}
  >
    {status}
  </Badge>
);
