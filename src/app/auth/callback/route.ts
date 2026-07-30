import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Handles two flows that both land here via redirect:
 *  1. Google OAuth: ?code=... to exchange for a session
 *  2. Email confirmation / magic link / password recovery links from Supabase Auth
 *
 * On success, redirects to `next` (defaults to "/"). On failure, redirects
 * to /login with an error flag so the UI can show a message.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
