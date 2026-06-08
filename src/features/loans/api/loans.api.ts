import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  LoanApplication,
  LoanApplicationFilters,
  LoanFilters,
  Loan,
  Repayment,
  RepaymentFilters,
  RepaymentSchedule,
  RepaymentScheduleFilters,
  LoanPagination,
  CreateLoanApplicationPayload,
  UpdateLoanApplicationStatusPayload,
  DisburseLoanPayload,
  UpdateLoanStatusPayload,
  CreateRepaymentPayload,
} from "../types";

type PagedResponse<T> = ApiResponse<T[]> & { pagination: LoanPagination };

/* ─── Active Institutions (for loan application picker) ─── */

export type ActiveInstitution = {
  id: string;
  name: string;
  type: string;
  district: string | null;
  province: string | null;
};

export const getActiveInstitutions = async (): Promise<ApiResponse<ActiveInstitution[]>> => {
  const { data } = await api.get<ApiResponse<ActiveInstitution[]>>("/institutions/active");
  return data;
};

/* ─── Loan Applications ─── */

export const createLoanApplication = async (
  payload: CreateLoanApplicationPayload
): Promise<ApiResponse<LoanApplication>> => {
  const { data } = await api.post<ApiResponse<LoanApplication>>(
    "/loan-applications",
    payload
  );
  return data;
};

export const getLoanApplications = async (
  filters?: LoanApplicationFilters
): Promise<PagedResponse<LoanApplication>> => {
  const { data } = await api.get<PagedResponse<LoanApplication>>(
    "/loan-applications",
    { params: filters }
  );
  return data;
};

export const getLoanApplicationById = async (
  id: string
): Promise<ApiResponse<LoanApplication>> => {
  const { data } = await api.get<ApiResponse<LoanApplication>>(
    `/loan-applications/${id}`
  );
  return data;
};

export const updateLoanApplicationStatus = async (
  id: string,
  payload: UpdateLoanApplicationStatusPayload
): Promise<ApiResponse<LoanApplication>> => {
  const { data } = await api.patch<ApiResponse<LoanApplication>>(
    `/loan-applications/${id}/status`,
    payload
  );
  return data;
};

export const deleteLoanApplication = async (
  id: string
): Promise<ApiResponse<null>> => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/loan-applications/${id}`
  );
  return data;
};

/* ─── Loans ─── */

export const getLoans = async (
  filters?: LoanFilters
): Promise<PagedResponse<Loan>> => {
  const { data } = await api.get<PagedResponse<Loan>>("/loans", {
    params: filters,
  });
  return data;
};

export const getLoanById = async (id: string): Promise<ApiResponse<Loan>> => {
  const { data } = await api.get<ApiResponse<Loan>>(`/loans/${id}`);
  return data;
};

export const disburseLoan = async (
  id: string,
  payload: DisburseLoanPayload
): Promise<ApiResponse<Loan>> => {
  const { data } = await api.patch<ApiResponse<Loan>>(
    `/loans/${id}/disburse`,
    payload
  );
  return data;
};

export const updateLoanStatus = async (
  id: string,
  payload: UpdateLoanStatusPayload
): Promise<ApiResponse<Loan>> => {
  const { data } = await api.patch<ApiResponse<Loan>>(
    `/loans/${id}/status`,
    payload
  );
  return data;
};

/* ─── Repayments ─── */

export const createRepayment = async (
  payload: CreateRepaymentPayload
): Promise<ApiResponse<Repayment>> => {
  const { data } = await api.post<ApiResponse<Repayment>>(
    "/repayments",
    payload
  );
  return data;
};

export const getRepayments = async (
  filters?: RepaymentFilters
): Promise<PagedResponse<Repayment>> => {
  const { data } = await api.get<PagedResponse<Repayment>>("/repayments", {
    params: filters,
  });
  return data;
};

/* ─── Repayment Schedules ─── */

export const getRepaymentSchedules = async (
  filters?: RepaymentScheduleFilters
): Promise<PagedResponse<RepaymentSchedule>> => {
  const { data } = await api.get<PagedResponse<RepaymentSchedule>>(
    "/repayment-schedules",
    { params: filters }
  );
  return data;
};
