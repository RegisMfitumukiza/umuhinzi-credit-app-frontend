import api from "@/lib/api";

import type {
  ApiResponse,
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  ResendVerificationEmailPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from "../types";

/* ================= REGISTER ================= */

export const registerUser = async (
  payload: RegisterPayload
): Promise<ApiResponse<RegisterResponse>> => {
  const { data } = await api.post<ApiResponse<RegisterResponse>>(
    "/auth/register",
    payload
  );

  return data;
};

/* ================= LOGIN ================= */

export const loginUser = async (
  payload: LoginPayload
): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    payload
  );

  return data;
};

/* ================= REFRESH TOKEN ================= */

export const refreshToken = async (
  payload: RefreshTokenPayload
): Promise<ApiResponse<RefreshTokenResponse>> => {
  const { data } = await api.post<
    ApiResponse<RefreshTokenResponse>
  >("/auth/refresh-token", payload);

  return data;
};

/* ================= LOGOUT ================= */

export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/logout"
  );

  return data;
};

/* ================= FORGOT PASSWORD ================= */

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/forgot-password",
    payload
  );

  return data;
};

/* ================= RESET PASSWORD ================= */

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/reset-password",
    payload
  );

  return data;
};

/* ================= VERIFY EMAIL ================= */

export const verifyEmail = async (
  payload: VerifyEmailPayload
): Promise<ApiResponse<AuthUser>> => {
  const { data } = await api.post<ApiResponse<AuthUser>>(
    "/auth/verify-email",
    payload
  );

  return data;
};

/* ================= RESEND VERIFICATION ================= */

export const resendVerificationEmail = async (
  payload: ResendVerificationEmailPayload
): Promise<ApiResponse<null>> => {
  const { data } = await api.post<ApiResponse<null>>(
    "/auth/resend-verification-email",
    payload
  );

  return data;
};

/* ================= AUTH USER ================= */

export const getAuthUser = async (): Promise<
  ApiResponse<AuthUser>
> => {
  const { data } = await api.get<ApiResponse<AuthUser>>(
    "/auth/me"
  );

  return data;
};