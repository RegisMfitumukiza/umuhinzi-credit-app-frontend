import { useQuery } from "@tanstack/react-query";
import { getMyInstitution } from "../api/institution.api";

export const useMyInstitution = () =>
  useQuery({
    queryKey: ["institution", "mine"],
    queryFn: getMyInstitution,
  });
