import { useQuery } from "@tanstack/react-query";
import { getMyExpenses } from "../api/expenses.api";

export const useMyExpenses = (params?: { page?: number; limit?: number; cropId?: string }) => {
  return useQuery({
    queryKey: ["expenses", "me", params],
    queryFn: async () => {
      const res = await getMyExpenses(params);
      return { expenses: res.data, pagination: res.pagination };
    },
  });
};
