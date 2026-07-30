"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { loginAction, type AuthActionState } from "@/lib/actions/auth";
import { signInWithGoogleAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      چوونەژوورەوە
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-5" noValidate>
        <div className="grid gap-2">
          <Label htmlFor="email">ئیمەیل</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">وشەی نهێنی</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-[var(--color-gold)] hover:underline"
            >
              وشەی نهێنیت لەبیرچووە؟
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!state.fieldErrors?.password}
            required
          />
          {state.fieldErrors?.password && (
            <p className="text-sm font-medium text-[var(--color-danger)]">
              {state.fieldErrors.password[0]}
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
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-ink-faint)]">یان</span>
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      <form action={signInWithGoogleAction}>
        <Button type="submit" variant="secondary" className="w-full">
          <GoogleIcon />
          چوونەژوورەوە بە گووگڵ
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--color-ink-muted)]">
        هەژمارت نییە؟{" "}
        <Link href="/register" className="font-medium text-[var(--color-gold)] hover:underline">
          خۆت تۆمار بکە
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.3-1.7 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.88 0 3.14.8 3.86 1.48l2.63-2.53C16.9 3.02 14.68 2 12 2 6.98 2 2.9 6.03 2.9 11s4.08 9 9.1 9c5.25 0 8.74-3.69 8.74-8.89 0-.6-.07-1.05-.15-1.5H12z"
      />
    </svg>
  );
}
