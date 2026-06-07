export type CropType =
  | "CEREAL"
  | "LEGUME"
  | "VEGETABLE"
  | "FRUIT"
  | "ROOT_TUBER"
  | "CASH_CROP"
  | "OTHER";

export type CropStatus =
  | "PLANNED"
  | "PLANTED"
  | "GROWING"
  | "HARVESTED"
  | "FAILED";

export type SeasonName = "Season A" | "Season B" | "Season C";

export type Season = {
  id: string;
  name: SeasonName;
  year: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSeasonPayload = {
  name: SeasonName;
  year: number;
};

export type Crop = {
  id: string;
  farmId: string;
  seasonId: string;
  cropName: string;
  cropType: CropType;
  plantingDate: string;
  expectedHarvestDate: string | null;
  actualHarvestDate: string | null;
  estimatedArea: number | null;
  status: CropStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  season: { id: string; name: string; year: number };
  farm: { id: string; name: string; district: string; farmerId: string };
};

export type CreateCropPayload = {
  farmId: string;
  seasonId: string;
  cropName: string;
  cropType: CropType;
  plantingDate: string;
  expectedHarvestDate?: string;
  estimatedArea?: number;
  notes?: string;
};

export type UpdateCropPayload = Partial<
  Omit<CreateCropPayload, "farmId">
>;

export const CROP_TYPE_LABELS: Record<CropType, string> = {
  CEREAL: "Cereal",
  LEGUME: "Legume",
  VEGETABLE: "Vegetable",
  FRUIT: "Fruit",
  ROOT_TUBER: "Root / Tuber",
  CASH_CROP: "Cash crop",
  OTHER: "Other",
};

export const CROP_STATUS_LABELS: Record<CropStatus, string> = {
  PLANNED: "Planned",
  PLANTED: "Planted",
  GROWING: "Growing",
  HARVESTED: "Harvested",
  FAILED: "Failed",
};
