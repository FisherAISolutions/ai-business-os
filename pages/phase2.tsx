// pages/phase2.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { BusinessIdea, FounderProfile } from "../types/business";
import { generateLegalSetup } from "../lib/legal/ai";
import { LegalChecklist } from "../components/LegalChecklist";
import { templates } from "../lib/legal/templates";
import LegalFormsBoard from "../components/LegalFormsBoard";
import { setPhaseCompleted } from "../lib/utils/phaseProgress";

type SavedSelection = {
  savedAt: string;
  founder: FounderProfile;
  idea: BusinessIdea;
  createdAt: string;
};

type LegalSetup = {
  recommendedStructure: string;
  checklist: { step: string; completed: boolean }[];
  templates?: { name: string; link: string }[];
  notes: string;
};

const SELECTION_KEY = "ai-business-os:selected-idea";
const LEGAL_PROGRESS_KEY = "ai-business-os:legal-steps:done:usa";
const BUSINESS_NAME_KEY = "ai-business-os:business-name";

function readSelection(): SavedSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SELECTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.founder || !parsed?.idea) return null;
    return parsed as SavedSelection;
  } catch {
    return null;
  }
}

function readBusinessNameFallback(selection: SavedSelection | null) {
  if (typeof window === "undefined") return selection?.idea?.name ?? "";
  const saved = window.localStorage.getItem(BUSINESS_NAME_KEY);
  if (saved && saved.trim()) return saved.trim();
  return selection?.idea?.name ?? "";
}

export default function Phase2Page() {
  const [selection, setSelection] = useState<SavedSelection | null>(null);
  const [legalSetup, setLegalSetup] = useState<LegalSetup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [progress, setProgress] = useState({ completed: 0, total: 0, percent: 0 });
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const sel = readSelection();
    setSelection(sel);
    setBusinessName(readBusinessNameFallback(sel));
  }, []);

  // persist business name
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!businessName) return;
    window.localStorage.setItem(BUSINESS_NAME_KEY, businessName);
  }, [businessName]);

  const location = selection?.founder?.location ?? "USA";

  // generate only when user clicks (NOT auto-run) — avoids “missing required fields” surprises
  async function handleGenerate() {
    if (!selection) return;

    const bn = businessName.trim();
    const loc = (selection.founder.location || "USA").trim();

    if (!selection.founder || !bn || !loc) {
      setError("Missing required fields: founder, businessName, location");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      // Keep signature compatible with your existing lib/legal/ai
      const aiResult = await generateLegalSetup(selection.founder, bn, loc);

      if (!aiResult) throw new Error("Legal setup returned empty result.");
      setLegalSetup(aiResult);

      // Phase 1 is "done" if a selection exists
      setPhaseCompleted("phase1", true);
    } catch (e: any) {
      setError(e?.message ?? "Failed to generate legal setup.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (progress.total > 0 && progress.completed === progress.total) {
      setPhaseCompleted("phase2", true);
    }
  }, [progress]);

  const templateLinks = useMemo(() => {
    // Prefer AI-returned links if present, otherwise map names to your local templates map.
    const fromAi = legalSetup?.templates?.length ? legalSetup.templates : [];
    if (fromAi.length) return fromAi;

    // fallback list from your template map keys (nice default)
    const keys = Object.keys(templates || {});
    return keys.map((k) => ({ name: k, link: (templates as any)[k] || "" }));
  }, [legalSetup]);

  if (!selection) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight">Phase 2: Business Setup & Legal</h1>
          <p className="mt-2 text-sm text-white/60">
            No idea selected yet. Go to Phase 1 and select an idea first.
          </p>
        </div>

        <a
          href="/phase1"
          className="inline-flex rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          ← Go to Phase 1
        </a>
      </div>
    );
  }

  const phase2Complete = progress.total > 0 && progress.completed === progress.total;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight">Phase 2: Business Setup & Legal</h1>
        <p className="mt-2 text-sm text-white/60">
          Location: <span className="text-white">{location}</span>
        </p>

        {/* Business name input */}
        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-wide text-white/50">Business name</div>
          <input
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/40"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Type your business name…"
          />
          <div className="mt-2 text-xs text-white/50">
            This name will be used across legal docs, branding, and your landing page.
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-wide text-white/50">Checklist progress</p>
            <p className="mt-1 text-2xl font-semibold text-white">{progress.percent}%</p>
            <p className="mt-1 text-sm text-white/60">
              {progress.total ? `${progress.completed}/${progress.total} completed` : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-4 md:col-span-2">
            <p className="text-xs uppercase tracking-wide text-white/50">Recommended flow</p>
            <p className="mt-1 text-sm text-white/70">
              Enter your business name → generate the checklist → complete items → then move to Phase 3.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href="/phase1"
                className="inline-flex rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
              >
                ← Back to Phase 1
              </a>

              <a
                href="/phase3"
                className={[
                  "inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white",
                  phase2Complete ? "bg-emerald-600 hover:bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-500",
                ].join(" ")}
                title={
                  phase2Complete
                    ? "Continue to Phase 3"
                    : "You can continue now, but finishing the legal checklist first is recommended."
                }
              >
                Continue to Phase 3 →
              </a>

              {!phase2Complete && (
                <span className="text-xs text-white/50">
                  Recommended: finish Phase 2 for stronger branding + website copy.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading || !businessName.trim()}
            className={[
              "rounded-lg px-4 py-2 text-sm font-semibold transition",
              loading || !businessName.trim()
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500",
            ].join(" ")}
            title={!businessName.trim() ? "Enter a business name first" : "Generate legal setup"}
          >
            {loading ? "Generating…" : "Generate Legal Setup"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
          Generating legal setup…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <div className="font-semibold">Something went wrong</div>
          <div className="mt-2 text-sm opacity-90">{error}</div>
        </div>
      )}

      {legalSetup && (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Recommended business structure</h2>
            <p className="mt-2 text-white/70">{legalSetup.recommendedStructure}</p>
          </div>

          {/* ✅ This matches the component props below */}
          <LegalChecklist
            checklist={legalSetup.checklist || []}
            storageKey={LEGAL_PROGRESS_KEY}
            onProgress={setProgress}
          />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Templates & resources</h2>
            <p className="mt-2 text-sm text-white/60">
              Quick links to common documents. When possible, use official sources.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-white/80">
              {templateLinks.map((t, idx) => (
                <li key={`${t.name}-${idx}`}>
                  {t.link ? (
                    <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                      {t.name}
                    </a>
                  ) : (
                    <span className="text-white/60">{t.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">AI guidance & notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-white/70">{legalSetup.notes}</p>
          </div>

          {/* ✅ This matches the component props below */}
          <LegalFormsBoard
            storageKey={LEGAL_PROGRESS_KEY}
            businessType={legalSetup.recommendedStructure}
          />
        </>
      )}
    </div>
  );
}
