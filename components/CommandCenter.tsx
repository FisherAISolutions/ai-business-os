// components/CommandCenter.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import type { BusinessIdea, BusinessState } from "../types/business";

type Props = {
  business: BusinessState;
};

const STORAGE_KEY = "ai-business-os:selected-idea";

const badgeStyles: Record<string, string> = {
  proceed: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  caution: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  // support both spellings just in case
  "no_go": "bg-red-500/20 text-red-300 border-red-400/30",
  "no-go": "bg-red-500/20 text-red-300 border-red-400/30",
};

function safeGetBadgeStyle(rec: string | undefined) {
  if (!rec) return "bg-white/5 text-white/70 border-white/10";
  return badgeStyles[rec] ?? "bg-white/5 text-white/70 border-white/10";
}

function safeString(val: unknown) {
  return typeof val === "string" ? val : "";
}

function readSelectedId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const id = parsed?.idea?.id ?? parsed?.ideaId ?? null;
    return typeof id === "string" ? id : null;
  } catch {
    return null;
  }
}

function writeSelection(business: BusinessState, idea: BusinessIdea) {
  if (typeof window === "undefined") return;
  const payload = {
    savedAt: new Date().toISOString(),
    founder: business.founder,
    idea,
    createdAt: business.createdAt,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export const CommandCenter: React.FC<Props> = ({ business }) => {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(readSelectedId());
  }, []);

  const selectedIdea = useMemo(() => {
    if (!selectedId) return null;
    return business.ideas.find((i) => i.id === selectedId) ?? null;
  }, [business.ideas, selectedId]);

  function selectIdea(idea: BusinessIdea) {
    setSelectedId(idea.id);
    writeSelection(business, idea);
  }

  function continueToPhase2() {
    // Phase 2 can read STORAGE_KEY to know what was selected
    router.push("/phase2");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Business Command Center
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Founder: {business.founder.skills.join(", ")} • Goal:{" "}
              {safeString(business.founder.goals).replace("_", " ")} • Budget: $
              {business.founder.budget.toLocaleString()} • Time:{" "}
              {business.founder.timePerWeek}h/wk
            </p>

            {selectedIdea ? (
              <div className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm">
                <span className="text-white/70">Selected:</span>{" "}
                <span className="font-semibold text-white">{selectedIdea.name}</span>
                <span className="text-white/50"> • </span>
                <span className="text-white/70">
                  {selectedIdea.description}
                </span>
              </div>
            ) : (
              <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                Tip: click <span className="font-semibold text-white">Select Idea</span> on one
                idea to unlock Phase 2.
              </div>
            )}
          </div>

          <button
            onClick={continueToPhase2}
            disabled={!selectedIdea}
            className={[
              "rounded-lg px-4 py-2 text-sm font-semibold transition",
              selectedIdea
                ? "bg-emerald-500 text-white hover:bg-emerald-400"
                : "bg-white/10 text-white/40 cursor-not-allowed",
            ].join(" ")}
            title={selectedIdea ? "Continue to Phase 2" : "Select an idea first"}
          >
            Continue to Phase 2 →
          </button>
        </div>
      </div>

      {/* Ideas */}
      <div className="grid gap-6 md:grid-cols-2">
        {business.ideas.map((idea) => {
          const isSelected = idea.id === selectedId;

          return (
            <div
              key={idea.id}
              className={[
                "relative rounded-xl border bg-white/5 p-6 backdrop-blur transition",
                isSelected
                  ? "border-emerald-400/40 ring-2 ring-emerald-500/20"
                  : "border-white/10 hover:border-white/20",
              ].join(" ")}
            >
              {/* Recommendation badge */}
              <div
                className={[
                  "absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold uppercase",
                  safeGetBadgeStyle(idea.recommendation),
                ].join(" ")}
              >
                {idea.recommendation}
              </div>

              <h3 className="text-xl font-semibold">{idea.name}</h3>
              <p className="mt-2 text-sm text-white/70">{idea.description}</p>

              {/* Scores */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <Score label="Demand" value={idea.market.demand} />
                <Score label="Competition" value={idea.market.competition} />
                <Score label="Saturation" value={idea.market.saturation} />
                <Score label="Profitability" value={idea.feasibility.profitability} />
                <Score label="Difficulty" value={idea.feasibility.difficulty} />
                <Score label="Entry Barriers" value={idea.feasibility.entryBarriers} />
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="text-sm text-white/60">
                  Fit: <span className="text-white">{idea.fitScore}</span> •
                  Viability:{" "}
                  <span className="text-white">{idea.viabilityScore}</span>
                </div>

                <button
                  onClick={() => selectIdea(idea)}
                  className={[
                    "rounded-lg px-4 py-2 text-sm font-semibold transition",
                    isSelected
                      ? "bg-emerald-500 text-white hover:bg-emerald-400"
                      : "bg-indigo-500 text-white hover:bg-indigo-400",
                  ].join(" ")}
                >
                  {isSelected ? "Selected ✓" : "Select Idea →"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Score = ({ label, value }: { label: string; value: number }) => {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  return (
    <div>
      <div className="flex justify-between text-xs text-white/60">
        <span>{label}</span>
        <span>{safe}</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
};
