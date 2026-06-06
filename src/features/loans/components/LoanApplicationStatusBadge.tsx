import { Badge } from "@/shared/components/ui/badge";
import type { LoanApplicationStatus } from "../types";
import { LOAN_APPLICATION_STATUS_LABELS } from "../types";

const CONFIG: Record<LoanApplicationStatus, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  PENDING: { variant: "outline", className: "border-yellow-400 text-yellow-700 bg-yellow-50" },
  UNDER_REVIEW: { variant: "outline", className: "border-blue-400 text-blue-700 bg-blue-50" },
  APPROVED: { variant: "outline", className: "border-green-500 text-green-700 bg-green-50" },
  REJECTED: { variant: "outline", className: "border-red-400 text-red-700 bg-red-50" },
  CANCELLED: { variant: "outline", className: "border-gray-300 text-gray-500 bg-gray-50" },
};

export const LoanApplicationStatusBadge = ({ status }: { status: LoanApplicationStatus }) => {
  const { variant, className } = CONFIG[status] ?? CONFIG.PENDING;
  return (
    <Badge variant={variant} className={className}>
      {LOAN_APPLICATION_STATUS_LABELS[status]}
    </Badge>
  );
};
