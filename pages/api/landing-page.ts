// pages/api/landing-page.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { FounderProfile } from "../../types/business";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Body = {
  founder: FounderProfile;
  businessName: string;
  location: string;

  // Optional (helps quality)
  brandName?: string;
  tagline?: string;
  colors?: { primary?: string; secondary?: string; accent?: string };
  typography?: { heading?: string; body?: string };
  logoPrompt?: string;

  templateId?: "templateA" | "templateB" | "templateC";

  // new
  theme?: "dark" | "light";
};

function safeJsonParse(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = (req.body || {}) as Body;

    const founder = body.founder;
    const businessName = String(body.businessName || "").trim();
    const location = String(body.location || "").trim();
    const templateId = (body.templateId || "templateA") as "templateA" | "templateB" | "templateC";
    const theme = (body.theme === "light" ? "light" : "dark") as "light" | "dark";

    if (!founder || !businessName || !location) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const brandName = String(body.brandName || businessName).trim();
    const tagline = String(body.tagline || "").trim();

    const primary = String(body.colors?.primary || "#4F46E5");
    const secondary = String(body.colors?.secondary || "#111827");
    const accent = String(body.colors?.accent || "#22C55E");

    const headingFont = String(body.typography?.heading || "Inter");
    const bodyFont = String(body.typography?.body || "Inter");

    const founderSkills = Array.isArray((founder as any).skills) ? (founder as any).skills.join(", ") : "";
    const founderGoals = String((founder as any).goals || "");

    const prompt = `
You are an expert conversion copywriter and landing page strategist.

Create a HIGH-CONVERTING landing page content pack for this business.

BUSINESS:
- Business name: ${businessName}
- Brand name: ${brandName}
- Location: ${location}
- Tagline: ${tagline || "(none provided)"}

VISUAL THEME PREFERENCE:
- Theme: ${theme}
Write copy that matches the ${theme} aesthetic (clean, modern, professional), but do NOT include CSS or code.

BRAND STYLE (optional guidance):
- Primary color: ${primary}
- Secondary color: ${secondary}
- Accent color: ${accent}
- Heading font: ${headingFont}
- Body font: ${bodyFont}

FOUNDER CONTEXT:
- Skills: ${founderSkills}
- Experience level: ${(founder as any).experienceLevel || ""}
- Budget: ${(founder as any).budget || ""}
- Time per week: ${(founder as any).timePerWeek || ""}
- Risk tolerance: ${(founder as any).riskTolerance || ""}
- Goals: ${founderGoals}

TEMPLATE CHOICE (for tone and structure):
- templateId: ${templateId}
Where:
- templateA = clean SaaS hero + feature grid + FAQ
- templateB = bold story-driven page + problem/solution + testimonials
- templateC = offer-focused page + steps + guarantee + strong CTA

Return ONLY valid JSON with EXACTLY this shape:

{
  "templateId": "templateA" | "templateB" | "templateC",
  "meta": {
    "pageTitle": string,
    "seoDescription": string
  },
  "hero": {
    "headline": string,
    "subheadline": string,
    "primaryCta": string,
    "secondaryCta": string,
    "trustLine": string
  },
  "problem": {
    "title": string,
    "bullets": string[]
  },
  "solution": {
    "title": string,
    "paragraph": string
  },
  "features": {
    "title": string,
    "items": { "title": string, "description": string }[]
  },
  "steps": {
    "title": string,
    "items": { "title": string, "description": string }[]
  },
  "socialProof": {
    "title": string,
    "testimonials": { "name": string, "role": string, "quote": string }[]
  },
  "faq": {
    "title": string,
    "items": { "q": string, "a": string }[]
  },
  "finalCta": {
    "title": string,
    "paragraph": string,
    "cta": string
  }
}

Rules:
- Make headlines benefit-driven, not generic.
- Keep it realistic for a new business: do not invent awards or fake credentials.
- Testimonials should be plausible and clearly generic (no real company names).
- Features: 4 to 6 items.
- Steps: 3 to 5 items.
- FAQ: 4 to 6 items.
- Use clear, professional, modern wording.
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return strictly valid JSON only. No markdown. No commentary." },
        { role: "user", content: prompt },
      ],
      temperature: 0.65,
      max_tokens: 1200,
    });

    const content = completion.choices?.[0]?.message?.content?.trim() || "";
    const parsed = safeJsonParse(content);

    if (!parsed) {
      return res.status(500).json({
        error: "AI response was not valid JSON.",
        raw: content.slice(0, 2000),
      });
    }

    // Minimal shape validation
    if (!parsed.hero || !parsed.features || !parsed.faq || !parsed.finalCta || !parsed.steps) {
      return res.status(500).json({
        error: "AI response missing required fields.",
        raw: parsed,
      });
    }

    return res.status(200).json(parsed);
  } catch (err: any) {
    const message = err?.message || "Landing page request failed.";
    return res.status(500).json({ error: message });
  }
}
