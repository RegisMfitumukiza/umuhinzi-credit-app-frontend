import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  InputCost,
  CreateInputCostPayload,
  UpdateInputCostPayload,
  InputCostFilters,
} from "../types";

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type InputCostListResponse = {
  success: boolean;
  message: string;
  data: InputCost[];
  pagination: Pagination;
};

export const getMyInputCosts = async (
  params?: InputCostFilters
): Promise<InputCostListResponse> => {
  const { data } = await api.get<InputCostListResponse>("/input-costs", { params });
  return data;
};

export const getInputCostById = async (id: string): Promise<ApiResponse<InputCost>> => {
  const { data } = await api.get<ApiResponse<InputCost>>(`/input-costs/${id}`);
  return data;
};

export const createInputCost = async (
  payload: CreateInputCostPayload
): Promise<ApiResponse<InputCost>> => {
  const { data } = await api.post<ApiResponse<InputCost>>("/input-costs", payload);
  return data;
};

export const updateInputCost = async (
  id: string,
  payload: UpdateInputCostPayload
): Promise<ApiResponse<InputCost>> => {
  const { data } = await api.patch<ApiResponse<InputCost>>(`/input-costs/${id}`, payload);
  return data;
};

export const deleteInputCost = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/input-costs/${id}`);
  return data;
};
