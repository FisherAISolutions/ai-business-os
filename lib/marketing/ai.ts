import type { FounderProfile, MarketingOutput as MarketingOutputType } from "../../types/business";

export type MarketingOutput = MarketingOutputType;

export async function generateMarketing(input: {
  founder: FounderProfile;
  businessName: string;
  location: string;
}): Promise<MarketingOutput> {
  const res = await fetch("/api/marketing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Marketing generation failed.");
  }

  return (await res.json()) as MarketingOutput;
}
