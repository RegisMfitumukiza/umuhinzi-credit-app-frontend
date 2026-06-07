import { Badge } from "@/shared/components/ui/badge";
import type { LivestockStatus } from "../types";
import { LIVESTOCK_STATUS_LABELS, LIVESTOCK_STATUS_STYLES } from "../types";

type Props = { status: LivestockStatus };

export const LivestockStatusBadge = ({ status }: Props) => (
  <Badge variant="outline" className={LIVESTOCK_STATUS_STYLES[status]}>
    {LIVESTOCK_STATUS_LABELS[status]}
  </Badge>
);
