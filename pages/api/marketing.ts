import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { FounderProfile, MarketingOutput } from "../../types/business";

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
You are a performance marketer and lifecycle marketer.

Generate a FIRST 14 DAYS marketing starter kit for this business.

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
  "aiEmails": { "subject": string, "body": string }[],
  "socialPosts": string[],
  "adCopy": string[],
  "metricsAnalysis": string,
  "growthRecommendations": string[],
  "contentCalendar": { "day": number, "content": string }[]
}

Rules:
- aiEmails: 3-5 sequences (welcome, value, offer, follow-up).
- socialPosts: 6-10 punchy posts.
- adCopy: 6-10 variations.
- metricsAnalysis: explain what to watch in the first 2 weeks.
- growthRecommendations: 6-10 bullets.
- contentCalendar: day 1-14 entries.
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return strictly valid JSON only. No markdown, no commentary." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
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

    if (!parsed.aiEmails || !parsed.socialPosts || !parsed.adCopy || !parsed.metricsAnalysis || !parsed.growthRecommendations) {
      return res.status(500).json({
        error: "AI response missing required fields.",
        raw: parsed,
      });
    }

    return res.status(200).json(parsed as MarketingOutput);
  } catch (err: any) {
    const message = err?.message || "Marketing request failed.";
    return res.status(500).json({ error: message });
  }
}
