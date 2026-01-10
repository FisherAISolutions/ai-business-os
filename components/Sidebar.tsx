// components/Sidebar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Sidebar() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  const phases = [
    { id: "phase1", label: "Phase 1", href: "/phase1", free: true },
    { id: "phase2", label: "Phase 2", href: "/phase2" },
    { id: "phase3", label: "Phase 3", href: "/phase3" },
    { id: "phase4", label: "Phase 4", href: "/phase4" },
    { id: "phase5", label: "Phase 5", href: "/phase5" },
  ];

  return (
    <aside className="w-64 bg-gray-800 p-4">
      <h1 className="text-xl font-bold mb-4">AI Business OS</h1>

      <nav className="flex flex-col gap-2">
        <Link href="/" className="text-sm">
          Home
        </Link>

        {phases.map((p) => {
          const locked = !p.free && !session;
          const isActive = router.pathname === p.href;

          return (
            <Link
              key={p.id}
              href={p.href}
              className={[
                "text-sm rounded px-3 py-2 transition",
                isActive ? "bg-white/10" : "hover:bg-white/10",
                locked ? "opacity-70" : "",
              ].join(" ")}
            >
              {p.label}
              {p.free && <span className="ml-2 text-xs bg-emerald-500/20 px-2 rounded">Free</span>}
              {locked && <span className="ml-2 text-xs">🔒</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
