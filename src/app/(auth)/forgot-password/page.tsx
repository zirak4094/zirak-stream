import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "گەڕاندنەوەی وشەی نهێنی",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">وشەی نهێنیت لەبیرچووە؟</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          ئیمەیلەکەت بنووسە و بەستەرێکی گەڕاندنەوەت بۆ دەنێرین
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
