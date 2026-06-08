import { z } from "zod";

const qualityGradeEnum = z.enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "DAMAGED"]);

export const createYieldSchema = z.object({
  cropId: z.string().uuid("Select a valid crop"),
  expectedYield: z.number().positive("Must be positive").optional(),
  actualYield: z.number().positive("Actual yield is required"),
  unit: z.string().min(1).max(20).optional().or(z.literal("")),
  harvestDate: z.string().min(1, "Harvest date is required"),
  qualityGrade: qualityGradeEnum.optional(),
  notes: z.string().max(500, "Max 500 characters").optional().or(z.literal("")),
});

export const updateYieldSchema = createYieldSchema
  .omit({ cropId: true })
  .partial()
  .refine((d) => Object.keys(d).length > 0, { message: "At least one field required" });

export const verifyYieldSchema = z
  .object({
    status: z.enum(["VERIFIED", "REJECTED"]),
    method: z.enum(["FIELD_VISIT", "COOPERATIVE_COLLECTION_RECORD"]).optional(),
    evidenceReference: z.string().min(2).max(100).optional().or(z.literal("")),
    verifiedActualYield: z.number().positive().optional(),
    verifiedUnit: z.string().min(1).max(20).optional().or(z.literal("")),
    verificationNote: z.string().min(5).max(700).optional().or(z.literal("")),
  })
  .refine((d) => d.status !== "VERIFIED" || !!d.method, {
    message: "Verification method is required",
    path: ["method"],
  })
  .refine(
    (d) =>
      d.status !== "VERIFIED" ||
      d.method !== "COOPERATIVE_COLLECTION_RECORD" ||
      !!(d.evidenceReference && d.evidenceReference.length >= 2),
    {
      message: "Collection record reference is required",
      path: ["evidenceReference"],
    }
  )
  .refine(
    (d) =>
      d.status !== "VERIFIED" ||
      d.method !== "FIELD_VISIT" ||
      !!(d.verificationNote && d.verificationNote.length >= 5),
    {
      message: "Field visit note is required",
      path: ["verificationNote"],
    }
  )
  .refine(
    (d) => d.status !== "REJECTED" || !!(d.verificationNote && d.verificationNote.length >= 5),
    {
      message: "Rejection note is required",
      path: ["verificationNote"],
    }
  );

export type CreateYieldSchemaType = z.infer<typeof createYieldSchema>;
export type UpdateYieldSchemaType = z.infer<typeof updateYieldSchema>;
export type VerifyYieldSchemaType = z.infer<typeof verifyYieldSchema>;
