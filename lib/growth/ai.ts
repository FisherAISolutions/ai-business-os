import type { FounderProfile, ContinuousGrowthOutput } from "../../types/business";

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

export type GrowthOutput = ContinuousGrowthOutput & {
  summary?: string;
  experiments?: any[];
  automation?: any;
  risks?: string[];
  nextSteps?: string[];
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

  return (await res.json()) as GrowthOutput;
}
