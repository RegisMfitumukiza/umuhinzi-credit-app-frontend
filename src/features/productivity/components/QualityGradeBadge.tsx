import { Badge } from "@/shared/components/ui/badge";
import type { YieldQualityGrade } from "../types";
import { QUALITY_GRADE_LABELS, QUALITY_GRADE_STYLES } from "../types";

type Props = { grade: YieldQualityGrade; className?: string };

export const QualityGradeBadge = ({ grade, className }: Props) => (
  <Badge variant="outline" className={`${QUALITY_GRADE_STYLES[grade]} ${className ?? ""}`}>
    {QUALITY_GRADE_LABELS[grade]}
  </Badge>
);
