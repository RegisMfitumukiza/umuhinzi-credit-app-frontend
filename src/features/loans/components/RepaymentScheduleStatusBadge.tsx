import { Badge } from "@/shared/components/ui/badge";
import type { RepaymentScheduleStatus } from "../types";
import { REPAYMENT_SCHEDULE_STATUS_LABELS } from "../types";

const CONFIG: Record<RepaymentScheduleStatus, string> = {
  UPCOMING: "border-gray-300 text-gray-500 bg-gray-50",
  DUE: "border-orange-400 text-orange-700 bg-orange-50",
  PARTIALLY_PAID: "border-yellow-400 text-yellow-700 bg-yellow-50",
  PAID: "border-green-500 text-green-700 bg-green-50",
  OVERDUE: "border-red-500 text-red-700 bg-red-50",
  CANCELLED: "border-gray-300 text-gray-400 bg-gray-50",
};

export const RepaymentScheduleStatusBadge = ({ status }: { status: RepaymentScheduleStatus }) => (
  <Badge variant="outline" className={CONFIG[status] ?? CONFIG.UPCOMING}>
    {REPAYMENT_SCHEDULE_STATUS_LABELS[status]}
  </Badge>
);
