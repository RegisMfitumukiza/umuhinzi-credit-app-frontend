import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";

import { LoanStatusBadge } from "./LoanStatusBadge";
import { DisburseDialog } from "./DisburseDialog";
import { UpdateLoanStatusDialog } from "./UpdateLoanStatusDialog";
import { MakeRepaymentDialog } from "./MakeRepaymentDialog";
import { RepaymentScheduleTable } from "./RepaymentScheduleTable";
import { formatCurrency, type Loan } from "../types";

interface Props {
  loan: Loan;
  canDisburse?: boolean;
  canUpdateStatus?: boolean;
  canRepay?: boolean;
}

export const LoanItem = ({
  loan,
  canDisburse = false,
  canUpdateStatus = false,
  canRepay = false,
}: Props) => {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [disburseOpen, setDisburseOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [repayOpen, setRepayOpen] = useState(false);

  const paidCount = loan.repaymentSchedules.filter(
    (s) => s.status === "PAID"
  ).length;
  const totalCount = loan.repaymentSchedules.length;
  const totalPaid = loan.repaymentSchedules.reduce(
    (sum, s) => sum + s.paidAmount,
    0
  );
  const progress =
    loan.totalPayable > 0
      ? Math.min((totalPaid / loan.totalPayable) * 100, 100)
      : 0;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">
              {formatCurrency(loan.principalAmount)}
            </span>
            {loan.interestRate > 0 && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  {loan.interestRate}% interest
                </span>
              </>
            )}
            {loan.farmer && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  {loan.farmer.user.fullName}
                </span>
              </>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {loan.institution && <span>{loan.institution.name}</span>}
            {loan.startDate && (
              <span>
                {new Date(loan.startDate).toLocaleDateString()}
                {loan.endDate &&
                  ` – ${new Date(loan.endDate).toLocaleDateString()}`}
              </span>
            )}
            {totalCount > 0 && (
              <span>
                {paidCount}/{totalCount} installments paid
              </span>
            )}
          </div>

          {totalCount > 0 && (
            <div className="mt-1.5 h-1.5 w-48 max-w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <LoanStatusBadge status={loan.status} />

          {totalCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => setScheduleOpen(true)}
            >
              Schedule
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}

          {canRepay && loan.status === "ACTIVE" && (
            <Button size="sm" variant="outline" onClick={() => setRepayOpen(true)}>
              Make payment
            </Button>
          )}

          {canDisburse && loan.status === "APPROVED" && (
            <Button size="sm" variant="outline" onClick={() => setDisburseOpen(true)}>
              Disburse
            </Button>
          )}

          {canUpdateStatus && (
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => setStatusOpen(true)}
            >
              Update status
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Repayment schedule dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Repayment schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex gap-6">
              <div>
                <p className="text-muted-foreground">Principal</p>
                <p className="font-medium">{formatCurrency(loan.principalAmount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total payable</p>
                <p className="font-semibold">{formatCurrency(loan.totalPayable)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total paid</p>
                <p className="font-medium text-green-700">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </div>
          <Separator />
          <RepaymentScheduleTable schedules={loan.repaymentSchedules} />
          {canRepay && loan.status === "ACTIVE" && (
            <>
              <Separator />
              <Button onClick={() => { setScheduleOpen(false); setRepayOpen(true); }}>
                Make a payment
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {disburseOpen && (
        <DisburseDialog
          loan={loan}
          open={disburseOpen}
          onOpenChange={setDisburseOpen}
        />
      )}

      {statusOpen && (
        <UpdateLoanStatusDialog
          loan={loan}
          open={statusOpen}
          onOpenChange={setStatusOpen}
        />
      )}

      {repayOpen && (
        <MakeRepaymentDialog
          loan={loan}
          open={repayOpen}
          onOpenChange={setRepayOpen}
        />
      )}
    </>
  );
};
