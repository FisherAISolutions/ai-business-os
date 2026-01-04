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
    "ctaText": string
  }
}

Rules:
- Use hex colors like "#111827" when possible, but any valid CSS color is acceptable.
- Make the landing page headline benefit-driven.
- Features should be 4-6 bullets max.
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return strictly valid JSON only. No markdown, no commentary." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 900,
    });

    const content = completion.choices?.[0]?.message?.content?.trim() || "";
    const parsed = safeJsonParse(content);

    if (!parsed) {
      return res.status(500).json({
        error: "AI response was not valid JSON.",
        raw: content.slice(0, 2000),
      });
    }

    if (!parsed.brandName || !parsed.tagline || !parsed.colors || !parsed.typography || !parsed.landingPage) {
      return res.status(500).json({
        error: "AI response missing required fields.",
        raw: parsed,
      });
    }

    return res.status(200).json(parsed as BrandingOutput);
  } catch (err: any) {
    const message = err?.message || "Branding request failed.";
    return res.status(500).json({ error: message });
  }
}
