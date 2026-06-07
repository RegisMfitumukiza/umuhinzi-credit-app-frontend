import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  AddMemberPayload,
  Cooperative,
  CooperativeMember,
  CreateCooperativePayload,
  MemberFarm,
  Pagination,
  PendingCooperative,
  UpdateCooperativePayload,
  UpdateCooperativeStatusPayload,
  UpdateMemberPayload,
} from "../types";

// Backend returns members as a flat array in `data`, with `pagination` at the top level
type MembersListResponse = ApiResponse<CooperativeMember[]> & { pagination: Pagination };

type MemberFarmsResponse = {
  data: MemberFarm[];
  pagination: Pagination;
};

/* ── COOPERATIVE ── */

export const getMyCooperative = async (): Promise<
  ApiResponse<Cooperative | null>
> => {
  const { data } = await api.get<ApiResponse<Cooperative | null>>(
    "/cooperatives/mine"
  );
  return data;
};

export const createCooperative = async (
  payload: CreateCooperativePayload
): Promise<ApiResponse<Cooperative>> => {
  const { data } = await api.post<ApiResponse<Cooperative>>(
    "/cooperatives",
    payload
  );
  return data;
};

export const updateCooperative = async (
  id: string,
  payload: UpdateCooperativePayload
): Promise<ApiResponse<Cooperative>> => {
  const { data } = await api.patch<ApiResponse<Cooperative>>(
    `/cooperatives/${id}`,
    payload
  );
  return data;
};

export const getPendingCooperatives = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PendingCooperative[]> & { pagination: Pagination }> => {
  const { data } = await api.get<ApiResponse<PendingCooperative[]> & { pagination: Pagination }>(
    "/cooperatives/pending",
    { params }
  );
  return data;
};

export const updateCooperativeStatus = async (
  id: string,
  payload: UpdateCooperativeStatusPayload
): Promise<ApiResponse<Cooperative>> => {
  const { data } = await api.patch<ApiResponse<Cooperative>>(
    `/cooperatives/${id}/status`,
    payload
  );
  return data;
};

/* ── MEMBER FARMS ── */

export const getMemberFarmsApi = async (params?: {
  locationVerificationStatus?: string;
  page?: number;
  limit?: number;
}): Promise<MemberFarmsResponse> => {
  const { data } = await api.get<MemberFarmsResponse>(
    "/cooperatives/mine/member-farms",
    { params }
  );
  return data;
};

export const verifyFarmLocationApi = async (
  farmId: string,
  payload: { status: "VERIFIED" | "REJECTED"; note?: string }
): Promise<ApiResponse<MemberFarm>> => {
  const { data } = await api.patch<ApiResponse<MemberFarm>>(
    `/farms/${farmId}/location-verification`,
    payload
  );
  return data;
};

/* ── MEMBERS ── */

export const getCooperativeMembers = async (params?: {
  page?: number;
  limit?: number;
}): Promise<MembersListResponse> => {
  const { data } = await api.get<MembersListResponse>(
    "/cooperative-members",
    { params }
  );
  return data;
};

export const addCooperativeMember = async (
  payload: AddMemberPayload
): Promise<ApiResponse<CooperativeMember>> => {
  const { data } = await api.post<ApiResponse<CooperativeMember>>(
    "/cooperative-members",
    payload
  );
  return data;
};

export const updateCooperativeMember = async (
  id: string,
  payload: UpdateMemberPayload
): Promise<ApiResponse<CooperativeMember>> => {
  const { data } = await api.patch<ApiResponse<CooperativeMember>>(
    `/cooperative-members/${id}`,
    payload
  );
  return data;
};

export const removeCooperativeMember = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  const { data } = await api.delete<ApiResponse<{ message: string }>>(
    `/cooperative-members/${id}`
  );
  return data;
};
