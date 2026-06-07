import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  CreateExpensePayload,
  FarmExpense,
  FinancePagination,
  UpdateExpensePayload,
} from "../types";

type ExpenseListResponse = {
  success: boolean;
  message: string;
  data: FarmExpense[];
  pagination: FinancePagination;
};

export const getMyExpenses = async (params?: {
  page?: number;
  limit?: number;
  cropId?: string;
}): Promise<ExpenseListResponse> => {
  const { data } = await api.get<ExpenseListResponse>("/expenses", { params });
  return data;
};

export const getExpenseById = async (id: string): Promise<ApiResponse<FarmExpense>> => {
  const { data } = await api.get<ApiResponse<FarmExpense>>(`/expenses/${id}`);
  return data;
};

export const createExpense = async (
  payload: CreateExpensePayload
): Promise<ApiResponse<FarmExpense>> => {
  const { data } = await api.post<ApiResponse<FarmExpense>>("/expenses", payload);
  return data;
};

export const updateExpense = async (
  id: string,
  payload: UpdateExpensePayload
): Promise<ApiResponse<FarmExpense>> => {
  const { data } = await api.patch<ApiResponse<FarmExpense>>(`/expenses/${id}`, payload);
  return data;
};

export const deleteExpense = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/expenses/${id}`);
  return data;
};
