import { z } from "zod";

const inputTypeEnum = z.enum([
  "SEED", "FERTILIZER", "PESTICIDE", "HERBICIDE", "LABOR",
  "IRRIGATION", "TRANSPORT", "EQUIPMENT", "STORAGE", "OTHER",
]);

export const createInputCostSchema = z.object({
  cropId: z.string().uuid("Select a valid crop"),
  type: inputTypeEnum,
  name: z.string().min(1, "Name is required").max(100, "Max 100 characters"),
  description: z.string().max(500, "Max 500 characters").optional().or(z.literal("")),
  quantity: z.number().positive("Must be positive").optional(),
  unit: z.string().max(50).optional().or(z.literal("")),
  unitCost: z.number().positive("Must be positive").optional(),
  totalCost: z.number().positive("Total cost is required"),
  dateUsed: z.string().min(1, "Date is required"),
});

export const updateInputCostSchema = createInputCostSchema
  .omit({ cropId: true })
  .partial()
  .refine((d) => Object.keys(d).length > 0, { message: "At least one field required" });

export type CreateInputCostSchemaType = z.infer<typeof createInputCostSchema>;
export type UpdateInputCostSchemaType = z.infer<typeof updateInputCostSchema>;
