import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { getLatestCreditScore } from "../api/creditScore.api";

export const useLatestCreditScore = () => {
  return useQuery({
    queryKey: ["credit-scores", "latest"],
    queryFn: async () => {
      try {
        const res = await getLatestCreditScore();
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return null;
        throw err;
      }
    },
  });
};
