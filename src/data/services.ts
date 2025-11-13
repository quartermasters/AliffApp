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
  {
    slug: "past-performance",
    name: "Past Performance Narratives",
    category: "govcon",
    headline: "Turn Project History Into Winning Proof",
    description:
      "Strategic past performance narratives that prove capability and build evaluator confidence, not just list what you did.",
    overview: {
      whatItIs:
        "Past performance narratives that transform project history into compelling proof of your ability to deliver. We don't just describe what you did - we prove why it matters to this specific solicitation.",
      whoNeedsIt:
        "Contractors responding to RFPs with past performance requirements, businesses with completed projects but weak documentation, firms pursuing work similar to previous contracts.",
      keyChallenges: [
        "Past performance sections read like boring project summaries",
        "Can't find metrics or quantifiable results from old projects",
        "Not sure which projects are most relevant to highlight",
        "Contract references don't respond or provide weak feedback",
        "Limited relevant experience in the specific domain",
      ],
      whyStrategic:
        "Past performance is often worth 30-40% of evaluation points. Strategic selection and presentation of projects - emphasizing relevance, results, and risk mitigation - separates winners from losers.",
    },
    approach: {
      phase1: {
        title: "Strategic Selection",
        description: "Identify which past projects maximize evaluation points",
        details: [
          "Analyze solicitation evaluation criteria for past performance requirements",
          "Review all available past projects for relevance mapping",
          "Calculate relevance scores based on: domain, scope, complexity, recency",
          "Identify gaps and determine mitigation strategies",
          "Select optimal mix of projects (typically 3-5) to maximize points",
          "Develop storyline connecting past work to current requirement",
        ],
      },
      phase2: {
        title: "AI-Powered Drafting",
        description: "AI creates compelling narratives from project data",
        details: [
          "Extract key information from contract files and closeout documents",
          "AI generates narrative following best-practice structure",
          "Emphasize challenges overcome, risks mitigated, innovation delivered",
          "Quantify results: cost savings, schedule performance, quality metrics",
          "Connect past project details to current RFP requirements",
          "Generate reference questionnaire responses proactively",
        ],
      },
      phase3: {
        title: "Expert Validation",
        description: "Ensure accuracy and maximize persuasive impact",
        details: [
          "Verify all facts, dates, contract numbers, and performance data",
          "Strengthen weak narratives with additional metrics or context",
          "Ensure consistency across all past performance narratives",
          "Prep references with talking points for likely evaluator questions",
          "Final polish for readability and persuasive impact",
          "Quality check against evaluation criteria",
        ],
      },
    },
    deliverables: [
      {
        name: "Past Performance Narratives",
        description: "3-5 compelling project narratives with metrics",
      },
      {
        name: "Relevance Matrix",
        description: "Analysis showing how each project maps to requirements",
      },
      {
        name: "Reference Contact Sheet",
        description: "Complete reference information with prep notes",
      },
      {
        name: "Reference Talking Points",
        description: "Brief for references on what to emphasize",
      },
      {
        name: "Questionnaire Responses",
        description: "Pre-drafted responses to standard CPARS questions",
      },
    ],
    turnaroundTime: "3-5 days for standard projects",
    revisionsIncluded: "2 rounds of revisions, unlimited factual corrections",
    pricing: {
      message: "Pricing based on number of past performance narratives needed",
      note: "Often bundled with proposal development services",
    },
    relatedServices: ["proposal-development", "capability-statements"],
    caseStudies: [
      {
        title: "Weak Past Performance Becomes Differentiator",
        challenge:
          "Small business had relevant experience but no formal CPARS ratings. Competing against firms with 'Exceptional' ratings from same agency.",
        solution:
          "Strategic narrative emphasized innovation and cost savings (20% under budget) on similar project. Positioned lack of formal rating as 'new to agency but proven elsewhere' rather than weakness.",
        result:
          "Received 38/40 points on past performance vs average competitor score of 35/40. Past performance became strength despite rating disadvantage.",
        metrics: ["38/40 points", "Outscored firms with Exceptional ratings"],
      },
    ],
    faq: [
      {
        question: "What if I don't have relevant past performance?",
        answer:
          "We use several strategies: emphasize transferable experience from similar domains, highlight individual team member experience, use teaming partners to fill gaps, or position as 'new approach' rather than 'no experience.'",
      },
      {
        question: "What if my references don't respond to evaluator calls?",
        answer:
          "We proactively prep references with talking points and schedules, provide evaluators with multiple contact methods, and create reference questionnaire responses that stand alone even if calls aren't made.",
      },
      {
        question: "Can you improve bad CPARS ratings?",
        answer:
          "We can't change official ratings, but we can provide context, emphasize what was learned and corrected, and ensure other stronger projects receive more emphasis in the narrative.",
      },
      {
        question: "How many past performance examples should I include?",
        answer:
          "Typically 3-5 depending on RFP requirements. Quality over quantity - three highly relevant projects with strong metrics beat five mediocre examples.",
      },
    ],
    differentiators: {
      aiOnly:
        "Generic project descriptions with no strategic selection. Misses opportunities to emphasize relevance and results.",
      traditional:
        "Writers create narratives but don't strategically select projects or calculate relevance scores. Often includes too many weak examples.",
      aliff:
        "Strategic project selection using relevance scoring, AI-powered narrative generation emphasizing results, expert validation of all facts and metrics.",
    },
  },
  {
    slug: "price-volume",
    name: "Price Volume Development",
    category: "govcon",
    headline: "Competitive Pricing That Wins Without Leaving Money On The Table",
    description:
      "Strategic pricing development with compelling narratives that justify your approach while remaining competitive.",
    overview: {
      whatItIs:
        "Complete price volume development including cost model, pricing strategy, BOE narratives, and justifications. We help you price to win while maintaining profitability.",
      whoNeedsIt:
        "Contractors responding to cost-reimbursable or T&M RFPs, businesses unsure how to price competitively, firms needing BOE and cost narrative support.",
      keyChallenges: [
        "Don't know what competitors will bid",
        "Price too high: lose on cost. Price too low: lose profit or credibility",
        "Can't justify indirect rates or other cost elements convincingly",
        "Basis of Estimate (BOE) narratives are weak or missing",
        "Price volume is just a spreadsheet with no strategic narrative",
      ],
      whyStrategic:
        "Price is often 30-50% of evaluation points. Strategic pricing means understanding agency budget, competitive landscape, and evaluation formula to optimize win probability while maintaining margin.",
    },
    approach: {
      phase1: {
        title: "Pricing Strategy",
        description: "Develop competitive pricing approach based on intelligence",
        details: [
          "Analyze agency budget and historical contract values",
          "Competitive intelligence: estimate likely competitor pricing",
          "Understand evaluation methodology (LPTA, tradeoff, etc.)",
          "Calculate price-to-win range with sensitivity analysis",
          "Develop should-cost model for realistic baseline",
          "Determine optimal pricing strategy (aggressive, conservative, value-based)",
        ],
      },
      phase2: {
        title: "AI-Powered Cost Development",
        description: "Build detailed cost model with AI assistance",
        details: [
          "AI generates labor hour estimates based on SOW requirements",
          "Material and ODC cost research and documentation",
          "Indirect rate application and justification development",
          "BOE narrative generation for each cost element",
          "Risk pricing analysis and recommendation",
          "Alternative pricing scenarios for leadership decision",
        ],
      },
      phase3: {
        title: "Narrative Development",
        description: "Create compelling justifications for all cost elements",
        details: [
          "Executive summary explaining pricing approach and value",
          "BOE narratives for every labor category and task",
          "Indirect rate justification with supporting documentation",
          "Cost realism explanations for complex elements",
          "Value proposition: why your price delivers best value",
          "Final review for consistency with technical volume",
        ],
      },
    },
    deliverables: [
      {
        name: "Complete Price Volume",
        description: "Formatted pricing with all required SF forms",
      },
      {
        name: "Detailed Cost Model",
        description: "Excel workbook with all calculations and assumptions",
      },
      {
        name: "BOE Narratives",
        description: "Basis of Estimate for each cost element",
      },
      {
        name: "Pricing Strategy Memo",
        description: "Justification of pricing approach for leadership",
      },
      {
        name: "Competitive Analysis",
        description: "Estimated competitor pricing ranges",
      },
      {
        name: "Sensitivity Analysis",
        description: "Impact of pricing adjustments on win probability",
      },
    ],
    turnaroundTime: "4-6 days after technical volume is complete",
    revisionsIncluded: "2 rounds of pricing revisions",
    pricing: {
      message: "Pricing based on contract value and complexity",
      note: "Often bundled with full proposal development",
    },
    relatedServices: ["proposal-development", "technical-volume"],
    caseStudies: [
      {
        title: "Strategic Pricing Wins $8M Contract Despite Higher Cost",
        challenge:
          "Client's realistic pricing was 15% higher than should-cost estimate. LPTA evaluation meant lowest price would likely win.",
        solution:
          "Developed value narrative showing 20% faster delivery and lower risk. Emphasized cost realism and past performance of on-budget delivery. Positioned higher price as 'realistic vs optimistic'.",
        result:
          "Won despite being 12% higher than lowest bidder. Evaluators rated higher price as 'more realistic' and factored delivery speed into best value determination.",
        metrics: ["$8M contract value", "12% higher than low bid", "Rated most realistic"],
      },
    ],
    faq: [
      {
        question: "Should I always bid the lowest price?",
        answer:
          "For LPTA (Lowest Price Technically Acceptable), yes if technically qualified. For tradeoff evaluations, focus on best value - sometimes slightly higher price with better technical approach wins. We analyze each situation.",
      },
      {
        question: "How do you estimate competitor pricing?",
        answer:
          "We use historical contract values, industry standards, competitor intelligence, and cost models to estimate likely bid ranges. Not perfect but helps you make informed decisions.",
      },
      {
        question: "What if my indirect rates are higher than industry average?",
        answer:
          "We develop justification narratives explaining your rates, showing what's included, and demonstrating value. Sometimes restructuring how costs are presented helps without changing total price.",
      },
      {
        question: "Can you help with cost vs price strategy?",
        answer:
          "Yes, we help determine optimal fee/profit margins, identify cost reduction opportunities, and develop pricing that balances competitiveness with profitability.",
      },
    ],
    differentiators: {
      aiOnly:
        "AI can build spreadsheets but can't develop competitive pricing strategy or understand evaluator cost realism analysis.",
      traditional:
        "Pricing consultants build models but often lack proposal expertise to align pricing narrative with technical story.",
      aliff:
        "Strategic pricing intelligence combined with AI-powered cost modeling and expert narrative development. Competitive pricing that maintains profit.",
    },
  },
  {
    slug: "technical-volume",
    name: "Technical Volume Writing",
    category: "govcon",
    headline: "Technical Solutions That Evaluators Understand and Trust",
    description:
      "Technical volumes that prove feasibility and build confidence without drowning evaluators in jargon.",
    overview: {
      whatItIs:
        "Technical approach volumes that clearly explain your solution, demonstrate feasibility, and address evaluation criteria. We translate technical complexity into evaluator-friendly narratives.",
      whoNeedsIt:
        "Contractors responding to complex technical RFPs, firms with strong technical teams but weak writing, businesses pursuing IT, engineering, or technical services contracts.",
      keyChallenges: [
        "Technical experts can't write clearly for non-technical evaluators",
        "Too much jargon makes proposals incomprehensible",
        "Approach is technically sound but doesn't address evaluation criteria",
        "Can't balance detail (proving feasibility) with readability",
        "Subject matter experts too busy to write",
      ],
      whyStrategic:
        "Technical approach is typically 40-60% of evaluation points. Strategic technical writing means proving you can deliver while making it easy for evaluators to give you high scores.",
    },
    approach: {
      phase1: {
        title: "Technical Strategy",
        description: "Develop technical approach that maximizes evaluation points",
        details: [
          "Analyze technical requirements and evaluation criteria",
          "Interview SMEs to understand proposed solution",
          "Identify technical discriminators vs competitors",
          "Map technical approach to each evaluation subfactor",
          "Develop solution architecture and visual aids strategy",
          "Create technical volume outline with compliance matrix",
        ],
      },
      phase2: {
        title: "AI-Powered Technical Writing",
        description: "Generate technical content with AI, guided by SME input",
        details: [
          "AI generates technical narratives from SME interviews and notes",
          "Translate complex technical concepts into clear language",
          "Ensure proper technical depth without excessive jargon",
          "Generate technical diagrams, flowcharts, and visual aids",
          "Cross-reference technical approach with past performance examples",
          "Ensure compliance with all technical requirements",
        ],
      },
      phase3: {
        title: "SME Validation & Refinement",
        description: "Technical experts validate accuracy and feasibility",
        details: [
          "SMEs review all technical content for accuracy",
          "Strengthen weak technical sections with additional detail",
          "Ensure technical approach is realistic and achievable",
          "Remove or clarify technical jargon where needed",
          "Final compliance check against SOW requirements",
          "Polish for readability by non-technical evaluators",
        ],
      },
    },
    deliverables: [
      {
        name: "Complete Technical Volume",
        description: "Full technical approach addressing all requirements",
      },
      {
        name: "Technical Diagrams",
        description: "Architecture diagrams, workflows, and visual aids",
      },
      {
        name: "Compliance Matrix",
        description: "Cross-reference of requirements to proposal sections",
      },
      {
        name: "Technical Risk Analysis",
        description: "Identification and mitigation of technical risks",
      },
      {
        name: "SME Review Notes",
        description: "Documentation of technical validation process",
      },
    ],
    turnaroundTime: "5-7 days depending on technical complexity",
    revisionsIncluded: "2 rounds of revisions plus SME feedback incorporation",
    pricing: {
      message: "Pricing based on technical complexity and volume length",
      note: "Often bundled with full proposal development",
    },
    relatedServices: ["proposal-development", "price-volume"],
    caseStudies: [
      {
        title: "Complex Cloud Migration Proposal Wins Despite Technical Complexity",
        challenge:
          "Highly technical cloud infrastructure migration for DoD. Evaluators were program managers, not cloud architects. Previous proposals scored poorly for 'lack of clarity.'",
        solution:
          "Developed layered approach: executive summary for non-technical readers, detailed technical appendix for evaluators who wanted depth. Used extensive diagrams to explain complex migration phases.",
        result:
          "Scored 48/50 on technical approach. Evaluator comments praised 'clarity and feasibility' despite complex technical solution.",
        metrics: ["48/50 technical score", "Complex solution explained clearly"],
      },
    ],
    faq: [
      {
        question: "What if my technical approach is highly specialized?",
        answer:
          "We work with your SMEs to understand the approach, then translate it into language evaluators can understand while maintaining technical credibility. We don't dumb it down - we clarify it.",
      },
      {
        question: "How much technical detail should be included?",
        answer:
          "Enough to prove feasibility without overwhelming. We use layered approach: clear summary up front, detailed technical content in body, comprehensive appendices for evaluators who want more.",
      },
      {
        question: "What if our SMEs don't have time to write?",
        answer:
          "That's exactly why clients use us. We interview SMEs for 1-2 hours, then AI generates first draft. SMEs review for accuracy (much faster than writing from scratch). Typical SME time: 4-6 hours vs 40+ to write themselves.",
      },
      {
        question: "Can you handle classified technical approaches?",
        answer:
          "Yes, our team includes cleared technical writers. We have processes for handling classified information and can work in SCIF environments when needed.",
      },
    ],
    differentiators: {
      aiOnly:
        "AI-generated technical content lacks feasibility validation and often includes technical hallucinations. Not reviewed by actual experts.",
      traditional:
        "Traditional technical writers are expensive ($150+/hour) and slow. Still require extensive SME time for interviews and reviews.",
      aliff:
        "AI generates drafts from SME input (90% time savings), experts validate accuracy and feasibility, strategic approach ensures evaluation criteria are met.",
    },
  },
  {
    slug: "capability-statements",
    name: "Capability Statements",
    category: "govcon",
    headline: "Capability Statements That Open Doors",
    description:
      "Strategic capability statements that get you noticed by agencies and prime contractors for teaming opportunities.",
    overview: {
      whatItIs:
        "Professional capability statements (1-2 pages) showcasing your company's qualifications, past performance, and differentiators. Used for pre-RFP marketing, teaming, and initial agency outreach.",
      whoNeedsIt:
        "Small businesses pursuing federal contracts, companies building agency relationships, firms seeking teaming opportunities, contractors responding to capability requests.",
      keyChallenges: [
        "Generic capability statements that look like everyone else's",
        "Don't know what to emphasize for different agencies/opportunities",
        "Capability statement is too long (3+ pages) or too vague",
        "Not sure how to present socioeconomic status (8(a), WOSB, etc.)",
        "Outdated information or unclear value proposition",
      ],
      whyStrategic:
        "First impression matters. Strategic capability statements emphasize what makes you different and relevant to the specific opportunity or agency, not just list what you do.",
    },
    approach: {
      phase1: {
        title: "Strategic Positioning",
        description: "Define your unique value and target audience",
        details: [
          "Identify core competencies and competitive differentiators",
          "Analyze target agencies and their priorities",
          "Determine optimal positioning (specialist vs generalist)",
          "Review past performance for strongest examples",
          "Identify socioeconomic advantages to highlight",
          "Develop messaging that resonates with target audience",
        ],
      },
      phase2: {
        title: "AI-Powered Content Development",
        description: "Generate compelling capability statement content",
        details: [
          "AI drafts core capabilities section with strategic emphasis",
          "Past performance section highlighting relevant successes",
          "Company overview emphasizing differentiators",
          "Contract vehicle and certification information",
          "Generate multiple versions for different audiences",
          "Create visual design with professional branding",
        ],
      },
      phase3: {
        title: "Refinement & Finalization",
        description: "Polish for maximum impact and versatility",
        details: [
          "Ensure 1-2 page length for quick reading",
          "Strengthen value proposition and differentiators",
          "Verify all facts, contract numbers, NAICS codes",
          "Professional graphic design and layout",
          "Create customizable template for future updates",
          "Final review for clarity and impact",
        ],
      },
    },
    deliverables: [
      {
        name: "Master Capability Statement",
        description: "1-2 page professional capability statement (PDF)",
      },
      {
        name: "Editable Template",
        description: "Word/PowerPoint template for future updates",
      },
      {
        name: "Agency-Specific Versions",
        description: "2-3 customized versions for target agencies",
      },
      {
        name: "Digital Version",
        description: "Web-friendly version for email and websites",
      },
      {
        name: "Social Media Graphics",
        description: "LinkedIn/Twitter optimized versions",
      },
    ],
    turnaroundTime: "3-5 days for initial version",
    revisionsIncluded: "2 rounds of content revisions",
    pricing: {
      message: "Fixed pricing for capability statement development",
      note: "Often bundled with capture strategy services",
    },
    relatedServices: ["capture-strategy", "proposal-development"],
    caseStudies: [
      {
        title: "WOSB Capability Statement Generates 12 Teaming Opportunities",
        challenge:
          "Women-owned small business had strong capabilities but generic capability statement. Not getting teaming invitations despite active marketing.",
        solution:
          "Created focused capability statement emphasizing WOSB status, specific NAICS codes for target opportunities, and past performance with metrics. Designed for easy forwarding and quick reading.",
        result:
          "Within 3 months: 12 teaming inquiries, 4 subcontract awards, 2 prime opportunities identified.",
        metrics: ["12 teaming opportunities", "4 subcontracts won", "3 months"],
      },
    ],
    faq: [
      {
        question: "How is a capability statement different from a proposal?",
        answer:
          "Capability statements are pre-RFP marketing tools (1-2 pages) for general outreach. Proposals are solicitation-specific responses (often 50-100+ pages). Think of capability statements as your company's resume.",
      },
      {
        question: "Should I have different capability statements for different agencies?",
        answer:
          "Yes, ideally. We create a master template plus 2-3 agency-specific versions emphasizing different capabilities or past performance relevant to each agency's priorities.",
      },
      {
        question: "What if I'm a new company with no past performance?",
        answer:
          "Emphasize individual team experience, relevant commercial work, socioeconomic status if applicable, and unique approach or capability. New doesn't mean unqualified.",
      },
      {
        question: "How often should I update my capability statement?",
        answer:
          "Update quarterly or after major contract wins, certifications, or capability additions. We provide editable templates so you can make minor updates yourself.",
      },
    ],
    differentiators: {
      aiOnly:
        "AI-generated capability statements are generic and lack strategic positioning. Look like templates.",
      traditional:
        "Traditional graphic designers create beautiful layouts but don't understand federal contracting or strategic positioning.",
      aliff:
        "Strategic positioning for federal market, AI-powered content emphasizing differentiators, professional design, expert review by former COs who know what agencies look for.",
    },
  },
  {
    slug: "teaming-agreements",
    name: "Teaming Agreements",
    category: "govcon",
    headline: "Teaming Agreements That Protect and Empower",
    description:
      "Strategic teaming agreements that define roles, protect your interests, and position partnerships for success.",
    overview: {
      whatItIs:
        "Legal agreements between prime and subcontractor(s) defining roles, responsibilities, workshare, pricing, and terms for pursuing and performing government contracts together.",
      whoNeedsIt:
        "Primes seeking subcontractors to fill capability gaps, small businesses teaming with larger primes, companies forming partnerships to pursue large opportunities.",
      keyChallenges: [
        "Generic teaming agreement templates miss critical protections",
        "Unclear workshare or pricing splits lead to disputes",
        "Prime takes all control, sub has no protection",
        "Agreement doesn't address post-award changes or scope additions",
        "Legal review is expensive ($5K-15K per agreement)",
      ],
      whyStrategic:
        "Teaming agreements set the foundation for successful partnerships. Strategic agreements balance control and protection, define clear roles, and prevent disputes before they happen.",
    },
    approach: {
      phase1: {
        title: "Strategic Partnership Design",
        description: "Define optimal teaming structure and terms",
        details: [
          "Analyze RFP requirements and capability gaps",
          "Define prime/sub roles and responsibilities clearly",
          "Determine workshare percentages and task allocation",
          "Establish pricing structure and payment terms",
          "Identify key person requirements and staffing commitments",
          "Develop dispute resolution and termination provisions",
        ],
      },
      phase2: {
        title: "AI-Assisted Drafting",
        description: "Generate comprehensive teaming agreement",
        details: [
          "AI generates agreement using best-practice templates",
          "Customize for specific opportunity and partnership structure",
          "Include all required FAR/DFARS compliance provisions",
          "Address intellectual property and proprietary information",
          "Define proposal cost sharing and win/loss scenarios",
          "Include post-award modification and scope change provisions",
        ],
      },
      phase3: {
        title: "Legal Review & Finalization",
        description: "Expert review and negotiation support",
        details: [
          "Contracts expert reviews for gaps and risks",
          "Strengthen protections for your position (prime or sub)",
          "Ensure compliance with federal contracting requirements",
          "Provide negotiation talking points and recommendations",
          "Support during partner negotiations if needed",
          "Final execution-ready agreement",
        ],
      },
    },
    deliverables: [
      {
        name: "Complete Teaming Agreement",
        description: "Comprehensive agreement ready for execution",
      },
      {
        name: "Workshare Matrix",
        description: "Detailed breakdown of responsibilities by partner",
      },
      {
        name: "Pricing Schedule",
        description: "Cost allocation and payment terms",
      },
      {
        name: "Negotiation Guidance",
        description: "Key points and fallback positions for negotiations",
      },
      {
        name: "Compliance Checklist",
        description: "Verification of FAR/DFARS requirements",
      },
    ],
    turnaroundTime: "3-5 days for initial draft",
    revisionsIncluded: "2 rounds of revisions plus negotiation support",
    pricing: {
      message: "Fixed pricing per teaming agreement",
      note: "Significantly less expensive than attorney-drafted agreements ($300-800 vs $5K-15K)",
    },
    relatedServices: ["capture-strategy", "proposal-development"],
    caseStudies: [
      {
        title: "Teaming Agreement Saves Sub $200K in Disputed Work",
        challenge:
          "Small business subcontractor on $15M contract. Prime tried to reduce sub's scope post-award without adjusting price. Generic teaming agreement had no protection.",
        solution:
          "Our teaming agreements include scope change provisions requiring written amendments and price adjustments. Client used agreement to force negotiation.",
        result:
          "Prime agreed to maintain original scope or reduce price proportionally. Sub avoided $200K in lost revenue.",
        metrics: ["$200K in revenue protected", "Avoided contract dispute"],
      },
    ],
    faq: [
      {
        question: "Is a teaming agreement legally binding?",
        answer:
          "Yes, when properly executed. They're enforceable contracts. However, they're most valuable as prevention - clear terms reduce disputes. Include dispute resolution and termination clauses as backup.",
      },
      {
        question: "What if we don't win the contract?",
        answer:
          "Agreement should address this: typically no obligations if not awarded. May include proposal cost sharing terms. Always define what happens in loss scenario.",
      },
      {
        question: "Can the prime change my scope after award?",
        answer:
          "Only if agreement allows it. We include provisions requiring written amendments for scope changes with corresponding price adjustments. Protects both parties from scope creep.",
      },
      {
        question: "Do I need a lawyer to review this?",
        answer:
          "Our agreements are drafted by contracts experts and include standard protections. Many clients use them as-is. If your company requires legal review, our agreements reduce attorney review time (and cost) significantly.",
      },
      {
        question: "What about intellectual property created during the contract?",
        answer:
          "Critical issue we address. Agreement defines ownership of background IP, foreground IP created during performance, and data rights. Especially important for R&D or software development.",
      },
    ],
    differentiators: {
      aiOnly:
        "AI can generate generic contract language but doesn't understand federal contracting nuances or strategic protection.",
      traditional:
        "Attorneys draft comprehensive agreements but cost $5K-15K and take 2-3 weeks. Often over-lawyered for straightforward teaming.",
      aliff:
        "Best-practice templates customized for federal contracting, AI-assisted drafting for speed, expert review for protection. Attorney-quality at fraction of cost and time.",
    },
  },
  {
    slug: "subcontracting-plans",
    name: "Subcontracting Plans",
    category: "govcon",
    headline: "Compliant Subcontracting Plans That Meet Goals",
    description:
      "Small business subcontracting plans that satisfy FAR requirements and demonstrate good faith effort.",
    overview: {
      whatItIs:
        "Required submission for contracts over $750K (or $1.5M for construction) demonstrating commitment to small business subcontracting. Includes goals, approach, and compliance procedures.",
      whoNeedsIt:
        "Large businesses and other than small businesses responding to federal RFPs, primes seeking to demonstrate small business utilization, companies needing to meet subcontracting goals.",
      keyChallenges: [
        "Don't know realistic small business utilization goals for this contract",
        "Can't find small business subcontractors in required categories",
        "Plan is generic and doesn't demonstrate good faith effort",
        "Unsure how to comply with reporting requirements",
        "Government rejects plan for insufficient goals or weak approach",
      ],
      whyStrategic:
        "Subcontracting plans are increasingly scrutinized. Strategic plans set achievable goals, identify real small business partners, and demonstrate genuine commitment - not just checkbox compliance.",
    },
    approach: {
      phase1: {
        title: "Goal Development",
        description: "Establish realistic and competitive small business goals",
        details: [
          "Analyze contract requirements and subcontracting opportunities",
          "Research historical small business utilization for similar contracts",
          "Review agency and government-wide goals for categories",
          "Identify which work packages can go to small businesses",
          "Calculate realistic goals by category (SB, SDB, WOSB, VOSB, HUBZone)",
          "Develop competitive goals that demonstrate commitment",
        ],
      },
      phase2: {
        title: "AI-Powered Plan Development",
        description: "Generate comprehensive subcontracting plan",
        details: [
          "AI generates plan narrative following FAR requirements",
          "Develop approach for identifying and soliciting small businesses",
          "Create compliance and monitoring procedures",
          "Address reporting requirements (ISR/SSR)",
          "Include good faith effort documentation",
          "Generate subcontracting opportunity descriptions",
        ],
      },
      phase3: {
        title: "Partner Identification & Validation",
        description: "Identify real small business partners and finalize plan",
        details: [
          "Research and identify potential small business subcontractors",
          "Verify certifications and capabilities",
          "Document outreach efforts and responses",
          "Strengthen plan with specific partner commitments",
          "Final compliance review against FAR 19.704",
          "Prepare for potential government questions or negotiations",
        ],
      },
    },
    deliverables: [
      {
        name: "Complete Subcontracting Plan",
        description: "FAR-compliant plan ready for submission",
      },
      {
        name: "Goals Analysis",
        description: "Justification for goals by category",
      },
      {
        name: "Partner List",
        description: "Identified small business subcontractors with capabilities",
      },
      {
        name: "Compliance Procedures",
        description: "Monitoring and reporting procedures",
      },
      {
        name: "Outreach Documentation",
        description: "Good faith effort documentation",
      },
    ],
    turnaroundTime: "5-7 days including partner research",
    revisionsIncluded: "2 rounds of revisions plus government negotiation support",
    pricing: {
      message: "Pricing based on contract value and complexity",
      note: "Often bundled with proposal development services",
    },
    relatedServices: ["proposal-development", "teaming-agreements"],
    caseStudies: [
      {
        title: "Aggressive Small Business Goals Help Win $25M Contract",
        challenge:
          "Large business competing for DoD contract with strong small business preference. Previous subcontracting plans used minimum acceptable goals (20% small business).",
        solution:
          "Developed aggressive but achievable 35% small business goal with identified partners. Demonstrated commitment through specific subcontracting opportunities and named teaming partners.",
        result:
          "Subcontracting plan scored 'Excellent' and became differentiator. Client won contract and achieved 37% actual small business utilization (exceeded plan goals).",
        metrics: ["35% SB goal vs 20% typical", "37% actual utilization", "$25M contract"],
      },
    ],
    faq: [
      {
        question: "What small business goals should I commit to?",
        answer:
          "Depends on contract type and agency. We analyze similar contracts and agency goals to recommend competitive but achievable targets. Typically 20-40% total small business, with subcategory goals varying.",
      },
      {
        question: "What if I can't find small businesses in all categories?",
        answer:
          "You're required to show good faith effort, not guarantee results. We document outreach attempts, explain market limitations, and focus goals on categories with available partners.",
      },
      {
        question: "What happens if I don't meet the goals after award?",
        answer:
          "You must demonstrate good faith effort. We include monitoring procedures and documentation requirements in the plan. Failure without good faith effort can result in penalties or future proposal rejection.",
      },
      {
        question: "Do I need actual commitments from small businesses?",
        answer:
          "Not required for plan submission, but strengthens credibility. We help identify potential partners and document outreach. After award, you must actively implement the plan.",
      },
      {
        question: "How often do I need to report?",
        answer:
          "Semi-annually (SSR) and annually (ISR) to eSRS. We include reporting procedures and timeline in the plan so you're prepared for post-award compliance.",
      },
    ],
    differentiators: {
      aiOnly:
        "AI generates generic plans with arbitrary goals and no real partner identification. Government easily spots template plans.",
      traditional:
        "Consultants write plans but often don't research actual market availability or identify real partners. May commit to unrealistic goals.",
      aliff:
        "Strategic goal development based on market research, AI-powered plan generation, actual small business partner identification and outreach, expert validation for compliance.",
    },
  },
];

export const sledServices: Service[] = [
  {
    slug: "rfp-response",
    name: "RFP Response Development",
    category: "sled",
    headline: "Win State and Local Contracts with Strategic SLED Proposals",
    description:
      "Complete SLED RFP responses that navigate 50 different state requirements while maximizing evaluation points.",
    overview: {
      whatItIs:
        "Full-service RFP response development for state, local, and education opportunities. We handle the unique requirements of SLED procurement while delivering strategic, competitive proposals.",
      whoNeedsIt:
        "Companies pursuing state contracts, businesses expanding into local government, firms responding to education RFPs, vendors navigating multi-state opportunities.",
      keyChallenges: [
        "Every state has different requirements and processes",
        "Local governments use inconsistent evaluation criteria",
        "Education procurement mixes state and federal rules",
        "DBE/MBE requirements vary by jurisdiction",
        "Can't reuse federal proposal approaches for SLED",
      ],
      whyStrategic:
        "SLED procurement is not just 'simpler federal contracting.' Each state has unique evaluation priorities, political considerations, and compliance requirements. Strategic SLED proposals address specific state contexts.",
    },
    approach: {
      phase1: {
        title: "SLED-Specific Analysis",
        description: "Understand state/local requirements and evaluation approach",
        details: [
          "Analyze state-specific procurement rules and evaluation methods",
          "Identify local priorities and political considerations",
          "Research incumbent and competitive landscape",
          "Review DBE/MBE and local preference requirements",
          "Map state evaluation criteria to your capabilities",
          "Develop win strategy specific to this jurisdiction",
        ],
      },
      phase2: {
        title: "AI-Powered SLED Writing",
        description: "Generate proposal content following state formats",
        details: [
          "AI generates content using state-specific templates and language",
          "Address local priorities and evaluation criteria",
          "Incorporate DBE/MBE compliance narratives",
          "Develop pricing following state cost formats",
          "Create required forms and certifications per state",
          "Ensure compliance with all state-specific requirements",
        ],
      },
      phase3: {
        title: "State Compliance Validation",
        description: "Expert review for state-specific compliance",
        details: [
          "SLED procurement experts review for compliance",
          "Verify all state forms and certifications are complete",
          "Ensure DBE/MBE commitments are realistic and documented",
          "Validate pricing against state standards",
          "Final review for local priorities and evaluation criteria",
          "Quality check before submission to state portal",
        ],
      },
    },
    deliverables: [
      {
        name: "Complete RFP Response",
        description: "Full proposal following state format requirements",
      },
      {
        name: "State-Specific Forms",
        description: "All required state certifications and forms",
      },
      {
        name: "DBE/MBE Documentation",
        description: "Compliance documentation for diversity requirements",
      },
      {
        name: "Pricing Schedules",
        description: "State-specific pricing formats and justifications",
      },
      {
        name: "Compliance Checklist",
        description: "Verification of all state requirements met",
      },
    ],
    turnaroundTime: "5-7 days for standard SLED RFPs",
    revisionsIncluded: "2 rounds of revisions",
    pricing: {
      message: "Pricing based on RFP complexity and state requirements",
      note: "Multi-state proposals may require additional time",
    },
    relatedServices: ["state-contracts", "dbe-mbe-compliance", "multi-state"],
    caseStudies: [
      {
        title: "First-Time State Vendor Wins $3M California Contract",
        challenge:
          "Small business had never worked with California. Competing against 15 established state vendors. Unfamiliar with California's unique evaluation process.",
        solution:
          "Research revealed California prioritizes innovation and cost savings over incumbency. Emphasized new approach and 15% cost reduction vs current contract. Addressed DVBE requirements proactively.",
        result:
          "Won contract. Evaluators rated proposal 'innovative' and noted cost savings. Beat 3 incumbent vendors.",
        metrics: ["$3M contract value", "Beat 3 incumbents", "First California contract"],
      },
    ],
    faq: [
      {
        question: "How is SLED procurement different from federal?",
        answer:
          "Each state has unique rules, forms, and evaluation criteria. Some states use informal processes vs federal's rigid FAR structure. Local politics and preferences matter more. DBE/MBE requirements vary. We navigate these differences for you.",
      },
      {
        question: "Can you handle multiple states simultaneously?",
        answer:
          "Yes, we have experience with all 50 states. If pursuing similar opportunities across states, we can adapt winning approaches while respecting each state's unique requirements.",
      },
      {
        question: "What if the RFP has strict page limits?",
        answer:
          "Common in SLED. We strategically prioritize content, use concise language, and optimize layout to maximize impact within constraints. Often more challenging than federal unlimited-page proposals.",
      },
      {
        question: "Do you understand education procurement?",
        answer:
          "Yes, education RFPs often mix state procurement rules with federal education funding requirements. We handle both, whether K-12, community college, or university systems.",
      },
    ],
    differentiators: {
      aiOnly:
        "AI trained on federal procurement generates wrong approach for SLED. Misses state-specific requirements and local priorities.",
      traditional:
        "Many proposal firms focus on federal, have limited SLED experience. Don't understand state variations or local politics.",
      aliff:
        "Expertise across all 50 states, AI generates state-appropriate content, experts validate compliance with specific state requirements.",
    },
  },
  {
    slug: "state-contracts",
    name: "State Contract Proposals",
    category: "sled",
    headline: "Master State Procurement Across All 50 States",
    description:
      "State-specific proposal development that navigates unique requirements and evaluation criteria for each state.",
    overview: {
      whatItIs:
        "Specialized state contract proposal development understanding the unique procurement processes, evaluation methods, and compliance requirements of each state government.",
      whoNeedsIt:
        "Businesses pursuing state agency contracts, companies expanding into new states, vendors responding to state-level RFPs across multiple states.",
      keyChallenges: [
        "Texas procurement is completely different from New York",
        "Don't know if state uses best value or low bid evaluation",
        "State veteran/minority preferences vary dramatically",
        "Some states require in-state presence or hiring",
        "State political considerations affect contract awards",
      ],
      whyStrategic:
        "State procurement success requires understanding each state's political priorities, economic development goals, and evaluation nuances. Generic approaches fail.",
    },
    approach: {
      phase1: {
        title: "State Intelligence Gathering",
        description: "Research state-specific requirements and priorities",
        details: [
          "Analyze state procurement code and evaluation methodology",
          "Identify state economic development and local hiring priorities",
          "Research incumbent and state vendor history",
          "Understand state budget and funding sources",
          "Review state agency priorities and pain points",
          "Identify veteran, minority, and in-state preferences",
        ],
      },
      phase2: {
        title: "State-Tailored Proposal Development",
        description: "Create proposal addressing state priorities",
        details: [
          "AI generates content emphasizing state-specific benefits",
          "Address local economic impact and job creation",
          "Incorporate state preferences into win themes",
          "Develop pricing competitive for state market",
          "Create required state forms and certifications",
          "Ensure compliance with all state-specific requirements",
        ],
      },
      phase3: {
        title: "State Expert Validation",
        description: "Review by experts with state-specific experience",
        details: [
          "Experts validate approach for this specific state",
          "Verify all state forms completed correctly",
          "Ensure messaging aligns with state priorities",
          "Final compliance check against state requirements",
          "Quality review for state evaluation criteria",
          "Prepare for potential state evaluation process",
        ],
      },
    },
    deliverables: [
      {
        name: "State-Specific Proposal",
        description: "Complete proposal following state format",
      },
      {
        name: "State Forms Package",
        description: "All required state certifications and forms",
      },
      {
        name: "Local Impact Narrative",
        description: "Economic development and local hiring commitments",
      },
      {
        name: "Preference Documentation",
        description: "Veteran, minority, or in-state preference documentation",
      },
      {
        name: "State Compliance Checklist",
        description: "Verification of state-specific requirements",
      },
    ],
    turnaroundTime: "5-7 days per state proposal",
    revisionsIncluded: "2 rounds of revisions",
    pricing: {
      message: "Per-state pricing with multi-state discounts available",
      note: "State research and compliance included",
    },
    relatedServices: ["rfp-response", "multi-state", "dbe-mbe-compliance"],
    caseStudies: [
      {
        title: "Multi-State Expansion Wins 5 States in 6 Months",
        challenge:
          "National company had federal contracts but no state presence. Wanted to expand into 5 target states with similar IT services opportunities.",
        solution:
          "Developed master proposal template, then customized for each state's specific priorities, preferences, and evaluation criteria. Texas emphasized economic development, California prioritized innovation, New York valued experience.",
        result:
          "Won contracts in 4 of 5 states within 6 months. Total contract value $8M across states.",
        metrics: ["4 of 5 states won", "$8M total value", "6 months"],
      },
    ],
    faq: [
      {
        question: "Which states are easiest for new vendors?",
        answer:
          "Varies by industry, but states with strong best-value evaluation (vs low bid only) give new vendors better chances. Texas, Virginia, and Washington are generally more open. New York and California favor experience but pay for quality.",
      },
      {
        question: "Do we need an in-state presence to win?",
        answer:
          "Some states give preference to in-state companies (usually 5-10% price advantage). Others require local hiring commitments. We develop strategies for out-of-state vendors, including teaming with local partners when beneficial.",
      },
      {
        question: "How do state veteran preferences work?",
        answer:
          "Highly variable. Some states give veteran-owned businesses price preferences, others award points, some have set-asides. We research specific state rules and help maximize your advantage if applicable.",
      },
      {
        question: "Can you handle state cooperative purchasing agreements?",
        answer:
          "Yes, state co-ops (NASPO, WSCA, regional) are excellent entry points to multi-state opportunities. We help you pursue lead state awards and leverage them for piggyback contracts.",
      },
    ],
    differentiators: {
      aiOnly:
        "AI doesn't understand state political priorities or local preferences. Generates federal-style proposals inappropriate for states.",
      traditional:
        "Most firms specialize in specific states or regions. Hard to find experts across all 50 states.",
      aliff:
        "Database of state-specific requirements and priorities, AI customizes content per state, experts validate for each state's unique context.",
    },
  },
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
