import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { GrowthDashboard } from "../components/GrowthDashboard";
import { generateContinuousGrowth } from "../lib/growth/ai";
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

const Phase5Page: React.FC = () => {
  const [growthData, setGrowthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const data = await generateContinuousGrowth({
        businessName: "AI-Enhanced Local SEO Agency",
        founderProfile: mockFounder,
        marketingData: {}, // can add Phase 4 output here
        trafficData: { visits: 500, conversions: 50, bounceRate: 30 },
      });
      setGrowthData(data);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold mb-6">Phase 5: Continuous Growth & Automation</h1>

        {loading && (
          <p className="text-center text-xl text-gray-700 dark:text-gray-300">
            Generating AI growth insights...
          </p>
        )}

        {growthData && <GrowthDashboard data={growthData} />}
      </div>
    </Layout>
  );
};

export default Phase5Page;
