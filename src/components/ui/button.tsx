import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]",
  {
    variants: {
      variant: {
        default:
          "bg-brand-gradient text-black font-semibold shadow-[0_8px_24px_-8px_rgba(255,184,0,0.55)] hover:brightness-110 active:brightness-95",
        secondary:
          "bg-[var(--color-surface-raised)] text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-[var(--color-border)]",
        outline:
          "border border-[var(--color-border)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface)]",
        ghost: "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface)]",
        link: "text-[var(--color-gold)] underline-offset-4 hover:underline",
        destructive: "bg-[var(--color-danger)] text-white hover:brightness-110",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-13 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
