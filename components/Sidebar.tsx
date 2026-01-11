// components/Sidebar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../lib/auth/AuthContext";

export default function Sidebar() {
  const router = useRouter();
  const { user, subscription, loading } = useAuth();

  const phases = [
    { id: "phase1", label: "Phase 1", href: "/phase1", free: true },
    { id: "phase2", label: "Phase 2", href: "/phase2" },
    { id: "phase3", label: "Phase 3", href: "/phase3" },
    { id: "phase4", label: "Phase 4", href: "/phase4" },
    { id: "phase5", label: "Phase 5", href: "/phase5" },
  ];

  const isPro = !!user && (subscription.active || subscription.status === "trialing");

  return (
    <aside className="w-64 bg-gray-800 p-4">
      <h1 className="text-xl font-bold mb-4">AI Business OS</h1>

      <nav className="flex flex-col gap-2">
        <Link href="/" className="text-sm">
          Home
        </Link>

        {phases.map((p) => {
          const locked = !p.free && !loading && (!user || !isPro);
          const active = router.pathname === p.href;

          return (
            <Link
              key={p.id}
              href={locked ? "/pricing" : p.href}
              className={[
                "text-sm rounded px-3 py-2 flex items-center justify-between",
                active ? "bg-white/10" : "hover:bg-white/10",
                locked ? "opacity-60" : "",
              ].join(" ")}
              title={locked ? "Subscribe to unlock" : undefined}
            >
              <span>
                {p.label}
                {p.free && <span className="ml-2 text-xs bg-emerald-500/20 px-2 rounded">Free</span>}
              </span>

              {locked && <span className="text-xs">🔒</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
