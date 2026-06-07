import { useQuery } from "@tanstack/react-query";
import { getFinancialDashboard } from "../api/financialSummaries.api";

export const useFinancialDashboard = () => {
  return useQuery({
    queryKey: ["financial-dashboard"],
    queryFn: async () => {
      const res = await getFinancialDashboard();
      return res.data;
    },
  });
};
