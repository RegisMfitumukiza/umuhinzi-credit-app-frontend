import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/users.api";
import type { UserFilters } from "../types";

export const useAllUsers = (filters?: UserFilters) =>
  useQuery({
    queryKey: ["users", "list", filters],
    queryFn: () => getAllUsers(filters),
    placeholderData: (prev) => prev,
  });
