import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="size-12 text-[var(--color-gold)]" />
      <h1 className="text-3xl font-extrabold text-[var(--color-ink)]">٤٠٤ — نەدۆزرایەوە</h1>
      <p className="max-w-sm text-[var(--color-ink-muted)]">
        ئەم لاپەڕەیە بوونی نییە یان گواستراوەتەوە بۆ شوێنێکی تر.
      </p>
      <Button asChild>
        <Link href="/">گەڕانەوە بۆ سەرەکی</Link>
      </Button>
    </main>
  );
}
