// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PHASES = ["/phase2", "/phase3", "/phase4", "/phase5"];
const ALWAYS_ALLOWED = ["/", "/phase1", "/login", "/pricing", "/api", "/_next", "/favicon.ico"];

function isAllowed(pathname: string) {
  return ALWAYS_ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

function isProtected(pathname: string) {
  return PROTECTED_PHASES.some((p) => pathname === p || pathname.startsWith(p + "/")) || pathname.startsWith("/account");
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isAllowed(pathname)) return NextResponse.next();

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

  if (isProtected(pathname) && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname + search);
    return NextResponse.redirect(url);
  }

  // If it's a paid phase, require active/trialing subscription
  const isPaidPhase = PROTECTED_PHASES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isPaidPhase && user) {
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
