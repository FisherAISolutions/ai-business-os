export type PaywallMode = "all" | "phase2plus" | "none";

/**
 * Change this by env var:
 * NEXT_PUBLIC_PAYWALL_MODE=phase2plus
 * Options: "all" | "phase2plus" | "none"
 */
export const PAYWALL_MODE: PaywallMode =
  (process.env.NEXT_PUBLIC_PAYWALL_MODE as PaywallMode) || "phase2plus";

const PUBLIC_ALWAYS = new Set<string>([
  "/login",
  "/pricing",
  "/terms",
  "/privacy"
]);

function isPublicAssetPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/hero/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

export function isProtectedPath(pathname: string): boolean {
  if (!pathname) return false;
  if (isPublicAssetPath(pathname)) return false;

  // Allow API routes to be called by the app;
  // once subscriptions are added, we'll enforce auth in API routes too.
  if (pathname.startsWith("/api")) return false;

  if (PUBLIC_ALWAYS.has(pathname)) return false;

  if (PAYWALL_MODE === "none") return false;

  if (PAYWALL_MODE === "all") {
    // Everything except public pages requires login
    // (Home page included)
    return pathname !== "/";
  }

  // Recommended: Phase 1 free, paywall Phase 2–5 (and account)
  if (PAYWALL_MODE === "phase2plus") {
    if (pathname === "/") return false;
    if (pathname === "/phase1") return false;
    if (pathname.startsWith("/phase2")) return true;
    if (pathname.startsWith("/phase3")) return true;
    if (pathname.startsWith("/phase4")) return true;
    if (pathname.startsWith("/phase5")) return true;
    if (pathname.startsWith("/account")) return true;
    return false;
  }

  return false;
}
