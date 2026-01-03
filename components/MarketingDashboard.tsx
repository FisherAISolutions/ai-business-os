import React from "react";

interface MarketingDashboardProps {
  marketingData: any; // MarketingOutput
}

export const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ marketingData }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">AI Marketing Dashboard</h2>

      <div>
        <h3 className="font-semibold mb-2">AI Email Campaigns</h3>
        {marketingData.aiEmails.map((email: any, idx: number) => (
          <div key={idx} className="mb-2 p-2 border rounded">
            <p className="font-bold">{email.subject}</p>
            <p>{email.body}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Social Media Posts</h3>
        <ul className="list-disc pl-6 space-y-1">
          {marketingData.socialPosts.map((post: string, idx: number) => (
            <li key={idx}>{post}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Ad Copy</h3>
        <ul className="list-disc pl-6 space-y-1">
          {marketingData.adCopy.map((ad: string, idx: number) => (
            <li key={idx}>{ad}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Metrics Analysis</h3>
        <p>{marketingData.metricsAnalysis}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Growth Recommendations</h3>
        <ul className="list-disc pl-6 space-y-1">
          {marketingData.growthRecommendations.map((rec: string, idx: number) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
