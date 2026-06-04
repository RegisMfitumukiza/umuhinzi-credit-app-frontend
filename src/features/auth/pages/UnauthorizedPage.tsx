import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <ShieldAlert className="text-destructive mb-4 h-16 w-16" />

      <h1 className="mb-2 text-3xl font-bold">
        Access Denied
      </h1>

      <p className="text-muted-foreground mb-6 max-w-md">
        You do not have permission to access this page.
      </p>

      <Button asChild>
        <Link to="/">
          Go Back Home
        </Link>
      </Button>
    </div>
  );
}