import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { MarketingDashboard } from "../components/MarketingDashboard";
import { generateMarketing } from "../lib/marketing/ai";
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

const Phase4Page: React.FC = () => {
  const [marketingData, setMarketingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const aiMarketing = await generateMarketing({
        businessName: "AI-Enhanced Local SEO Agency",
        landingPageContent: {
          headline: "Boost Your Local SEO Effortlessly",
          subheadline: "AI tools help small businesses rank higher",
          features: ["Automated keyword research", "On-page optimization", "Local backlink building"],
          ctaText: "Get Started",
        },
        targetMarket: "Small business owners needing local SEO help",
        founderProfile: mockFounder,
      });
      setMarketingData(aiMarketing);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold mb-6">Phase 4: AI Analytics & Marketing</h1>

        {loading && (
          <p className="text-center text-xl text-gray-700 dark:text-gray-300">
            Generating AI marketing data...
          </p>
        )}

        {marketingData && <MarketingDashboard marketingData={marketingData} />}
      </div>
    </Layout>
  );
};

export default Phase4Page;
