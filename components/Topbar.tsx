// components/Topbar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/auth/AuthContext";

export default function Topbar() {
  const router = useRouter();
  const { user } = useAuth();
  const email = user?.email ?? null;

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="bg-gray-700 p-4 flex justify-between items-center border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="font-semibold text-white">AI Business OS</div>
        <span className="hidden sm:inline text-xs text-white/40">Business Forge AI</span>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="hidden md:block text-sm text-gray-200">{email}</span>

            <Link
              href="/account"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10"
            >
              Account
            </Link>

            <button
              onClick={signOut}
              className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/25"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <span className="hidden md:block text-sm text-gray-300">Not signed in</span>

            <Link
              href="/pricing"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10"
            >
              Pricing
            </Link>

            <Link
              href={`/login?redirectedFrom=${encodeURIComponent(router.asPath || "/")}`}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
