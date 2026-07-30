import Link from "next/link";
import { Film } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, rgba(255,184,0,0.14) 0%, rgba(5,5,5,0) 60%)",
        }}
      />

      <Film className="size-12 text-[var(--color-gold)]" />

      <h1 className="text-4xl font-extrabold tracking-tight text-brand-gradient sm:text-5xl">
        زیرەک ستریم
      </h1>

      <p className="max-w-md text-[var(--color-ink-muted)]">
        بنکەی سەرەکی — قۆناغی ١ تەواو بوو: پڕۆژە، بنکەدراوە، و چوونەژوورەوە ئامادەن. لاپەڕەی
        سەرەکی و پەڕگەکانی فیلم و زنجیرە لە قۆناغی داهاتوودا زیاد دەکرێن.
      </p>

      <div className="flex gap-3">
        {user ? (
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="secondary">
              چوونەدەرەوە ({user.email})
            </Button>
          </form>
        ) : (
          <>
            <Button asChild>
              <Link href="/login">چوونەژوورەوە</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/register">تۆمارکردن</Link>
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
