import { Badge } from "@/shared/components/ui/badge";
import type { LoanStatus } from "../types";
import { LOAN_STATUS_LABELS } from "../types";

const CONFIG: Record<LoanStatus, { className: string }> = {
  APPROVED: { className: "border-green-400 text-green-700 bg-green-50" },
  DISBURSED: { className: "border-blue-400 text-blue-700 bg-blue-50" },
  ACTIVE: { className: "border-emerald-500 text-emerald-700 bg-emerald-50" },
  COMPLETED: { className: "border-gray-400 text-gray-600 bg-gray-50" },
  DEFAULTED: { className: "border-red-500 text-red-700 bg-red-50" },
  CANCELLED: { className: "border-gray-300 text-gray-500 bg-gray-50" },
};

export const LoanStatusBadge = ({ status }: { status: LoanStatus }) => {
  const { className } = CONFIG[status] ?? CONFIG.APPROVED;
  return (
    <Badge variant="outline" className={className}>
      {LOAN_STATUS_LABELS[status]}
    </Badge>
  );
};
