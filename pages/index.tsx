// pages/index.tsx
import Link from "next/link";
import Image from "next/image";
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

function HoloVisual() {
  // Pure SVG “product visual” — no assets required.
  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      {/* scanlines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background:repeating-linear-gradient(180deg,rgba(255,255,255,0.10)_0px,rgba(255,255,255,0.10)_1px,transparent_4px,transparent_8px)]" />

      {/* glass sheen */}
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.10),transparent_45%)]" />

      {/* soft aurora blobs */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full blur-3xl opacity-90"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.26) 0%, rgba(34,197,94,0.10) 35%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.18) 0%, rgba(239,68,68,0.10) 35%, rgba(0,0,0,0) 75%)",
        }}
      />

      {/* rotating shimmer ring (Tailwind animate-spin only; no styled-jsx) */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(black,transparent)]">
        <div className="absolute -inset-[2px] rounded-[26px] border border-white/10" />
        <div
          className="absolute -inset-[2px] rounded-[26px] animate-spin"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.16) 70deg, transparent 140deg)",
            filter: "blur(1px)",
          }}
        />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold tracking-widest text-white/50">SYSTEM PREVIEW</div>
          <div className="text-[10px] text-white/40">Live • Local progress</div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
            <div className="text-xs text-white/55">PHASE STATUS</div>
            <div className="mt-2 space-y-2">
              {[
                { t: "Idea Validation", c: "ok" },
                { t: "Setup & Legal", c: "warn" },
                { t: "Branding & Website", c: "idle" },
                { t: "Marketing", c: "idle" },
                { t: "Growth & Automation", c: "idle" },
              ].map((x) => (
                <div
                  key={x.t}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/10 px-3 py-2 transition hover:border-white/20 hover:bg-white/5"
                >
                  <div className="text-xs text-white/70">{x.t}</div>
                  <span
                    className={[
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      x.c === "ok"
                        ? "bg-emerald-500/10 text-emerald-200 border border-emerald-400/20"
                        : "",
                      x.c === "warn"
                        ? "bg-amber-500/10 text-amber-200 border border-amber-400/20"
                        : "",
                      x.c === "idle"
                        ? "bg-white/5 text-white/45 border border-white/10"
                        : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        x.c === "ok" ? "bg-emerald-400" : "",
                        x.c === "warn" ? "bg-amber-400" : "",
                        x.c === "idle" ? "bg-white/30" : "",
                      ].join(" ")}
                    />
                    {x.c === "ok" ? "Done" : x.c === "warn" ? "Next" : "Locked"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
            <div className="text-xs text-white/55">FORGE CORE</div>

            <div className="mt-3 relative grid place-items-center overflow-hidden rounded-2xl border border-white/10 bg-black/10 p-4">
              {/* animated aura (Tailwind animate-pulse) */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.85] animate-pulse">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(99,102,241,0.35) 0%, rgba(249,115,22,0.18) 35%, rgba(0,0,0,0) 70%)",
                  }}
                />
              </div>

              {/* small “embers” (no custom keyframes, subtle pulse) */}
              <div className="pointer-events-none absolute inset-0 opacity-40">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-white/45 blur-[0.2px] animate-pulse"
                    style={{
                      left: `${(i * 37) % 100}%`,
                      top: `${(i * 23) % 100}%`,
                      animationDelay: `${(i % 6) * 0.35}s`,
                    }}
                  />
                ))}
              </div>

              {/* SVG visual */}
              <svg viewBox="0 0 420 240" className="relative h-[180px] w-full">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(99,102,241,0.85)" />
                    <stop offset="55%" stopColor="rgba(34,197,94,0.55)" />
                    <stop offset="100%" stopColor="rgba(249,115,22,0.55)" />
                  </linearGradient>
                  <radialGradient id="g2" cx="50%" cy="45%" r="70%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                    <stop offset="35%" stopColor="rgba(99,102,241,0.55)" />
                    <stop offset="70%" stopColor="rgba(249,115,22,0.18)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                  <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* orbit rings */}
                <g opacity="0.9" filter="url(#glow)">
                  <ellipse cx="210" cy="120" rx="150" ry="62" fill="none" stroke="url(#g1)" strokeWidth="2" />
                  <ellipse
                    cx="210"
                    cy="120"
                    rx="110"
                    ry="44"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                  />
                  <ellipse
                    cx="210"
                    cy="120"
                    rx="75"
                    ry="28"
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                  />
                </g>

                {/* core */}
                <circle cx="210" cy="120" r="46" fill="url(#g2)" />
                <circle cx="210" cy="120" r="22" fill="rgba(255,255,255,0.22)" />

                {/* nodes */}
                {[
                  { x: 70, y: 120 },
                  { x: 140, y: 70 },
                  { x: 280, y: 70 },
                  { x: 350, y: 120 },
                  { x: 280, y: 170 },
                  { x: 140, y: 170 },
                ].map((p, i) => (
                  <g key={i} filter="url(#glow)">
                    <circle cx={p.x} cy={p.y} r="7" fill="rgba(99,102,241,0.55)" />
                    <circle cx={p.x} cy={p.y} r="3" fill="rgba(255,255,255,0.75)" />
                    <line
                      x1={p.x}
                      y1={p.y}
                      x2={210}
                      y2={120}
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* subtle waveform */}
                <path
                  d="M 20 210 C 80 180, 140 240, 200 210 C 260 180, 320 240, 400 210"
                  fill="none"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="2"
                />
              </svg>

              <div className="mt-2 text-xs text-white/55 text-center">
                A guided system that turns decisions into a launch-ready plan.
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { k: "Outputs", v: "Copy + ship" },
                { k: "Progress", v: "Saved" },
                { k: "Flow", v: "Phase-based" },
              ].map((x) => (
                <div
                  key={x.k}
                  className="rounded-xl border border-white/10 bg-black/10 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition hover:border-white/20 hover:bg-white/5"
                >
                  <div className="text-[10px] text-white/45">{x.k}</div>
                  <div className="mt-1 text-xs font-semibold text-white/80">{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="text-xs text-white/55">WHAT MAKES IT DIFFERENT</div>
          <div className="mt-2 text-sm text-white/75 leading-relaxed">
            Business Forge AI isn’t a chat prompt — it’s an organized workflow. Each phase creates tangible assets:
            legal checklists, brand + landing page copy, marketing kits, and growth plans.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selection, setSelection] = useState<SelectionPreview | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = safeJsonParse<SelectionPreview>(window.localStorage.getItem(SELECTION_KEY));
    setSelection(data);
  }, []);

  const businessName = useMemo(() => String(selection?.idea?.name || "").trim(), [selection]);
  const location = useMemo(() => String(selection?.founder?.location || "").trim(), [selection]);

  const primaryCta = useMemo(() => {
    return businessName ? { href: "/phase2", label: "Continue your build" } : { href: "/phase1", label: "Start Phase 1" };
  }, [businessName]);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* TOP BANNER (FULL IMAGE, NO CROP) */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
        {/* Aspect ratio tuned for wide banners; shows full image */}
        <div className="relative w-full aspect-[3/1]">
          <Image
            src="/hero/forge-hero.jpg"
            alt="Business Forge AI hero banner"
            fill
            priority
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1100px"
          />

          {/* Soft vignette + readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />
          <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.55)]" />

          {/* Optional caption chip */}
          <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-semibold text-white/75 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            Business Forge AI • businessforgeai.com
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:p-12">
        {/* Decorative background: aurora + forge glow + subtle grid */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-40 left-1/2 h-[480px] w-[1100px] -translate-x-1/2 rounded-full blur-3xl opacity-90"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(99,102,241,0.30) 0%, rgba(34,197,94,0.10) 32%, rgba(0,0,0,0) 70%)",
            }}
          />
          <div
            className="absolute -bottom-56 left-1/2 h-[620px] w-[1200px] -translate-x-1/2 rounded-full blur-3xl opacity-90"
            style={{
              background:
                "radial-gradient(circle at 50% 60%, rgba(249,115,22,0.18) 0%, rgba(239,68,68,0.10) 35%, rgba(0,0,0,0) 75%)",
            }}
          />

          <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.10),transparent_45%)]" />

          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.20) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.20) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(circle at 50% 35%, black 0%, transparent 70%)",
            }}
          />

          {/* faint rotating sheen ring */}
          <div className="absolute inset-0 rounded-3xl opacity-50">
            <div className="absolute -inset-[2px] rounded-[26px] border border-white/10" />
            <div
              className="absolute -inset-[2px] rounded-[26px] animate-spin"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.14) 75deg, transparent 150deg)",
                filter: "blur(1px)",
              }}
            />
          </div>
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
                className="group relative inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white"
              >
                <span className="absolute inset-0 rounded-xl bg-indigo-600/90 shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_18px_40px_rgba(79,70,229,0.20)] transition group-hover:bg-indigo-500/95" />
                <span className="absolute -inset-[2px] rounded-[14px] opacity-60 blur-md transition group-hover:opacity-90 [background:radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.55),transparent_60%)]" />
                <span className="relative">{primaryCta.label} →</span>
              </Link>

              <Link
                href="/phase1"
                className="relative inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:border-white/25"
              >
                Explore Phase 1
              </Link>

              <span className="text-xs text-white/50 sm:ml-2">Progress saves locally on your device.</span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition hover:border-white/20 hover:bg-white/5">
                <div className="text-xs text-white/50">Current business</div>
                <div className="mt-1 text-sm font-semibold text-white">{businessName ? businessName : "Not selected yet"}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition hover:border-white/20 hover:bg-white/5">
                <div className="text-xs text-white/50">Location</div>
                <div className="mt-1 text-sm font-semibold text-white">{location || "—"}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition hover:border-white/20 hover:bg-white/5">
                <div className="text-xs text-white/50">Workflow</div>
                <div className="mt-1 text-sm font-semibold text-white">5 phases</div>
              </div>
            </div>
          </div>

          <HoloVisual />
        </div>
      </section>

      {/* PHASE LINKS */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.08),transparent_45%)]" />
        <div
          className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
          }}
        />

        <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Jump into a phase</h2>
            <p className="mt-2 text-sm text-white/65">
              You can revisit phases anytime — your sidebar keeps track of what’s completed.
            </p>
          </div>
        </div>

        <div className="relative mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[
            { href: "/phase1", t: "Phase 1", d: "Idea validation" },
            { href: "/phase2", t: "Phase 2", d: "Setup & legal" },
            { href: "/phase3", t: "Phase 3", d: "Branding & website" },
            { href: "/phase4", t: "Phase 4", d: "Marketing" },
            { href: "/phase5", t: "Phase 5", d: "Growth" },
          ].map((x, idx) => (
            <Link
              key={x.href}
              href={x.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/15 p-5 transition hover:border-white/20 hover:bg-white/5"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl opacity-0 transition group-hover:opacity-90"
                style={{
                  background:
                    idx % 2 === 0
                      ? "radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)"
                      : "radial-gradient(circle, rgba(249,115,22,0.28), transparent 70%)",
                }}
              />
              <div className="relative text-sm font-semibold text-white">{x.t}</div>
              <div className="relative mt-1 text-xs text-white/60">{x.d}</div>
              <div className="relative mt-4 text-xs font-semibold text-indigo-200 opacity-0 transition group-hover:opacity-100">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_12%_0%,rgba(255,255,255,0.08),transparent_45%)]" />
        <div
          className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full blur-3xl opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(34,197,94,0.16), transparent 70%)",
          }}
        />

        <div className="relative grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition hover:border-white/20 hover:bg-white/5">
            <div className="text-sm font-semibold text-white">Professional wording</div>
            <p className="mt-2 text-sm text-white/65">
              Outputs are written to feel investor-ready, customer-ready, and launch-ready.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition hover:border-white/20 hover:bg-white/5">
            <div className="text-sm font-semibold text-white">Clear, repeatable process</div>
            <p className="mt-2 text-sm text-white/65">
              A structured flow reduces overwhelm and keeps momentum high.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition hover:border-white/20 hover:bg-white/5">
            <div className="text-sm font-semibold text-white">Revisit anytime</div>
            <p className="mt-2 text-sm text-white/65">
              Jump between phases. Update inputs. Regenerate outputs when needed.
            </p>
          </div>
        </div>

        <div className="relative mt-8 flex flex-col items-center justify-between gap-2 text-center text-xs text-white/45 md:flex-row md:text-left">
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
