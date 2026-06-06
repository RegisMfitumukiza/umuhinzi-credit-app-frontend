import { Badge } from "@/shared/components/ui/badge";
import type { CredibilityStatus, FarmerStatus } from "../types";

type StatusProps = { status: FarmerStatus };
type CredibilityProps = { status: CredibilityStatus };

const statusStyles: Record<FarmerStatus, string> = {
  PENDING:  "bg-yellow-100 text-yellow-800 border-yellow-200",
  VERIFIED: "bg-green-100 text-green-800 border-green-200",
  SUSPENDED: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<FarmerStatus, string> = {
  PENDING:  "Pending",
  VERIFIED: "Verified",
  SUSPENDED: "Suspended",
};

const credibilityStyles: Record<CredibilityStatus, string> = {
  LOW:     "bg-gray-100 text-gray-700 border-gray-200",
  MEDIUM:  "bg-blue-100 text-blue-700 border-blue-200",
  HIGH:    "bg-purple-100 text-purple-700 border-purple-200",
  TRUSTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export const FarmerStatusBadge = ({ status }: StatusProps) => (
  <Badge variant="outline" className={statusStyles[status]}>
    {statusLabels[status]}
  </Badge>
);

export const CredibilityBadge = ({ status }: CredibilityProps) => (
  <Badge variant="outline" className={credibilityStyles[status]}>
    {status.charAt(0) + status.slice(1).toLowerCase()} credibility
  </Badge>
);
