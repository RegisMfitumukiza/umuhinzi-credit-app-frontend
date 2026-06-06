import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle, Loader2, MailOpen } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants/routes";

import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useResendEmailVerificationEmail } from "../hooks/useResendVerificationEmail";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: verify, isPending, isSuccess, isError, error } = useVerifyEmail();
  const {
    mutate: resend,
    isPending: isResending,
    isSuccess: isResendSuccess,
    error: resendError,
  } = useResendEmailVerificationEmail();

  const [resendEmail, setResendEmail] = useState("");

  useEffect(() => {
    if (token) {
      verify({ token });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6 pb-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <MailOpen className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Verify your email</h2>
            <p className="text-sm text-muted-foreground">
              Check your inbox for a verification link, or enter your email
              below to resend it.
            </p>
          </div>
          <ResendForm
            email={resendEmail}
            onEmailChange={setResendEmail}
            onResend={() => resend({ email: resendEmail })}
            isPending={isResending}
            isSuccess={isResendSuccess}
            error={resendError}
          />
          <Link
            to={ROUTES.LOGIN}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6 pb-6 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Verifying your email address...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6 pb-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Email verified!</h2>
            <p className="text-sm text-muted-foreground">
              Your email address has been verified. You can now sign in to your
              account.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link to={ROUTES.LOGIN}>Sign in to your account</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6 pb-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Verification failed</h2>
            <p className="text-sm text-muted-foreground">
              {error?.message ??
                "This verification link is invalid or has expired."}
            </p>
          </div>
          <ResendForm
            email={resendEmail}
            onEmailChange={setResendEmail}
            onResend={() => resend({ email: resendEmail })}
            isPending={isResending}
            isSuccess={isResendSuccess}
            error={resendError}
          />
          <Link
            to={ROUTES.LOGIN}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return null;
};

type ResendFormProps = {
  email: string;
  onEmailChange: (v: string) => void;
  onResend: () => void;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
};

const ResendForm = ({
  email,
  onEmailChange,
  onResend,
  isPending,
  isSuccess,
  error,
}: ResendFormProps) => {
  if (isSuccess) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-primary">
        <CheckCircle className="h-4 w-4" />
        Verification email resent
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <Label htmlFor="resend-email" className="sr-only">
        Email address
      </Label>
      <Input
        id="resend-email"
        type="email"
        placeholder="Enter your email to resend"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isPending || !email}
        onClick={onResend}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Resend verification email
      </Button>
    </div>
  );
};

export default VerifyEmailPage;
