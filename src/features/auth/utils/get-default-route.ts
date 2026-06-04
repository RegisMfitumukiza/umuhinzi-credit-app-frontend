import type { UserRole } from "../types";

import { ROLE_ROUTES } from "@/shared/constants/role-routes";

export const getDefaultRoute = (
  role: UserRole
) => {
  return ROLE_ROUTES[role];
};
