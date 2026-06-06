import { useQuery } from "@tanstack/react-query";

import { getMemberFarmsApi } from "../api/cooperative.api";

type Params = {
  locationVerificationStatus?: string;
  limit?: number;
  enabled?: boolean;
};

export const useMemberFarms = ({ locationVerificationStatus, limit = 50, enabled = true }: Params = {}) => {
  return useQuery({
    queryKey: ["member-farms", { locationVerificationStatus }],
    queryFn: async () => {
      const res = await getMemberFarmsApi({ locationVerificationStatus, limit });
      return res.data;
    },
    enabled,
    staleTime: 30_000,
  });
};
