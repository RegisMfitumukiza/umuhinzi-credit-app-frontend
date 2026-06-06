import { RepaymentScheduleStatusBadge } from "./RepaymentScheduleStatusBadge";
import { formatCurrency } from "../types";
import type { RepaymentSchedule } from "../types";

interface Props {
  schedules: RepaymentSchedule[];
}

export const RepaymentScheduleTable = ({ schedules }: Props) => {
  if (schedules.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No repayment schedule yet. Loan must be disbursed first.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">#</th>
            <th className="pb-2 pr-4 font-medium">Due date</th>
            <th className="pb-2 pr-4 font-medium text-right">Expected</th>
            <th className="pb-2 pr-4 font-medium text-right">Paid</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {schedules.map((s, i) => (
            <tr key={s.id} className="text-sm">
              <td className="py-2 pr-4 text-muted-foreground">{i + 1}</td>
              <td className="py-2 pr-4">
                {new Date(s.dueDate).toLocaleDateString()}
              </td>
              <td className="py-2 pr-4 text-right font-medium">
                {formatCurrency(s.expectedAmount)}
              </td>
              <td className="py-2 pr-4 text-right">
                {s.paidAmount > 0 ? (
                  <span className="text-green-700">
                    {formatCurrency(s.paidAmount)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="py-2">
                <RepaymentScheduleStatusBadge status={s.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
