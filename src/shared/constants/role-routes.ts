import type { UserRole } from "@/features/auth/types";

export const ROLE_ROUTES: Record<UserRole, string> = {
  ADMIN: "/admin",

  FARMER: "/farmer",

  INSTITUTION: "/institution",

  COOPERATIVE_MANAGER: "/cooperative",

  GOVERNMENT_PARTNER: "/government",
};