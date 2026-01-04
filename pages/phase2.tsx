// pages/phase2.tsx
import React, { useEffect, useMemo, useState } from "react";
import { BusinessState } from "../types/business";
import { generateLegalSetup } from "../lib/legal/ai";
import { LegalChecklist } from "../components/LegalChecklist";
import { templates } from "../lib/legal/templates";
import LegalFormsBoard, { type LegalBoardColumn } from "../components/LegalFormsBoard";

interface LegalSetup {
  recommendedStructure: string;
  checklist: { step: string; completed: boolean }[];
  templates: { name: string; link: string }[];
  notes: string;
}

// MOCK: Replace with actual Phase 1 selected idea and founder later
const mockBusiness: BusinessState = {
  founder: {
    skills: ["Marketing", "Tech / Development"],
    experienceLevel: "intermediate",
    budget: 2000,
    timePerWeek: 15,
    riskTolerance: "medium",
    goals: "side_hustle",
    location: "USA",
  },
  ideas: [
    {
      id: "idea1",
      name: "AI-Enhanced Local SEO Agency",
      description: "Help small businesses rank on search engines using AI tools.",
      rationale: "Fits your marketing and tech skills and low startup capital requirement.",
      fitScore: 85,
      market: { demand: 78, competition: 60, saturation: 70 },
      feasibility: { profitability: 80, difficulty: 40, entryBarriers: 30 },
      viabilityScore: 78,
      recommendation: "proceed",
    },
  ],
  createdAt: new Date().toISOString(),
};

const STORAGE_KEY = "ai-business-os:legal-steps:done:usa";

const Phase2Page: React.FC = () => {
  const [legalSetup, setLegalSetup] = useState<LegalSetup | null>(null);
  const [loading, setLoading] = useState(false);

  // Track completed “board” items by ID (saved to localStorage)
  const [doneIds, setDoneIds] = useState<Record<string, boolean>>({});

  // Load saved completion state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDoneIds(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Persist completion state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doneIds));
    } catch {
      // ignore
    }
  }, [doneIds]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const idea = mockBusiness.ideas[0];

      const aiResult = await generateLegalSetup(
        mockBusiness.founder,
        idea.name,
        mockBusiness.founder.location
      );

      setLegalSetup(aiResult);
      setLoading(false);
    };

    init();
  }, []);

  const columns: LegalBoardColumn[] = useMemo(() => {
    // These are “USA-wide” best-effort official / authoritative starting points.
    // Later we can personalize by state + business type.
    const cols: LegalBoardColumn[] = [
      {
        id: "federal",
        title: "Federal",
        subtitle: "IRS + trademarks (if needed)",
        items: [
          {
            id: "ein",
            title: "Get an EIN (Employer Identification Number)",
            description:
              "Used for taxes, hiring, opening a business bank account, and many filings.",
            when: "After choosing a business name/structure (or before banking).",
            linkLabel: "IRS EIN Application (Official)",
            linkUrl: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
          },
          {
            id: "trademark-search",
            title: "Search trademarks (optional but smart)",
            description:
              "Check whether your business name or brand conflicts with existing trademarks.",
            when: "Before committing to branding/website + marketing spend.",
            linkLabel: "USPTO Trademark Search (TESS)",
            linkUrl: "https://www.uspto.gov/trademarks/search",
          },
          {
            id: "trademark-file",
            title: "File a trademark (optional)",
            description:
              "Protect your brand name/logo if it’s core to your business.",
            when: "After you validate demand + intend to build a real brand.",
            linkLabel: "USPTO Trademark Filing",
            linkUrl: "https://www.uspto.gov/trademarks/apply",
          },
        ],
      },
      {
        id: "state",
        title: "State",
        subtitle: "Form your entity + register properly",
        items: [
          {
            id: "choose-structure",
            title: "Choose your business structure (LLC / Corporation / Sole Prop)",
            description:
              "This impacts taxes, liability, paperwork, and how you run the business.",
            when: "Early — before state filings.",
            linkLabel: "SBA: Choose a business structure",
            linkUrl: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure",
          },
          {
            id: "find-state-filing",
            title: "Find your state's business filing office",
            description:
              "You’ll submit LLC/Corp formation paperwork to your state (usually Secretary of State).",
            when: "Before you file Articles/Certificate of Formation.",
            linkLabel: "SBA: Register your business (state links)",
            linkUrl: "https://www.sba.gov/business-guide/launch-your-business/register-your-business",
          },
          {
            id: "register-doing-business-as",
            title: "DBA / Fictitious name (if applicable)",
            description:
              "If operating under a name different than your legal entity, you may need a DBA.",
            when: "If your public-facing name differs from legal entity name.",
            linkLabel: "SBA: Register your business (DBA guidance)",
            linkUrl: "https://www.sba.gov/business-guide/launch-your-business/register-your-business",
          },
          {
            id: "state-tax-registration",
            title: "Register for state taxes (if applicable)",
            description:
              "Sales tax, payroll tax, etc. depend on what you sell and where you operate.",
            when: "After entity formation / before collecting sales tax or hiring.",
            linkLabel: "SBA: Get federal & state tax ID numbers",
            linkUrl: "https://www.sba.gov/business-guide/launch-your-business/get-federal-state-tax-id-numbers",
          },
        ],
      },
      {
        id: "local",
        title: "Local",
        subtitle: "Licenses & permits",
        items: [
          {
            id: "licenses-permits",
            title: "Check for required licenses & permits",
            description:
              "City/county/state permits vary by industry and location.",
            when: "Before operating, advertising, or taking payments.",
            linkLabel: "SBA: Apply for licenses & permits",
            linkUrl: "https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits",
          },
        ],
      },
      {
        id: "banking",
        title: "Banking",
        subtitle: "Keep finances clean",
        items: [
          {
            id: "open-bank-account",
            title: "Open a business bank account",
            description:
              "Separates personal and business finances (clean accounting + liability hygiene).",
            when: "After EIN + formation (varies by bank).",
            linkLabel: "SBA: Open a business bank account",
            linkUrl: "https://www.sba.gov/business-guide/launch-your-business/open-business-bank-account",
          },
          {
            id: "accounting-system",
            title: "Set up basic accounting (simple but crucial)",
            description:
              "Even a lightweight system prevents tax-season pain.",
            when: "Before first revenue is ideal.",
            linkLabel: "SBA: Manage your finances",
            linkUrl: "https://www.sba.gov/business-guide/manage-your-business/manage-your-finances",
          },
        ],
      },
      {
        id: "compliance",
        title: "Compliance",
        subtitle: "Docs + protection",
        items: [
          {
            id: "operating-agreement",
            title: "Create an Operating Agreement / Bylaws",
            description:
              "Defines ownership, decisions, and protects you if anything goes sideways.",
            when: "Right after forming your entity.",
            linkLabel: "SBA: Choose business structure (docs guidance)",
            linkUrl: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure",
          },
          {
            id: "insurance",
            title: "Get appropriate business insurance",
            description:
              "General liability, professional liability, etc. depending on business type.",
            when: "Before taking on clients/contracts.",
            linkLabel: "SBA: Get business insurance",
            linkUrl: "https://www.sba.gov/business-guide/launch-your-business/get-business-insurance",
          },
          {
            id: "privacy-terms",
            title: "Add Privacy Policy + Terms (if you have a website)",
            description:
              "Especially important if collecting emails, analytics, or payments.",
            when: "Before launch.",
            linkLabel: "FTC: Privacy & data security basics",
            linkUrl: "https://www.ftc.gov/business-guidance/privacy-security",
          },
        ],
      },
    ];

    // apply completion flags
    return cols.map((c) => ({
      ...c,
      items: (c.items || []).map((i) => ({
        ...i,
        completed: !!doneIds[i.id],
      })),
    }));
  }, [doneIds]);

  function toggleDone(itemId: string) {
    setDoneIds((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight">
          Phase 2: Business Setup & Legal
        </h1>
        <p className="mt-2 text-sm text-white/60">
          We translate “legal setup” into a simple, step-by-step workflow with official links.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
          Generating legal setup…
        </div>
      )}

      {legalSetup && (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Recommended Business Structure</h2>
            <p className="mt-2 text-white/70">{legalSetup.recommendedStructure}</p>
          </div>

          <LegalChecklist checklist={legalSetup.checklist} />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Templates & Resources</h2>
            <p className="mt-2 text-sm text-white/60">
              Quick links to common docs. (We’ll expand this into state-specific forms next.)
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-white/80">
              {(legalSetup.templates || []).map((t, idx) => (
                <li key={idx}>
                  <a
                    href={t.link || templates[t.name as keyof typeof templates]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:underline"
                  >
                    {t.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">AI Guidance & Notes</h2>
            <p className="mt-2 text-white/70">{legalSetup.notes}</p>
          </div>

          {/* ✅ NEW: “All-in-one place” workflow board (HORIZONTAL + SAVED PROGRESS) */}
          <LegalFormsBoard columns={columns} onToggleComplete={toggleDone} />
        </>
      )}
    </div>
  );
};

export default Phase2Page;
