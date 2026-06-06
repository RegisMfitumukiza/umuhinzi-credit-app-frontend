import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  CreateInstitutionPayload,
  Institution,
  UpdateInstitutionPayload,
} from "../types";

export const getMyInstitution = async (): Promise<Institution | null> => {
  const { data } = await api.get<ApiResponse<Institution[]>>("/institutions");
  return data.data?.[0] ?? null;
};

export const createInstitution = async (
  payload: CreateInstitutionPayload
): Promise<ApiResponse<Institution>> => {
  const { data } = await api.post<ApiResponse<Institution>>(
    "/institutions",
    payload
  );
  return data;
};

export const updateInstitution = async (
  id: string,
  payload: UpdateInstitutionPayload
): Promise<ApiResponse<Institution>> => {
  const { data } = await api.patch<ApiResponse<Institution>>(
    `/institutions/${id}`,
    payload
  );
  return data;
};
