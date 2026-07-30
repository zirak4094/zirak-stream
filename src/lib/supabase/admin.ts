import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

/**
 * Service-role Supabase client. BYPASSES Row Level Security entirely.
 *
 * `import "server-only"` makes it a build error to ever import this from
 * client-side code. Use this ONLY in:
 *   - Admin dashboard server actions / route handlers (after verifying the
 *     caller's profile.role === 'admin')
 *   - Trusted background jobs (e.g. processing R2 upload webhooks)
 *
 * Never send the service role key to the browser, never log it, never
 * construct this client inside a Client Component.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
