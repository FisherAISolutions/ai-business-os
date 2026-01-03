import {
  FounderProfile,
  BusinessIdea,
  MarketScores,
  FeasibilityScores,
} from "../../types/business";

// Utility to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// If your BusinessIdea type includes these optional fields, this will work.
// If your type does NOT include them, remove these 2 lines in the mapping below:
//   customerPersona: idea.customerPersona,
//   pricingModel: idea.pricingModel,

export async function generateBusinessIdeas(
  founder: FounderProfile
): Promise<BusinessIdea[]> {
  const res = await fetch("/api/idea-generation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(founder),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Idea generation failed.");
  }

  const ideasRaw = await res.json();

  if (!Array.isArray(ideasRaw)) return [];

  try {
    const ideas: BusinessIdea[] = ideasRaw.map((idea: any) => ({
      id: generateId(),
      name: String(idea?.name ?? ""),
      description: String(idea?.description ?? ""),
      rationale: String(idea?.rationale ?? ""),

      // ✅ Keep these ONLY if your BusinessIdea type supports them:
      customerPersona: idea?.customerPersona,
      pricingModel: idea?.pricingModel,

      fitScore: Number(idea?.fitScore ?? 0),
      market: (idea?.market ?? { demand: 0, competition: 0, saturation: 0 }) as MarketScores,
      feasibility: (idea?.feasibility ?? {
        profitability: 0,
        difficulty: 0,
        entryBarriers: 0,
      }) as FeasibilityScores,
      viabilityScore: Number(idea?.viabilityScore ?? 0),
      recommendation: (idea?.recommendation ??
        "caution") as "proceed" | "caution" | "no_go",
    }));

    // Optional: filter out blank ideas if model returns junk
    return ideas.filter((i) => i.name.trim().length > 0);
  } catch (error) {
    console.error("Failed to map idea output:", error, "Raw:", ideasRaw);
    return [];
  }
}
