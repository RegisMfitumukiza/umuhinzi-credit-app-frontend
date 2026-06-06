import { useQuery } from "@tanstack/react-query";
import { getRepaymentSchedules } from "../api/loans.api";
import type { RepaymentScheduleFilters } from "../types";

export const useRepaymentSchedules = (filters?: RepaymentScheduleFilters) =>
  useQuery({
    queryKey: ["repayment-schedules", "list", filters],
    queryFn: () => getRepaymentSchedules(filters),
    placeholderData: (prev) => prev,
  });
