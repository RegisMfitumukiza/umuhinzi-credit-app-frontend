import { Badge } from "@/shared/components/ui/badge";
import type { RecommendationPriority } from "../types";
import { RECOMMENDATION_PRIORITY_LABELS, RECOMMENDATION_PRIORITY_STYLES } from "../types";

type Props = { priority: RecommendationPriority; className?: string };

export const PriorityBadge = ({ priority, className }: Props) => (
  <Badge variant="outline" className={`${RECOMMENDATION_PRIORITY_STYLES[priority]} ${className ?? ""}`}>
    {RECOMMENDATION_PRIORITY_LABELS[priority]}
  </Badge>
);
