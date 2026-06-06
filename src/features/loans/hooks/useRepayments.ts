import { useQuery } from "@tanstack/react-query";
import { getRepayments } from "../api/loans.api";
import type { RepaymentFilters } from "../types";

export const useRepayments = (filters?: RepaymentFilters) =>
  useQuery({
    queryKey: ["repayments", "list", filters],
    queryFn: () => getRepayments(filters),
    placeholderData: (prev) => prev,
  });
