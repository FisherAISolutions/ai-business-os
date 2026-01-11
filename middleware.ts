// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Phase 1 is free
const FREE_ROUTES = ["/", "/phase1", "/login", "/pricing"];

// Anything here should NEVER be blocked
function isPublicRoute(pathname: string) {
  // exact-match public pages
  if (FREE_ROUTES.includes(pathname)) return true;

  // allow next internals + assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml")
  ) {
    return true;
  }

  // allow API routes (they self-check auth)
  if (pathname.startsWith("/api")) return true;

  return false;
}

function isPaidPhase(pathname: string) {
  return (
    pathname === "/phase2" ||
    pathname.startsWith("/phase2/") ||
    pathname === "/phase3" ||
    pathname.startsWith("/phase3/") ||
    pathname === "/phase4" ||
    pathname.startsWith("/phase4/") ||
    pathname === "/phase5" ||
    pathname.startsWith("/phase5/") ||
    pathname === "/account" ||
    pathname.startsWith("/account/")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Allow public routes through
  if (isPublicRoute(pathname)) return NextResponse.next();

  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            res.cookies.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Must be logged in for paid phases + account
  if (isPaidPhase(pathname) && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname + search);
    return NextResponse.redirect(url);
  }

  // Must be subscribed for paid phases + account
  if (isPaidPhase(pathname) && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .maybeSingle();

    const status = profile?.subscription_status ?? null;
    const active = status === "active" || status === "trialing";

    if (!active) {
      const url = req.nextUrl.clone();
      url.pathname = "/pricing";
      url.searchParams.set("from", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|favicon.ico).*)"],
};
