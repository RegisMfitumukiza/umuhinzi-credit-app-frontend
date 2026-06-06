import { Routes, Route, Navigate } from "react-router-dom";

import { AuthLayout } from "@/shared/layouts/AuthLayout";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { PublicLayout } from "@/shared/layouts/PublicLayout";

import {
  ProtectedRoute,
  RoleGuard,
  UnauthorizedPage,
} from "@/features/auth";

import CooperativeDashboard from "@/features/cooperatives/pages/CooperativeDashboard";
import FarmerDashboard from "@/features/farmers/pages/FarmerDashboard";
import FarmsPage from "@/features/farms/pages/FarmsPage";
import FarmerLoansPage from "@/features/loans/pages/FarmerLoansPage";
import AdminLoansPage from "@/features/loans/pages/AdminLoansPage";
import InstitutionLoansPage from "@/features/loans/pages/InstitutionLoansPage";
import InstitutionDashboard from "@/features/institutions/pages/InstitutionDashboard";
import AdminUsersPage from "@/features/users/pages/AdminUsersPage";
import UserProfilePage from "@/features/users/pages/UserProfilePage";
import NotificationsPage from "@/features/notifications/pages/NotificationsPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";

import { ROUTES } from "@/shared/constants/routes";

/* ─── Placeholder dashboards (replace as features are built) ─── */
const HomePage = () => <div>Home Page</div>;
const GovernmentDashboard = () => <div>Government Dashboard</div>;

export const AppRouter = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}

      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
      </Route>

      {/* AUTH ROUTES */}

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
      </Route>

      {/* UNAUTHORIZED */}

      <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

      {/* PROTECTED ROUTES */}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* ALL AUTHENTICATED — accessible to every role */}
          <Route path={ROUTES.PROFILE} element={<UserProfilePage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />

          {/* ADMIN */}
          <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminUsersPage />} />
            <Route path={ROUTES.ADMIN_LOANS} element={<AdminLoansPage />} />
          </Route>

          {/* FARMER */}
          <Route element={<RoleGuard allowedRoles={["FARMER"]} />}>
            <Route path={ROUTES.FARMER_DASHBOARD} element={<FarmerDashboard />} />
            <Route path={ROUTES.FARMER_FARMS} element={<FarmsPage />} />
            <Route path={ROUTES.FARMER_LOANS} element={<FarmerLoansPage />} />
          </Route>

          {/* INSTITUTION */}
          <Route element={<RoleGuard allowedRoles={["INSTITUTION"]} />}>
            <Route
              path={ROUTES.INSTITUTION_DASHBOARD}
              element={<InstitutionDashboard />}
            />
            <Route
              path={ROUTES.INSTITUTION_LOANS}
              element={<InstitutionLoansPage />}
            />
          </Route>

          {/* COOPERATIVE */}
          <Route element={<RoleGuard allowedRoles={["COOPERATIVE_MANAGER"]} />}>
            <Route
              path={ROUTES.COOPERATIVE_DASHBOARD}
              element={<CooperativeDashboard />}
            />
          </Route>

          {/* GOVERNMENT */}
          <Route element={<RoleGuard allowedRoles={["GOVERNMENT_PARTNER"]} />}>
            <Route
              path={ROUTES.GOVERNMENT_DASHBOARD}
              element={<GovernmentDashboard />}
            />
          </Route>
        </Route>
      </Route>

      {/* 404 */}

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
