import { z } from "zod";

export const cropTypeValues = [
  "CEREAL",
  "LEGUME",
  "VEGETABLE",
  "FRUIT",
  "ROOT_TUBER",
  "CASH_CROP",
  "OTHER",
] as const;

export const createCropSchema = z.object({
  seasonId: z.string().min(1, "Season is required"),
  cropName: z
    .string()
    .min(1, "Crop name is required")
    .max(100, "Max 100 characters"),
  cropType: z.enum(cropTypeValues, { error: "Crop type is required" }),
  plantingDate: z.string().min(1, "Planting date is required"),
  expectedHarvestDate: z.string().optional(),
  estimatedArea: z.number().positive("Must be greater than 0").optional(),
  notes: z.string().max(500).optional(),
});

export type CreateCropSchemaType = z.infer<typeof createCropSchema>;
