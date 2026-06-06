import { useQuery } from "@tanstack/react-query";
import { getLoanById } from "../api/loans.api";

export const useLoan = (id: string) =>
  useQuery({
    queryKey: ["loans", id],
    queryFn: () => getLoanById(id),
    enabled: !!id,
  });
