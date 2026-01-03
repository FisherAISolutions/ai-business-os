import React from "react";
import { BusinessState } from "../types/business";

type Props = {
  business: BusinessState;
};

const badgeStyles: Record<string, string> = {
  proceed: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  caution: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  "no-go": "bg-red-500/20 text-red-300 border-red-400/30",
};

export const CommandCenter: React.FC<Props> = ({ business }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="text-2xl font-semibold tracking-tight">
          Business Command Center
        </h2>
        <p className="mt-1 text-sm text-white/60">
          Founder: {business.founder.skills.join(", ")} • Goal:{" "}
          {business.founder.goals.replace("_", " ")} • Budget: $
          {business.founder.budget.toLocaleString()}
        </p>
      </div>

      {/* Ideas */}
      <div className="grid gap-6 md:grid-cols-2">
        {business.ideas.map((idea) => (
          <div
            key={idea.id}
            className="relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/20"
          >
            {/* Recommendation badge */}
            <div
              className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold uppercase ${
                badgeStyles[idea.recommendation]
              }`}
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

              <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
                Select Idea →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Score = ({ label, value }: { label: string; value: number }) => {
  return (
    <div>
      <div className="flex justify-between text-xs text-white/60">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};
