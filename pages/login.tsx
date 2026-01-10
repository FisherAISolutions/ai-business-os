// pages/login.tsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const redirectedFrom = (router.query.redirectedFrom as string) || "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function signIn() {
    setMsg(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace(redirectedFrom);
    } catch (e: any) {
      setMsg(e?.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function signUp() {
    setMsg(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // If email confirmations are ON, user must confirm via email.
      // If confirmations are OFF, session is created immediately.
      if (data.session) {
        router.replace(redirectedFrom);
      } else {
        setMsg("Check your email to confirm your account, then come back and sign in.");
        setMode("signin");
      }
    } catch (e: any) {
      setMsg(e?.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="mt-2 text-sm text-white/60">
          {mode === "signin"
            ? "Sign in with your email and password."
            : "Create a new account with your email and password."}
        </p>
      </div>

      {msg && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          {msg}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
        <input
          className="w-full rounded-lg bg-black/30 border border-white/10 p-3 text-white placeholder-white/40"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          className="w-full rounded-lg bg-black/30 border border-white/10 p-3 text-white placeholder-white/40"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
        />

        {mode === "signin" ? (
          <button
            onClick={signIn}
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        ) : (
          <button
            onClick={signUp}
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-500 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        )}

        <div className="flex items-center justify-between text-sm text-white/70">
          {mode === "signin" ? (
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="underline hover:text-white"
            >
              Create an account
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="underline hover:text-white"
            >
              I already have an account
            </button>
          )}

          <Link href="/" className="underline hover:text-white">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
