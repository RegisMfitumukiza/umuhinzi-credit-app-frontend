import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  ProductivityRecord,
  CreateProductivityRecordPayload,
  UpdateProductivityRecordPayload,
  ProductivityDashboard,
  ProductivityBenchmark,
} from "../types";

type Pagination = {
  page: number; limit: number; total: number; totalPages: number;
  currentPage: number; hasNextPage: boolean; hasPreviousPage: boolean;
};

type ProductivityListResponse = {
  success: boolean; message: string; data: ProductivityRecord[]; pagination: Pagination;
};

type DashboardResponse = { success: boolean; message: string; data: ProductivityDashboard };
type BenchmarkResponse = { success: boolean; message: string; data: ProductivityBenchmark };

export const getProductivityDashboard = async (): Promise<ProductivityDashboard> => {
  const { data } = await api.get<DashboardResponse>("/productivity/dashboard");
  return data.data;
};

export const getProductivityBenchmark = async (cropName: string): Promise<ProductivityBenchmark> => {
  const { data } = await api.get<BenchmarkResponse>("/productivity/benchmark", {
    params: { cropName },
  });
  return data.data;
};

export const getProductivityRecords = async (params?: {
  page?: number; limit?: number;
}): Promise<ProductivityListResponse> => {
  const { data } = await api.get<ProductivityListResponse>("/productivity", { params });
  return data;
};

export const getProductivityRecordById = async (
  id: string
): Promise<ApiResponse<ProductivityRecord>> => {
  const { data } = await api.get<ApiResponse<ProductivityRecord>>(`/productivity/${id}`);
  return data;
};

export const createProductivityRecord = async (
  payload: CreateProductivityRecordPayload
): Promise<ApiResponse<ProductivityRecord>> => {
  const { data } = await api.post<ApiResponse<ProductivityRecord>>("/productivity", payload);
  return data;
};

export const updateProductivityRecord = async (
  id: string,
  payload: UpdateProductivityRecordPayload
): Promise<ApiResponse<ProductivityRecord>> => {
  const { data } = await api.patch<ApiResponse<ProductivityRecord>>(`/productivity/${id}`, payload);
  return data;
};

export const deleteProductivityRecord = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/productivity/${id}`);
  return data;
};
