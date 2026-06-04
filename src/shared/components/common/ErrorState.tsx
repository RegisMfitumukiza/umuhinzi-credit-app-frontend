import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export const ErrorState = ({
  title = "Something went wrong",
  description = "An unexpected error occurred.",
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        {description}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-md border px-4 py-2 text-sm"
        >
          Retry
        </button>
      )}
    </div>
  );
};