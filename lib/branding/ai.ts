import type { FounderProfile, BrandingOutput as BrandingOutputType } from "../../types/business";

export type BrandingOutput = BrandingOutputType;

export async function generateBranding(input: {
  founder: FounderProfile;
  businessName: string;
  location: string;
}): Promise<BrandingOutput> {
  const res = await fetch("/api/branding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Branding generation failed.");
  }

  return (await res.json()) as BrandingOutput;
}
