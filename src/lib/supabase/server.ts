import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/database.types";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * Must be created fresh on every call (never module-level singleton) because
 * it's bound to the current request's cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // `setAll` is called from a Server Component during rendering,
            // where cookie mutation isn't allowed. Safe to ignore because
            // `middleware.ts` refreshes the session on every request.
          }
        },
      },
    },
  );
}
