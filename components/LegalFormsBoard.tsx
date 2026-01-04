// components/LegalFormsBoard.tsx
import React from "react";

export type LegalBoardItem = {
  id: string;
  title: string;
  description?: string;
  when?: string;
  linkLabel?: string;
  linkUrl?: string;
  completed?: boolean;
};

export type LegalBoardColumn = {
  id: string;
  title: string;
  subtitle?: string;
  items: LegalBoardItem[];
};

type Props = {
  columns?: LegalBoardColumn[]; // ✅ optional now
  onToggleComplete?: (itemId: string) => void;
};

export default function LegalFormsBoard({ columns = [], onToggleComplete }: Props) {
  const hasColumns = Array.isArray(columns) && columns.length > 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Legal Forms & Links</h2>
          <p className="mt-1 text-sm text-white/60">
            A step-by-step checklist with official links. Your progress is saved on this device.
          </p>
        </div>

        <div className="text-xs text-white/50 hidden sm:block">
          Tip: Shift + mousewheel scrolls horizontally
        </div>
      </div>

      {!hasColumns ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-6 text-sm text-white/70">
          No legal steps loaded yet. (This usually means Phase 2 hasn’t provided board data.)
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto pb-3">
          <div className="flex gap-4 min-w-max">
            {columns.map((col) => (
              <div
                key={col.id}
                className="w-[280px] sm:w-[320px] shrink-0 rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-white/90">{col.title}</div>
                    {col.subtitle ? (
                      <div className="mt-1 text-xs text-white/50">{col.subtitle}</div>
                    ) : null}
                  </div>
                  <div className="text-xs text-white/40">
                    {col.items?.length ?? 0} {(col.items?.length ?? 0) === 1 ? "item" : "items"}
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  {(col.items ?? []).map((item) => {
                    const done = !!item.completed;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-3 transition ${
                          done
                            ? "border-emerald-500/25 bg-emerald-500/10"
                            : "border-white/10 bg-black/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => onToggleComplete?.(item.id)}
                            className={`mt-1 h-5 w-5 shrink-0 rounded border transition ${
                              done
                                ? "border-emerald-400/60 bg-emerald-400/30"
                                : "border-white/30 bg-transparent hover:bg-white/10"
                            }`}
                            aria-label={done ? "Mark incomplete" : "Mark complete"}
                          />
                          <div className="min-w-0">
                            <div
                              className={`text-sm font-medium ${
                                done ? "text-white/60 line-through" : "text-white/90"
                              }`}
                            >
                              {item.title}
                            </div>

                            {item.description ? (
                              <div className="mt-1 text-xs text-white/55">{item.description}</div>
                            ) : null}

                            {item.when ? (
                              <div className="mt-2 text-[11px] text-white/45">
                                <span className="font-semibold text-white/55">When:</span>{" "}
                                {item.when}
                              </div>
                            ) : null}

                            {item.linkUrl ? (
                              <div className="mt-3">
                                <a
                                  href={item.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                                >
                                  {item.linkLabel || "Open link"}
                                  <span className="ml-2 text-white/40">↗</span>
                                </a>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
