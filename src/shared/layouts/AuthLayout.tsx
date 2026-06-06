import { Link, Outlet } from "react-router-dom";

import { ROUTES } from "@/shared/constants/routes";
import logoUrl from "@/assets/favicon/favicon.svg";

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-primary/5 via-background to-muted/30 p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <img src={logoUrl} alt="Umuhinzi Credit" className="h-11 w-11" />
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            Umuhinzi Credit
          </span>
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
