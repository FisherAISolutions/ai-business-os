import { weights } from "./weights";

export function calculateViabilityScore(input: {
  demand: number;
  competition: number;
  saturation: number;
  profitability: number;
  difficulty: number;
}) {
  return Math.round(
    input.demand * weights.demand +
    input.profitability * weights.profitability -
    input.competition * weights.competition -
    input.saturation * weights.saturation -
    input.difficulty * weights.difficulty
  );
}
