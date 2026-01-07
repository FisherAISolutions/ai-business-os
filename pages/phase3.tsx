// pages/phase3.tsx
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BrandingPreview } from "../components/BrandingPreview";
import { generateBranding } from "../lib/branding/ai";
import { generateLandingPage, LandingContent, LandingTemplateId, LandingTheme } from "../lib/branding/landing";
import LandingTemplateRenderer from "../components/LandingTemplateRenderer";
import { setPhaseCompleted } from "../lib/utils/phaseProgress";
import type { BusinessIdea, FounderProfile } from "../types/business";

type SavedSelection = {
  savedAt: string;
  founder: FounderProfile;
  idea: BusinessIdea;
  createdAt: string;
};

const SELECTION_KEY = "ai-business-os:selected-idea";

// Phase 3 local persistence (per idea)
const PHASE3_STORAGE_KEY = "ai-business-os:phase3:landing";

function readSelection(): SavedSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SELECTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.founder || !parsed?.idea) return null;
    return parsed as SavedSelection;
  } catch {
    return null;
  }
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function buildPageCode(
  templateId: LandingTemplateId,
  content: LandingContent,
  brand: any,
  theme: LandingTheme
) {
  // A clean, copy/paste Next.js page (Pages Router)
  // This is intentionally self-contained so users can drop it into /pages/landing.tsx, etc.
  const safe = JSON.stringify(
    {
      templateId,
      content,
      brand: brand || {},
      theme,
    },
    null,
    2
  );

  // NOTE: No styled-jsx to avoid build issues.
  return `// pages/landing.tsx
import React from "react";

type LandingTemplateId = "templateA" | "templateB" | "templateC";
type LandingTheme = "dark" | "light";
type LandingContent = any;

type Brand = {
  brandName?: string;
  tagline?: string;
  colors?: { primary?: string; secondary?: string; accent?: string };
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function SectionTitle({ children, theme }: { children: React.ReactNode; theme: LandingTheme }) {
  return (
    <h2 className={cx("text-2xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
      {children}
    </h2>
  );
}

function Card({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: LandingTheme;
}) {
  return (
    <div
      className={cx(
        "rounded-xl border p-5",
        theme === "dark"
          ? "border-white/10 bg-white/5"
          : "border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]"
      )}
    >
      {children}
    </div>
  );
}

function LandingTemplateRenderer({
  templateId,
  content,
  brand,
  theme,
}: {
  templateId: LandingTemplateId;
  content: any;
  brand?: Brand;
  theme: LandingTheme;
}) {
  const brandName = brand?.brandName || "";
  const tagline = brand?.tagline || "";
  const primary = brand?.colors?.primary || "#4F46E5";
  const accent = brand?.colors?.accent || "#22C55E";
  const c = content;

  const pageShell = cx(
    "min-h-screen",
    theme === "dark" ? "bg-gray-950 text-white" : "bg-slate-50 text-slate-900"
  );

  const frame = cx(
    "mx-auto max-w-5xl px-6 py-10"
  );

  const panel = cx(
    "rounded-2xl border p-6 backdrop-blur",
    theme === "dark" ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/70"
  );

  const subtleText = theme === "dark" ? "text-white/70" : "text-slate-600";
  const faintText = theme === "dark" ? "text-white/50" : "text-slate-500";

  const ghostBtn = cx(
    "rounded-lg px-5 py-2 text-sm font-semibold border inline-flex items-center justify-center transition",
    theme === "dark"
      ? "text-white/90 border-white/15 bg-black/20 hover:bg-white/5"
      : "text-slate-900 border-slate-200 bg-white hover:bg-slate-50"
  );

  const featureCard = cx(
    "rounded-xl border p-4",
    theme === "dark" ? "border-white/10 bg-black/20" : "border-slate-200 bg-white"
  );

  const quoteCard = cx(
    "rounded-lg border p-4",
    theme === "dark" ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
  );

  const bottomPanel = cx(
    "rounded-xl border p-5",
    theme === "dark" ? "border-white/10 bg-black/20" : "border-slate-200 bg-white"
  );

  if (templateId === "templateB") {
    return (
      <div className={pageShell}>
        <div className={frame}>
          <div className={panel}>
            <div className="flex flex-col gap-2">
              {brandName ? <div className={cx("text-sm", faintText)}>{brandName}</div> : null}
              <h1 className={cx("text-4xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
                {c.hero.headline}
              </h1>
              <p className={subtleText}>{c.hero.subheadline}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="rounded-lg px-5 py-2 text-sm font-semibold text-white inline-flex items-center justify-center"
                  style={{ backgroundColor: primary }}
                >
                  {c.hero.primaryCta}
                </a>
                <a href="#learn" className={ghostBtn}>
                  {c.hero.secondaryCta}
                </a>
              </div>

              <div className={cx("mt-3 text-xs", faintText)}>{c.hero.trustLine}</div>
              {tagline ? <div className={cx("mt-2 text-sm italic", faintText)}>{tagline}</div> : null}
            </div>

            <div id="learn" className="mt-8 grid gap-5 md:grid-cols-2">
              <Card theme={theme}>
                <SectionTitle theme={theme}>{c.problem.title}</SectionTitle>
                <ul className={cx("mt-3 list-disc pl-6 space-y-2", subtleText)}>
                  {c.problem.bullets.map((b: string, idx: number) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </Card>

              <Card theme={theme}>
                <SectionTitle theme={theme}>{c.solution.title}</SectionTitle>
                <p className={cx("mt-3", subtleText)}>{c.solution.paragraph}</p>
              </Card>
            </div>

            <div className="mt-8">
              <SectionTitle theme={theme}>{c.features.title}</SectionTitle>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {c.features.items.map((it: any, idx: number) => (
                  <div key={idx} className={featureCard}>
                    <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>
                      {it.title}
                    </div>
                    <div className={cx("mt-2 text-sm", subtleText)}>{it.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Card theme={theme}>
                <SectionTitle theme={theme}>{c.socialProof.title}</SectionTitle>
                <div className="mt-4 space-y-3">
                  {c.socialProof.testimonials.map((t: any, idx: number) => (
                    <div key={idx} className={quoteCard}>
                      <div className={cx("text-sm", theme === "dark" ? "text-white/85" : "text-slate-800")}>
                        &ldquo;{t.quote}&rdquo;
                      </div>
                      <div className={cx("mt-2 text-xs", faintText)}>
                        — {t.name}, {t.role}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card theme={theme}>
                <SectionTitle theme={theme}>{c.faq.title}</SectionTitle>
                <div className="mt-4 space-y-3">
                  {c.faq.items.map((f: any, idx: number) => (
                    <div key={idx}>
                      <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>
                        {f.q}
                      </div>
                      <div className={cx("mt-1 text-sm", subtleText)}>{f.a}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div id="contact" className={cx("mt-8", bottomPanel)}>
              <div className={cx("text-2xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
                {c.finalCta.title}
              </div>
              <div className={cx("mt-2", subtleText)}>{c.finalCta.paragraph}</div>
              <a
                href="#"
                className="mt-4 inline-flex rounded-lg px-6 py-2 text-sm font-semibold text-white items-center justify-center"
                style={{ backgroundColor: accent }}
              >
                {c.finalCta.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "templateC") {
    return (
      <div className={pageShell}>
        <div className={frame}>
          <div className={panel}>
            <div className={cx("rounded-xl border p-6", theme === "dark" ? "border-white/10 bg-black/20" : "border-slate-200 bg-white")}>
              <div className={cx("text-xs uppercase tracking-wide", faintText)}>Offer</div>
              <h1 className={cx("mt-2 text-4xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
                {c.hero.headline}
              </h1>
              <p className={cx("mt-2", subtleText)}>{c.hero.subheadline}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="rounded-lg px-6 py-2 text-sm font-semibold text-white inline-flex items-center justify-center"
                  style={{ backgroundColor: accent }}
                >
                  {c.hero.primaryCta}
                </a>
                <a href="#learn" className={ghostBtn}>
                  {c.hero.secondaryCta}
                </a>
              </div>

              <div className={cx("mt-3 text-xs", faintText)}>{c.hero.trustLine}</div>
            </div>

            <div id="learn" className="mt-8 grid gap-5 md:grid-cols-2">
              <Card theme={theme}>
                <SectionTitle theme={theme}>{c.features.title}</SectionTitle>
                <div className="mt-4 space-y-3">
                  {c.features.items.map((it: any, idx: number) => (
                    <div key={idx} className={quoteCard}>
                      <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>
                        {it.title}
                      </div>
                      <div className={cx("mt-1 text-sm", subtleText)}>{it.description}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card theme={theme}>
                <SectionTitle theme={theme}>{c.steps.title}</SectionTitle>
                <div className="mt-4 space-y-3">
                  {c.steps.items.map((s: any, idx: number) => (
                    <div key={idx} className={quoteCard}>
                      <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>
                        {s.title}
                      </div>
                      <div className={cx("mt-1 text-sm", subtleText)}>{s.description}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Card theme={theme}>
                <SectionTitle theme={theme}>{c.problem.title}</SectionTitle>
                <ul className={cx("mt-3 list-disc pl-6 space-y-2", subtleText)}>
                  {c.problem.bullets.map((b: string, idx: number) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </Card>

              <Card theme={theme}>
                <SectionTitle theme={theme}>{c.faq.title}</SectionTitle>
                <div className="mt-4 space-y-3">
                  {c.faq.items.map((f: any, idx: number) => (
                    <div key={idx}>
                      <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>
                        {f.q}
                      </div>
                      <div className={cx("mt-1 text-sm", subtleText)}>{f.a}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div id="contact" className={cx("mt-8 rounded-xl border p-6", theme === "dark" ? "border-white/10 bg-black/20" : "border-slate-200 bg-white")}>
              <div className={cx("text-2xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
                {c.finalCta.title}
              </div>
              <p className={cx("mt-2", subtleText)}>{c.finalCta.paragraph}</p>
              <a
                href="#"
                className="mt-4 inline-flex rounded-lg px-6 py-2 text-sm font-semibold text-white items-center justify-center"
                style={{ backgroundColor: primary }}
              >
                {c.finalCta.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // templateA
  return (
    <div className={pageShell}>
      <div className={frame}>
        <div className={panel}>
          {brandName ? <div className={cx("text-sm", faintText)}>{brandName}</div> : null}
          <h1 className={cx("mt-2 text-4xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
            {c.hero.headline}
          </h1>
          <p className={cx("mt-2", subtleText)}>{c.hero.subheadline}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-lg px-6 py-2 text-sm font-semibold text-white inline-flex items-center justify-center"
              style={{ backgroundColor: primary }}
            >
              {c.hero.primaryCta}
            </a>
            <a href="#learn" className={ghostBtn}>
              {c.hero.secondaryCta}
            </a>
          </div>

          <div className={cx("mt-3 text-xs", faintText)}>{c.hero.trustLine}</div>
          {tagline ? <div className={cx("mt-2 text-sm italic", faintText)}>{tagline}</div> : null}

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {c.features.items.map((it: any, idx: number) => (
              <div key={idx} className={featureCard}>
                <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>
                  {it.title}
                </div>
                <div className={cx("mt-2 text-sm", subtleText)}>{it.description}</div>
              </div>
            ))}
          </div>

          <div id="learn" className="mt-8 grid gap-5 md:grid-cols-2">
            <Card theme={theme}>
              <SectionTitle theme={theme}>{c.steps.title}</SectionTitle>
              <div className="mt-4 space-y-3">
                {c.steps.items.map((s: any, idx: number) => (
                  <div key={idx} className={quoteCard}>
                    <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>
                      {s.title}
                    </div>
                    <div className={cx("mt-1 text-sm", subtleText)}>{s.description}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card theme={theme}>
              <SectionTitle theme={theme}>{c.faq.title}</SectionTitle>
              <div className="mt-4 space-y-3">
                {c.faq.items.map((f: any, idx: number) => (
                  <div key={idx}>
                    <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>
                      {f.q}
                    </div>
                    <div className={cx("mt-1 text-sm", subtleText)}>{f.a}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div id="contact" className={cx("mt-8", bottomPanel)}>
            <div className={cx("text-2xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
              {c.finalCta.title}
            </div>
            <p className={cx("mt-2", subtleText)}>{c.finalCta.paragraph}</p>
            <a
              href="#"
              className="mt-4 inline-flex rounded-lg px-6 py-2 text-sm font-semibold text-white items-center justify-center"
              style={{ backgroundColor: accent }}
            >
              {c.finalCta.cta}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const data = ${safe} as {
    templateId: LandingTemplateId;
    content: LandingContent;
    brand?: Brand;
    theme: LandingTheme;
  };

  return (
    <LandingTemplateRenderer
      templateId={data.templateId}
      content={data.content}
      brand={data.brand}
      theme={data.theme || "dark"}
    />
  );
}
`;
}

const Phase3Page: React.FC = () => {
  const [selection, setSelection] = useState<SavedSelection | null>(null);

  const [branding, setBranding] = useState<any>(null);
  const [landing, setLanding] = useState<LandingContent | null>(null);

  const [templateId, setTemplateId] = useState<LandingTemplateId>("templateA");
  const [theme, setTheme] = useState<LandingTheme>("dark");

  const [loadingBrand, setLoadingBrand] = useState(false);
  const [loadingLanding, setLoadingLanding] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [exportCode, setExportCode] = useState<string>("");

  useEffect(() => {
    const sel = readSelection();
    setSelection(sel);

    if (typeof window !== "undefined") {
      const saved = safeParse<any>(window.localStorage.getItem(PHASE3_STORAGE_KEY));
      if (saved && saved.templateId && saved.landing) {
        setTemplateId(saved.templateId as LandingTemplateId);
        setLanding(saved.landing as LandingContent);
        setExportCode(saved.exportCode || "");
        if (saved.theme === "light" || saved.theme === "dark") {
          setTheme(saved.theme as LandingTheme);
        }
      }
    }
  }, []);

  const businessName = useMemo(() => selection?.idea?.name || "", [selection]);
  const location = useMemo(() => selection?.founder?.location || "USA", [selection]);

  const handleGenerateBranding = async () => {
    if (!selection) return;
    setLoadingBrand(true);
    setError(null);
    try {
      const data = await generateBranding({
        founder: selection.founder,
        businessName: selection.idea.name,
        location: selection.founder.location || "USA",
      });
      setBranding(data);

      // Phase 1 is always complete if we have a selection
      setPhaseCompleted("phase1", true);

      // Do NOT auto-mark phase3 done here. We mark it after a landing page is generated.
    } catch (e: any) {
      setError(e?.message || "Branding generation failed.");
    } finally {
      setLoadingBrand(false);
    }
  };

  const handleGenerateLanding = async () => {
    if (!selection) return;
    if (!branding) {
      setError("Generate your brand kit first — it improves landing page quality.");
      return;
    }

    setLoadingLanding(true);
    setError(null);

    try {
      const content = await generateLandingPage({
        founder: selection.founder,
        businessName: selection.idea.name,
        location: selection.founder.location || "USA",
        brandName: branding.brandName,
        tagline: branding.tagline,
        colors: branding.colors,
        typography: branding.typography,
        logoPrompt: branding.logoPrompt,
        templateId,
        theme,
      });

      setLanding(content);

      const code = buildPageCode(
        templateId,
        content,
        {
          brandName: branding.brandName,
          tagline: branding.tagline,
          colors: branding.colors,
        },
        theme
      );

      setExportCode(code);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          PHASE3_STORAGE_KEY,
          JSON.stringify({
            templateId,
            theme,
            landing: content,
            exportCode: code,
            savedAt: new Date().toISOString(),
          })
        );
      }

      // Mark phase completion
      setPhaseCompleted("phase1", true);
      setPhaseCompleted("phase3", true);
    } catch (e: any) {
      setError(e?.message || "Landing page generation failed.");
    } finally {
      setLoadingLanding(false);
    }
  };

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportCode);
    } catch {
      // ignore
    }
  };

  // keep export code in sync if user switches theme AFTER generation
  useEffect(() => {
    if (!landing) return;
    const code = buildPageCode(
      templateId,
      landing,
      {
        brandName: branding?.brandName,
        tagline: branding?.tagline,
        colors: branding?.colors,
      },
      theme
    );
    setExportCode(code);

    if (typeof window !== "undefined") {
      const saved = safeParse<any>(window.localStorage.getItem(PHASE3_STORAGE_KEY)) || {};
      window.localStorage.setItem(
        PHASE3_STORAGE_KEY,
        JSON.stringify({
          ...saved,
          templateId,
          theme,
          landing,
          exportCode: code,
          savedAt: new Date().toISOString(),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, templateId]);

  if (!selection) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Phase 3 — Branding & Website</h1>
        <p className="text-gray-300">To continue, select a business idea in Phase 1.</p>
        <div className="flex gap-3">
          <Link href="/phase1" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
            Go to Phase 1
          </Link>
          <Link href="/phase2" className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
            Go to Phase 2
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Phase 3 — Branding & Website</h1>
        <p className="text-gray-300">
          Business: <span className="font-semibold text-white">{businessName}</span> • Location:{" "}
          <span className="font-semibold text-white">{location}</span>
        </p>
      </div>

      {error && <div className="p-3 rounded bg-red-900/40 border border-red-800 text-red-200">{error}</div>}

      {/* Step 1 */}
      <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="font-semibold">Step 1 — Generate your brand kit</p>
          <p className="text-sm text-gray-300">
            This gives the AI the style + positioning it needs to produce a stronger landing page.
          </p>
        </div>
        <button
          onClick={handleGenerateBranding}
          disabled={loadingBrand}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {loadingBrand ? "Generating..." : "Generate Brand Kit"}
        </button>
      </div>

      {branding && <BrandingPreview branding={branding} />}

      {/* Step 2 */}
      <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="font-semibold">Step 2 — Choose a landing page template</p>
            <p className="text-sm text-gray-300">
              Pick the layout style you like. Then generate a complete landing page with real sections and copy.
            </p>
          </div>

          <button
            onClick={handleGenerateLanding}
            disabled={loadingLanding || !branding}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:opacity-60"
            title={!branding ? "Generate your brand kit first" : "Generate the landing page"}
          >
            {loadingLanding ? "Generating..." : "Generate Landing Page"}
          </button>
        </div>

        {/* Theme selector */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Landing page theme</div>
            <div className="text-xs text-white/60">This changes the preview styling and the exported code.</div>
          </div>

          <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
            {(["dark", "light"] as LandingTheme[]).map((t) => {
              const active = theme === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={[
                    "px-4 py-2 text-sm font-semibold rounded-lg transition",
                    active ? "bg-indigo-500/20 text-indigo-200" : "text-white/70 hover:bg-white/10",
                  ].join(" ")}
                >
                  {t === "dark" ? "Dark" : "Light"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {(["templateA", "templateB", "templateC"] as LandingTemplateId[]).map((id) => {
            const active = templateId === id;
            const label = id === "templateA" ? "Clean SaaS" : id === "templateB" ? "Story-driven" : "Offer-focused";
            const desc =
              id === "templateA"
                ? "Simple hero + feature grid + FAQ."
                : id === "templateB"
                ? "Problem/solution narrative + trust + testimonials."
                : "Strong offer + steps + urgency-friendly CTA.";

            return (
              <button
                key={id}
                type="button"
                onClick={() => setTemplateId(id)}
                className={[
                  "rounded-xl border p-4 text-left transition",
                  active ? "border-indigo-400/40 bg-indigo-500/10" : "border-white/10 bg-white/5 hover:bg-white/10",
                ].join(" ")}
              >
                <div className="font-semibold text-white">{label}</div>
                <div className="mt-1 text-sm text-white/60">{desc}</div>
                {active ? (
                  <div className="mt-3 inline-flex rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-200">
                    Selected
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview */}
      {landing && (
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Landing page preview</h2>
              <p className="text-sm text-white/60">This is a real layout preview generated from your business data.</p>
            </div>

            <Link href="/phase4" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
              Continue to Phase 4 →
            </Link>
          </div>

          <LandingTemplateRenderer
            content={landing}
            templateId={templateId}
            theme={theme}
            brand={{
              brandName: branding?.brandName,
              tagline: branding?.tagline,
              colors: branding?.colors,
            }}
          />

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-white">Export page code</div>
                <div className="text-sm text-white/60">Copy/paste into your project as a real Next.js page (Pages Router).</div>
              </div>

              <button
                type="button"
                onClick={copyExport}
                disabled={!exportCode}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                Copy code
              </button>
            </div>

            <textarea
              className="mt-4 w-full h-64 rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-white/80 font-mono"
              value={exportCode}
              onChange={(e) => setExportCode(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Phase3Page;
