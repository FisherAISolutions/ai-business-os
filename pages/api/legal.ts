import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { FounderProfile } from "../../types/business";

type LegalSetupResponse = {
  recommendedStructure: string;
  checklist: { step: string; completed: boolean }[];
  templates: { name: string; link: string }[];
  notes: string;
};

type Body = {
  founder: FounderProfile;
  businessName: string;
  location: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY missing on server. Add it to .env and restart the dev server.",
    });
  }

  try {
    const body = req.body as Body;

    if (!body?.founder || !body?.businessName || !body?.location) {
      return res.status(400).json({
        error: "Missing required fields: founder, businessName, location",
      });
    }

    const prompt = `
You are a senior business setup consultant. You help solo founders set up their business legally and correctly.

Given:
- Founder profile
- Business name
- Location (country/state)

Generate:
1) Recommended business structure (LLC, Sole Prop, S-Corp, etc.) with 1-2 sentence reasoning
2) Step-by-step legal checklist for registration (practical, in order)
3) Templates/resources list (name + a suggested link if possible; otherwise empty string)
4) Notes & disclaimers (clear, helpful, non-scary)

Return STRICT JSON ONLY matching this schema:

{
  "recommendedStructure": "string",
  "checklist": [{"step": "string", "completed": false}],
  "templates": [{"name": "string", "link": "string"}],
  "notes": "string"
}

Founder Profile:
${JSON.stringify(body.founder, null, 2)}

Business Name: ${body.businessName}
Location: ${body.location}
`.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a legal/business setup advisor AI." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 1200,
    });

    const text = response.choices[0]?.message?.content ?? "{}";

    const parsed = safeJsonParse<LegalSetupResponse>(text, {
      recommendedStructure: "",
      checklist: [],
      templates: [],
      notes: "AI output could not be parsed. Please try again.",
    });

    return res.status(200).json(parsed);
  } catch (err: any) {
    return res.status(500).json({
      error: "Legal setup generation failed.",
      details: err?.message ?? String(err),
    });
  }
}
