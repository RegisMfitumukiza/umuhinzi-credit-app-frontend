export type InstitutionType =
  | "SACCO"
  | "MICROFINANCE"
  | "BANK"
  | "NGO"
  | "GOVERNMENT_PROGRAM"
  | "OTHER";

export type InstitutionStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "DEACTIVATED";

export type Institution = {
  id: string;
  userId: string;
  name: string;
  type: InstitutionType;
  registrationNumber: string | null;
  licenseNumber: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  province: string | null;
  district: string | null;
  sector: string | null;
  cell: string | null;
  village: string | null;
  status: InstitutionStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
};

export type CreateInstitutionPayload = {
  name: string;
  type: InstitutionType;
  registrationNumber?: string;
  licenseNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
};

export type UpdateInstitutionPayload = Partial<CreateInstitutionPayload>;

export const REGULATED_INSTITUTION_TYPES: InstitutionType[] = [
  "SACCO",
  "MICROFINANCE",
  "BANK",
];

export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  SACCO: "SACCO",
  MICROFINANCE: "Microfinance",
  BANK: "Bank",
  NGO: "NGO",
  GOVERNMENT_PROGRAM: "Government Program",
  OTHER: "Other",
};
