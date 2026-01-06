import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { FounderProfile, ContinuousGrowthOutput } from "../../types/business";

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

type ExtendedGrowthOutput = ContinuousGrowthOutput & {
  // These are optional extras your UI may render if present.
  summary?: string;
  experiments?: {
    title: string;
    steps: string[];
    metricsToTrack?: string[];
    priorityScore?: number;
  }[];
  automation?: {
    quickWins: string[];
    toolsStack: { tool: string; purpose: string }[];
  };
  risks?: string[];
  nextSteps?: string[];
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeFallback(input: GrowthInput): ExtendedGrowthOutput {
  const biz = input.businessName || "Your Business";

  return {
    growthRecommendations: [
      "Pick one acquisition channel for the next 14 days and commit to a simple cadence.",
      "Clarify the offer: who it’s for, the outcome, and the fastest path to value.",
      "Add one primary conversion goal on your landing page and measure it weekly.",
    ],
    automatedEmails: [
      {
        subject: `Quick question about ${biz}`,
        body:
          `Hi {{name}},\n\nI noticed {{personalization}} and had a quick question:\n\nAre you currently looking to improve {{outcome}} over the next 30 days?\n\nIf yes, I can share a simple plan and a few quick wins.\n\nBest,\n{{your_name}}`,
      },
      {
        subject: `A simple 3-step plan for {{outcome}}`,
        body:
          `Hi {{name}},\n\nHere’s a simple plan you can run this month:\n\n1) Tighten your offer & landing page CTA\n2) Run one focused acquisition channel\n3) Track conversion rate weekly and iterate\n\nIf you want, reply with your website and I’ll point out the 2 highest-impact improvements.\n\n— {{your_name}}`,
      },
    ],
    automatedSocialPosts: [
      `Most businesses don’t need more ideas — they need a tighter offer + a single acquisition channel executed consistently for 30 days.`,
      `If your website isn’t converting, fix the headline, add proof, and make the CTA obvious. Everything else is secondary.`,
      `A simple growth rule: pick one metric, one channel, one weekly habit. Do it for a month. Then expand.`,
    ],
    updatedLandingPage: {
      headline: `A clearer path to results for ${biz}`,
      subheadline:
        "A focused offer, conversion-first landing page, and a simple growth loop — built for a solo founder.",
      features: [
        "Clear value proposition with outcome-driven messaging",
        "One primary CTA with friction removed",
        "Proof section (testimonials/case study) to increase trust",
        "Simple tracking so you know what’s working",
      ],
      ctaText: "Get Started",
    },
    kpiDashboard: {
      traffic: 500,
      conversionRate: 3,
      bounceRate: 45,
      emailOpenRate: 25,
      socialEngagementRate: 8,
    },

    // Extras for your dashboard
    summary: `Here’s a practical 30-day growth plan for ${biz}. (Fallback response — AI returned invalid JSON.)`,
    experiments: [
      {
        title: "Landing page headline + CTA test",
        steps: [
          "Write 2 alternative headlines focused on a specific outcome",
          "Add 1 proof element (testimonial, metric, short case study)",
          "Run for 7 days and compare conversion rate",
        ],
        metricsToTrack: ["Conversion rate", "CTA click rate", "Bounce rate"],
        priorityScore: 85,
      },
      {
        title: "Outbound micro-campaign (50 leads)",
        steps: [
          "Build a list of 50 ideal customers",
          "Send a 2-email sequence with a tight offer",
          "Track reply rate and booked calls",
        ],
        metricsToTrack: ["Reply rate", "Booked calls"],
        priorityScore: 70,
      },
    ],
    automation: {
      quickWins: [
        "Auto-tag leads by source",
        "Auto-send an intake form immediately after inquiry",
        "Auto-send a weekly KPI email summary to yourself",
      ],
      toolsStack: [
        { tool: "Google Analytics", purpose: "Traffic and behavior tracking" },
        { tool: "Notion/Airtable", purpose: "Pipeline and experiment tracking" },
        { tool: "Zapier/Make", purpose: "Simple automations" },
      ],
    },
    risks: [
      "Trying too many channels at once",
      "Unclear offer positioning",
      "No consistent outreach/content cadence",
    ],
    nextSteps: [
      "Pick one acquisition channel for 14 days",
      "Tighten the offer + landing page headline",
      "Implement conversion tracking and review weekly",
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
      return res
        .status(400)
        .json({ error: "Missing required fields: businessName, founderProfile" });
    }

    const prompt = `
You are a world-class growth strategist and lifecycle automation operator.

Create a practical 30-day growth + automation plan for this business.

Business name: ${input.businessName}
Founder profile: ${JSON.stringify(input.founderProfile, null, 2)}
Marketing data (may be empty): ${JSON.stringify(input.marketingData ?? {}, null, 2)}
Traffic data (may be empty): ${JSON.stringify(input.trafficData ?? {}, null, 2)}

Return STRICT JSON ONLY matching this schema:

{
  "summary": "string",
  "kpiDashboard": {
    "traffic": number,
    "conversionRate": number,
    "bounceRate": number,
    "emailOpenRate"?: number,
    "socialEngagementRate"?: number
  },
  "growthRecommendations": ["string"],
  "experiments": [
    {
      "title": "string",
      "steps": ["string"],
      "metricsToTrack"?: ["string"],
      "priorityScore"?: number
    }
  ],
  "automation": {
    "quickWins": ["string"],
    "toolsStack": [{ "tool":"string", "purpose":"string" }]
  },
  "automatedEmails": [{ "subject":"string", "body":"string" }],
  "automatedSocialPosts": ["string"],
  "updatedLandingPage"?: {
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
- Keep it premium, specific, non-fluffy. No fake claims like “trusted by thousands”.
- KPI values should be realistic numeric targets for the next 30 days.
- Provide 5–8 growthRecommendations.
- Provide 3–6 experiments with clear steps.
- priorityScore is 1–100 (higher = do first).
- automatedEmails should be ready-to-send templates with placeholders like {{name}}.
- automatedSocialPosts should be short, useful, not cringe.
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return only valid JSON. No markdown. No extra text." },
        { role: "user", content: prompt },
      ],
      temperature: 0.35,
      max_tokens: 1400,
    });

    const text = completion.choices?.[0]?.message?.content?.trim() || "{}";

    try {
      const parsed = JSON.parse(text) as ExtendedGrowthOutput;

      // Basic safety checks so the UI never breaks.
      if (
        !parsed ||
        typeof parsed !== "object" ||
        !parsed.kpiDashboard ||
        typeof parsed.kpiDashboard !== "object" ||
        typeof (parsed as any).kpiDashboard.traffic !== "number" ||
        typeof (parsed as any).kpiDashboard.conversionRate !== "number" ||
        typeof (parsed as any).kpiDashboard.bounceRate !== "number" ||
        !Array.isArray((parsed as any).growthRecommendations) ||
        !Array.isArray((parsed as any).automatedEmails) ||
        !Array.isArray((parsed as any).automatedSocialPosts)
      ) {
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
