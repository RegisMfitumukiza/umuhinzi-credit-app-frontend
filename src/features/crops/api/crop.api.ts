import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  Crop,
  CreateCropPayload,
  Season,
  UpdateCropPayload,
} from "../types";

type CropsListResponse = {
  success: boolean;
  message: string;
  data: Crop[];
  pagination: {
    page: number;
    total: number;
    limit: number;
    totalPages: number;
  };
};

type SeasonsListResponse = {
  success: boolean;
  message: string;
  data: Season[];
};

/* ── Seasons ── */

export const getSeasons = async (): Promise<Season[]> => {
  const { data } = await api.get<SeasonsListResponse>("/seasons");
  return data.data;
};

/* ── Crops ── */

export const getFarmCrops = async (
  farmId: string,
  params?: { page?: number; limit?: number }
): Promise<CropsListResponse> => {
  const { data } = await api.get<CropsListResponse>("/crops", {
    params: { farmId, ...params },
  });
  return data;
};

export const createCrop = async (
  payload: CreateCropPayload
): Promise<ApiResponse<Crop>> => {
  const { data } = await api.post<ApiResponse<Crop>>("/crops", payload);
  return data;
};

export const updateCrop = async (
  id: string,
  payload: UpdateCropPayload
): Promise<ApiResponse<Crop>> => {
  const { data } = await api.patch<ApiResponse<Crop>>(`/crops/${id}`, payload);
  return data;
};

export const deleteCrop = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(
    `/crops/${id}`
  );
  return data;
};
