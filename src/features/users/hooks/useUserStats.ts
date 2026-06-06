import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "../api/users.api";

export const useUserStats = () =>
  useQuery({
    queryKey: ["users", "stats"],
    queryFn: async () => {
      const res = await getUserStats();
      return res.data;
    },
  });
