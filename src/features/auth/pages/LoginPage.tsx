import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AppLoader } from "@/shared/components/common/AppLoader";
import { ROUTES } from "@/shared/constants/routes";

import { useAuth } from "../context/AuthProvider";
import { getDefaultRoute, isRouteAllowedForRole } from "../utils/get-default-route";
import { LoginForm } from "../components/LoginForm";

const LoginPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? null;

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      toast.success(state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const destination =
        from && isRouteAllowedForRole(from, user.role)
          ? from
          : getDefaultRoute(user.role);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, from, navigate]);

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <LoginForm />

        <div className="flex items-center justify-between text-sm">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Create account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
