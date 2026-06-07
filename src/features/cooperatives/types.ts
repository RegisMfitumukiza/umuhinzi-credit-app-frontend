export type CooperativeStatus =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "SUSPENDED"
  | "DEACTIVATED";

export type MemberStatus = "PENDING" | "ACTIVE" | "REMOVED" | "LEFT";

export type Cooperative = {
  id: string;
  name: string;
  registrationNumber: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  province: string | null;
  district: string | null;
  sector: string | null;
  cell: string | null;
  village: string | null;
  status: CooperativeStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    members: number;
    managers: number;
  };
};

export type CooperativeMember = {
  id: string;
  cooperativeId: string;
  farmerId: string;
  status: MemberStatus;
  joinedAt: string | null;
  leftAt: string | null;
  createdAt: string;
  updatedAt: string;
  farmer: {
    id: string;
    user: {
      id: string;
      fullName: string;
      email: string;
    };
  };
};

export type Pagination = {
  total: number;
  limit: number;
  skip: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type CreateCooperativePayload = {
  name: string;
  registrationNumber: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
};

export type UpdateCooperativePayload = Partial<CreateCooperativePayload>;

export type UpdateCooperativeStatusPayload = {
  status: CooperativeStatus;
  rejectionReason?: string;
};

export type PendingCooperative = Cooperative & {
  _count: { members: number; managers: number };
  managers: Array<{
    position: string | null;
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string | null;
    };
  }>;
};

export type MemberFarm = {
  id: string;
  farmerId: string;
  name: string;
  description: string | null;
  landSize: number;
  landUnit: string;
  district: string;
  province: string | null;
  sector: string | null;
  cell: string | null;
  village: string | null;
  latitude: number;
  longitude: number;
  locationSource: string | null;
  locationVerificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  locationVerifiedAt: string | null;
  locationVerificationNote: string | null;
  status: string;
  createdAt: string;
  farmer: {
    id: string;
    user: { fullName: string; email: string };
  };
};

export type AddMemberPayload = {
  cooperativeId: string;
  farmerId: string;
};

export type UpdateMemberPayload = {
  status?: MemberStatus;
  joinedAt?: string;
  leftAt?: string;
};
