// components/Sidebar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import {
  getRecommendedPhase,
  PHASE_PROGRESS_EVENT,
  readPhaseProgress,
  PhaseId,
} from "../lib/utils/phaseProgress";

type NavItem = {
  id: "home" | PhaseId;
  label: string;
  href: string;
  sublabel?: string;
};

const nav: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "phase1", label: "Phase 1", href: "/phase1", sublabel: "Idea validation" },
  { id: "phase2", label: "Phase 2", href: "/phase2", sublabel: "Business setup & legal" },
  { id: "phase3", label: "Phase 3", href: "/phase3", sublabel: "Branding & website" },
  { id: "phase4", label: "Phase 4", href: "/phase4", sublabel: "Marketing" },
  { id: "phase5", label: "Phase 5", href: "/phase5", sublabel: "Growth & automation" },
];

export default function Sidebar() {
  const router = useRouter();

  const [progress, setProgress] = useState(() => ({
    phase1: { completed: false, updatedAt: null },
    phase2: { completed: false, updatedAt: null },
    phase3: { completed: false, updatedAt: null },
    phase4: { completed: false, updatedAt: null },
    phase5: { completed: false, updatedAt: null },
  }));

  function isActive(href: string) {
    if (href === "/") return router.pathname === "/";
    return router.pathname === href;
  }

  const refresh = () => setProgress(readPhaseProgress());

  useEffect(() => {
    refresh();

    // Cross-tab updates
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key.startsWith("ai-business-os:")) refresh();
    };

    // Same-tab updates (we emit this event when setting progress)
    const onCustom = () => refresh();

    window.addEventListener("storage", onStorage);
    window.addEventListener(PHASE_PROGRESS_EVENT, onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(PHASE_PROGRESS_EVENT, onCustom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const recommended = useMemo(() => getRecommendedPhase(progress as any), [progress]);

  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold mb-1">AI Business OS</h1>
        <p className="text-xs text-white/50 leading-snug">
          A professional, step-by-step system to validate, launch, and grow a business.
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = isActive(item.href);
          const isPhase = item.id !== "home";
          const phaseId = isPhase ? (item.id as PhaseId) : null;

          const completed = phaseId ? Boolean((progress as any)[phaseId]?.completed) : false;
          const isRecommended = phaseId ? recommended === phaseId : false;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-lg px-3 py-2 text-sm transition border",
                active
                  ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/30"
                  : "text-white/80 hover:bg-white/5 hover:text-white border-transparent",
                isRecommended && !active && isPhase ? "ring-1 ring-indigo-400/25" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isPhase && (
                    <span
                      className={[
                        "inline-flex h-5 w-5 items-center justify-center rounded border text-[11px]",
                        completed
                          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                          : "border-white/15 text-white/40",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {completed ? "✓" : "•"}
                    </span>
                  )}

                  <span className="font-medium">{item.label}</span>

                  {isPhase && isRecommended && !completed && (
                    <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-200">
                      Next
                    </span>
                  )}
                </div>

                {isPhase && completed && (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                    Done
                  </span>
                )}
              </div>

              {item.sublabel && <div className="mt-1 text-xs text-white/45">{item.sublabel}</div>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <div className="font-semibold text-white/80">Tip</div>
        <p className="mt-1">
          You can revisit any phase at any time. Your progress and outputs stay saved on this device.
        </p>
      </div>
    </aside>
  );
}
