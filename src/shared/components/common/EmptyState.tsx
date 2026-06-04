import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export const EmptyState = ({
  title = "No Data Found",
  description = "There is nothing to display at the moment.",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="text-muted-foreground mb-4 h-12 w-12" />

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        {description}
      </p>
    </div>
  );
};