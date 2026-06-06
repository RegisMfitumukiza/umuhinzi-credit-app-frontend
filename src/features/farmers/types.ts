export type Gender = "MALE" | "FEMALE" | "OTHER";
export type FarmerStatus = "PENDING" | "VERIFIED" | "SUSPENDED";
export type CredibilityStatus = "LOW" | "MEDIUM" | "HIGH" | "TRUSTED";
export type MembershipStatus = "PENDING" | "ACTIVE" | "LEFT";

export type FarmerUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  province: string | null;
  district: string | null;
  sector: string | null;
  cell: string | null;
  village: string | null;
  profileImageUrl: string | null;
};

export type FarmerMembership = {
  id: string;
  status: MembershipStatus;
  joinedAt: string | null;
  cooperative: {
    id: string;
    name: string;
    district: string | null;
    status: string;
  };
};

export type CreditScore = {
  id: string;
  score: number;
  riskLevel: string;
  summary: string | null;
  generatedAt: string;
};

export type Farmer = {
  id: string;
  userId: string;
  nationalId: string;
  dateOfBirth: string | null;
  gender: Gender | null;
  farmingExperienceYears: number | null;
  primaryCrop: string | null;
  credibilityStatus: CredibilityStatus;
  status: FarmerStatus;
  cooperativeId: string | null;
  createdAt: string;
  updatedAt: string;
  user: FarmerUser;
  cooperativeMembership: FarmerMembership | null;
  creditScores: CreditScore[];
  _count: {
    farms: number;
    livestock: number;
    loanApplications: number;
    loans: number;
    creditScores: number;
  };
};

export type CreateFarmerPayload = {
  nationalId: string;
  dateOfBirth?: string;
  gender?: Gender;
  farmingExperienceYears?: number;
  primaryCrop?: string;
  cooperativeId?: string;
};

export type UpdateFarmerPayload = {
  nationalId?: string;
  dateOfBirth?: string;
  gender?: Gender;
  farmingExperienceYears?: number;
  primaryCrop?: string;
  cooperativeId?: string | null;
};

export type CompletenessItem = {
  key: string;
  label: string;
  done: boolean;
};

export type FarmerCompleteness = {
  percentage: number;
  completedCount: number;
  totalChecks: number;
  isReadyForVerification: boolean;
  items: CompletenessItem[];
  missing: string[];
};

export type FarmerStats = {
  total: number;
  byStatus: { pending: number; verified: number; suspended: number };
  byCredibility: { low: number; medium: number; high: number; trusted: number };
};

export type FarmerPagination = {
  page: number;
  total: number;
  limit: number;
  skip: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type DiscoverCooperative = {
  id: string;
  name: string;
  registrationNumber: string | null;
  description: string | null;
  district: string | null;
  province: string | null;
  status: string;
  _count?: { members: number };
};

export type DiscoverScope = "district" | "province" | "national";
