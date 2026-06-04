import type { UserRole } from "@/features/auth/types";

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrator",

  FARMER: "Farmer",

  INSTITUTION: "Institution",

  COOPERATIVE_MANAGER: "Cooperative Manager",

  GOVERNMENT_PARTNER: "Government Partner",
};