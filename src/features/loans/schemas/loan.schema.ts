import { z } from "zod";

export const createLoanApplicationSchema = z.object({
  institutionId: z.uuid().optional(),
  requestedAmount: z.number().positive("Amount must be greater than 0"),
  purpose: z.enum([
    "SEEDS",
    "FERTILIZER",
    "EQUIPMENT",
    "IRRIGATION",
    "LIVESTOCK",
    "LAND_RENT",
    "LABOR",
    "TRANSPORT",
    "STORAGE",
    "OTHER",
  ]),
  purposeDescription: z.string().max(500).optional(),
});

export type CreateLoanApplicationSchemaType = z.infer<
  typeof createLoanApplicationSchema
>;

export const updateLoanApplicationStatusSchema = z
  .object({
    status: z.enum(["UNDER_REVIEW", "APPROVED", "REJECTED", "CANCELLED"]),
    rejectionReason: z.string().trim().min(1).max(500).optional(),
    recommendedAmount: z.number().positive().optional(),
    approvedAmount: z.number().positive().optional(),
    interestRate: z.number().min(0).max(100).optional(),
    totalPayable: z.number().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "REJECTED" && !data.rejectionReason) {
      ctx.addIssue({
        code: "custom",
        message: "Rejection reason is required",
        path: ["rejectionReason"],
      });
    }
  });

export type UpdateLoanApplicationStatusSchemaType = z.infer<
  typeof updateLoanApplicationStatusSchema
>;

export const disburseLoanSchema = z.object({
  disbursedAmount: z.number().positive("Amount must be greater than 0"),
  startDate: z.string().min(1, "Start date is required"),
  durationMonths: z.number().int().min(1, "Minimum 1 month").max(120, "Maximum 120 months"),
});

export type DisburseLoanSchemaType = z.infer<typeof disburseLoanSchema>;

export const updateLoanStatusSchema = z.object({
  status: z.enum(["ACTIVE", "COMPLETED", "DEFAULTED", "CANCELLED"]),
  note: z.string().trim().max(500).optional(),
});

export type UpdateLoanStatusSchemaType = z.infer<typeof updateLoanStatusSchema>;

export const createRepaymentSchema = z.object({
  loanId: z.uuid("Invalid loan ID"),
  repaymentScheduleId: z
    .union([z.uuid("Invalid schedule ID"), z.literal("")])
    .optional(),
  amountPaid: z.number().positive("Amount must be greater than 0"),
  paymentMethod: z.enum([
    "MOBILE_MONEY",
    "BANK_TRANSFER",
    "CASH",
    "CARD",
    "OTHER",
  ]),
  transactionReference: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(500).optional(),
  paidAt: z.string().optional(),
});

export type CreateRepaymentSchemaType = z.infer<typeof createRepaymentSchema>;
