import { useQuery } from "@tanstack/react-query";
import { getProductivityDashboard } from "../api/productivity.api";

export const useProductivityDashboard = () => {
  return useQuery({
    queryKey: ["productivity", "dashboard"],
    queryFn: getProductivityDashboard,
  });
};
