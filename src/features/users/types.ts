import type { AuthUser, UserRole, UserStatus } from "@/features/auth/types";

export type { UserRole, UserStatus };

export type User = AuthUser;

export type UpdateProfilePayload = {
  fullName?: string;
  phone?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
};

export type UserStats = {
  totalUsers: number;
  byStatus: {
    active: number;
    pending: number;
    suspended: number;
    deactivated: number;
  };
  byRole: {
    farmers: number;
    institutions: number;
    cooperativeManagers: number;
    admins: number;
    governmentPartners: number;
  };
};

export type UserFilters = {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  district?: string;
  search?: string;
};

export type UserPagination = {
  page: number;
  total: number;
  limit: number;
  skip: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
