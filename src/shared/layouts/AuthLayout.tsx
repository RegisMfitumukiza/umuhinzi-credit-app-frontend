import { Link, Outlet } from "react-router-dom";

import { ROUTES } from "@/shared/constants/routes";
import { AppLogo } from "@/shared/components/common/AppLogo";

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-primary/5 via-background to-muted/30 p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link
          to={ROUTES.HOME}
          className="transition-opacity hover:opacity-80"
        >
          <AppLogo iconSize="lg" textSize="lg" />
        </Link>
        <p className="text-sm text-muted-foreground">
          Agricultural credit platform for Rwanda
        </p>
      </div>

      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
