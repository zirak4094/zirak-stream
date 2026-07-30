"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Loader2, PartyPopper } from "lucide-react";

import { registerAction, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      دروستکردنی هەژمار
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <PartyPopper className="size-10 text-[var(--color-gold)]" />
        <p className="text-[var(--color-ink)]">{state.message}</p>
        <Link href="/login" className="text-sm text-[var(--color-gold)] hover:underline">
          گەڕانەوە بۆ چوونەژوورەوە
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="displayName">ناوی نیشاندان</Label>
        <Input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          aria-invalid={!!state.fieldErrors?.displayName}
          required
        />
        {state.fieldErrors?.displayName && (
          <p className="text-sm font-medium text-[var(--color-danger)]">
            {state.fieldErrors.displayName[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">ئیمەیل</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!state.fieldErrors?.email}
          required
        />
        {state.fieldErrors?.email && (
          <p className="text-sm font-medium text-[var(--color-danger)]">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">وشەی نهێنی</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!state.fieldErrors?.password}
          required
        />
        {state.fieldErrors?.password && (
          <p className="text-sm font-medium text-[var(--color-danger)]">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">دووبارەکردنەوەی وشەی نهێنی</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!state.fieldErrors?.confirmPassword}
          required
        />
        {state.fieldErrors?.confirmPassword && (
          <p className="text-sm font-medium text-[var(--color-danger)]">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-[var(--radius-control)] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]"
        >
          {state.message}
        </p>
      )}

      <SubmitButton />

      <p className="text-center text-sm text-[var(--color-ink-muted)]">
        هەژمارت هەیە؟{" "}
        <Link href="/login" className="font-medium text-[var(--color-gold)] hover:underline">
          چوونەژوورەوە
        </Link>
      </p>
    </form>
  );
}
