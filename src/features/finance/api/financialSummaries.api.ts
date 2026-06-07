import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  CreateFinancialSummaryPayload,
  FinancePagination,
  FinancialDashboard,
  FinancialSummary,
  UpdateFinancialSummaryPayload,
} from "../types";

type SummaryListResponse = {
  success: boolean;
  message: string;
  data: FinancialSummary[];
  pagination: FinancePagination;
};

export const getMyFinancialSummaries = async (params?: {
  page?: number;
  limit?: number;
}): Promise<SummaryListResponse> => {
  const { data } = await api.get<SummaryListResponse>("/financial-summaries", { params });
  return data;
};

export const getFinancialDashboard = async (): Promise<ApiResponse<FinancialDashboard>> => {
  const { data } = await api.get<ApiResponse<FinancialDashboard>>("/financial-summaries/dashboard");
  return data;
};

export const getFinancialSummaryById = async (
  id: string
): Promise<ApiResponse<FinancialSummary>> => {
  const { data } = await api.get<ApiResponse<FinancialSummary>>(`/financial-summaries/${id}`);
  return data;
};

export const createFinancialSummary = async (
  payload: CreateFinancialSummaryPayload
): Promise<ApiResponse<FinancialSummary>> => {
  const { data } = await api.post<ApiResponse<FinancialSummary>>("/financial-summaries", payload);
  return data;
};

export const updateFinancialSummary = async (
  id: string,
  payload: UpdateFinancialSummaryPayload
): Promise<ApiResponse<FinancialSummary>> => {
  const { data } = await api.patch<ApiResponse<FinancialSummary>>(
    `/financial-summaries/${id}`,
    payload
  );
  return data;
};

export const recalculateFinancialSummary = async (
  id: string
): Promise<ApiResponse<FinancialSummary>> => {
  const { data } = await api.patch<ApiResponse<FinancialSummary>>(
    `/financial-summaries/${id}/recalculate`
  );
  return data;
};

export const deleteFinancialSummary = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(
    `/financial-summaries/${id}`
  );
  return data;
};
