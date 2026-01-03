import React from "react";
import { BrandingOutput } from "../lib/branding/ai";

interface Props {
  branding: BrandingOutput;
}

export const BrandingPreview: React.FC<Props> = ({ branding }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">{branding.brandName}</h2>
      <p className="text-gray-700 dark:text-gray-300 italic mb-4">{branding.tagline}</p>

      <div className="mb-4">
        <h3 className="font-semibold">Colors</h3>
        <div className="flex space-x-2 mt-2">
          <div className="w-10 h-10 rounded" style={{ backgroundColor: branding.colors.primary }} />
          <div className="w-10 h-10 rounded" style={{ backgroundColor: branding.colors.secondary }} />
          <div className="w-10 h-10 rounded" style={{ backgroundColor: branding.colors.accent }} />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Typography</h3>
        <p>Heading: {branding.typography.heading}</p>
        <p>Body: {branding.typography.body}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Logo Prompt</h3>
        <p className="italic">{branding.logoPrompt}</p>
      </div>
    </div>
  );
};
