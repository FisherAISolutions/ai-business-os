// components/LegalChecklist.tsx
import React from "react";

interface ChecklistItem {
  step: string;
  completed: boolean;
}

interface Props {
  checklist: ChecklistItem[];
}

export const LegalChecklist: React.FC<Props> = ({ checklist }) => {
  if (!checklist || checklist.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        No legal checklist steps generated yet.
      </div>
    );
  }

  const completedCount = checklist.filter((c) => c.completed).length;
  const total = checklist.length;
  const percent = Math.round((completedCount / total) * 100);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            AI-Generated Legal Checklist
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Suggested steps based on your business idea and location.
          </p>
        </div>

        <div className="text-sm text-white/70">
          {completedCount} / {total} completed ({percent}%)
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-400/50 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-6 space-y-3">
        {checklist.map((item, idx) => (
          <li
            key={idx}
            className={`flex items-start gap-3 rounded-xl border p-4 transition ${
              item.completed
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <div
              className={`mt-1 h-4 w-4 flex-shrink-0 rounded border ${
                item.completed
                  ? "border-emerald-400/60 bg-emerald-400/40"
                  : "border-white/30 bg-transparent"
              }`}
            />

            <span
              className={`text-sm leading-snug ${
                item.completed ? "line-through text-white/60" : "text-white/80"
              }`}
            >
              {item.step}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-100/90">
        <strong>Note:</strong> This checklist is informational only and not legal advice.
        Requirements may vary by state and business type.
      </div>
    </section>
  );
};
