import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { getMyFarmerProfile } from "../api/farmer.api";

export const useMyFarmer = () => {
  return useQuery({
    queryKey: ["farmer", "me"],
    queryFn: async () => {
      try {
        const res = await getMyFarmerProfile();
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return null;
        throw err;
      }
    },
  });
};
