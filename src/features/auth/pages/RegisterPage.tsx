import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/constants/routes";

import { useAuth } from "../context/AuthProvider";
import { getDefaultRoute } from "../utils/get-default-route";
import { RegisterForm } from "../components/RegisterForm";

const RegisterPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDefaultRoute(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSuccess = () => {
    navigate(ROUTES.LOGIN, {
      replace: true,
      state: {
        message:
          "Account created! Please check your email to verify your account.",
      },
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>
          Join Umuhinzi Credit and access agricultural financing
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <RegisterForm onSuccess={handleSuccess} />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
