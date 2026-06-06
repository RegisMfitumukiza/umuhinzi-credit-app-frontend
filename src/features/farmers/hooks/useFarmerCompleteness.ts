import { useQuery } from "@tanstack/react-query";

import { getFarmerCompleteness } from "../api/farmer.api";

export const useFarmerCompleteness = () => {
  return useQuery({
    queryKey: ["farmer", "completeness"],
    queryFn: async () => {
      const res = await getFarmerCompleteness();
      return res.data;
    },
  });
};
