import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";

/**
 * Supabase client for use inside Client Components ("use client").
 * Reads the public URL/anon key — safe to expose to the browser.
 * Create a fresh instance per call site; @supabase/ssr handles
 * de-duplication internally.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
