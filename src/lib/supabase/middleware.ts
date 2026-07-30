import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/auth"];
const ADMIN_ROUTE_PREFIX = "/admin";

function isPublicRoute(pathname: string) {
  if (pathname === "/") return true;
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Refreshes the Supabase auth session on every request and enforces
 * route-level access rules:
 *   - unauthenticated users are redirected to /login for protected routes
 *   - non-admins are redirected away from /admin/**
 *
 * IMPORTANT: keep the `supabaseResponse` object as the return value so the
 * refreshed auth cookies actually reach the browser. Never strip cookies
 * from it or construct a fresh NextResponse after calling getUser().
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Do not run any logic between createServerClient and getUser().
  // A stray return here would silently break session refresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && !isPublicRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && pathname.startsWith(ADMIN_ROUTE_PREFIX)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
