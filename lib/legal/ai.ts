import type { FounderProfile, LegalSetup } from "../../types/business";

export async function generateLegalSetup(
  founder: FounderProfile,
  businessName: string,
  location: string
): Promise<LegalSetup> {
  const res = await fetch("/api/legal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ founder, businessName, location }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Legal setup generation failed.");
  }

  return (await res.json()) as LegalSetup;
}
