import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import { AppLoader } from "../../../shared/components/common/AppLoader";

import type { UserRole } from "../types";

type RoleGuardProps = {
  allowedRoles: UserRole[];
};

export const RoleGuard = ({
  allowedRoles,
}: RoleGuardProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <AppLoader message="Checking permissions..." />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
};