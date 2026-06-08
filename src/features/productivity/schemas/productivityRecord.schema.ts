import { z } from "zod";

export const createProductivityRecordSchema = z.object({
  seasonId: z.string().uuid("Select a valid season"),
  totalExpectedYield: z.number().positive("Must be positive").optional(),
  totalActualYield: z.number().positive("Total actual yield is required"),
  unit: z.string().min(1).max(20).optional().or(z.literal("")),
  productivityRate: z.number().min(0, "Must be non-negative"),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export const updateProductivityRecordSchema = createProductivityRecordSchema
  .omit({ seasonId: true })
  .partial()
  .refine((d) => Object.keys(d).length > 0, { message: "At least one field required" });

export type CreateProductivityRecordSchemaType = z.infer<typeof createProductivityRecordSchema>;
export type UpdateProductivityRecordSchemaType = z.infer<typeof updateProductivityRecordSchema>;
