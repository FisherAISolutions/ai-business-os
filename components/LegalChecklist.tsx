// components/LegalChecklist.tsx
import React, { useEffect, useMemo, useState } from "react";

interface ChecklistItem {
  step: string;
  completed: boolean;
}

interface ProgressInfo {
  completed: number;
  total: number;
  percent: number;
}

interface Props {
  checklist: ChecklistItem[];
  /**
   * Optional localStorage key. If provided, checklist completion is saved and restored.
   * Tip: pass the SAME key as LegalFormsBoard to keep the user’s “done” state unified.
   */
  storageKey?: string;

  /**
   * Optional callback for parent pages to display progress and unlock the recommended next phase.
   * Backwards-compatible: if not provided, nothing changes.
   */
  onProgress?: (progress: ProgressInfo) => void;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function safeParseArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export const LegalChecklist: React.FC<Props> = ({ checklist, storageKey, onProgress }) => {
  const [done, setDone] = useState<Set<string>>(new Set());

  // Load saved "done" set
  useEffect(() => {
    if (!storageKey) return;
    if (typeof window === "undefined") return;
    const arr = safeParseArray(window.localStorage.getItem(storageKey));
    setDone(new Set(arr));
  }, [storageKey]);

  // Persist "done" set
  useEffect(() => {
    if (!storageKey) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(Array.from(done)));
  }, [done, storageKey]);

  const normalized = useMemo(() => {
    return (checklist || [])
      .filter((c) => c && typeof c.step === "string")
      .map((c) => {
        const id = `check:${slugify(c.step)}`;
        const isDone = done.has(id) || !!c.completed;
        return { ...c, id, completed: isDone };
      });
  }, [checklist, done]);

  if (!normalized || normalized.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        No legal checklist steps generated yet.
      </div>
    );
  }

  const completedCount = normalized.filter((c) => c.completed).length;
  const total = normalized.length;
  const percent = total ? Math.round((completedCount / total) * 100) : 0;

  // Report progress upward (used for sidebar "Done" + recommended flow)
  useEffect(() => {
    if (!onProgress) return;
    onProgress({ completed: completedCount, total, percent });
  }, [completedCount, total, percent, onProgress]);

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">AI-Generated Legal Checklist</h2>
          <p className="mt-1 text-sm text-white/60">Click items to mark them done. Progress is saved on this device.</p>
        </div>

        <div className="text-sm text-white/70">
          {completedCount} / {total} completed ({percent}%)
        </div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-400/50 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-6 space-y-3">
        {normalized.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className={[
                "w-full text-left flex items-start gap-3 rounded-xl border p-4 transition",
                item.completed
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20",
              ].join(" ")}
            >
              <div
                className={[
                  "mt-1 h-4 w-4 flex-shrink-0 rounded border grid place-items-center",
                  item.completed ? "border-emerald-400/60 bg-emerald-400/30" : "border-white/30 bg-transparent",
                ].join(" ")}
              >
                {item.completed ? <span className="text-[10px] font-bold text-emerald-100">✓</span> : null}
              </div>

              <span
                className={[
                  "text-sm leading-snug",
                  item.completed ? "line-through text-white/60" : "text-white/80",
                ].join(" ")}
              >
                {item.step}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-100/90">
        <strong>Note:</strong> This checklist is informational only and not legal advice. Requirements may vary by state
        and business type.
      </div>
    </section>
  );
};
