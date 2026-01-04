import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MarketingDashboard } from "../components/MarketingDashboard";
import { generateMarketing } from "../lib/marketing/ai";
import type { BusinessIdea, FounderProfile } from "../types/business";

type SavedSelection = {
  savedAt: string;
  founder: FounderProfile;
  idea: BusinessIdea;
  createdAt: string;
};

const SELECTION_KEY = "ai-business-os:selected-idea";

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

const Phase4Page: React.FC = () => {
  const [selection, setSelection] = useState<SavedSelection | null>(null);
  const [marketingData, setMarketingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelection(readSelection());
  }, []);

  const businessName = useMemo(() => selection?.idea?.name || "", [selection]);

  const handleGenerate = async () => {
    if (!selection) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateMarketing({
        founder: selection.founder,
        businessName: selection.idea.name,
        location: selection.founder.location || "USA",
      });
      setMarketingData(data);
    } catch (e: any) {
      setError(e?.message || "Marketing generation failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!selection) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Phase 4 — Marketing</h1>
        <p className="text-gray-300">You need to complete Phase 1 first by selecting a business idea.</p>
        <div className="flex gap-3">
          <Link href="/phase1" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
            Go to Phase 1
          </Link>
          <Link href="/phase3" className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
            Go to Phase 3
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Phase 4 — Marketing</h1>
        <p className="text-gray-300">
          Business: <span className="font-semibold text-white">{businessName}</span>
        </p>
      </div>

      <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="font-semibold">Generate a 14-day marketing starter kit</p>
          <p className="text-sm text-gray-300">
            Emails, social posts, ad copy, a simple content calendar, and what to track.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Marketing"}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded bg-red-900/40 border border-red-800 text-red-200">{error}</div>
      )}

      {marketingData && (
        <>
          <MarketingDashboard marketingData={marketingData} />
          <div className="flex justify-end">
            <Link href="/phase5" className="px-4 py-2 rounded bg-green-600 hover:bg-green-700">
              Continue to Phase 5 →
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Phase4Page;
