import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { BrandingPreview } from "../components/BrandingPreview";
import { LandingPagePreview } from "../components/LandingPagePreview";
import { generateBranding } from "../lib/branding/ai";
import { FounderProfile } from "../types/business";

const mockFounder: FounderProfile = {
  skills: ["Marketing", "Tech / Development"],
  experienceLevel: "intermediate",
  budget: 2000,
  timePerWeek: 15,
  riskTolerance: "medium",
  goals: "side_hustle",
  location: "USA",
};

const Phase3Page: React.FC = () => {
  const [branding, setBranding] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const aiBranding = await generateBranding({
        businessIdeaName: "AI-Enhanced Local SEO Agency",
        founderProfile: mockFounder,
        recommendedStructure: "LLC",
        targetMarket: "Small business owners needing local SEO help",
      });
      setBranding(aiBranding);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold mb-6">Phase 3: Branding & Website</h1>

        {loading && (
          <p className="text-center text-xl text-gray-700 dark:text-gray-300">
            Generating branding assets...
          </p>
        )}

        {branding && (
          <>
            <BrandingPreview branding={branding} />
            <LandingPagePreview branding={branding} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Phase3Page;
