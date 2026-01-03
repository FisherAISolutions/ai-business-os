import type { FounderProfile } from "../../types/business";

export type GrowthInput = {
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

export type GrowthOutput = {
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

export async function generateContinuousGrowth(input: GrowthInput): Promise<GrowthOutput> {
  const res = await fetch("/api/growth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Growth generation request failed.");
  }

  return res.json();
}
