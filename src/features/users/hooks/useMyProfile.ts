import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../api/users.api";

export const useMyProfile = () =>
  useQuery({
    queryKey: ["users", "me"],
    queryFn: async () => {
      const res = await getMyProfile();
      return res.data;
    },
  });
