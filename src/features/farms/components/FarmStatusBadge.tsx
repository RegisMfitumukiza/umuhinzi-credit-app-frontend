import { Badge } from "@/shared/components/ui/badge";
import type { FarmStatus, LocationVerificationStatus } from "../types";

type FarmStatusProps = { status: FarmStatus };
type LocationProps = { status: LocationVerificationStatus };

const farmStatusStyles: Record<FarmStatus, string> = {
  ACTIVE:       "bg-green-100 text-green-800 border-green-200",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-800 border-yellow-200",
  INACTIVE:     "bg-gray-100 text-gray-600 border-gray-200",
};

const farmStatusLabels: Record<FarmStatus, string> = {
  ACTIVE:       "Active",
  UNDER_REVIEW: "Under review",
  INACTIVE:     "Inactive",
};

const locationStyles: Record<LocationVerificationStatus, string> = {
  UNVERIFIED: "bg-gray-100 text-gray-600 border-gray-200",
  PENDING:    "bg-blue-100 text-blue-700 border-blue-200",
  VERIFIED:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  REJECTED:   "bg-red-100 text-red-700 border-red-200",
};

const locationLabels: Record<LocationVerificationStatus, string> = {
  UNVERIFIED: "Location unverified",
  PENDING:    "Awaiting location check",
  VERIFIED:   "Location verified",
  REJECTED:   "Location rejected",
};

export const FarmStatusBadge = ({ status }: FarmStatusProps) => (
  <Badge variant="outline" className={farmStatusStyles[status]}>
    {farmStatusLabels[status]}
  </Badge>
);

export const LocationVerificationBadge = ({ status }: LocationProps) => (
  <Badge variant="outline" className={`text-xs ${locationStyles[status]}`}>
    {locationLabels[status]}
  </Badge>
);
