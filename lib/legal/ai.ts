import OpenAI from "openai";
import { FounderProfile } from "../types/business";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateLegalSetup(founder: FounderProfile, businessName: string, location: string) {
  const prompt = `
You are a senior business consultant.

Given a founder profile and business name, generate:
1. Recommended business structure (LLC, Sole Prop, S-Corp)
2. Step-by-step legal checklist for registration
3. List of templates with guidance
4. Notes & disclaimers

Founder Profile: ${JSON.stringify(founder)}
Business Name: ${businessName}
Location: ${location}

Output JSON:
{
  "recommendedStructure": "",
  "checklist": [{"step": "", "completed": false}],
  "templates": [{"name": "", "link": ""}],
  "notes": ""
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: "You are a legal/business setup advisor AI." }, { role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000
  });

  try {
    const text = response.choices[0].message?.content || "{}";
    return JSON.parse(text);
  } catch (err) {
    console.error("AI parsing error:", err);
    return null;
  }
}
