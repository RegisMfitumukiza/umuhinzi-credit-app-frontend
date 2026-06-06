import { useQuery } from "@tanstack/react-query";
import { getLoanApplications } from "../api/loans.api";
import type { LoanApplicationFilters } from "../types";

export const useLoanApplications = (filters?: LoanApplicationFilters) =>
  useQuery({
    queryKey: ["loan-applications", "list", filters],
    queryFn: () => getLoanApplications(filters),
    placeholderData: (prev) => prev,
  });
