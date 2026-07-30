import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "ئیمەیل پێویستە")
    .email("ئیمەیلەکە دروست نییە"),
  password: z.string().min(1, "وشەی نهێنی پێویستە"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "ناو دەبێت لانی کەم ٢ پیت بێت")
      .max(50, "ناو زۆر درێژە"),
    email: z
      .string()
      .min(1, "ئیمەیل پێویستە")
      .email("ئیمەیلەکە دروست نییە"),
    password: z
      .string()
      .min(8, "وشەی نهێنی دەبێت لانی کەم ٨ پیت بێت")
      .regex(/[A-Z]/, "دەبێت پیتێکی گەورە تێدابێت")
      .regex(/[0-9]/, "دەبێت ژمارەیەک تێدابێت"),
    confirmPassword: z.string().min(1, "دووبارەکردنەوەی وشەی نهێنی پێویستە"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "وشەی نهێنییەکان وەک یەک نین",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "ئیمەیل پێویستە")
    .email("ئیمەیلەکە دروست نییە"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "وشەی نهێنی دەبێت لانی کەم ٨ پیت بێت")
      .regex(/[A-Z]/, "دەبێت پیتێکی گەورە تێدابێت")
      .regex(/[0-9]/, "دەبێت ژمارەیەک تێدابێت"),
    confirmPassword: z.string().min(1, "دووبارەکردنەوەی وشەی نهێنی پێویستە"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "وشەی نهێنییەکان وەک یەک نین",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
