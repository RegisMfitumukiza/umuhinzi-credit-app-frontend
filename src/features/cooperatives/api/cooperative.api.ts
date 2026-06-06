import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  AddMemberPayload,
  Cooperative,
  CooperativeMember,
  CreateCooperativePayload,
  Pagination,
  UpdateCooperativePayload,
  UpdateMemberPayload,
} from "../types";

type MembersResponse = {
  members: CooperativeMember[];
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

/* ── MEMBERS ── */

export const getCooperativeMembers = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<MembersResponse>> => {
  const { data } = await api.get<ApiResponse<MembersResponse>>(
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
