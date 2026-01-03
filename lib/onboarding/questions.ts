import { FounderProfile } from "../../types/business";

export interface OnboardingQuestion {
  key: keyof FounderProfile;
  question: string;
  type: "text" | "number" | "select" | "multiselect";
  options?: string[];
  placeholder?: string;
  helperText?: string;
}

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    key: "skills",
    question: "Which of these skills do you excel at?",
    type: "multiselect",
    options: [
      "Marketing",
      "Tech / Development",
      "Operations",
      "Sales",
      "Content Creation",
      "Finance",
      "Design",
    ],
    helperText: "Pick 2–5 if possible. This heavily influences your best-fit ideas.",
  },
  {
    key: "experienceLevel",
    question: "What is your experience level as a founder?",
    type: "select",
    options: ["beginner", "intermediate", "advanced"],
  },
  {
    key: "budget",
    question: "What is your available startup budget (in USD)?",
    type: "number",
    placeholder: "2000",
  },
  {
    key: "timePerWeek",
    question: "How many hours per week can you dedicate to your business?",
    type: "number",
    placeholder: "10",
  },
  {
    key: "riskTolerance",
    question: "What is your risk tolerance?",
    type: "select",
    options: ["low", "medium", "high"],
  },
  {
    key: "goals",
    question: "What type of business are you aiming to start?",
    type: "select",
    options: ["side_hustle", "startup", "scale_existing"],
  },
  {
    key: "location",
    question: "Where are you located?",
    type: "text",
    placeholder: "USA",
  },
];
