"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Loader2, MailCheck } from "lucide-react";

import { forgotPasswordAction, type AuthActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      ناردنی بەستەری گەڕاندنەوە
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <MailCheck className="size-10 text-[var(--color-gold)]" />
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

      <SubmitButton />

      <p className="text-center text-sm text-[var(--color-ink-muted)]">
        <Link href="/login" className="font-medium text-[var(--color-gold)] hover:underline">
          گەڕانەوە بۆ چوونەژوورەوە
        </Link>
      </p>
    </form>
  );
}
