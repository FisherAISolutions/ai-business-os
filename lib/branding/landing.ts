// lib/branding/landing.ts
import type { FounderProfile } from "../../types/business";

export type LandingTemplateId = "templateA" | "templateB" | "templateC";
export type LandingTheme = "dark" | "light";

export type LandingContent = {
  templateId: LandingTemplateId;
  meta: {
    pageTitle: string;
    seoDescription: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    trustLine: string;
  };
  problem: {
    title: string;
    bullets: string[];
  };
  solution: {
    title: string;
    paragraph: string;
  };
  features: {
    title: string;
    items: { title: string; description: string }[];
  };
  steps: {
    title: string;
    items: { title: string; description: string }[];
  };
  socialProof: {
    title: string;
    testimonials: { name: string; role: string; quote: string }[];
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
  finalCta: {
    title: string;
    paragraph: string;
    cta: string;
  };
};

export async function generateLandingPage(input: {
  founder: FounderProfile;
  businessName: string;
  location: string;

  // optional brand guidance
  brandName?: string;
  tagline?: string;
  colors?: { primary?: string; secondary?: string; accent?: string };
  typography?: { heading?: string; body?: string };
  logoPrompt?: string;

  templateId: LandingTemplateId;

  // new
  theme?: LandingTheme;
}): Promise<LandingContent> {
  const res = await fetch("/api/landing-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Landing page generation failed.");
  }

  return (await res.json()) as LandingContent;
}
