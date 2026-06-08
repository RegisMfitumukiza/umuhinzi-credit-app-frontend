import { z } from "zod";

const TYPES = ["CATTLE", "GOAT", "SHEEP", "PIG", "CHICKEN", "DUCK", "RABBIT", "FISH", "BEE", "OTHER"] as const;
const PURPOSES = ["MILK", "MEAT", "EGGS", "BREEDING", "FARM_WORK", "COMMERCIAL", "OTHER"] as const;
const STATUSES = ["ACTIVE", "SOLD", "DECEASED", "INACTIVE"] as const;

export const createLivestockSchema = z.object({
  type: z.enum(TYPES, { message: "Select a livestock type" }),

  purposes: z.array(z.enum(PURPOSES)).optional(),

  quantity: z
    .number({ message: "Enter a valid number" })
    .int("Must be a whole number")
    .positive("Must be at least 1")
    .max(100_000, "Too large")
    .optional(),

  estimatedValue: z
    .number({ message: "Enter a valid number" })
    .positive("Must be greater than 0")
    .optional(),

  notes: z.string().trim().max(500, "Max 500 characters").optional().or(z.literal("")),
});

export const updateLivestockSchema = createLivestockSchema.extend({
  status: z.enum(STATUSES).optional(),
});

export type CreateLivestockSchemaType = z.infer<typeof createLivestockSchema>;
export type UpdateLivestockSchemaType = z.infer<typeof updateLivestockSchema>;
