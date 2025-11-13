export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceCaseStudy {
  title: string;
  challenge: string;
  solution: string;
  result: string;
  metrics?: string[];
}

export interface ServiceDeliverable {
  name: string;
  description: string;
}

export interface ServicePhase {
  title: string;
  description: string;
  details: string[];
}

export interface Service {
  slug: string;
  name: string;
  category: "govcon" | "sled" | "writing" | "it";
  headline: string;
  description: string;
  overview: {
    whatItIs: string;
    whoNeedsIt: string;
    keyChallenges: string[];
    whyStrategic: string;
  };
  approach: {
    phase1: ServicePhase;
    phase2: ServicePhase;
    phase3: ServicePhase;
  };
  deliverables: ServiceDeliverable[];
  turnaroundTime: string;
  revisionsIncluded: string;
  pricing: {
    message: string;
    note?: string;
  };
  relatedServices: string[]; // slugs of related services
  caseStudies: ServiceCaseStudy[];
  faq: ServiceFAQ[];
  differentiators: {
    aiOnly: string;
    traditional: string;
    aliff: string;
  };
}

export const govconServices: Service[] = [
  {
    slug: "proposal-development",
    name: "Proposal Development",
    category: "govcon",
    headline: "Win 22% of Federal Contracts with Strategic Proposals",
    description:
      "Full-service proposal development combining strategic diagnosis, AI-powered execution, and expert refinement to beat AI commodity competitors.",
    overview: {
      whatItIs:
        "Complete end-to-end proposal development for federal contracts, from initial RFP analysis through final submission. We handle technical volumes, management volumes, past performance, and pricing.",
      whoNeedsIt:
        "Government contractors responding to federal RFPs, businesses new to federal contracting, agencies needing capacity for multiple simultaneous proposals.",
      keyChallenges: [
        "30 proposals all look identical because everyone uses ChatGPT templates",
        "Contracting officers spot AI-generated generic content immediately",
        "No strategic differentiation leads to 4% win rates",
        "Tight deadlines make strategic thinking feel impossible",
        "Compliance requirements are complex and easy to miss",
      ],
      whyStrategic:
        "Strategic diagnosis before writing is the only way to stand out. We analyze what the agency really wants (not just what they wrote), identify competitive differentiators, and design a win strategy before any AI touches the content.",
    },
    approach: {
      phase1: {
        title: "Strategic Diagnosis",
        description: "Human experts analyze the solicitation and design your win strategy",
        details: [
          "Former contracting officers review the RFP to understand evaluator mindset",
          "Identify hidden evaluation priorities beyond stated criteria",
          "Competitive landscape analysis: who else is bidding and how to differentiate",
          "Win themes development: strategic messaging unique to your capabilities",
          "Compliance matrix creation: catch traps before writing begins",
          "Determine optimal proposal structure and story arc",
        ],
      },
      phase2: {
        title: "AI-Powered Execution",
        description: "Multi-AI orchestration handles 80% of content creation",
        details: [
          "Deploy GPT-5 for technical writing, Claude for narrative, specialized models for specific sections",
          "AI writes content following the strategic blueprint (not generic templates)",
          "Automated compliance checking against the solicitation matrix",
          "Past performance database mining for relevant examples",
          "Pricing volume development with AI-assisted analysis",
          "Graphics and visual aids generation",
        ],
      },
      phase3: {
        title: "Expert Refinement",
        description: "Human experts review, refine, and ensure strategic excellence",
        details: [
          "Senior proposal managers review for strategic alignment",
          "Technical experts validate accuracy and feasibility",
          "Compliance specialists verify all requirements are met",
          "Remove AI hallucinations and generic phrasing",
          "Polish for readability and persuasive impact",
          "Final quality assurance before submission",
        ],
      },
    },
    deliverables: [
      {
        name: "Technical Volume",
        description: "Complete technical approach and solution description",
      },
      {
        name: "Management Volume",
        description: "Management approach, staffing plan, project timeline",
      },
      {
        name: "Past Performance Volume",
        description: "Relevant past performance narratives with metrics",
      },
      {
        name: "Pricing Volume",
        description: "Complete pricing with narratives and justifications",
      },
      {
        name: "Executive Summary",
        description: "Compelling summary highlighting win themes",
      },
      {
        name: "Compliance Matrix",
        description: "Section-by-section compliance verification",
      },
      {
        name: "Source Files",
        description: "Editable Word/PDF files with all content",
      },
    ],
    turnaroundTime: "5-7 days for standard proposals, 3-4 days rush available",
    revisionsIncluded: "2 rounds of revisions included, unlimited minor edits",
    pricing: {
      message: "Custom pricing based on proposal complexity and timeline",
      note: "Agency volume discounts available - contact for details",
    },
    relatedServices: [
      "capture-strategy",
      "past-performance",
      "technical-volume",
      "price-volume",
    ],
    caseStudies: [
      {
        title: "Mid-Size IT Contractor Wins $12M Contract",
        challenge:
          "Competing against 28 other bidders for Department of Defense IT services contract. Previous win rate was 5% using in-house team with AI tools.",
        solution:
          "Strategic diagnosis revealed evaluators prioritized security clearance depth over past performance quantity. Restructured entire proposal around security-first messaging instead of generic technical competence.",
        result:
          "Won contract against larger competitors. Score: 94/100 vs average competitor score of 76/100.",
        metrics: [
          "22% win rate improvement",
          "7-day turnaround vs 21 days in-house",
          "$12M contract value",
        ],
      },
    ],
    faq: [
      {
        question: "How is this different from using ChatGPT ourselves?",
        answer:
          "ChatGPT and other AI tools execute without strategy. They produce generic content because they don't understand evaluator psychology, competitive landscape, or your unique differentiators. We put human strategic analysis first, then use AI for execution speed - not the other way around.",
      },
      {
        question: "What if our proposal deadline is in 3 days?",
        answer:
          "We offer rush service for urgent deadlines. Contact us immediately - we've successfully delivered quality proposals in 72 hours when needed. Rush fees apply but we maintain the same 3-phase strategic process.",
      },
      {
        question: "Do you guarantee we'll win?",
        answer:
          "No one can guarantee wins in federal contracting - too many variables beyond the proposal (incumbent advantage, pricing, teaming, etc.). We guarantee strategic differentiation and 22% average win rates vs 4% industry average.",
      },
      {
        question: "Can you handle classified or sensitive proposals?",
        answer:
          "Yes, our team includes cleared personnel. We have processes for handling CUI, classified, and proprietary information. Contact us to discuss security requirements.",
      },
      {
        question: "What if we need help beyond just writing?",
        answer:
          "We offer full capture strategy services including pre-RFP intelligence gathering, teaming partner identification, and bid/no-bid analysis. See our Capture Strategy service for details.",
      },
    ],
    differentiators: {
      aiOnly:
        "Generic proposals from templates. No strategic thinking. Evaluators immediately recognize AI-generated content. 4% win rate.",
      traditional:
        "Expensive senior writers ($150-200/hour). Slow turnaround (3-4 weeks). All-human process can't scale to multiple simultaneous proposals.",
      aliff:
        "Strategic diagnosis by former COs, AI execution for speed, expert refinement for quality. Differentiated proposals that beat commodity competitors. 22% win rate at traditional firm costs.",
    },
  },
  {
    slug: "capture-strategy",
    name: "Capture Strategy",
    category: "govcon",
    headline: "Win Before the RFP Drops",
    description:
      "Pre-RFP intelligence gathering, relationship building, and strategic positioning to shape requirements and maximize win probability.",
    overview: {
      whatItIs:
        "Strategic planning and execution of activities before RFP release to position your company as the preferred vendor. Includes agency intelligence, requirement shaping, teaming strategy, and bid/no-bid analysis.",
      whoNeedsIt:
        "Companies pursuing large contracts ($5M+), businesses new to an agency, contractors wanting to improve win rates, firms targeting strategic opportunities.",
      keyChallenges: [
        "RFP requirements favor incumbents or competitors",
        "No relationships with key decision makers",
        "Don't know who else is pursuing the opportunity",
        "Can't influence requirements after RFP release",
        "Unclear if opportunity is worth pursuing",
      ],
      whyStrategic:
        "80% of contract outcomes are determined before RFP release. Strategic capture ensures requirements align with your strengths and you're positioned as the preferred solution.",
    },
    approach: {
      phase1: {
        title: "Strategic Intelligence",
        description: "Gather intelligence on agency needs and competitive landscape",
        details: [
          "Agency stakeholder mapping and relationship assessment",
          "Identify key decision makers and influencers",
          "Understand agency pain points and budget priorities",
          "Competitive intelligence: who's positioned and how",
          "Incumbent analysis: strengths to counter, weaknesses to exploit",
          "Requirements analysis: what's likely to be in RFP",
        ],
      },
      phase2: {
        title: "Positioning & Shaping",
        description: "Position your solution and shape requirements",
        details: [
          "Develop differentiated solution approach",
          "Create white papers or capability statements for agency stakeholders",
          "Schedule meetings with program offices to discuss challenges",
          "Provide technical guidance that subtly favors your approach",
          "Identify and build teaming partnerships to fill gaps",
          "Shape RFP language through industry day participation",
        ],
      },
      phase3: {
        title: "Capture Execution",
        description: "Execute capture plan and prepare for RFP release",
        details: [
          "Monitor RFP release timeline and draft requirements",
          "Bid/no-bid decision based on probability of win (Pwin) analysis",
          "Teaming agreements finalized with partners",
          "Solution architecture pre-developed before RFP",
          "Pricing strategy and cost modeling completed",
          "Proposal team mobilized and ready to execute on day 1",
        ],
      },
    },
    deliverables: [
      {
        name: "Capture Plan",
        description: "Complete capture strategy and execution timeline",
      },
      {
        name: "Competitive Intelligence Report",
        description: "Analysis of competitors and their positioning",
      },
      {
        name: "Stakeholder Map",
        description: "Key decision makers and influence strategy",
      },
      {
        name: "Solution Architecture",
        description: "Pre-RFP solution design aligned with agency needs",
      },
      {
        name: "Teaming Strategy",
        description: "Partner recommendations and teaming approach",
      },
      {
        name: "Bid/No-Bid Analysis",
        description: "Pwin calculation and go/no-go recommendation",
      },
      {
        name: "Pricing Strategy",
        description: "Cost model and competitive pricing approach",
      },
    ],
    turnaroundTime: "4-12 weeks depending on opportunity timeline",
    revisionsIncluded: "Ongoing strategy refinement throughout capture phase",
    pricing: {
      message: "Monthly retainer or project-based pricing depending on engagement length",
      note: "ROI typically 10x-50x for large contract captures",
    },
    relatedServices: ["proposal-development", "capability-statements", "teaming-agreements"],
    caseStudies: [
      {
        title: "Small Business Wins $45M IDIQ Against Incumbents",
        challenge:
          "Company had never worked with the agency. Incumbent had 5-year relationship. Requirements were being written to favor incumbent's approach.",
        solution:
          "6-month capture strategy including stakeholder meetings, white paper on innovative approach, teaming with complementary small business. Shaped requirements to emphasize innovation over incumbency.",
        result:
          "Won contract. Agency changed evaluation criteria to add 'innovative approach' worth 30 points after our white paper.",
        metrics: ["$45M contract value", "Beat 3 incumbents", "First time working with agency"],
      },
    ],
    faq: [
      {
        question: "How far in advance should we start capture?",
        answer:
          "Ideally 6-12 months before expected RFP release for large contracts, 3-6 months for smaller opportunities. It's rarely too early to start building agency relationships.",
      },
      {
        question: "What if we don't know when the RFP will be released?",
        answer:
          "We use multiple intelligence sources (budget cycles, SAM.gov, agency contacts, FOIA requests) to predict RFP timing. We also help you position for the next opportunity even if current timing is unclear.",
      },
      {
        question: "Is capture worth it for small contracts under $1M?",
        answer:
          "Usually not. Capture ROI is best for contracts $5M+. For smaller opportunities, focus on excellent proposal development and past performance instead.",
      },
      {
        question: "Can you guarantee we'll win if we do capture?",
        answer:
          "No guarantees, but our capture clients average 40-60% win rates vs 4% industry average. Capture dramatically improves odds but doesn't eliminate all risk.",
      },
      {
        question: "What if the agency won't meet with us?",
        answer:
          "We have strategies for indirect influence: industry day participation, written questions, teaming with known vendors, and public comment on draft requirements. Direct access is ideal but not required.",
      },
    ],
    differentiators: {
      aiOnly: "AI can't build relationships or gather intelligence. Capture is fundamentally human.",
      traditional:
        "Large capture consultants charge $20K-50K/month. Often process-heavy without practical agency experience.",
      aliff:
        "Former contracting officers who understand agency psychology. Practical capture tactics that work. Cost-effective for mid-size businesses.",
    },
  },
  // Additional GOVCON services will be added here
  // For now, including placeholder structure for the remaining 6 services
];

export const sledServices: Service[] = [
  // SLED services will be added
];

export const writingServices: Service[] = [
  // Writing services will be added
];

export const itServices: Service[] = [
  // IT services will be added
];

export const allServices = [
  ...govconServices,
  ...sledServices,
  ...writingServices,
  ...itServices,
];

export function getServiceBySlug(slug: string): Service | undefined {
  return allServices.find((service) => service.slug === slug);
}

export function getServicesByCategory(
  category: "govcon" | "sled" | "writing" | "it"
): Service[] {
  return allServices.filter((service) => service.category === category);
}
