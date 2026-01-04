// components/LandingTemplateRenderer.tsx
import React from "react";
import type { LandingContent, LandingTemplateId } from "../lib/branding/landing";

type Props = {
  content: LandingContent;
  templateId: LandingTemplateId;
  brand?: {
    brandName?: string;
    tagline?: string;
    colors?: { primary?: string; secondary?: string; accent?: string };
  };
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-white">{children}</h2>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-white/10 bg-white/5 p-5">{children}</div>;
}

export default function LandingTemplateRenderer({ content, templateId, brand }: Props) {
  const brandName = brand?.brandName || "";
  const tagline = brand?.tagline || "";
  const primary = brand?.colors?.primary || "#4F46E5";
  const accent = brand?.colors?.accent || "#22C55E";

  const c = content;

  if (templateId === "templateB") {
    // Story-driven
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-col gap-2">
          {brandName ? <div className="text-sm text-white/60">{brandName}</div> : null}
          <h1 className="text-4xl font-bold text-white">{c.hero.headline}</h1>
          <p className="text-white/70">{c.hero.subheadline}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg px-5 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: primary }}
            >
              {c.hero.primaryCta}
            </button>
            <button
              type="button"
              className="rounded-lg px-5 py-2 text-sm font-semibold text-white/90 border border-white/15 bg-black/20 hover:bg-white/5"
            >
              {c.hero.secondaryCta}
            </button>
          </div>

          <div className="mt-3 text-xs text-white/50">{c.hero.trustLine}</div>
          {tagline ? <div className="mt-2 text-sm text-white/50 italic">{tagline}</div> : null}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card>
            <SectionTitle>{c.problem.title}</SectionTitle>
            <ul className="mt-3 list-disc pl-6 text-white/70 space-y-2">
              {c.problem.bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionTitle>{c.solution.title}</SectionTitle>
            <p className="mt-3 text-white/70">{c.solution.paragraph}</p>
          </Card>
        </div>

        <div className="mt-8">
          <SectionTitle>{c.features.title}</SectionTitle>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {c.features.items.map((it, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="font-semibold text-white">{it.title}</div>
                <div className="mt-2 text-sm text-white/70">{it.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card>
            <SectionTitle>{c.socialProof.title}</SectionTitle>
            <div className="mt-4 space-y-3">
              {c.socialProof.testimonials.map((t, idx) => (
                <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-white/80">&ldquo;{t.quote}&rdquo;</div>
                  <div className="mt-2 text-xs text-white/50">
                    — {t.name}, {t.role}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle>{c.faq.title}</SectionTitle>
            <div className="mt-4 space-y-3">
              {c.faq.items.map((f, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-white">{f.q}</div>
                  <div className="mt-1 text-sm text-white/70">{f.a}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-5">
          <div className="text-2xl font-bold text-white">{c.finalCta.title}</div>
          <div className="mt-2 text-white/70">{c.finalCta.paragraph}</div>
          <button
            type="button"
            className="mt-4 rounded-lg px-6 py-2 text-sm font-semibold text-white"
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
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="rounded-xl border border-white/10 bg-black/20 p-6">
          <div className="text-xs uppercase tracking-wide text-white/50">Offer</div>
          <h1 className="mt-2 text-4xl font-bold text-white">{c.hero.headline}</h1>
          <p className="mt-2 text-white/70">{c.hero.subheadline}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg px-6 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: accent }}
            >
              {c.hero.primaryCta}
            </button>
            <button
              type="button"
              className="rounded-lg px-6 py-2 text-sm font-semibold text-white/90 border border-white/15 bg-black/20 hover:bg-white/5"
            >
              {c.hero.secondaryCta}
            </button>
          </div>

          <div className="mt-3 text-xs text-white/50">{c.hero.trustLine}</div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card>
            <SectionTitle>{c.features.title}</SectionTitle>
            <div className="mt-4 space-y-3">
              {c.features.items.map((it, idx) => (
                <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-white">{it.title}</div>
                  <div className="mt-1 text-sm text-white/70">{it.description}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle>{c.steps.title}</SectionTitle>
            <div className="mt-4 space-y-3">
              {c.steps.items.map((s, idx) => (
                <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-white">{s.title}</div>
                  <div className="mt-1 text-sm text-white/70">{s.description}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card>
            <SectionTitle>{c.problem.title}</SectionTitle>
            <ul className="mt-3 list-disc pl-6 text-white/70 space-y-2">
              {c.problem.bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionTitle>{c.faq.title}</SectionTitle>
            <div className="mt-4 space-y-3">
              {c.faq.items.map((f, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-white">{f.q}</div>
                  <div className="mt-1 text-sm text-white/70">{f.a}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-6">
          <div className="text-2xl font-bold text-white">{c.finalCta.title}</div>
          <p className="mt-2 text-white/70">{c.finalCta.paragraph}</p>
          <button
            type="button"
            className="mt-4 rounded-lg px-6 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            {c.finalCta.cta}
          </button>
        </div>
      </div>
    );
  }

  // templateA = clean SaaS
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-2">
        {brandName ? <div className="text-sm text-white/60">{brandName}</div> : null}
        <h1 className="text-4xl font-bold text-white">{c.hero.headline}</h1>
        <p className="text-white/70">{c.hero.subheadline}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg px-6 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            {c.hero.primaryCta}
          </button>
          <button
            type="button"
            className="rounded-lg px-6 py-2 text-sm font-semibold text-white/90 border border-white/15 bg-black/20 hover:bg-white/5"
          >
            {c.hero.secondaryCta}
          </button>
        </div>

        <div className="mt-3 text-xs text-white/50">{c.hero.trustLine}</div>
        {tagline ? <div className="mt-2 text-sm text-white/50 italic">{tagline}</div> : null}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {c.features.items.map((it, idx) => (
          <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="font-semibold text-white">{it.title}</div>
            <div className="mt-2 text-sm text-white/70">{it.description}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Card>
          <SectionTitle>{c.steps.title}</SectionTitle>
          <div className="mt-4 space-y-3">
            {c.steps.items.map((s, idx) => (
              <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="font-semibold text-white">{s.title}</div>
                <div className="mt-1 text-sm text-white/70">{s.description}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>{c.faq.title}</SectionTitle>
          <div className="mt-4 space-y-3">
            {c.faq.items.map((f, idx) => (
              <div key={idx}>
                <div className="font-semibold text-white">{f.q}</div>
                <div className="mt-1 text-sm text-white/70">{f.a}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-6">
        <div className="text-2xl font-bold text-white">{c.finalCta.title}</div>
        <p className="mt-2 text-white/70">{c.finalCta.paragraph}</p>
        <button
          type="button"
          className="mt-4 rounded-lg px-6 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: accent }}
        >
          {c.finalCta.cta}
        </button>
      </div>
    </div>
  );
}
