// pages/phase2.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { BusinessIdea, FounderProfile } from "../types/business";
import { generateLegalSetup } from "../lib/legal/ai";
import { LegalChecklist } from "../components/LegalChecklist";
import { templates } from "../lib/legal/templates";
import LegalFormsBoard from "../components/LegalFormsBoard";

type SavedSelection = {
  savedAt: string;
  founder: FounderProfile;
  idea: BusinessIdea;
  createdAt: string;
};

type LegalSetup = {
  recommendedStructure: string;
  checklist: { step: string; completed: boolean }[];
  templates: { name: string; link: string }[];
  notes: string;
};

const SELECTION_KEY = "ai-business-os:selected-idea";

// IMPORTANT: shared key so BOTH widgets persist together
const LEGAL_PROGRESS_KEY = "ai-business-os:legal-steps:done:usa";

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

export default function Phase2Page() {
  const [selection, setSelection] = useState<SavedSelection | null>(null);

  const [legalSetup, setLegalSetup] = useState<LegalSetup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load selection from Phase 1
  useEffect(() => {
    setSelection(readSelection());
  }, []);

  const ideaName = selection?.idea?.name ?? "";
  const location = selection?.founder?.location ?? "USA";

  useEffect(() => {
    const run = async () => {
      if (!selection) return;

      setError(null);
      setLoading(true);
      try {
        const aiResult = await generateLegalSetup(
          selection.founder,
          selection.idea.name,
          selection.founder.location || "USA"
        );

        if (!aiResult) throw new Error("Legal setup returned empty result.");
        setLegalSetup(aiResult);
      } catch (e: any) {
        setError(e?.message ?? "Failed to generate legal setup.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [selection]);

  const templateLinks = useMemo(() => {
    if (!legalSetup?.templates?.length) return [];
    return legalSetup.templates.map((t) => ({
      name: t.name,
      link: t.link || (templates as any)[t.name as keyof typeof templates] || "",
    }));
  }, [legalSetup]);

  if (!selection) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight">
            Phase 2: Business Setup & Legal
          </h1>
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

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight">
          Phase 2: Business Setup & Legal
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Selected idea: <span className="text-white">{ideaName}</span> • Location:{" "}
          <span className="text-white">{location}</span>
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
          Generating legal setup…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      )}

      {legalSetup && (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Recommended Business Structure</h2>
            <p className="mt-2 text-white/70">{legalSetup.recommendedStructure}</p>
          </div>

          {/* NOW CLICKABLE + SAVED */}
          <LegalChecklist
            checklist={legalSetup.checklist || []}
            storageKey={LEGAL_PROGRESS_KEY}
          />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Templates & Resources</h2>
            <p className="mt-2 text-sm text-white/60">
              Quick links to common docs. (We’ll keep expanding this into more “official forms”.)
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-white/80">
              {templateLinks.map((t, idx) => (
                <li key={`${t.name}-${idx}`}>
                  {t.link ? (
                    <a
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline"
                    >
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
            <h2 className="text-xl font-semibold">AI Guidance & Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-white/70">{legalSetup.notes}</p>
          </div>

          {/* Workflow board */}
          <LegalFormsBoard
            storageKey={LEGAL_PROGRESS_KEY}
            businessType={legalSetup.recommendedStructure}
          />
        </>
      )}
    </div>
  );
}
