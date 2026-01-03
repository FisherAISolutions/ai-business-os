import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { BusinessState } from "../types/business";
import { generateLegalSetup } from "../lib/legal/ai";
import { LegalChecklist } from "../components/LegalChecklist";
import { templates } from "../lib/legal/templates";

interface LegalSetup {
  recommendedStructure: string;
  checklist: { step: string; completed: boolean }[];
  templates: { name: string; link: string }[];
  notes: string;
}

// MOCK: Replace with actual Phase 1 selected idea and founder
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

const Phase2Page: React.FC = () => {
  const [legalSetup, setLegalSetup] = useState<LegalSetup | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <h1 className="text-4xl font-bold mb-6">Phase 2: Business Setup & Legal</h1>

        {loading && (
          <p className="text-center text-xl text-gray-700 dark:text-gray-300">
            Generating legal setup...
          </p>
        )}

        {legalSetup && (
          <>
            <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Recommended Business Structure</h2>
              <p className="text-gray-700 dark:text-gray-300">{legalSetup.recommendedStructure}</p>
            </div>

            <LegalChecklist checklist={legalSetup.checklist} />

            <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Templates & Resources</h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                {legalSetup.templates.map((t, idx) => (
                  <li key={idx}>
                    <a
                      href={t.link || templates[t.name as keyof typeof templates]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {t.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">AI Guidance & Notes</h2>
              <p className="text-gray-700 dark:text-gray-300">{legalSetup.notes}</p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Phase2Page;
