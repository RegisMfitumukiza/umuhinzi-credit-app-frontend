export type InputType =
  | "SEED"
  | "FERTILIZER"
  | "PESTICIDE"
  | "HERBICIDE"
  | "LABOR"
  | "IRRIGATION"
  | "TRANSPORT"
  | "EQUIPMENT"
  | "STORAGE"
  | "OTHER";

export type InputCost = {
  id: string;
  cropId: string;
  type: InputType;
  name: string;
  description: string | null;
  quantity: number | null;
  unit: string | null;
  unitCost: number | null;
  totalCost: number;
  dateUsed: string;
  createdAt: string;
  updatedAt: string;
  crop: {
    id: string;
    cropName: string;
    farmId: string;
    season: { id: string; name: string; year: number };
  };
};

export type CreateInputCostPayload = {
  cropId: string;
  type: InputType;
  name: string;
  description?: string;
  quantity?: number;
  unit?: string;
  unitCost?: number;
  totalCost: number;
  dateUsed: string;
};

export type UpdateInputCostPayload = Partial<Omit<CreateInputCostPayload, "cropId">>;

export type InputCostFilters = {
  page?: number;
  limit?: number;
  cropId?: string;
  type?: InputType;
};

export const INPUT_TYPE_LABELS: Record<InputType, string> = {
  SEED: "Seeds",
  FERTILIZER: "Fertilizer",
  PESTICIDE: "Pesticide",
  HERBICIDE: "Herbicide",
  LABOR: "Labor",
  IRRIGATION: "Irrigation",
  TRANSPORT: "Transport",
  EQUIPMENT: "Equipment",
  STORAGE: "Storage",
  OTHER: "Other",
};

export const INPUT_TYPE_COLORS: Record<InputType, string> = {
  SEED: "bg-green-100 text-green-700",
  FERTILIZER: "bg-lime-100 text-lime-700",
  PESTICIDE: "bg-orange-100 text-orange-700",
  HERBICIDE: "bg-yellow-100 text-yellow-800",
  LABOR: "bg-blue-100 text-blue-700",
  IRRIGATION: "bg-cyan-100 text-cyan-700",
  TRANSPORT: "bg-indigo-100 text-indigo-700",
  EQUIPMENT: "bg-violet-100 text-violet-700",
  STORAGE: "bg-gray-100 text-gray-700",
  OTHER: "bg-slate-100 text-slate-600",
};
