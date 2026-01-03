import React, { useState } from "react";
import FounderIntake from "../components/FounderIntake";
import { CommandCenter } from "../components/CommandCenter";
import { generateBusinessIdeas } from "../lib/ai/ideaGeneration";
import type { BusinessState, FounderProfile } from "../types/business";

const Phase1Page: React.FC = () => {
  const [business, setBusiness] = useState<BusinessState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate(profile: FounderProfile) {
    setError(null);
    setLoading(true);
    try {
      const ideas = await generateBusinessIdeas(profile);
      setBusiness({
        founder: profile,
        ideas,
        createdAt: new Date().toISOString(),
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate ideas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight">
          Phase 1: Idea → Validation
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Answer a few questions. Then we generate and score business ideas tailored to you.
        </p>
      </div>

      <FounderIntake onSubmit={onGenerate} disabled={loading} />

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
          Generating business ideas…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      )}

      {business && <CommandCenter business={business} />}
    </div>
  );
};

export default Phase1Page;
