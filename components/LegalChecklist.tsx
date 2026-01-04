// components/LegalChecklist.tsx
import React, { useEffect, useMemo, useState } from "react";

interface ChecklistItem {
  step: string;
  completed: boolean;
}

interface ProgressInfo {
  completed: number;
  total: number;
  percent: number; // 0-100
}

interface Props {
  checklist: ChecklistItem[];
  /**
   * Optional localStorage key. If provided, checklist completion is saved and restored.
   * Tip: pass the SAME key as LegalFormsBoard to keep the user’s “done” state unified.
   */
  storageKey?: string;
  /**
   * Optional callback so parent pages can display progress and unlock the next phase.
   * This is fully backwards-compatible: if you don't pass it, nothing changes.
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

  const items = useMemo(() => {
    return checklist.map((item) => {
      const id = slugify(item.step);
      return { ...item, id };
    });
  }, [checklist]);

  const total = items.length;

  const completedCount = useMemo(() => {
    if (!total) return 0;
    let count = 0;
    for (const item of items) {
      if (done.has(item.id)) count += 1;
    }
    return count;
  }, [done, items, total]);

  const percent = total ? Math.round((completedCount / total) * 100) : 0;

  // Load saved "done" set
  useEffect(() => {
    if (!storageKey) return;
    const arr = safeParseArray(window.localStorage.getItem(storageKey));
    setDone(new Set(arr));
  }, [storageKey]);

  // Persist "done" set
  useEffect(() => {
    if (!storageKey) return;
    const arr = Array.from(done);
    window.localStorage.setItem(storageKey, JSON.stringify(arr));
  }, [done, storageKey]);

  // Report progress upward (used for phase unlocking + progress UI)
  useEffect(() => {
    if (!onProgress) return;
    onProgress({ completed: completedCount, total, percent });
  }, [completedCount, total, percent, onProgress]);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Legal Checklist</h2>
          <div className="text-sm text-white/70">
            {completedCount}/{total} completed
          </div>
        </div>

        <div className="mt-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-indigo-500/70" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-2 text-xs text-white/60">
            Progress updates automatically. You can revisit and change items anytime.
          </div>
        </div>
      </div>

      <ul className="mt-6 space-y-2">
        {items.map((item) => {
          const checked = done.has(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={[
                  "w-full rounded-xl border px-4 py-3 text-left transition",
                  checked
                    ? "border-emerald-400/30 bg-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "mt-0.5 flex h-5 w-5 items-center justify-center rounded border text-xs",
                      checked
                        ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                        : "border-white/20 text-white/60",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {checked ? "✓" : ""}
                  </div>

                  <span className={checked ? "text-white" : "text-white/80"}>{item.step}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-100/90">
        <strong>Important:</strong> This checklist is educational and not legal advice. Requirements vary by state, city,
        and industry. When you’re unsure, verify with your state’s official site or a qualified professional.
      </div>
    </section>
  );
};
