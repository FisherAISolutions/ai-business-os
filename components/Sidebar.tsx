// components/Sidebar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { getRecommendedPhase, readPhaseProgress, PhaseId } from "../lib/utils/phaseProgress";

type NavItem = {
  id: "home" | PhaseId;
  label: string;
  href: string;
  description?: string;
};

const nav: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "phase1", label: "Phase 1", href: "/phase1", description: "Idea validation" },
  { id: "phase2", label: "Phase 2", href: "/phase2", description: "Business setup & legal" },
  { id: "phase3", label: "Phase 3", href: "/phase3", description: "Branding & website" },
  { id: "phase4", label: "Phase 4", href: "/phase4", description: "Marketing" },
  { id: "phase5", label: "Phase 5", href: "/phase5", description: "Growth & automation" },
];

export default function Sidebar() {
  const router = useRouter();
  const [progress, setProgress] = useState(() => {
    // SSR-safe initial state
    return {
      phase1: { completed: false, updatedAt: null },
      phase2: { completed: false, updatedAt: null },
      phase3: { completed: false, updatedAt: null },
      phase4: { completed: false, updatedAt: null },
      phase5: { completed: false, updatedAt: null },
    };
  });

  useEffect(() => {
    // Read from localStorage on client
    setProgress(readPhaseProgress());
  }, []);

  const recommended = useMemo(() => getRecommendedPhase(progress as any), [progress]);

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-black/20 p-4">
      <div className="mb-4">
        <div className="text-sm font-semibold text-white/90">AI Business OS</div>
        <div className="mt-1 text-xs text-white/50">
          A guided, phase-by-phase system to validate, launch, and grow a business.
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = router.pathname === item.href;

          const isPhase = item.id !== "home";
          const phaseId = isPhase ? (item.id as PhaseId) : null;

          const completed = phaseId ? Boolean((progress as any)[phaseId]?.completed) : false;
          const isRecommended = phaseId ? recommended === phaseId : false;

          const leftMark = completed ? "✓" : isPhase ? "•" : "";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-lg px-3 py-2 text-sm transition border",
                active
                  ? "bg-indigo-500/20 text-indigo-200 border-indigo-400/30"
                  : "text-white/80 hover:bg-white/5 hover:text-white border-transparent",
                isRecommended && !active ? "ring-1 ring-indigo-400/25" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {leftMark ? (
                    <span
                      className={[
                        "inline-flex h-5 w-5 items-center justify-center rounded border text-xs",
                        completed
                          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                          : "border-white/15 text-white/40",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {leftMark}
                    </span>
                  ) : (
                    <span className="inline-flex h-5 w-5" aria-hidden="true" />
                  )}

                  <span className="font-medium">{item.label}</span>

                  {isRecommended && !completed && (
                    <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-200">
                      Next
                    </span>
                  )}
                </div>

                {completed && (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                    Done
                  </span>
                )}
              </div>

              {item.description && <div className="mt-1 text-xs text-white/45">{item.description}</div>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <div className="font-semibold text-white/80">Pro tip</div>
        <p className="mt-1">
          You can revisit any phase at any time. The app will recommend the next best step based on your progress.
        </p>
      </div>
    </aside>
  );
}
