import { Loader2 } from "lucide-react";

type AppLoaderProps = {
  message?: string;
};

export const AppLoader = ({
  message = "Loading...",
}: AppLoaderProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm">
        {message}
      </p>
    </div>
  );
};