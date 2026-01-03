export const ideaGenerationPrompt = `
You are a senior startup strategist.

Generate business ideas tailored to the founder profile below.
Return structured JSON only.

Founder Profile:
{{FOUNDER_PROFILE}}

Rules:
- Solo-founder viable
- Budget aware
- Skill aligned
- Realistic markets
`;
