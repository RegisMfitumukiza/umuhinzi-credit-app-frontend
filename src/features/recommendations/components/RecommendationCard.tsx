import { format } from "date-fns";
import { ExternalLink, CheckCheck, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

import { useMarkRecommendationRead } from "../hooks/useMarkRecommendationRead";
import { useDismissRecommendation } from "../hooks/useDismissRecommendation";
import { PriorityBadge } from "./PriorityBadge";
import type { Recommendation } from "../types";
import {
  RECOMMENDATION_TYPE_LABELS,
  RECOMMENDATION_TYPE_COLORS,
  RECOMMENDATION_STATUS_LABELS,
  RECOMMENDATION_STATUS_STYLES,
} from "../types";

type Props = {
  recommendation: Recommendation;
  showFarmer?: boolean;
  readOnly?: boolean;
};

export const RecommendationCard = ({ recommendation: r, showFarmer, readOnly }: Props) => {
  const { mutate: markRead, isPending: isMarking, variables: markingId } = useMarkRecommendationRead();
  const { mutate: dismiss, isPending: isDismissing, variables: dismissingId } = useDismissRecommendation();

  const isActive = r.status === "ACTIVE";
  const canAct = !readOnly && isActive;

  const handleMarkRead = () => {
    markRead(r.id, {
      onSuccess: () => toast.success("Marked as read."),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDismiss = () => {
    dismiss(r.id, {
      onSuccess: () => toast.success("Recommendation dismissed."),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Card className={`transition-opacity ${!isActive ? "opacity-70" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start gap-2">
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${RECOMMENDATION_TYPE_COLORS[r.type]}`}>
            {RECOMMENDATION_TYPE_LABELS[r.type]}
          </span>
          <PriorityBadge priority={r.priority} />
          <Badge variant="outline" className={`${RECOMMENDATION_STATUS_STYLES[r.status]} ml-auto`}>
            {RECOMMENDATION_STATUS_LABELS[r.status]}
          </Badge>
        </div>

        <h3 className="mt-2 font-semibold leading-snug">{r.title}</h3>

        {showFarmer && r.farmer && (
          <p className="text-xs text-muted-foreground">
            For: <span className="font-medium">{r.farmer.user.fullName}</span>
            {" · "}{r.farmer.user.phone}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{r.message}</p>

        {r.actionLabel && r.actionUrl && (
          <a
            href={r.actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {r.actionLabel}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <p className="text-xs text-muted-foreground">
            {format(new Date(r.createdAt), "MMM d, yyyy")}
            {r.readAt && ` · Read ${format(new Date(r.readAt), "MMM d")}`}
          </p>

          {canAct && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1.5 text-xs"
                onClick={handleMarkRead}
                disabled={isMarking && markingId === r.id}
              >
                {isMarking && markingId === r.id
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <CheckCheck className="h-3 w-3" />}
                Mark read
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={handleDismiss}
                disabled={isDismissing && dismissingId === r.id}
              >
                {isDismissing && dismissingId === r.id
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <X className="h-3 w-3" />}
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
