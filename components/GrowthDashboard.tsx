import React from "react";

interface Props {
  data: any; // ContinuousGrowthOutput
}

export const GrowthDashboard: React.FC<Props> = ({ data }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">Continuous Growth Dashboard</h2>

      <div>
        <h3 className="font-semibold mb-2">KPI Dashboard</h3>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
          <li>Traffic: {data.kpiDashboard.traffic}</li>
          <li>Conversion Rate: {data.kpiDashboard.conversionRate}%</li>
          <li>Bounce Rate: {data.kpiDashboard.bounceRate}%</li>
          {data.kpiDashboard.emailOpenRate && <li>Email Open Rate: {data.kpiDashboard.emailOpenRate}%</li>}
          {data.kpiDashboard.socialEngagementRate && <li>Social Engagement: {data.kpiDashboard.socialEngagementRate}%</li>}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Growth Recommendations</h3>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
          {data.growthRecommendations.map((rec: string, idx: number) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Automated Marketing</h3>
        <p className="font-semibold">Emails:</p>
        {data.automatedEmails.map((email: any, idx: number) => (
          <div key={idx} className="mb-2 p-2 border rounded">
            <p className="font-bold">{email.subject}</p>
            <p>{email.body}</p>
          </div>
        ))}
        <p className="font-semibold mt-2">Social Posts:</p>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
          {data.automatedSocialPosts.map((post: string, idx: number) => (
            <li key={idx}>{post}</li>
          ))}
        </ul>
      </div>

      {data.updatedLandingPage && (
        <div>
          <h3 className="font-semibold mb-2">Updated Landing Page</h3>
          <p className="font-bold">{data.updatedLandingPage.headline}</p>
          <p>{data.updatedLandingPage.subheadline}</p>
          <ul className="list-disc pl-6 space-y-1">
            {data.updatedLandingPage.features.map((f: string, idx: number) => (
              <li key={idx}>{f}</li>
            ))}
          </ul>
          <p className="font-semibold mt-2">CTA: {data.updatedLandingPage.ctaText}</p>
        </div>
      )}
    </div>
  );
};
