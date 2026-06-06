import { Badge } from "@/shared/components/ui/badge";
import type { InstitutionStatus } from "../types";

const CONFIG: Record<
  InstitutionStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending review",
    className: "border-yellow-300 bg-yellow-50 text-yellow-700",
  },
  ACTIVE: {
    label: "Active",
    className: "border-green-300 bg-green-50 text-green-700",
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

type Props = { status: InstitutionStatus };

export const InstitutionStatusBadge = ({ status }: Props) => {
  const { label, className } = CONFIG[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};
