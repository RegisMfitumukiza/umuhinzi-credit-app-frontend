import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  User,
  UserFilters,
  UserPagination,
  UserRole,
  UserStats,
  UserStatus,
  UpdateProfilePayload,
} from "../types";

type UsersListResponse = ApiResponse<User[]> & { pagination: UserPagination };

/* ── Self-service ── */

export const getMyProfile = async (): Promise<ApiResponse<User>> => {
  const { data } = await api.get<ApiResponse<User>>("/users/me");
  return data;
};

export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<ApiResponse<User>> => {
  const { data } = await api.patch<ApiResponse<User>>("/users/me", payload);
  return data;
};

export const updateMyAvatar = async (file: File): Promise<ApiResponse<User>> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.patch<ApiResponse<User>>(
    "/users/me/avatar",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

/* ── Admin ── */

export const getUserStats = async (): Promise<ApiResponse<UserStats>> => {
  const { data } = await api.get<ApiResponse<UserStats>>("/users/stats");
  return data;
};

export const getAllUsers = async (
  filters?: UserFilters
): Promise<UsersListResponse> => {
  const { data } = await api.get<UsersListResponse>("/users", {
    params: filters,
  });
  return data;
};

export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
  return data;
};

export const updateUserStatus = async (
  id: string,
  status: UserStatus
): Promise<ApiResponse<User>> => {
  const { data } = await api.patch<ApiResponse<User>>(`/users/${id}/status`, {
    status,
  });
  return data;
};

export const updateUserRole = async (
  id: string,
  role: UserRole
): Promise<ApiResponse<User>> => {
  const { data } = await api.patch<ApiResponse<User>>(`/users/${id}/role`, {
    role,
  });
  return data;
};

export const deactivateUser = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await api.delete<ApiResponse<null>>(`/users/${id}`);
  return data;
};
