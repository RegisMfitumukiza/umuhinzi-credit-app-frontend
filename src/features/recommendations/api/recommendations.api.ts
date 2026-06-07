import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  Recommendation,
  CreateRecommendationPayload,
  UpdateRecommendationPayload,
  RecommendationFilters,
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

type RecommendationListResponse = {
  success: boolean;
  message: string;
  data: Recommendation[];
  pagination: Pagination;
};

export const getRecommendations = async (
  params?: RecommendationFilters
): Promise<RecommendationListResponse> => {
  const { data } = await api.get<RecommendationListResponse>("/recommendations", { params });
  return data;
};

export const getRecommendationById = async (
  id: string
): Promise<ApiResponse<Recommendation>> => {
  const { data } = await api.get<ApiResponse<Recommendation>>(`/recommendations/${id}`);
  return data;
};

export const createRecommendation = async (
  payload: CreateRecommendationPayload
): Promise<ApiResponse<Recommendation>> => {
  const { data } = await api.post<ApiResponse<Recommendation>>("/recommendations", payload);
  return data;
};

export const updateRecommendation = async (
  id: string,
  payload: UpdateRecommendationPayload
): Promise<ApiResponse<Recommendation>> => {
  const { data } = await api.patch<ApiResponse<Recommendation>>(`/recommendations/${id}`, payload);
  return data;
};

export const deleteRecommendation = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/recommendations/${id}`);
  return data;
};

export const markRecommendationRead = async (
  id: string
): Promise<ApiResponse<Recommendation>> => {
  const { data } = await api.patch<ApiResponse<Recommendation>>(`/recommendations/${id}/read`);
  return data;
};

export const dismissRecommendation = async (
  id: string
): Promise<ApiResponse<Recommendation>> => {
  const { data } = await api.patch<ApiResponse<Recommendation>>(`/recommendations/${id}/dismiss`);
  return data;
};
