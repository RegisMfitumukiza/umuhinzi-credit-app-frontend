import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  CreateFarmPayload,
  Farm,
  FarmPagination,
  UpdateFarmPayload,
} from "../types";

type FarmsListResponse = {
  success: boolean;
  message: string;
  data: Farm[];
  pagination: FarmPagination;
};

/* ── Farmer: own farms ── */

export const getMyFarms = async (params?: {
  page?: number;
  limit?: number;
}): Promise<FarmsListResponse> => {
  const { data } = await api.get<FarmsListResponse>("/farms", { params });
  return data;
};

export const getFarmById = async (id: string): Promise<ApiResponse<Farm>> => {
  const { data } = await api.get<ApiResponse<Farm>>(`/farms/${id}`);
  return data;
};

export const createFarm = async (
  payload: CreateFarmPayload
): Promise<ApiResponse<Farm>> => {
  const { data } = await api.post<ApiResponse<Farm>>("/farms", payload);
  return data;
};

export const updateFarm = async (
  id: string,
  payload: UpdateFarmPayload
): Promise<ApiResponse<Farm>> => {
  const { data } = await api.patch<ApiResponse<Farm>>(`/farms/${id}`, payload);
  return data;
};

export const deleteFarm = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(
    `/farms/${id}`
  );
  return data;
};

/* ── Admin only ── */

export const updateFarmStatus = async (
  id: string,
  status: string
): Promise<ApiResponse<Farm>> => {
  const { data } = await api.patch<ApiResponse<Farm>>(`/farms/${id}/status`, {
    status,
  });
  return data;
};
