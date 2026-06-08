import { Badge } from "@/shared/components/ui/badge";
import type { YieldVerificationStatus } from "../types";
import { VERIFICATION_STATUS_LABELS, VERIFICATION_STATUS_STYLES } from "../types";

type Props = { status: YieldVerificationStatus; className?: string };

export const VerificationBadge = ({ status, className }: Props) => (
  <Badge variant="outline" className={`${VERIFICATION_STATUS_STYLES[status]} ${className ?? ""}`}>
    {VERIFICATION_STATUS_LABELS[status]}
  </Badge>
);
