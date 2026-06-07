import type { UserRole } from "../types";

import { ROLE_ROUTES } from "@/shared/constants/role-routes";
import { ROUTES } from "@/shared/constants/routes";

export const getDefaultRoute = (role: UserRole) => {
  return ROLE_ROUTES[role];
};

const COMMON_ROUTES: string[] = [ROUTES.PROFILE, ROUTES.NOTIFICATIONS];

export const isRouteAllowedForRole = (route: string, role: UserRole): boolean => {
  if (COMMON_ROUTES.includes(route)) return true;
  const rolePrefix = ROLE_ROUTES[role];
  return route === rolePrefix || route.startsWith(rolePrefix + "/");
};
