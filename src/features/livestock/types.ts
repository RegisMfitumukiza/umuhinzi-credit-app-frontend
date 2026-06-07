export type LivestockType =
  | "CATTLE"
  | "GOAT"
  | "SHEEP"
  | "PIG"
  | "CHICKEN"
  | "DUCK"
  | "RABBIT"
  | "FISH"
  | "BEE"
  | "OTHER";

export type LivestockPurpose =
  | "MILK"
  | "MEAT"
  | "EGGS"
  | "BREEDING"
  | "FARM_WORK"
  | "COMMERCIAL"
  | "OTHER";

export type LivestockStatus = "ACTIVE" | "SOLD" | "DECEASED" | "INACTIVE";

export type Livestock = {
  id: string;
  farmerId: string;
  type: LivestockType;
  purpose: LivestockPurpose;
  quantity: number;
  estimatedValue: number | null;
  notes: string | null;
  status: LivestockStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateLivestockPayload = {
  type: LivestockType;
  purpose?: LivestockPurpose;
  quantity?: number;
  estimatedValue?: number;
  notes?: string;
};

export type UpdateLivestockPayload = {
  type?: LivestockType;
  purpose?: LivestockPurpose;
  quantity?: number;
  estimatedValue?: number;
  notes?: string;
  status?: LivestockStatus;
};

export type LivestockPagination = {
  page: number;
  total: number;
  limit: number;
  skip: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const LIVESTOCK_TYPE_LABELS: Record<LivestockType, string> = {
  CATTLE: "Cattle",
  GOAT: "Goat",
  SHEEP: "Sheep",
  PIG: "Pig",
  CHICKEN: "Chicken",
  DUCK: "Duck",
  RABBIT: "Rabbit",
  FISH: "Fish",
  BEE: "Bees",
  OTHER: "Other",
};

export const LIVESTOCK_PURPOSE_LABELS: Record<LivestockPurpose, string> = {
  MILK: "Milk",
  MEAT: "Meat",
  EGGS: "Eggs",
  BREEDING: "Breeding",
  FARM_WORK: "Farm work",
  COMMERCIAL: "Commercial",
  OTHER: "Other",
};

export const LIVESTOCK_STATUS_LABELS: Record<LivestockStatus, string> = {
  ACTIVE: "Active",
  SOLD: "Sold",
  DECEASED: "Deceased",
  INACTIVE: "Inactive",
};

export const LIVESTOCK_STATUS_STYLES: Record<LivestockStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  SOLD: "bg-blue-100 text-blue-800 border-blue-200",
  DECEASED: "bg-gray-100 text-gray-700 border-gray-200",
  INACTIVE: "bg-red-100 text-red-800 border-red-200",
};

/* Color accent per type — used for the card icon area */
export const LIVESTOCK_TYPE_COLORS: Record<LivestockType, string> = {
  CATTLE: "bg-amber-100 text-amber-700",
  GOAT: "bg-lime-100 text-lime-700",
  SHEEP: "bg-sky-100 text-sky-700",
  PIG: "bg-pink-100 text-pink-700",
  CHICKEN: "bg-orange-100 text-orange-700",
  DUCK: "bg-teal-100 text-teal-700",
  RABBIT: "bg-purple-100 text-purple-700",
  FISH: "bg-blue-100 text-blue-700",
  BEE: "bg-yellow-100 text-yellow-700",
  OTHER: "bg-gray-100 text-gray-700",
};
