// components/Sidebar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type NavItem = {
  label: string;
  href: string;
};

const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Phase 1", href: "/phase1" },
  { label: "Phase 2", href: "/phase2" },
  { label: "Phase 3", href: "/phase3" },
  { label: "Phase 4", href: "/phase4" },
  { label: "Phase 5", href: "/phase5" },
];

export default function Sidebar() {
  const router = useRouter();

  function isActive(href: string) {
    // Exact match for home; prefix match for phases
    if (href === "/") return router.pathname === "/";
    return router.pathname === href;
  }

  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-2">AI Business OS</h1>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/30"
                  : "text-white/80 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
