export type LandUnit = "HECTARE" | "ACRE" | "SQUARE_METER";

export type OwnershipType =
  | "OWNED"
  | "RENTED"
  | "FAMILY_LAND"
  | "COOPERATIVE_LAND"
  | "GOVERNMENT_ALLOCATED"
  | "OTHER";

export type SoilType =
  | "CLAY"
  | "SANDY"
  | "SILT"
  | "LOAM"
  | "PEAT"
  | "CHALKY"
  | "UNKNOWN";

export type FarmStatus = "ACTIVE" | "INACTIVE" | "UNDER_REVIEW";

export type LocationVerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export type Farm = {
  id: string;
  farmerId: string;
  name: string;
  description: string | null;
  landSize: number;
  landUnit: LandUnit;
  ownershipType: OwnershipType;
  soilType: SoilType;
  status: FarmStatus;
  province: string | null;
  district: string;
  sector: string | null;
  cell: string | null;
  village: string | null;
  latitude: number | null;
  longitude: number | null;
  locationSource: string | null;
  locationAccuracyMeters: number | null;
  locationCapturedAt: string | null;
  locationVerificationStatus: LocationVerificationStatus;
  locationVerifiedAt: string | null;
  locationVerifiedById: string | null;
  locationVerificationNote: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { crops: number };
};

export type CreateFarmPayload = {
  name: string;
  landSize: number;
  district: string;
  description?: string;
  landUnit?: LandUnit;
  ownershipType?: OwnershipType;
  soilType?: SoilType;
  province?: string;
  sector?: string;
  cell?: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  locationAccuracyMeters?: number;
};

export type UpdateFarmPayload = Partial<CreateFarmPayload>;

export type FarmPagination = {
  page: number;
  total: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const LAND_UNIT_LABELS: Record<LandUnit, string> = {
  HECTARE: "ha",
  ACRE: "acres",
  SQUARE_METER: "m²",
};

export const OWNERSHIP_LABELS: Record<OwnershipType, string> = {
  OWNED: "Owned",
  RENTED: "Rented",
  FAMILY_LAND: "Family land",
  COOPERATIVE_LAND: "Cooperative land",
  GOVERNMENT_ALLOCATED: "Gov. allocated",
  OTHER: "Other",
};

export const SOIL_LABELS: Record<SoilType, string> = {
  CLAY: "Clay",
  SANDY: "Sandy",
  SILT: "Silt",
  LOAM: "Loam",
  PEAT: "Peat",
  CHALKY: "Chalky",
  UNKNOWN: "Unknown soil",
};
