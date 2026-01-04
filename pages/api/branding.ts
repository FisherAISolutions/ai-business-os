// pages/api/branding.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { FounderProfile, BrandingOutput } from "../../types/business";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Body = {
  founder: FounderProfile;
  businessName: string;
  location: string;
};

function safeJsonParse(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isNonEmptyString(v: any) {
  return typeof v === "string" && v.trim().length > 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = (req.body || {}) as Body;
    const founder = body.founder;
    const businessName = String(body.businessName || "").trim();
    const location = String(body.location || "").trim();

    if (!founder || !businessName || !location) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const prompt = `
You are an expert brand strategist and conversion copywriter.

Create a BRANDING PACKAGE + LANDING PAGE COPY for this business.
Your output will be used inside a professional SaaS app.

BUSINESS NAME: ${businessName}
LOCATION: ${location}

FOUNDER PROFILE (context):
- skills: ${Array.isArray(founder.skills) ? founder.skills.join(", ") : ""}
- experienceLevel: ${founder.experienceLevel}
- budget: ${founder.budget}
- timePerWeek: ${founder.timePerWeek}
- riskTolerance: ${founder.riskTolerance}
- goals: ${founder.goals}

Return ONLY valid JSON with EXACTLY this shape:

{
  "brandName": string,
  "tagline": string,
  "colors": { "primary": string, "secondary": string, "accent": string },
  "typography": { "heading": string, "body": string },
  "logoPrompt": string,
  "landingPage": {
    "headline": string,
    "subheadline": string,
    "features": string[],
    "ctaText": string,
    "ctaUrl"?: string
  },
  "seo": {
    "title": string,
    "description": string,
    "keywords": string[]
  }
}

Rules:
- Use hex colors like "#111827" when possible, but any valid CSS color is acceptable.
- Make the landing page headline benefit-driven and specific. Avoid generic buzzwords.
- Features should be 4–6 bullets max, written as outcomes and value (not vague).
- CTA text should be action-oriented and clear (e.g., "Get a Free Audit", "Book a Call", "Start Your Trial").
- If you include ctaUrl, use a safe placeholder like "/contact" or "/get-started" (do NOT invent real domains).
- SEO title should be 50–60 characters-ish, include the primary keyword and location when relevant.
- SEO description should be 140–160 characters-ish, benefit-driven, no hype.
- SEO keywords should be 8–14 short keyword phrases (strings).
- Keep tone professional and realistic for a new business (no fake awards or guarantees).
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return strictly valid JSON only. No markdown, no commentary." },
        { role: "user", content: prompt },
      ],
      temperature: 0.65,
      max_tokens: 1100,
    });

    const content = completion.choices?.[0]?.message?.content?.trim() || "";
    const parsed = safeJsonParse(content);

    if (!parsed) {
      return res.status(500).json({
        error: "AI response was not valid JSON.",
        raw: content.slice(0, 2000),
      });
    }

    // Validate required top-level fields
    if (
      !isNonEmptyString(parsed.brandName) ||
      !isNonEmptyString(parsed.tagline) ||
      !parsed.colors ||
      !parsed.typography ||
      !isNonEmptyString(parsed.logoPrompt) ||
      !parsed.landingPage ||
      !parsed.seo
    ) {
      return res.status(500).json({
        error: "AI response missing required fields.",
        raw: parsed,
      });
    }

    // Validate colors
    if (
      !isNonEmptyString(parsed.colors.primary) ||
      !isNonEmptyString(parsed.colors.secondary) ||
      !isNonEmptyString(parsed.colors.accent)
    ) {
      return res.status(500).json({
        error: "AI response missing required color fields.",
        raw: parsed,
      });
    }

    // Validate typography
    if (!isNonEmptyString(parsed.typography.heading) || !isNonEmptyString(parsed.typography.body)) {
      return res.status(500).json({
        error: "AI response missing typography fields.",
        raw: parsed,
      });
    }

    // Validate landing page
    if (
      !isNonEmptyString(parsed.landingPage.headline) ||
      !isNonEmptyString(parsed.landingPage.subheadline) ||
      !Array.isArray(parsed.landingPage.features) ||
      parsed.landingPage.features.length < 3 ||
      !isNonEmptyString(parsed.landingPage.ctaText)
    ) {
      return res.status(500).json({
        error: "AI response missing landing page fields.",
        raw: parsed,
      });
    }

    // Validate SEO
    if (
      !isNonEmptyString(parsed.seo.title) ||
      !isNonEmptyString(parsed.seo.description) ||
      !Array.isArray(parsed.seo.keywords) ||
      parsed.seo.keywords.length < 5
    ) {
      return res.status(500).json({
        error: "AI response missing SEO fields.",
        raw: parsed,
      });
    }

    // Normalize optional ctaUrl
    if (parsed.landingPage.ctaUrl && typeof parsed.landingPage.ctaUrl !== "string") {
      delete parsed.landingPage.ctaUrl;
    }

    return res.status(200).json(parsed as BrandingOutput);
  } catch (err: any) {
    const message = err?.message || "Branding request failed.";
    return res.status(500).json({ error: message });
  }
}
