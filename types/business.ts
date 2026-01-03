// Founder profile (used across all phases)
export interface FounderProfile {
  skills: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
  budget: number; // in USD
  timePerWeek: number; // hours available
  riskTolerance: "low" | "medium" | "high";
  goals: "side_hustle" | "startup" | "scale_existing";
  location: string;
}

// =======================
// Phase 1: Business Idea
// =======================

export interface MarketScores {
  demand: number;       // 0-100
  competition: number;  // 0-100
  saturation: number;   // 0-100
}

export interface FeasibilityScores {
  profitability: number; // 0-100
  difficulty: number;    // 0-100
  entryBarriers: number; // 0-100
}

export interface BusinessIdea {
  id: string;
  name: string;
  description: string;
  rationale: string;
  customerPersona?: string;
  pricingModel?: string;
  fitScore: number;
  market: MarketScores;
  feasibility: FeasibilityScores;
  viabilityScore: number;
  recommendation: "proceed" | "caution" | "no_go";
}

// Phase 1: Business State
export interface BusinessState {
  founder: FounderProfile;
  ideas: BusinessIdea[];
  createdAt: string;
}

// =======================
// Phase 2: Legal Setup
// =======================

export interface LegalSetup {
  recommendedStructure: string; // LLC, Sole Prop, S-Corp, etc.
  checklist: { step: string; completed: boolean }[];
  templates: { name: string; link: string }[];
  notes: string; // AI guidance
}

// =======================
// Phase 3: Branding & Website
// =======================

export interface BrandingOutput {
  brandName: string;
  tagline: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  logoPrompt: string;
  landingPage: {
    headline: string;
    subheadline: string;
    features: string[];
    ctaText: string;
    ctaUrl?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// =======================
// Phase 4: Marketing & Analytics
// =======================

export interface TrafficData {
  visits: number;
  conversions: number;
  bounceRate: number;
  trafficSources: { [source: string]: number };
}

export interface MarketingOutput {
  aiEmails: { subject: string; body: string }[];
  socialPosts: string[];
  adCopy: string[];
  metricsAnalysis: string;
  growthRecommendations: string[];
  contentCalendar?: { day: number; content: string }[];
}

// =======================
// Phase 5: Continuous Growth & Automation
// =======================

export interface EmailMetrics {
  campaignsSent: number;
  openRate: number; // %
  clickRate: number; // %
}

export interface SocialMetrics {
  postsPublished: number;
  engagementRate: number; // %
}

export interface ContinuousGrowthOutput {
  growthRecommendations: string[];
  automatedEmails: { subject: string; body: string }[];
  automatedSocialPosts: string[];
  updatedLandingPage?: {
    headline: string;
    subheadline: string;
    features: string[];
    ctaText: string;
  };
  kpiDashboard: {
    conversionRate: number;
    traffic: number;
    bounceRate: number;
    emailOpenRate?: number;
    socialEngagementRate?: number;
  };
}
