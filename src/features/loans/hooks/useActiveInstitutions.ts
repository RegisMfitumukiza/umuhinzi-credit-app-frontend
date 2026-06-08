import { useQuery } from "@tanstack/react-query";
import { getActiveInstitutions } from "../api/loans.api";

export const useActiveInstitutions = () =>
  useQuery({
    queryKey: ["institutions", "active"],
    queryFn: getActiveInstitutions,
    staleTime: 60_000,
  });
