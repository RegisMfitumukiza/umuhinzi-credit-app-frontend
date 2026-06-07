import { Badge } from "@/shared/components/ui/badge";
import type { RiskLevel } from "../types";
import { RISK_LEVEL_LABELS, RISK_LEVEL_STYLES } from "../types";

type Props = { level: RiskLevel; className?: string };

export const RiskLevelBadge = ({ level, className }: Props) => (
  <Badge variant="outline" className={`${RISK_LEVEL_STYLES[level]} ${className ?? ""}`}>
    {RISK_LEVEL_LABELS[level]}
  </Badge>
);
