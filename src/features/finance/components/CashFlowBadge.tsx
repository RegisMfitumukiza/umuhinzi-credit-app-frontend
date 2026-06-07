import { Badge } from "@/shared/components/ui/badge";
import type { CashFlowStatus } from "../types";
import { CASH_FLOW_LABELS, CASH_FLOW_STYLES } from "../types";

type Props = { status: CashFlowStatus; className?: string };

export const CashFlowBadge = ({ status, className }: Props) => (
  <Badge variant="outline" className={`${CASH_FLOW_STYLES[status]} ${className ?? ""}`}>
    {CASH_FLOW_LABELS[status]}
  </Badge>
);
