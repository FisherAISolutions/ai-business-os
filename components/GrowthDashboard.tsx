// components/GrowthDashboard.tsx
import React from "react";

interface Props {
  data: any; // ContinuousGrowthOutput (server may return extra fields)
}

function isObjectLike(v: any): v is Record<string, any> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function toNumberOrNull(v: any): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export const GrowthDashboard: React.FC<Props> = ({ data }) => {
  const isObj = isObjectLike(data);

  const kpi = isObj && isObjectLike(data.kpiDashboard) ? data.kpiDashboard : null;

  const traffic = kpi ? toNumberOrNull(kpi.traffic) : null;
  const conversionRate = kpi ? toNumberOrNull(kpi.conversionRate) : null;
  const bounceRate = kpi ? toNumberOrNull(kpi.bounceRate) : null;

  const emailOpenRate = kpi ? toNumberOrNull(kpi.emailOpenRate) : null;
  const socialEngagementRate = kpi ? toNumberOrNull(kpi.socialEngagementRate) : null;

  const growthRecommendations =
    isObj && Array.isArray(data.growthRecommendations) ? data.growthRecommendations.filter((x: any) => typeof x === "string") : [];

  const experiments = isObj && Array.isArray(data.experiments) ? data.experiments : [];
  const automation = isObj && isObjectLike(data.automation) ? data.automation : null;

  const risks =
    isObj && Array.isArray(data.risks) ? data.risks.filter((x: any) => typeof x === "string") : [];

  const nextSteps =
    isObj && Array.isArray(data.nextSteps) ? data.nextSteps.filter((x: any) => typeof x === "string") : [];

  const updatedLandingPage = isObj && isObjectLike(data.updatedLandingPage) ? data.updatedLandingPage : null;

  const hasKpi = traffic !== null && conversionRate !== null && bounceRate !== null;

  if (!isObj) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-bold">Continuous Growth Dashboard</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Growth data didn&apos;t load correctly. Please click &quot;Generate Growth Plan&quot; again.
        </p>
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
      <h2 className="text-2xl font-bold">Continuous Growth Dashboard</h2>

      {typeof data.summary === "string" && data.summary.trim().length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-gray-700 dark:text-gray-300">{data.summary}</p>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">KPI Dashboard</h3>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
          <li>Traffic: {traffic}</li>
          <li>Conversion Rate: {conversionRate}%</li>
          <li>Bounce Rate: {bounceRate}%</li>
          {emailOpenRate !== null && <li>Email Open Rate: {emailOpenRate}%</li>}
          {socialEngagementRate !== null && <li>Social Engagement: {socialEngagementRate}%</li>}
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
                <p className="font-bold">{typeof exp?.title === "string" ? exp.title : `Experiment ${idx + 1}`}</p>

                {Array.isArray(exp?.steps) && exp.steps.length > 0 && (
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                    {exp.steps
                      .filter((s: any) => typeof s === "string")
                      .map((s: string, sIdx: number) => (
                        <li key={sIdx}>{s}</li>
                      ))}
                  </ul>
                )}

                {Array.isArray(exp?.metricsToTrack) && exp.metricsToTrack.length > 0 && (
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Track:</span>{" "}
                    {exp.metricsToTrack.filter((m: any) => typeof m === "string").join(", ")}
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

      {automation && (
        <div>
          <h3 className="font-semibold mb-2">Automation</h3>

          {Array.isArray(automation.quickWins) && automation.quickWins.length > 0 && (
            <>
              <p className="font-semibold text-sm mb-1 text-gray-700 dark:text-gray-300">Quick Wins</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                {automation.quickWins
                  .filter((q: any) => typeof q === "string")
                  .map((q: string, idx: number) => (
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
                    <span className="font-semibold">{typeof t?.tool === "string" ? t.tool : "Tool"}:</span>{" "}
                    {typeof t?.purpose === "string" ? t.purpose : ""}
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

      {updatedLandingPage && (
        <div>
          <h3 className="font-semibold mb-2">Updated Landing Page</h3>

          {typeof updatedLandingPage.headline === "string" && (
            <p className="font-bold">{updatedLandingPage.headline}</p>
          )}

          {typeof updatedLandingPage.subheadline === "string" && (
            <p className="text-gray-700 dark:text-gray-300">{updatedLandingPage.subheadline}</p>
          )}

          {Array.isArray(updatedLandingPage.features) && updatedLandingPage.features.length > 0 && (
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300 mt-2">
              {updatedLandingPage.features
                .filter((f: any) => typeof f === "string")
                .map((f: string, idx: number) => (
                  <li key={idx}>{f}</li>
                ))}
            </ul>
          )}

          {typeof updatedLandingPage.ctaText === "string" && (
            <p className="font-semibold mt-2">CTA: {updatedLandingPage.ctaText}</p>
          )}
        </div>
      )}
    </div>
  );
};
