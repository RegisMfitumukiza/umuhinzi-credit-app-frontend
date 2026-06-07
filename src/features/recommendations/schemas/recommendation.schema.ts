import { z } from "zod";

const typeEnum = z.enum([
  "LOAN_AMOUNT",
  "FINANCIAL_IMPROVEMENT",
  "REPAYMENT_STRATEGY",
  "PRODUCTIVITY",
  "RISK_REDUCTION",
  "DATA_COMPLETENESS",
  "GENERAL_ADVISORY",
]);

const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const createRecommendationSchema = z.object({
  farmerId: z.string().uuid("Invalid farmer ID"),
  type: typeEnum,
  priority: priorityEnum.optional(),
  title: z.string().min(1, "Title is required").max(200, "Max 200 characters"),
  message: z.string().min(1, "Message is required").max(1000, "Max 1000 characters"),
  actionLabel: z.string().max(100).optional().or(z.literal("")),
  actionUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const updateRecommendationSchema = createRecommendationSchema
  .omit({ farmerId: true })
  .partial()
  .refine((d) => Object.keys(d).length > 0, { message: "At least one field is required" });

export type CreateRecommendationSchemaType = z.infer<typeof createRecommendationSchema>;
export type UpdateRecommendationSchemaType = z.infer<typeof updateRecommendationSchema>;
