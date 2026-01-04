// lib/legal/resources.ts

export type LegalStepCategory = "Federal" | "State" | "Local" | "Banking" | "Compliance";

export type LegalStep = {
  id: string;
  category: LegalStepCategory;
  title: string;
  whyItMatters: string;
  when: string;
  links: { label: string; url: string }[];
  optional?: boolean;
};

export const US_LEGAL_STEPS: LegalStep[] = [
  {
    id: "federal-ein",
    category: "Federal",
    title: "Get an EIN (Employer Identification Number)",
    whyItMatters:
      "An EIN is used for taxes, opening a business bank account, and many filings. Even solo founders often need one.",
    when: "After choosing a business name and structure (or before banking).",
    links: [
      { label: "IRS EIN Application (Official)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" },
    ],
  },
  {
    id: "state-entity",
    category: "State",
    title: "Form your business entity (LLC / Corporation) with your state",
    whyItMatters:
      "This is the legal act of creating your LLC or corporation. It establishes liability protection and legitimacy.",
    when: "Once you’ve selected your state and structure.",
    links: [
      { label: "Find your state business filing office", url: "https://www.usa.gov/state-business" },
      { label: "SBA: Choose a business structure", url: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure" },
    ],
  },
  {
    id: "state-name-check",
    category: "State",
    title: "Confirm name availability / reserve your name (if needed)",
    whyItMatters:
      "Avoid rejection and brand confusion. Many states require a unique business name, and name reservation can protect it temporarily.",
    when: "Before filing formation documents.",
    links: [{ label: "Search your state's business database", url: "https://www.nass.org/business-services/corporate-registration" }],
    optional: true,
  },
  {
    id: "federal-trademark-search",
    category: "Federal",
    title: "Search trademarks (USPTO) before committing to a brand name",
    whyItMatters:
      "Reduces risk of legal conflict and forced rebranding after you’ve built momentum.",
    when: "Before buying a domain and finalizing branding.",
    links: [
      { label: "USPTO Trademark Search (TESS)", url: "https://tmsearch.uspto.gov/" },
      { label: "USPTO Trademark basics", url: "https://www.uspto.gov/trademarks/basics" },
    ],
    optional: true,
  },
  {
    id: "banking-account",
    category: "Banking",
    title: "Open a business bank account",
    whyItMatters:
      "Separates personal and business finances, simplifies taxes, and is often required for payments and credibility.",
    when: "After EIN + state formation (varies by bank).",
    links: [
      { label: "SBA: Open a business bank account", url: "https://www.sba.gov/business-guide/manage-your-business/manage-your-finances" },
    ],
  },
  {
    id: "compliance-operating-agreement",
    category: "Compliance",
    title: "Create an Operating Agreement (LLC) or Bylaws (Corporation)",
    whyItMatters:
      "Defines ownership, decision-making rules, and protects you if disputes arise. Some banks request it.",
    when: "Right after forming your entity.",
    links: [
      { label: "SBA: Operating agreements overview", url: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure" },
    ],
  },
  {
    id: "local-licenses",
    category: "Local",
    title: "Check for local business licenses and permits",
    whyItMatters:
      "Many cities/counties require permits depending on your business type. Missing this can cause fines or forced shutdowns.",
    when: "After choosing your location and business activities.",
    links: [
      { label: "SBA: Apply for licenses and permits", url: "https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits" },
    ],
  },
  {
    id: "tax-state",
    category: "State",
    title: "Register for state taxes (sales tax, payroll, etc.) if applicable",
    whyItMatters:
      "If you sell taxable goods/services or hire people, you may need state tax accounts.",
    when: "Before collecting sales tax or running payroll.",
    links: [
      { label: "SBA: Get federal and state tax ID numbers", url: "https://www.sba.gov/business-guide/launch-your-business/get-federal-state-tax-id-numbers" },
    ],
    optional: true,
  },
  {
    id: "compliance-insurance",
    category: "Compliance",
    title: "Get appropriate business insurance (general liability, E&O, etc.)",
    whyItMatters:
      "Protects against common risks. Some clients require proof of insurance to work with you.",
    when: "Before signing client contracts or going live.",
    links: [
      { label: "SBA: Get business insurance", url: "https://www.sba.gov/business-guide/launch-your-business/get-business-insurance" },
    ],
    optional: true,
  },
];
