import React from "react";
import { BrandingOutput } from "../lib/branding/ai";

interface Props {
  branding: BrandingOutput;
}

export const LandingPagePreview: React.FC<Props> = ({ branding }) => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg mt-6">
      <h1 className="text-4xl font-bold mb-2">{branding.landingPage.headline}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{branding.landingPage.subheadline}</p>

      <ul className="list-disc pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300">
        {branding.landingPage.features.map((f, idx) => (
          <li key={idx}>{f}</li>
        ))}
      </ul>

      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">{branding.landingPage.ctaText}</button>
    </div>
  );
};
