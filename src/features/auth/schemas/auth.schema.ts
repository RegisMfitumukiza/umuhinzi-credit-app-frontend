import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),

  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .trim()
    .regex(/^(\+?[0-9]{10,15})$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .refine(
      (value) =>
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /\d/.test(value),
      {
        message:
          "Password must contain uppercase, lowercase, and a number",
      }
    ),

  role: z.enum([
    "FARMER",
    "INSTITUTION",
    "COOPERATIVE_MANAGER",
    "GOVERNMENT_PARTNER",
  ]),
}).superRefine((data, ctx) => {
  if (data.role === "GOVERNMENT_PARTNER" && !data.email.endsWith(".gov.rw")) {
    ctx.addIssue({
      code: "custom",
      path: ["email"],
      message: "Government partner accounts require an official .gov.rw email address",
    });
  }
});

export const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (value) =>
          /[A-Z]/.test(value) &&
          /[a-z]/.test(value) &&
          /\d/.test(value),
        {
          message:
            "Password must contain uppercase, lowercase, and a number",
        }
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const resendVerificationEmailSchema = z.object({
  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export type LoginSchemaType = z.infer<typeof loginSchema>;

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export type VerifyEmailSchemaType = z.infer<typeof verifyEmailSchema>;

export type ResendVerificationEmailSchemaType = z.infer<typeof resendVerificationEmailSchema>;