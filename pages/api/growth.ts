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
  kpiDashboard: {
    traffic: string;
    conversionRate: number;
    bounceRate: number;
    emailOpenRate?: number;
    socialEngagementRate?: number;
  };
  growthRecommendations: string[];
  experiments: {
    title: string;
    steps: string[];
    metricsToTrack: string[];
    priorityScore: number;
  }[];
  automation: {
    quickWins: string[];
    toolsStack: { tool: string; purpose: string }[];
  };
  updatedLandingPage: {
    headline: string;
    subheadline: string;
    features: string[];
    ctaText: string;
  };
  risks: string[];
  nextSteps: string[];
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeFallback(input: GrowthInput): GrowthOutput {
  const biz = input.businessName || "Your Business";
  return {
    summary: `Here’s a practical 30-day growth plan for ${biz}. This is a fallback response (AI returned invalid or incomplete JSON).`,
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
        "Add a strong lead magnet to the landing page",
        "Create a 2-step intake form to qualify leads",
        "Offer a low-friction audit/assessment as the first offer",
      ],
      revenue: [
        "Introduce 3 clear pricing tiers",
        "Add proof (case studies, testimonials, before/after) above the fold",
        "Add urgency with limited slots or time-bound offer",
      ],
      retention: [
        "Weekly performance updates to customers",
        "Monthly strategy calls for premium tier",
        "Create a simple onboarding checklist and success milestones",
      ],
      referral: [
        "Ask for referrals after first measurable result",
        "Offer a referral discount or bonus",
        "Create a simple referral link + email template",
      ],
    },
    kpiDashboard: {
      traffic: "Increase sessions by 20–40%",
      conversionRate: 2.5,
      bounceRate: 55,
      emailOpenRate: 35,
      socialEngagementRate: 4,
    },
    growthRecommendations: [
      "Tighten your ICP and rewrite the headline to target 1 buyer type",
      "Add a lead magnet + automated email follow-up",
      "Run 2 weekly experiments: one conversion, one acquisition",
      "Track 3 KPIs daily: sessions, leads, conversion rate",
    ],
    experiments: [
      {
        title: "Landing Page Offer Test",
        steps: [
          "Create 2 headline variants focused on different outcomes",
          "Run traffic to both versions (even small budget)",
          "Measure lead conversion rate after 300+ visits or 7 days",
        ],
        metricsToTrack: ["conversion rate", "bounce rate", "time on page"],
        priorityScore: 85,
      },
      {
        title: "Local Outreach Sprint",
        steps: [
          "Build a list of 50 local prospects",
          "Send personalized outreach with a clear offer",
          "Follow up 2 times over 7 days",
        ],
        metricsToTrack: ["reply rate", "booked calls", "close rate"],
        priorityScore: 78,
      },
    ],
    automation: {
      quickWins: [
        "Auto-send intake form after inquiry",
        "Auto-generate weekly KPI email",
        "Auto-follow-up on abandoned lead form",
      ],
      toolsStack: [
        { tool: "Google Analytics", purpose: "Traffic + behavior tracking" },
        { tool: "Notion/Airtable", purpose: "Pipeline + experiment tracking" },
        { tool: "Zapier/Make", purpose: "Automations" },
      ],
    },
    updatedLandingPage: {
      headline: `Get More Customers for ${biz} — In 30 Days`,
      subheadline: "A simple, proven growth system: attract the right traffic, convert more leads, and automate follow-up.",
      features: [
        "High-intent traffic strategy",
        "Conversion-focused landing page",
        "Automated follow-up sequences",
        "Weekly KPI tracking + iteration",
      ],
      ctaText: "Get My Growth Plan",
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

function isValidGrowthOutput(value: any): value is GrowthOutput {
  if (!value || typeof value !== "object") return false;

  const kpi = (value as any).kpiDashboard;
  if (!kpi || typeof kpi !== "object") return false;
  if (typeof kpi.traffic !== "string" || typeof kpi.conversionRate !== "number" || typeof kpi.bounceRate !== "number") {
    return false;
  }

  if (!Array.isArray((value as any).growthRecommendations)) return false;
  if (!Array.isArray((value as any).experiments)) return false;

  const updatedLP = (value as any).updatedLandingPage;
  if (!updatedLP || typeof updatedLP !== "object") return false;
  if (typeof updatedLP.headline !== "string" || typeof updatedLP.subheadline !== "string" || typeof updatedLP.ctaText !== "string") {
    return false;
  }
  if (!Array.isArray(updatedLP.features)) return false;

  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const input = (req.body || {}) as GrowthInput;

    if (!input.businessName || !input.founderProfile) {
      return res.status(400).json({ error: "Missing required fields." });
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
  "kpiDashboard": {
    "traffic":"string",
    "conversionRate": number,
    "bounceRate": number,
    "emailOpenRate": number,
    "socialEngagementRate": number
  },
  "growthRecommendations": ["string"],
  "experiments": [
    {
      "title":"string",
      "steps":["string"],
      "metricsToTrack":["string"],
      "priorityScore": number
    }
  ],
  "automation": {
    "quickWins": ["string"],
    "toolsStack": [{ "tool":"string", "purpose":"string" }]
  },
  "updatedLandingPage": {
    "headline":"string",
    "subheadline":"string",
    "features":["string"],
    "ctaText":"string"
  },
  "risks": ["string"],
  "nextSteps": ["string"]
}

Rules:
- Make it actionable for a solo founder.
- 5–10 experiments, each with clear steps and metrics.
- Priority score: 1–100 (higher = do first).
- Keep it premium, specific, non-fluffy.
`.trim();

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

      // If the model returns valid JSON but the shape is wrong/missing required fields,
      // fall back to a safe, complete response so the UI never crashes.
      if (!isValidGrowthOutput(parsed)) {
        return res.status(200).json(safeFallback(input));
      }

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
