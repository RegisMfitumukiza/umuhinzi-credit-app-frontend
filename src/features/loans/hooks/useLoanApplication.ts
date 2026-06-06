import { useQuery } from "@tanstack/react-query";
import { getLoanApplicationById } from "../api/loans.api";

export const useLoanApplication = (id: string) =>
  useQuery({
    queryKey: ["loan-applications", id],
    queryFn: () => getLoanApplicationById(id),
    enabled: !!id,
  });
