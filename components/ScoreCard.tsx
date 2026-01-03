import React from "react";
import { BusinessIdea } from "../types/business";

interface Props {
  idea: BusinessIdea;
}

export const ScoreCard: React.FC<Props> = ({ idea }) => {
  const { name, description, rationale, market, feasibility, fitScore, viabilityScore, recommendation } = idea;

  const recColor = recommendation === "proceed" ? "green" : recommendation === "caution" ? "yellow" : "red";

  return (
    <div className="border rounded-lg p-6 shadow-lg mb-6 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-2">{description}</p>
      <p className="italic text-gray-500 mb-4">{rationale}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-semibold mb-1">Market Scores</h3>
          <ul className="text-gray-700 dark:text-gray-300">
            <li>Demand: {market.demand}</li>
            <li>Competition: {market.competition}</li>
            <li>Saturation: {market.saturation}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Feasibility Scores</h3>
          <ul className="text-gray-700 dark:text-gray-300">
            <li>Profitability: {feasibility.profitability}</li>
            <li>Difficulty: {feasibility.difficulty}</li>
            <li>Entry Barriers: {feasibility.entryBarriers}</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={`font-bold text-${recColor}-600 dark:text-${recColor}-400`}>
          Recommendation: {recommendation.toUpperCase()}
        </span>
        <div>
          <span className="font-semibold mr-2">Fit Score:</span> {fitScore} | 
          <span className="font-semibold ml-2">Viability Score:</span> {viabilityScore}
        </div>
      </div>
    </div>
  );
};
