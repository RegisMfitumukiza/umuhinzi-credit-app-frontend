import { useQuery } from "@tanstack/react-query";
import { getLoans } from "../api/loans.api";
import type { LoanFilters } from "../types";

export const useLoans = (filters?: LoanFilters) =>
  useQuery({
    queryKey: ["loans", "list", filters],
    queryFn: () => getLoans(filters),
    placeholderData: (prev) => prev,
  });
