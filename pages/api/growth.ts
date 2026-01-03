import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { FounderProfile } from "../../types/business";

type GrowthInput = {
  businessName: string;
  founderProfile: FounderProfile;
  marketingData?: any;
  trafficData?: {
    visits?: number;
    conversions?: number;
    bounceRate?: number;
    [key: string]: any;
  };
};

type GrowthOutput = {
  summary: string;
  northStarMetric: { name: string; definition: string; targetNext30Days: string };
  funnel: {
    awareness: string[];
    activation: string[];
    revenue: string[];
    retention: string[];
    referral: string[];
  };
  experiments: {
    title: string;
    hypothesis: string;
    steps: string[];
    successMetric: string;
    expectedImpact: "low" | "medium" | "high";
    effort: "low" | "medium" | "high";
    priorityScore: number;
  }[];
  automation: {
    quickWins: string[];
    toolsStack: { tool: string; purpose: string }[];
  };
  risks: string[];
  nextSteps: string[];
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeFallback(input: GrowthInput): GrowthOutput {
  const biz = input.businessName || "Your Business";
  return {
    summary:
      `Here’s a practical 30-day growth plan for ${biz}. This is a fallback response (AI returned invalid JSON).`,
    northStarMetric: {
      name: "Qualified Leads / Week",
      definition: "Number of leads that match your ICP and book a call / request a quote.",
      targetNext30Days: "Increase by 25–50%",
    },
    funnel: {
      awareness: [
        "Publish 3–5 niche posts targeting high-intent keywords",
        "Post 3 short-form clips/week repurposed from the posts",
        "Engage daily in 2–3 communities where your buyers hang out",
      ],
      activation: [
        "Add a single CTA above the fold",
        "Offer a fast audit / assessment as lead magnet",
        "Create a 2-step intake form (name/email → 3 qualifying questions)",
      ],
      revenue: [
        "Create 2-tier offer (starter + pro)",
        "Add scarcity/urgency (limited spots/month)",
        "Implement a short discovery script + close checklist",
      ],
      retention: [
        "Monthly reporting + clear KPIs",
        "Automated check-ins and next actions",
        "Upsell add-on services after week 2",
      ],
      referral: [
        "Referral incentive (cash or service credit)",
        "Ask after first clear win",
        "Template email for referrals",
      ],
    },
    experiments: [
      {
        title: "High-intent landing page A/B",
        hypothesis: "A clearer value prop + proof will increase conversions.",
        steps: ["Create variant B with clearer headline", "Add 2 testimonials", "Run for 7 days"],
        successMetric: "Conversion rate",
        expectedImpact: "high",
        effort: "medium",
        priorityScore: 85,
      },
      {
        title: "Cold outreach micro-campaign",
        hypothesis: "A hyper-specific offer will book more calls than generic outreach.",
        steps: ["Build list of 50 ICP leads", "Send 2-step sequence", "Track replies/booked calls"],
        successMetric: "Booked calls / 50 leads",
        expectedImpact: "medium",
        effort: "medium",
        priorityScore: 70,
      },
    ],
    automation: {
      quickWins: [
        "Auto-tag leads by source",
        "Auto-send intake form after inquiry",
        "Auto-generate weekly KPI email",
      ],
      toolsStack: [
        { tool: "Google Analytics", purpose: "Traffic + behavior tracking" },
        { tool: "Notion/Airtable", purpose: "Pipeline + experiment tracking" },
        { tool: "Zapier/Make", purpose: "Automations" },
      ],
    },
    risks: [
      "Trying too many channels at once",
      "Unclear offer positioning",
      "No consistent content cadence",
    ],
    nextSteps: [
      "Pick 1 acquisition channel for the next 14 days",
      "Finalize your offer tiers + pricing",
      "Implement tracking for conversions and leads",
    ],
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error:
        "OPENAI_API_KEY is missing on the server. Ensure it exists in .env and restart `npm run dev`.",
    });
  }

  try {
    const input = req.body as GrowthInput;

    if (!input?.businessName || !input?.founderProfile) {
      return res.status(400).json({ error: "Missing required fields: businessName, founderProfile" });
    }

    const prompt = `
You are a world-class growth strategist + analytics operator.

Create a 30-day continuous growth & automation plan for this business.

Business name: ${input.businessName}
Founder profile: ${JSON.stringify(input.founderProfile, null, 2)}
Marketing data (may be empty): ${JSON.stringify(input.marketingData ?? {}, null, 2)}
Traffic data (may be empty): ${JSON.stringify(input.trafficData ?? {}, null, 2)}

Return STRICT JSON ONLY matching this schema:
{
  "summary": "string",
  "northStarMetric": { "name":"string", "definition":"string", "targetNext30Days":"string" },
  "funnel": {
    "awareness": ["string"],
    "activation": ["string"],
    "revenue": ["string"],
    "retention": ["string"],
    "referral": ["string"]
  },
  "experiments": [
    {
      "title":"string",
      "hypothesis":"string",
      "steps":["string"],
      "successMetric":"string",
      "expectedImpact":"low|medium|high",
      "effort":"low|medium|high",
      "priorityScore": 0
    }
  ],
  "automation": {
    "quickWins": ["string"],
    "toolsStack": [{ "tool":"string", "purpose":"string" }]
  },
  "risks": ["string"],
  "nextSteps": ["string"]
}

Rules:
- Make it actionable for a solo founder.
- 5–10 experiments, each with clear steps and metrics.
- Priority score: 1–100 (higher = do first).
- Keep it premium, specific, non-fluffy.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return only valid JSON. No markdown. No extra text." },
        { role: "user", content: prompt },
      ],
      temperature: 0.35,
    });

    const text = completion.choices[0]?.message?.content ?? "{}";

    try {
      const parsed = JSON.parse(text) as GrowthOutput;
      return res.status(200).json(parsed);
    } catch {
      return res.status(200).json(safeFallback(input));
    }
  } catch (err: any) {
    return res.status(500).json({
      error: "Failed to generate growth plan.",
      details: err?.message ?? String(err),
    });
  }
}
