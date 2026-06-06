import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  CreateFarmerPayload,
  DiscoverCooperative,
  DiscoverScope,
  Farmer,
  FarmerCompleteness,
  FarmerPagination,
  FarmerStats,
  UpdateFarmerPayload,
} from "../types";

type PaginatedResponse<T> = ApiResponse<T> & { pagination: FarmerPagination };

/* ── Farmer profile (self) ── */

export const getMyFarmerProfile = async (): Promise<ApiResponse<Farmer>> => {
  const { data } = await api.get<ApiResponse<Farmer>>("/farmers/me");
  return data;
};

export const createFarmerProfile = async (
  payload: CreateFarmerPayload
): Promise<ApiResponse<Farmer>> => {
  const { data } = await api.post<ApiResponse<Farmer>>("/farmers", payload);
  return data;
};

export const updateMyFarmerProfile = async (
  payload: UpdateFarmerPayload
): Promise<ApiResponse<Farmer>> => {
  const { data } = await api.patch<ApiResponse<Farmer>>("/farmers/me", payload);
  return data;
};

export const getFarmerCompleteness = async (): Promise<
  ApiResponse<FarmerCompleteness>
> => {
  const { data } = await api.get<ApiResponse<FarmerCompleteness>>(
    "/farmers/me/completeness"
  );
  return data;
};

/* ── Cooperative membership (farmer self-service) ── */

export const joinCooperativeApi = async (
  cooperativeId: string
): Promise<ApiResponse<Farmer>> => {
  const { data } = await api.post<ApiResponse<Farmer>>(
    `/farmers/me/cooperative/${cooperativeId}`
  );
  return data;
};

export const leaveCooperativeApi = async (): Promise<ApiResponse<Farmer>> => {
  const { data } = await api.delete<ApiResponse<Farmer>>(
    "/farmers/me/cooperative"
  );
  return data;
};

/* ── Discover cooperatives (farmer browsing) ── */

export const discoverCooperatives = async (params?: {
  scope?: DiscoverScope;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<DiscoverCooperative[]>> => {
  const { data } = await api.get<PaginatedResponse<DiscoverCooperative[]>>(
    "/cooperatives/discover",
    { params }
  );
  return data;
};

/* ── Admin: all farmers ── */

export const getAllFarmers = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  credibility?: string;
  district?: string;
  search?: string;
}): Promise<PaginatedResponse<Farmer[]>> => {
  const { data } = await api.get<PaginatedResponse<Farmer[]>>("/farmers", {
    params,
  });
  return data;
};

export const getFarmerById = async (
  id: string
): Promise<ApiResponse<Farmer>> => {
  const { data } = await api.get<ApiResponse<Farmer>>(`/farmers/${id}`);
  return data;
};

export const getFarmerStats = async (): Promise<ApiResponse<FarmerStats>> => {
  const { data } = await api.get<ApiResponse<FarmerStats>>("/farmers/stats");
  return data;
};

export const updateFarmerStatus = async (
  id: string,
  status: string
): Promise<ApiResponse<Farmer>> => {
  const { data } = await api.patch<ApiResponse<Farmer>>(
    `/farmers/${id}/status`,
    { status }
  );
  return data;
};

export const updateFarmerCredibility = async (
  id: string,
  credibilityStatus: string
): Promise<ApiResponse<Farmer>> => {
  const { data } = await api.patch<ApiResponse<Farmer>>(
    `/farmers/${id}/credibility`,
    { credibilityStatus }
  );
  return data;
};
