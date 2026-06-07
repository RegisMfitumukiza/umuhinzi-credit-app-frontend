import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  CreditScore,
  CreditScorePagination,
  CreditScoreTrend,
} from "../types";

type CreditScoreListResponse = {
  success: boolean;
  message: string;
  data: CreditScore[];
  pagination: CreditScorePagination;
};

/* ── Farmer: generate own score (or admin with farmerId) ── */

export const generateCreditScore = async (payload?: {
  farmerId?: string;
}): Promise<ApiResponse<CreditScore>> => {
  const { data } = await api.post<ApiResponse<CreditScore>>(
    "/credit-scores/generate",
    payload ?? {}
  );
  return data;
};

/* ── Farmer: get their latest score ── */

export const getLatestCreditScore = async (): Promise<
  ApiResponse<CreditScore>
> => {
  const { data } = await api.get<ApiResponse<CreditScore>>(
    "/credit-scores/latest"
  );
  return data;
};

/* ── Farmer / Admin: paginated list ── */

export const getMyCreditScores = async (params?: {
  page?: number;
  limit?: number;
}): Promise<CreditScoreListResponse> => {
  const { data } = await api.get<CreditScoreListResponse>("/credit-scores", {
    params,
  });
  return data;
};

/* ── Farmer: trend data ── */

export const getCreditScoreTrend = async (params?: {
  limit?: number;
}): Promise<ApiResponse<CreditScoreTrend>> => {
  const { data } = await api.get<ApiResponse<CreditScoreTrend>>(
    "/credit-scores/trend",
    { params }
  );
  return data;
};

/* ── Admin: all scores for a specific farmer ── */

export const getFarmerCreditScores = async (
  farmerId: string
): Promise<ApiResponse<CreditScore[]>> => {
  const { data } = await api.get<ApiResponse<CreditScore[]>>(
    `/credit-scores/farmers/${farmerId}`
  );
  return data;
};

/* ── Farmer / Admin: single score by id ── */

export const getCreditScoreById = async (
  id: string
): Promise<ApiResponse<CreditScore>> => {
  const { data } = await api.get<ApiResponse<CreditScore>>(
    `/credit-scores/${id}`
  );
  return data;
};
