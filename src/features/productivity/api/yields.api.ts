import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  YieldRecord,
  CreateYieldPayload,
  UpdateYieldPayload,
  VerifyYieldPayload,
  YieldFilters,
} from "../types";

type Pagination = {
  page: number; limit: number; total: number; totalPages: number;
  currentPage: number; hasNextPage: boolean; hasPreviousPage: boolean;
};

type YieldListResponse = {
  success: boolean; message: string; data: YieldRecord[]; pagination: Pagination;
};

export const getYieldRecords = async (params?: YieldFilters): Promise<YieldListResponse> => {
  const { data } = await api.get<YieldListResponse>("/yields", { params });
  return data;
};

export const getYieldRecordById = async (id: string): Promise<ApiResponse<YieldRecord>> => {
  const { data } = await api.get<ApiResponse<YieldRecord>>(`/yields/${id}`);
  return data;
};

export const createYieldRecord = async (
  payload: CreateYieldPayload
): Promise<ApiResponse<YieldRecord>> => {
  const { data } = await api.post<ApiResponse<YieldRecord>>("/yields", payload);
  return data;
};

export const updateYieldRecord = async (
  id: string,
  payload: UpdateYieldPayload
): Promise<ApiResponse<YieldRecord>> => {
  const { data } = await api.patch<ApiResponse<YieldRecord>>(`/yields/${id}`, payload);
  return data;
};

export const verifyYieldRecord = async (
  id: string,
  payload: VerifyYieldPayload
): Promise<ApiResponse<YieldRecord>> => {
  const { data } = await api.patch<ApiResponse<YieldRecord>>(`/yields/${id}/verification`, payload);
  return data;
};

export const deleteYieldRecord = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/yields/${id}`);
  return data;
};
