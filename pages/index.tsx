// pages/index.tsx
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

const SELECTION_KEY = "ai-business-os:selected-idea";

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

type SelectionPreview = {
  idea?: { name?: string; description?: string };
  founder?: { location?: string; budget?: number; timePerWeek?: number; experienceLevel?: string };
};

export default function HomePage() {
  const [selection, setSelection] = useState<SelectionPreview | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = safeJsonParse<SelectionPreview>(window.localStorage.getItem(SELECTION_KEY));
    setSelection(data);
  }, []);

  const businessName = useMemo(() => {
    const name = String(selection?.idea?.name || "").trim();
    return name;
  }, [selection]);

  const location = useMemo(() => String(selection?.founder?.location || "").trim(), [selection]);

  const primaryCta = useMemo(() => {
    // If user already has an idea selected, continuing to Phase 2 makes sense.
    return businessName ? { href: "/phase2", label: "Continue your build" } : { href: "/phase1", label: "Start Phase 1" };
  }, [businessName]);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:p-12">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          {/* Cool glow */}
          <div
            className="absolute -top-40 left-1/2 h-[420px] w-[980px] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.30) 0%, rgba(0,0,0,0) 62%)",
            }}
          />
          {/* Warm ember glow */}
          <div
            className="absolute -bottom-48 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(249,115,22,0.18) 0%, rgba(239,68,68,0.10) 35%, rgba(0,0,0,0) 68%)",
            }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.20) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.20) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(circle at 50% 35%, black 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              Business Forge AI • businessforgeai.com
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Forge your business from idea to launch — with an AI-guided roadmap.
            </h1>

            <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
              Stop guessing. Business Forge AI helps you validate your idea, handle setup, build a landing page,
              launch marketing, and plan growth — organized into clear phases with saved progress.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                {primaryCta.label} →
              </Link>

              <Link
                href="/phase1"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                Explore Phase 1
              </Link>

              <span className="text-xs text-white/50 sm:ml-2">Progress saves locally on your device.</span>
            </div>

            {/* Current build preview */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/50">Current business</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {businessName ? businessName : "Not selected yet"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/50">Location</div>
                <div className="mt-1 text-sm font-semibold text-white">{location || "—"}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/50">Workflow</div>
                <div className="mt-1 text-sm font-semibold text-white">5 phases</div>
              </div>
            </div>
          </div>

          {/* Right column: “Product preview” cards */}
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold tracking-widest text-white/50">WHAT YOU GET</div>
                  <div className="mt-2 text-lg font-semibold text-white">A real, usable startup kit</div>
                  <p className="mt-2 text-sm text-white/65">
                    Every phase produces practical outputs you can copy, use, and refine.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  { title: "Validated idea + scoring", desc: "Clear pick with reasoning and viability signals." },
                  { title: "Legal checklist + forms", desc: "Progress saved, links organized, guidance included." },
                  { title: "Brand kit + landing page", desc: "Positioning, copy, sections, and exportable code." },
                  { title: "Marketing starter kit", desc: "Emails, posts, ads, calendar, and what to track." },
                  { title: "Growth plan + automation", desc: "KPIs, experiments, and automation suggestions." },
                ].map((x) => (
                  <div key={x.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold text-white">{x.title}</div>
                    <div className="mt-1 text-xs text-white/60">{x.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
              <div className="text-xs font-semibold tracking-widest text-white/50">PHASE NAVIGATION</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { href: "/phase1", label: "Phase 1", sub: "Validate" },
                  { href: "/phase2", label: "Phase 2", sub: "Setup" },
                  { href: "/phase3", label: "Phase 3", sub: "Brand" },
                  { href: "/phase4", label: "Phase 4", sub: "Market" },
                  { href: "/phase5", label: "Phase 5", sub: "Grow" },
                ].map((x) => (
                  <Link
                    key={x.href}
                    href={x.href}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">{x.label}</div>
                      <div className="text-xs text-white/45">{x.sub}</div>
                    </div>
                    <div className="mt-3 text-xs font-semibold text-indigo-200 opacity-0 transition group-hover:opacity-100">
                      Open →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / FOOTER STRIP */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="text-sm font-semibold text-white">Professional wording</div>
            <p className="mt-2 text-sm text-white/65">
              Outputs are written to feel investor-ready, customer-ready, and launch-ready.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="text-sm font-semibold text-white">Clear, repeatable process</div>
            <p className="mt-2 text-sm text-white/65">
              A structured flow reduces overwhelm and keeps momentum high.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="text-sm font-semibold text-white">You can revisit anytime</div>
            <p className="mt-2 text-sm text-white/65">
              Jump between phases. Update inputs. Regenerate outputs when needed.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 text-center text-xs text-white/45 md:flex-row md:text-left">
          <div>© {new Date().getFullYear()} Business Forge AI</div>
          <div className="flex items-center gap-3">
            <span className="text-white/35">businessforgeai.com</span>
            <span className="text-white/25">•</span>
            <span className="text-white/35">AI Business OS (internal build)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
