import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  CreateLivestockPayload,
  Livestock,
  LivestockPagination,
  UpdateLivestockPayload,
} from "../types";

type LivestockListResponse = {
  success: boolean;
  message: string;
  data: Livestock[];
  pagination: LivestockPagination;
};

/* ── Farmer: own livestock ── */

export const getMyLivestock = async (params?: {
  page?: number;
  limit?: number;
}): Promise<LivestockListResponse> => {
  const { data } = await api.get<LivestockListResponse>("/livestock", { params });
  return data;
};

export const getLivestockById = async (id: string): Promise<ApiResponse<Livestock>> => {
  const { data } = await api.get<ApiResponse<Livestock>>(`/livestock/${id}`);
  return data;
};

export const createLivestock = async (
  payload: CreateLivestockPayload
): Promise<ApiResponse<Livestock>> => {
  const { data } = await api.post<ApiResponse<Livestock>>("/livestock", payload);
  return data;
};

export const updateLivestock = async (
  id: string,
  payload: UpdateLivestockPayload
): Promise<ApiResponse<Livestock>> => {
  const { data } = await api.patch<ApiResponse<Livestock>>(`/livestock/${id}`, payload);
  return data;
};

export const deleteLivestock = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(
    `/livestock/${id}`
  );
  return data;
};
