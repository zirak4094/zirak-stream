import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      dir="auto"
      className={cn(
        "flex h-11 w-full rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] transition-colors outline-none",
        "focus-visible:border-[var(--color-gold)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[var(--color-danger)] aria-invalid:ring-[var(--color-danger)]/30",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
