// components/LandingTemplateRenderer.tsx
import React from "react";
import type { LandingContent, LandingTemplateId, LandingTheme } from "../lib/branding/landing";

type Props = {
  content: LandingContent;
  templateId: LandingTemplateId;
  theme?: LandingTheme;
  brand?: {
    brandName?: string;
    tagline?: string;
    colors?: { primary?: string; secondary?: string; accent?: string };
  };
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

function Card({ children, theme }: { children: React.ReactNode; theme: LandingTheme }) {
  return (
    <div
      className={cx(
        "rounded-xl border p-5",
        theme === "dark"
          ? "border-white/10 bg-white/5"
          : // Light: softer "glass card" feel, not harsh white
            "border-slate-200/70 bg-white/70 backdrop-blur shadow-[0_1px_0_rgba(15,23,42,0.03),0_12px_30px_rgba(15,23,42,0.06)]"
      )}
    >
      {children}
    </div>
  );
}

export default function LandingTemplateRenderer({ content, templateId, brand, theme = "dark" }: Props) {
  const brandName = brand?.brandName || "";
  const tagline = brand?.tagline || "";
  const primary = brand?.colors?.primary || "#4F46E5";
  const accent = brand?.colors?.accent || "#22C55E";

  const c = content;

  // Shell/panel
  const shell = cx(
    "relative overflow-hidden rounded-2xl border p-6 backdrop-blur",
    theme === "dark"
      ? "border-white/10 bg-white/5"
      : // Light: soft off-white with subtle tint, not grey slab
        "border-slate-200/70 bg-white/60"
  );

  // Light theme background accents inside preview (subtle, premium)
  const lightSheen =
    theme === "light" ? "pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_18%_0%,rgba(99,102,241,0.12),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(34,197,94,0.10),transparent_40%),linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.85))]" : "";
  const darkSheen =
    theme === "dark"
      ? "pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_18%_0%,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(249,115,22,0.12),transparent_45%)]"
      : "";

  const subtleText = theme === "dark" ? "text-white/70" : "text-slate-600";
  const faintText = theme === "dark" ? "text-white/50" : "text-slate-500";

  // Buttons
  const ghostBtn = cx(
    "rounded-lg px-5 py-2 text-sm font-semibold border transition inline-flex items-center justify-center",
    theme === "dark"
      ? "text-white/90 border-white/15 bg-black/20 hover:bg-white/5"
      : // Light: tinted ghost button (less harsh)
        "text-slate-900 border-slate-200/80 bg-white/70 hover:bg-white"
  );

  const primaryBtn = cx(
    "rounded-lg px-5 py-2 text-sm font-semibold text-white inline-flex items-center justify-center transition",
    theme === "dark" ? "" : "shadow-[0_10px_22px_rgba(79,70,229,0.18)]"
  );

  const featureCard = cx(
    "rounded-xl border p-4 transition",
    theme === "dark"
      ? "border-white/10 bg-black/20 hover:bg-white/5"
      : "border-slate-200/70 bg-white/70 backdrop-blur hover:bg-white shadow-[0_1px_0_rgba(15,23,42,0.03),0_10px_24px_rgba(15,23,42,0.06)]"
  );

  const quoteCard = cx(
    "rounded-lg border p-4",
    theme === "dark"
      ? "border-white/10 bg-white/5"
      : "border-slate-200/70 bg-white/75 backdrop-blur shadow-[0_1px_0_rgba(15,23,42,0.03)]"
  );

  const bottomPanel = cx(
    "mt-8 rounded-xl border p-5",
    theme === "dark"
      ? "border-white/10 bg-black/20"
      : "border-slate-200/70 bg-white/70 backdrop-blur shadow-[0_1px_0_rgba(15,23,42,0.03),0_18px_40px_rgba(15,23,42,0.08)]"
  );

  const headlineClass = cx("text-4xl font-bold", theme === "dark" ? "text-white" : "text-slate-900");
  const sectionWrap = "mt-8 grid gap-5 md:grid-cols-2";

  if (templateId === "templateB") {
    // Story-driven
    return (
      <div className={shell}>
        <div className={lightSheen} />
        <div className={darkSheen} />

        <div className="relative flex flex-col gap-2">
          {brandName ? <div className={cx("text-sm", faintText)}>{brandName}</div> : null}
          <h1 className={headlineClass}>{c.hero.headline}</h1>
          <p className={subtleText}>{c.hero.subheadline}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className={primaryBtn} style={{ backgroundColor: primary }}>
              {c.hero.primaryCta}
            </button>
            <button type="button" className={ghostBtn}>
              {c.hero.secondaryCta}
            </button>
          </div>

          <div className={cx("mt-3 text-xs", faintText)}>{c.hero.trustLine}</div>
          {tagline ? <div className={cx("mt-2 text-sm italic", faintText)}>{tagline}</div> : null}
        </div>

        <div className={cx("relative", sectionWrap)}>
          <Card theme={theme}>
            <SectionTitle theme={theme}>{c.problem.title}</SectionTitle>
            <ul className={cx("mt-3 list-disc pl-6 space-y-2", subtleText)}>
              {c.problem.bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </Card>

          <Card theme={theme}>
            <SectionTitle theme={theme}>{c.solution.title}</SectionTitle>
            <p className={cx("mt-3", subtleText)}>{c.solution.paragraph}</p>
          </Card>
        </div>

        <div className="relative mt-8">
          <SectionTitle theme={theme}>{c.features.title}</SectionTitle>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {c.features.items.map((it, idx) => (
              <div key={idx} className={featureCard}>
                <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>{it.title}</div>
                <div className={cx("mt-2 text-sm", subtleText)}>{it.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={cx("relative", sectionWrap)}>
          <Card theme={theme}>
            <SectionTitle theme={theme}>{c.socialProof.title}</SectionTitle>
            <div className="mt-4 space-y-3">
              {c.socialProof.testimonials.map((t, idx) => (
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
              {c.faq.items.map((f, idx) => (
                <div key={idx}>
                  <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>{f.q}</div>
                  <div className={cx("mt-1 text-sm", subtleText)}>{f.a}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className={cx("relative", bottomPanel)}>
          <div className={cx("text-2xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>{c.finalCta.title}</div>
          <div className={cx("mt-2", subtleText)}>{c.finalCta.paragraph}</div>
          <button
            type="button"
            className={cx("mt-4 rounded-lg px-6 py-2 text-sm font-semibold text-white inline-flex items-center justify-center", theme === "light" ? "shadow-[0_10px_22px_rgba(34,197,94,0.18)]" : "")}
            style={{ backgroundColor: accent }}
          >
            {c.finalCta.cta}
          </button>
        </div>
      </div>
    );
  }

  if (templateId === "templateC") {
    // Offer-focused
    return (
      <div className={shell}>
        <div className={lightSheen} />
        <div className={darkSheen} />

        <div className={cx("relative rounded-xl border p-6", theme === "dark" ? "border-white/10 bg-black/20" : "border-slate-200/70 bg-white/70 backdrop-blur shadow-[0_12px_28px_rgba(15,23,42,0.08)]")}>
          <div className={cx("text-xs uppercase tracking-wide", faintText)}>Offer</div>
          <h1 className={headlineClass}>{c.hero.headline}</h1>
          <p className={cx("mt-2", subtleText)}>{c.hero.subheadline}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className={cx("rounded-lg px-6 py-2 text-sm font-semibold text-white inline-flex items-center justify-center", theme === "light" ? "shadow-[0_10px_22px_rgba(34,197,94,0.18)]" : "")}
              style={{ backgroundColor: accent }}
            >
              {c.hero.primaryCta}
            </button>
            <button type="button" className={ghostBtn}>
              {c.hero.secondaryCta}
            </button>
          </div>

          <div className={cx("mt-3 text-xs", faintText)}>{c.hero.trustLine}</div>
        </div>

        <div className={cx("relative", sectionWrap)}>
          <Card theme={theme}>
            <SectionTitle theme={theme}>{c.features.title}</SectionTitle>
            <div className="mt-4 space-y-3">
              {c.features.items.map((it, idx) => (
                <div key={idx} className={quoteCard}>
                  <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>{it.title}</div>
                  <div className={cx("mt-1 text-sm", subtleText)}>{it.description}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card theme={theme}>
            <SectionTitle theme={theme}>{c.steps.title}</SectionTitle>
            <div className="mt-4 space-y-3">
              {c.steps.items.map((s, idx) => (
                <div key={idx} className={quoteCard}>
                  <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>{s.title}</div>
                  <div className={cx("mt-1 text-sm", subtleText)}>{s.description}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className={cx("relative", sectionWrap)}>
          <Card theme={theme}>
            <SectionTitle theme={theme}>{c.problem.title}</SectionTitle>
            <ul className={cx("mt-3 list-disc pl-6 space-y-2", subtleText)}>
              {c.problem.bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </Card>

          <Card theme={theme}>
            <SectionTitle theme={theme}>{c.faq.title}</SectionTitle>
            <div className="mt-4 space-y-3">
              {c.faq.items.map((f, idx) => (
                <div key={idx}>
                  <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>{f.q}</div>
                  <div className={cx("mt-1 text-sm", subtleText)}>{f.a}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className={cx("relative mt-8 rounded-xl border p-6", theme === "dark" ? "border-white/10 bg-black/20" : "border-slate-200/70 bg-white/70 backdrop-blur shadow-[0_18px_40px_rgba(15,23,42,0.10)]")}>
          <div className={cx("text-2xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>{c.finalCta.title}</div>
          <p className={cx("mt-2", subtleText)}>{c.finalCta.paragraph}</p>
          <button type="button" className={cx("mt-4 rounded-lg px-6 py-2 text-sm font-semibold text-white inline-flex items-center justify-center", theme === "light" ? "shadow-[0_10px_22px_rgba(79,70,229,0.18)]" : "")} style={{ backgroundColor: primary }}>
            {c.finalCta.cta}
          </button>
        </div>
      </div>
    );
  }

  // templateA = clean SaaS
  return (
    <div className={shell}>
      <div className={lightSheen} />
      <div className={darkSheen} />

      <div className="relative flex flex-col gap-2">
        {brandName ? <div className={cx("text-sm", faintText)}>{brandName}</div> : null}
        <h1 className={headlineClass}>{c.hero.headline}</h1>
        <p className={subtleText}>{c.hero.subheadline}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className={primaryBtn} style={{ backgroundColor: primary }}>
            {c.hero.primaryCta}
          </button>
          <button type="button" className={ghostBtn}>
            {c.hero.secondaryCta}
          </button>
        </div>

        <div className={cx("mt-3 text-xs", faintText)}>{c.hero.trustLine}</div>
        {tagline ? <div className={cx("mt-2 text-sm italic", faintText)}>{tagline}</div> : null}
      </div>

      <div className="relative mt-8 grid gap-4 md:grid-cols-3">
        {c.features.items.map((it, idx) => (
          <div key={idx} className={featureCard}>
            <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>{it.title}</div>
            <div className={cx("mt-2 text-sm", subtleText)}>{it.description}</div>
          </div>
        ))}
      </div>

      <div className={cx("relative", sectionWrap)}>
        <Card theme={theme}>
          <SectionTitle theme={theme}>{c.steps.title}</SectionTitle>
          <div className="mt-4 space-y-3">
            {c.steps.items.map((s, idx) => (
              <div key={idx} className={quoteCard}>
                <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>{s.title}</div>
                <div className={cx("mt-1 text-sm", subtleText)}>{s.description}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card theme={theme}>
          <SectionTitle theme={theme}>{c.faq.title}</SectionTitle>
          <div className="mt-4 space-y-3">
            {c.faq.items.map((f, idx) => (
              <div key={idx}>
                <div className={cx("font-semibold", theme === "dark" ? "text-white" : "text-slate-900")}>{f.q}</div>
                <div className={cx("mt-1 text-sm", subtleText)}>{f.a}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className={cx("relative mt-8 rounded-xl border p-6", theme === "dark" ? "border-white/10 bg-black/20" : "border-slate-200/70 bg-white/70 backdrop-blur shadow-[0_18px_40px_rgba(15,23,42,0.10)]")}>
        <div className={cx("text-2xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>{c.finalCta.title}</div>
        <p className={cx("mt-2", subtleText)}>{c.finalCta.paragraph}</p>
        <button
          type="button"
          className={cx(
            "mt-4 rounded-lg px-6 py-2 text-sm font-semibold text-white inline-flex items-center justify-center",
            theme === "light" ? "shadow-[0_10px_22px_rgba(34,197,94,0.18)]" : ""
          )}
          style={{ backgroundColor: accent }}
        >
          {c.finalCta.cta}
        </button>
      </div>
    </div>
  );
}
