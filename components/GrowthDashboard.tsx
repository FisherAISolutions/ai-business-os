import React from "react";

interface Props {
  data: any; // ContinuousGrowthOutput
}

export const GrowthDashboard: React.FC<Props> = ({ data }) => {
  const isObject = data && typeof data === "object";
  const kpi = isObject ? data.kpiDashboard : null;
  const growthRecommendations = isObject && Array.isArray(data.growthRecommendations) ? data.growthRecommendations : [];
  const experiments = isObject && Array.isArray(data.experiments) ? data.experiments : [];
  const automation = isObject ? data.automation : null;
  const risks = isObject && Array.isArray(data.risks) ? data.risks : [];
  const nextSteps = isObject && Array.isArray(data.nextSteps) ? data.nextSteps : [];
  const updatedLandingPage = isObject ? data.updatedLandingPage : null;

  const hasKpi =
    kpi &&
    typeof kpi === "object" &&
    typeof kpi.traffic === "string" &&
    typeof kpi.conversionRate === "number" &&
    typeof kpi.bounceRate === "number";

  if (!isObject) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-bold">Continuous Growth Dashboard</h2>
        <p className="text-gray-700 dark:text-gray-300">Growth data didn&apos;t load correctly. Try generating again.</p>
      </div>
    );
  }

  if (!hasKpi) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-bold">Continuous Growth Dashboard</h2>
        <p className="text-gray-700 dark:text-gray-300">
          The growth plan came back in an unexpected format. Please click &quot;Generate Growth Plan&quot; again.
        </p>
        <details className="text-sm text-gray-700 dark:text-gray-300">
          <summary className="cursor-pointer select-none">Show raw response</summary>
          <pre className="mt-3 p-3 rounded bg-gray-100 dark:bg-gray-900 overflow-auto">
{JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">Continuous Growth Dashboard</h2>

      {typeof data.summary === "string" && (
        <div>
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-gray-700 dark:text-gray-300">{data.summary}</p>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">KPI Dashboard</h3>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
          <li>Traffic: {kpi.traffic}</li>
          <li>Conversion Rate: {kpi.conversionRate}%</li>
          <li>Bounce Rate: {kpi.bounceRate}%</li>
          {typeof kpi.emailOpenRate === "number" && <li>Email Open Rate: {kpi.emailOpenRate}%</li>}
          {typeof kpi.socialEngagementRate === "number" && <li>Social Engagement: {kpi.socialEngagementRate}%</li>}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Growth Recommendations</h3>
        {growthRecommendations.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No recommendations returned.</p>
        ) : (
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
            {growthRecommendations.map((rec: string, idx: number) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Experiments</h3>
        {experiments.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">No experiments returned.</p>
        ) : (
          <div className="space-y-4">
            {experiments.map((exp: any, idx: number) => (
              <div key={idx} className="p-4 border rounded bg-gray-50 dark:bg-gray-900">
                <p className="font-bold">{exp?.title ?? `Experiment ${idx + 1}`}</p>
                {Array.isArray(exp?.steps) && (
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    {exp.steps.map((s: string, sIdx: number) => (
                      <li key={sIdx}>{s}</li>
                    ))}
                  </ul>
                )}
                {Array.isArray(exp?.metricsToTrack) && exp.metricsToTrack.length > 0 && (
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Track:</span> {exp.metricsToTrack.join(", ")}
                  </p>
                )}
                {typeof exp?.priorityScore === "number" && (
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Priority:</span> {exp.priorityScore}/100
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {automation && typeof automation === "object" && (
        <div>
          <h3 className="font-semibold mb-2">Automation</h3>

          {Array.isArray(automation.quickWins) && automation.quickWins.length > 0 && (
            <>
              <p className="font-semibold text-sm mb-1 text-gray-700 dark:text-gray-300">Quick Wins</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                {automation.quickWins.map((q: string, idx: number) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </>
          )}

          {Array.isArray(automation.toolsStack) && automation.toolsStack.length > 0 && (
            <>
              <p className="font-semibold text-sm mt-3 mb-1 text-gray-700 dark:text-gray-300">Tool Stack</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                {automation.toolsStack.map((t: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-semibold">{t?.tool ?? "Tool"}:</span> {t?.purpose ?? ""}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {risks.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Risks</h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
            {risks.map((r: string, idx: number) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {nextSteps.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Next Steps</h3>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
            {nextSteps.map((s: string, idx: number) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {updatedLandingPage && typeof updatedLandingPage === "object" && (
        <div>
          <h3 className="font-semibold mb-2">Updated Landing Page</h3>
          <p className="font-bold">{updatedLandingPage.headline}</p>
          <p className="text-gray-700 dark:text-gray-300">{updatedLandingPage.subheadline}</p>
          {Array.isArray(updatedLandingPage.features) && (
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
              {updatedLandingPage.features.map((f: string, idx: number) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          )}
          <p className="font-semibold mt-2">CTA: {updatedLandingPage.ctaText}</p>
        </div>
      )}
    </div>
  );
};
