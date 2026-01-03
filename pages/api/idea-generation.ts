import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { FounderProfile } from "../../types/business";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function normalizeRecommendation(value: any): "proceed" | "caution" | "no-go" {
  const v = String(value ?? "").trim().toLowerCase();

  if (v === "proceed") return "proceed";
  if (v === "caution") return "caution";

  // accept common variants from models/users
  if (v === "no-go" || v === "nogo" || v === "no_go" || v === "no go" || v === "no") {
    return "no-go";
  }

  return "caution";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error:
        "OPENAI_API_KEY missing on server. Add it to .env and restart the dev server.",
    });
  }

  try {
    const founder = req.body as FounderProfile;

    if (!founder) {
      return res.status(400).json({ error: "Founder profile missing." });
    }

    const prompt = `
You are a senior startup strategist.

Given the following founder profile, generate 3-5 business ideas suitable for a solo founder. 

Founder Profile:
${JSON.stringify(founder, null, 2)}

Requirements:
- Each idea must include:
  - name
  - one-line description
  - rationale for why it fits this founder
  - suggested customer persona
  - suggested pricing model
  - demand score (0-100)
  - competition score (0-100)
  - saturation score (0-100)
  - profitability score (0-100)
  - difficulty score (0-100)
  - entry barrier score (0-100)
  - fit score (0-100)
  - viability recommendation ("proceed", "caution", "no-go")
- Output JSON array only, matching the following structure:
[
  {
    "name": "",
    "description": "",
    "rationale": "",
    "customerPersona": "",
    "pricingModel": "",
    "market": {
      "demand": 0,
      "competition": 0,
      "saturation": 0
    },
    "feasibility": {
      "profitability": 0,
      "difficulty": 0,
      "entryBarriers": 0
    },
    "fitScore": 0,
    "viabilityScore": 0,
    "recommendation": ""
  }
]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return ONLY valid JSON. No markdown." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const text = response.choices[0]?.message?.content || "[]";

    try {
      const ideasRaw = JSON.parse(text);

      if (!Array.isArray(ideasRaw)) {
        return res.status(200).json([]);
      }

      // Normalize fields so the rest of your app is stable
      const normalized = ideasRaw.map((idea: any) => ({
        ...idea,
        recommendation: normalizeRecommendation(idea?.recommendation),
      }));

      return res.status(200).json(normalized);
    } catch {
      return res.status(200).json([]);
    }
  } catch (err: any) {
    return res.status(500).json({
      error: "Idea generation failed.",
      details: err?.message ?? String(err),
    });
  }
}
