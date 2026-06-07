import { useQuery } from "@tanstack/react-query";

import { getFarmerCreditScores } from "../api/creditScore.api";

export const useFarmerCreditScores = (farmerId: string) => {
  return useQuery({
    queryKey: ["credit-scores", "farmer", farmerId],
    queryFn: async () => {
      const res = await getFarmerCreditScores(farmerId);
      return res.data;
    },
    enabled: !!farmerId,
  });
};
