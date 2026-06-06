import { Badge } from "@/shared/components/ui/badge";
import type { UserRole } from "../types";

const LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  FARMER: "Farmer",
  INSTITUTION: "Institution",
  COOPERATIVE_MANAGER: "Cooperative Manager",
  GOVERNMENT_PARTNER: "Government Partner",
};

const CLASS: Record<UserRole, string> = {
  ADMIN: "border-purple-300 bg-purple-50 text-purple-700",
  FARMER: "border-green-300 bg-green-50 text-green-700",
  INSTITUTION: "border-blue-300 bg-blue-50 text-blue-700",
  COOPERATIVE_MANAGER: "border-indigo-300 bg-indigo-50 text-indigo-700",
  GOVERNMENT_PARTNER: "border-teal-300 bg-teal-50 text-teal-700",
};

export const UserRoleBadge = ({ role }: { role: UserRole }) => (
  <Badge variant="outline" className={CLASS[role]}>
    {LABELS[role]}
  </Badge>
);
