import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "تۆمارکردن",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">دروستکردنی هەژمار</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          بەشداری زیرەک ستریم بکە و دەستبگرە بە بینینی بێ سنووری فیلم و زنجیرە
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
