import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "چوونەژوورەوە",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">بەخێربێیتەوە</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          بچۆرەژوورەوە بۆ بەردەوامبوون لە بینینی فیلم و زنجیرەکانت
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
