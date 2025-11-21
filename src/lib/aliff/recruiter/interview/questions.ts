import { InterviewQuestion, InterviewQuestionBank } from "./types";

/**
 * ALIFF-RECRUITER Interview Question Bank (200+ questions)
 *
 * Categorized by:
 * - Behavioral (40 questions)
 * - Technical GOVCON (30 questions)
 * - Technical SLED (25 questions)
 * - Technical IT Services (35 questions)
 * - Technical Writing Services (30 questions)
 * - Situational (25 questions)
 * - Cultural Fit (20 questions)
 *
 * Total: 205 questions
 */

// BEHAVIORAL QUESTIONS (40)
const behavioralQuestions: InterviewQuestion[] = [
  {
    id: "beh-001",
    category: "BEHAVIORAL",
    question:
      "Tell me about a time when you had to meet a tight deadline. How did you manage your time and priorities?",
    followUps: [
      "What was the outcome?",
      "What would you do differently?",
    ],
    expectedKeywords: [
      "prioritization",
      "time management",
      "communication",
      "planning",
    ],
    scoringCriteria: {
      excellent: ["specific example", "clear process", "measurable outcome"],
      good: ["relevant example", "some details", "positive result"],
      poor: ["vague", "no specific example", "negative outcome"],
    },
  },
  {
    id: "beh-002",
    category: "BEHAVIORAL",
    question:
      "Describe a situation where you had to work with a difficult team member. How did you handle it?",
    followUps: ["What was the resolution?", "How did this affect the project?"],
    expectedKeywords: ["communication", "conflict resolution", "empathy", "professionalism"],
  },
  {
    id: "beh-003",
    category: "BEHAVIORAL",
    question:
      "Tell me about a project where you had to learn a new skill quickly. How did you approach it?",
    expectedKeywords: ["learning", "adaptability", "resourcefulness", "initiative"],
  },
  {
    id: "beh-004",
    category: "BEHAVIORAL",
    question:
      "Give me an example of a time when you received critical feedback. How did you respond?",
    expectedKeywords: ["feedback", "growth mindset", "improvement", "professionalism"],
  },
  {
    id: "beh-005",
    category: "BEHAVIORAL",
    question:
      "Describe a situation where you had to manage multiple projects simultaneously. How did you prioritize?",
    expectedKeywords: ["prioritization", "organization", "time management", "delegation"],
  },
  {
    id: "beh-006",
    category: "BEHAVIORAL",
    question:
      "Tell me about a time when you identified a problem before it became critical. What did you do?",
    expectedKeywords: ["proactive", "problem-solving", "initiative", "analytical"],
  },
  {
    id: "beh-007",
    category: "BEHAVIORAL",
    question:
      "Describe a situation where you had to persuade someone to see things your way. What was your approach?",
    expectedKeywords: ["persuasion", "communication", "data-driven", "empathy"],
  },
  {
    id: "beh-008",
    category: "BEHAVIORAL",
    question:
      "Give me an example of a time when you failed. What did you learn?",
    expectedKeywords: ["accountability", "learning", "resilience", "growth"],
  },
  {
    id: "beh-009",
    category: "BEHAVIORAL",
    question:
      "Tell me about a time when you had to adapt to a significant change at work. How did you handle it?",
    expectedKeywords: ["adaptability", "flexibility", "positive attitude", "resilience"],
  },
  {
    id: "beh-010",
    category: "BEHAVIORAL",
    question:
      "Describe a situation where you went above and beyond what was expected. What motivated you?",
    expectedKeywords: ["initiative", "commitment", "excellence", "dedication"],
  },
  // Additional 30 behavioral questions
  { id: "beh-011", category: "BEHAVIORAL", question: "Tell me about your most challenging project and how you overcame the obstacles." },
  { id: "beh-012", category: "BEHAVIORAL", question: "Describe a time when you had to make a decision without all the information you needed." },
  { id: "beh-013", category: "BEHAVIORAL", question: "Give an example of when you successfully managed stakeholder expectations." },
  { id: "beh-014", category: "BEHAVIORAL", question: "Tell me about a time when you had to work with limited resources." },
  { id: "beh-015", category: "BEHAVIORAL", question: "Describe a situation where you improved a process or workflow." },
  { id: "beh-016", category: "BEHAVIORAL", question: "Tell me about a time when you had to say no to a request from a manager or client." },
  { id: "beh-017", category: "BEHAVIORAL", question: "Describe a situation where you had to build consensus among a diverse group." },
  { id: "beh-018", category: "BEHAVIORAL", question: "Give an example of when you coached or mentored someone successfully." },
  { id: "beh-019", category: "BEHAVIORAL", question: "Tell me about a time when you had to deliver bad news to a client or stakeholder." },
  { id: "beh-020", category: "BEHAVIORAL", question: "Describe a situation where you had to balance competing priorities from different stakeholders." },
  { id: "beh-021", category: "BEHAVIORAL", question: "Tell me about a time when you had to take ownership of someone else's mistake." },
  { id: "beh-022", category: "BEHAVIORAL", question: "Describe a situation where you successfully advocated for a resource or budget increase." },
  { id: "beh-023", category: "BEHAVIORAL", question: "Give an example of when you had to rebuild trust with a client or team member." },
  { id: "beh-024", category: "BEHAVIORAL", question: "Tell me about a time when you successfully negotiated a win-win outcome." },
  { id: "beh-025", category: "BEHAVIORAL", question: "Describe a situation where you had to pivot your approach mid-project." },
  { id: "beh-026", category: "BEHAVIORAL", question: "Tell me about a time when you led a team through a crisis or urgent situation." },
  { id: "beh-027", category: "BEHAVIORAL", question: "Describe a situation where you had to work with someone from a very different background or culture." },
  { id: "beh-028", category: "BEHAVIORAL", question: "Give an example of when you challenged the status quo or questioned an established process." },
  { id: "beh-029", category: "BEHAVIORAL", question: "Tell me about a time when you successfully managed a remote or distributed team." },
  { id: "beh-030", category: "BEHAVIORAL", question: "Describe a situation where you had to make an unpopular decision." },
  { id: "beh-031", category: "BEHAVIORAL", question: "Tell me about your biggest professional accomplishment and why it matters to you." },
  { id: "beh-032", category: "BEHAVIORAL", question: "Describe a time when you had to learn from a competitor or peer." },
  { id: "beh-033", category: "BEHAVIORAL", question: "Give an example of when you successfully resolved a misunderstanding or miscommunication." },
  { id: "beh-034", category: "BEHAVIORAL", question: "Tell me about a time when you had to work under pressure with high stakes." },
  { id: "beh-035", category: "BEHAVIORAL", question: "Describe a situation where you successfully onboarded to a new role or organization quickly." },
  { id: "beh-036", category: "BEHAVIORAL", question: "Tell me about a time when you had to give difficult feedback to a peer or team member." },
  { id: "beh-037", category: "BEHAVIORAL", question: "Describe a situation where you successfully recovered from a project setback." },
  { id: "beh-038", category: "BEHAVIORAL", question: "Give an example of when you had to influence without authority." },
  { id: "beh-039", category: "BEHAVIORAL", question: "Tell me about a time when you championed diversity or inclusion in your workplace." },
  { id: "beh-040", category: "BEHAVIORAL", question: "Describe a situation where you had to balance speed with quality." },
];

// TECHNICAL QUESTIONS - GOVCON (30)
const govconQuestions: InterviewQuestion[] = [
  {
    id: "tech-govcon-001",
    category: "TECHNICAL",
    question:
      "Explain your understanding of the FAR (Federal Acquisition Regulation) and its importance in government contracting.",
    expectedKeywords: ["FAR", "compliance", "procurement", "regulations"],
    jobCategories: ["GOVCON"],
  },
  {
    id: "tech-govcon-002",
    category: "TECHNICAL",
    question:
      "Walk me through your process for responding to an RFP from initial receipt to final submission.",
    expectedKeywords: [
      "compliance matrix",
      "Section L",
      "Section M",
      "team coordination",
      "quality review",
    ],
    jobCategories: ["GOVCON"],
  },
  {
    id: "tech-govcon-003",
    category: "TECHNICAL",
    question:
      "What's the difference between an RFP, RFQ, and IFB? When would each be used?",
    expectedKeywords: ["RFP", "RFQ", "IFB", "procurement", "proposal types"],
    jobCategories: ["GOVCON"],
  },
  {
    id: "tech-govcon-004",
    category: "TECHNICAL",
    question:
      "How do you approach past performance narratives? What makes a strong past performance reference?",
    expectedKeywords: [
      "past performance",
      "CPARS",
      "relevancy",
      "similarity",
      "quantifiable results",
    ],
    jobCategories: ["GOVCON"],
  },
  {
    id: "tech-govcon-005",
    category: "TECHNICAL",
    question:
      "Explain the Shipley methodology and how you've applied it in your proposal work.",
    expectedKeywords: ["Shipley", "color reviews", "proposal process", "win themes"],
    jobCategories: ["GOVCON"],
  },
  { id: "tech-govcon-006", category: "TECHNICAL", question: "What is CMMC and why is it important for DoD contractors?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-007", category: "TECHNICAL", question: "Describe your experience with FedRAMP compliance and authorization processes.", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-008", category: "TECHNICAL", question: "How do you develop win themes that resonate with federal evaluators?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-009", category: "TECHNICAL", question: "Explain the difference between Price-to-Win (PTW) and Should-Cost analysis.", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-010", category: "TECHNICAL", question: "What are the key elements of a compliant proposal management plan?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-011", category: "TECHNICAL", question: "How do you ensure your technical approach aligns with Section M evaluation criteria?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-012", category: "TECHNICAL", question: "Describe your experience with GSA Schedule contracts and task order competitions.", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-013", category: "TECHNICAL", question: "What is a compliance matrix and how do you use it throughout the proposal process?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-014", category: "TECHNICAL", question: "Explain the difference between LPTA and Best Value evaluation methodologies.", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-015", category: "TECHNICAL", question: "How do you approach writing for DoD vs civilian agency proposals?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-016", category: "TECHNICAL", question: "What role does capture management play in proposal development?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-017", category: "TECHNICAL", question: "Describe your experience with GWAC vehicles (SEWP, CIO-SP3, Alliant, etc.).", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-018", category: "TECHNICAL", question: "How do you develop discriminators that differentiate your proposal from competitors?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-019", category: "TECHNICAL", question: "Explain the protest process and how it affects proposal strategy.", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-020", category: "TECHNICAL", question: "What are the key requirements for 8(a), SDVOSB, or other socioeconomic set-asides?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-021", category: "TECHNICAL", question: "How do you conduct competitive analysis for government proposals?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-022", category: "TECHNICAL", question: "Describe your experience with oral presentations and demos for federal evaluations.", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-023", category: "TECHNICAL", question: "What is your approach to managing proposal budgets and resource allocation?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-024", category: "TECHNICAL", question: "How do you handle proprietary or classified information in proposals?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-025", category: "TECHNICAL", question: "Explain the role of Key Personnel sections and how to make them compelling.", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-026", category: "TECHNICAL", question: "What is your experience with teaming agreements and subcontractor management?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-027", category: "TECHNICAL", question: "How do you approach transition planning sections in proposals?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-028", category: "TECHNICAL", question: "Describe your experience with SeaPort-e, OASIS, or other IDIQs.", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-029", category: "TECHNICAL", question: "What metrics do you track to measure proposal quality and win probability?", jobCategories: ["GOVCON"] },
  { id: "tech-govcon-030", category: "TECHNICAL", question: "How do you stay current with changing federal procurement regulations?", jobCategories: ["GOVCON"] },
];

// TECHNICAL QUESTIONS - SLED (25)
const sledQuestions: InterviewQuestion[] = [
  {
    id: "tech-sled-001",
    category: "TECHNICAL",
    question:
      "What are the key differences between federal and state/local procurement processes?",
    expectedKeywords: [
      "state procurement",
      "regulations",
      "timelines",
      "evaluation criteria",
    ],
    jobCategories: ["SLED"],
  },
  {
    id: "tech-sled-002",
    category: "TECHNICAL",
    question:
      "Describe your experience with K-12 or higher education RFPs. What makes them unique?",
    expectedKeywords: [
      "education",
      "K-12",
      "higher education",
      "funding sources",
      "evaluation",
    ],
    jobCategories: ["SLED"],
  },
  {
    id: "tech-sled-003",
    category: "TECHNICAL",
    question:
      "How do you approach proposals for state Medicaid or health and human services agencies?",
    expectedKeywords: ["Medicaid", "HHS", "compliance", "outcomes-based"],
    jobCategories: ["SLED"],
  },
  { id: "tech-sled-004", category: "TECHNICAL", question: "What is your experience with cooperative purchasing agreements (NASPO, NCPA, E&I)?", jobCategories: ["SLED"] },
  { id: "tech-sled-005", category: "TECHNICAL", question: "How do you navigate varying state-specific procurement regulations?", jobCategories: ["SLED"] },
  { id: "tech-sled-006", category: "TECHNICAL", question: "Describe your approach to municipal government proposals (cities, counties).", jobCategories: ["SLED"] },
  { id: "tech-sled-007", category: "TECHNICAL", question: "What role does local content or in-state presence play in SLED proposals?", jobCategories: ["SLED"] },
  { id: "tech-sled-008", category: "TECHNICAL", question: "How do you address sustainability and environmental requirements common in SLED RFPs?", jobCategories: ["SLED"] },
  { id: "tech-sled-009", category: "TECHNICAL", question: "Explain your experience with state IT modernization projects.", jobCategories: ["SLED"] },
  { id: "tech-sled-010", category: "TECHNICAL", question: "What is your approach to developing local economic impact narratives?", jobCategories: ["SLED"] },
  { id: "tech-sled-011", category: "TECHNICAL", question: "How do you handle diverse board or commission approval processes?", jobCategories: ["SLED"] },
  { id: "tech-sled-012", category: "TECHNICAL", question: "Describe your experience with Public-Private Partnerships (P3s).", jobCategories: ["SLED"] },
  { id: "tech-sled-013", category: "TECHNICAL", question: "What is your understanding of prevailing wage requirements in SLED contracts?", jobCategories: ["SLED"] },
  { id: "tech-sled-014", category: "TECHNICAL", question: "How do you approach proposals for state transportation or infrastructure projects?", jobCategories: ["SLED"] },
  { id: "tech-sled-015", category: "TECHNICAL", question: "Explain your experience with grant-funded state/local projects.", jobCategories: ["SLED"] },
  { id: "tech-sled-016", category: "TECHNICAL", question: "How do you develop community engagement plans for SLED proposals?", jobCategories: ["SLED"] },
  { id: "tech-sled-017", category: "TECHNICAL", question: "What is your approach to MWBE (Minority/Women Business Enterprise) requirements?", jobCategories: ["SLED"] },
  { id: "tech-sled-018", category: "TECHNICAL", question: "Describe your experience with state data privacy and security requirements.", jobCategories: ["SLED"] },
  { id: "tech-sled-019", category: "TECHNICAL", question: "How do you navigate political considerations in SLED procurements?", jobCategories: ["SLED"] },
  { id: "tech-sled-020", category: "TECHNICAL", question: "What is your experience with state budget cycles and appropriation processes?", jobCategories: ["SLED"] },
  { id: "tech-sled-021", category: "TECHNICAL", question: "How do you approach workforce development commitments in SLED proposals?", jobCategories: ["SLED"] },
  { id: "tech-sled-022", category: "TECHNICAL", question: "Describe your experience with regional or multi-jurisdiction collaboratives.", jobCategories: ["SLED"] },
  { id: "tech-sled-023", category: "TECHNICAL", question: "What is your approach to developing long-term sustainability plans for SLED clients?", jobCategories: ["SLED"] },
  { id: "tech-sled-024", category: "TECHNICAL", question: "How do you handle open meetings laws and transparency requirements?", jobCategories: ["SLED"] },
  { id: "tech-sled-025", category: "TECHNICAL", question: "Explain your experience with state emergency management or public safety procurements.", jobCategories: ["SLED"] },
];

// TECHNICAL QUESTIONS - IT SERVICES (35)
const itServicesQuestions: InterviewQuestion[] = [
  {
    id: "tech-it-001",
    category: "TECHNICAL",
    question:
      "Explain the difference between Server-Side Rendering (SSR) and Static Site Generation (SSG) in Next.js.",
    expectedKeywords: ["SSR", "SSG", "performance", "SEO", "hydration"],
    jobCategories: ["IT_SERVICES"],
  },
  {
    id: "tech-it-002",
    category: "TECHNICAL",
    question:
      "How would you optimize a slow-loading React application? Walk me through your debugging process.",
    expectedKeywords: [
      "React DevTools",
      "profiling",
      "memoization",
      "code splitting",
      "lazy loading",
    ],
    jobCategories: ["IT_SERVICES"],
  },
  {
    id: "tech-it-003",
    category: "TECHNICAL",
    question:
      "Describe your approach to database schema design for a multi-tenant SaaS application.",
    expectedKeywords: [
      "multi-tenancy",
      "data isolation",
      "scalability",
      "normalization",
    ],
    jobCategories: ["IT_SERVICES"],
  },
  {
    id: "tech-it-004",
    category: "TECHNICAL",
    question:
      "How do you handle authentication and authorization in a modern web application?",
    expectedKeywords: ["JWT", "OAuth", "session management", "RBAC", "security"],
    jobCategories: ["IT_SERVICES"],
  },
  {
    id: "tech-it-005",
    category: "TECHNICAL",
    question:
      "Explain your experience with API design. What makes a well-designed RESTful API?",
    expectedKeywords: [
      "REST principles",
      "versioning",
      "error handling",
      "documentation",
      "pagination",
    ],
    jobCategories: ["IT_SERVICES"],
  },
  { id: "tech-it-006", category: "TECHNICAL", question: "What is your experience with tRPC and why might you choose it over traditional REST APIs?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-007", category: "TECHNICAL", question: "How do you implement real-time features in a web application?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-008", category: "TECHNICAL", question: "Explain your approach to testing (unit, integration, E2E) in a full-stack application.", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-009", category: "TECHNICAL", question: "What is your experience with Prisma ORM? How does it compare to other ORMs?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-010", category: "TECHNICAL", question: "How do you handle error boundaries and error handling in React applications?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-011", category: "TECHNICAL", question: "Describe your experience with CI/CD pipelines and deployment strategies.", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-012", category: "TECHNICAL", question: "What is your approach to managing state in large React applications?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-013", category: "TECHNICAL", question: "How do you implement rate limiting and API throttling?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-014", category: "TECHNICAL", question: "Explain your experience with caching strategies (Redis, CDN, browser cache).", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-015", category: "TECHNICAL", question: "What is your approach to database indexing and query optimization?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-016", category: "TECHNICAL", question: "How do you handle file uploads and storage in a serverless environment?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-017", category: "TECHNICAL", question: "Describe your experience with TypeScript. Why use it over JavaScript?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-018", category: "TECHNICAL", question: "What is your approach to monitoring and observability in production applications?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-019", category: "TECHNICAL", question: "How do you implement feature flags and A/B testing?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-020", category: "TECHNICAL", question: "Explain your experience with GraphQL. When would you use it vs REST?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-021", category: "TECHNICAL", question: "What is your approach to securing sensitive data (PII, passwords, API keys)?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-022", category: "TECHNICAL", question: "How do you handle database migrations in production without downtime?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-023", category: "TECHNICAL", question: "Describe your experience with microservices architecture vs monolithic applications.", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-024", category: "TECHNICAL", question: "What is your approach to accessibility (WCAG compliance) in web applications?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-025", category: "TECHNICAL", question: "How do you optimize images and assets for web performance?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-026", category: "TECHNICAL", question: "Explain your experience with Docker and containerization.", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-027", category: "TECHNICAL", question: "What is your approach to implementing search functionality (full-text, fuzzy, semantic)?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-028", category: "TECHNICAL", question: "How do you handle third-party integrations and API failures?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-029", category: "TECHNICAL", question: "Describe your experience with serverless functions (AWS Lambda, Vercel Functions).", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-030", category: "TECHNICAL", question: "What is your approach to documenting code and APIs?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-031", category: "TECHNICAL", question: "How do you implement background jobs and task queues?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-032", category: "TECHNICAL", question: "Explain your experience with WebSockets and real-time protocols.", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-033", category: "TECHNICAL", question: "What is your approach to mobile responsiveness and cross-browser compatibility?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-034", category: "TECHNICAL", question: "How do you handle internationalization (i18n) and localization (l10n)?", jobCategories: ["IT_SERVICES"] },
  { id: "tech-it-035", category: "TECHNICAL", question: "Describe your experience with performance budgets and Core Web Vitals.", jobCategories: ["IT_SERVICES"] },
];

// TECHNICAL QUESTIONS - WRITING SERVICES (30)
const writingServicesQuestions: InterviewQuestion[] = [
  {
    id: "tech-write-001",
    category: "TECHNICAL",
    question:
      "How do you adapt your writing style for different audiences (technical vs non-technical)?",
    expectedKeywords: ["audience analysis", "tone", "clarity", "technical writing"],
    jobCategories: ["WRITING_SERVICES"],
  },
  {
    id: "tech-write-002",
    category: "TECHNICAL",
    question:
      "Walk me through your research process when writing about a complex technical topic you're unfamiliar with.",
    expectedKeywords: [
      "research",
      "SME interviews",
      "documentation",
      "fact-checking",
    ],
    jobCategories: ["WRITING_SERVICES"],
  },
  {
    id: "tech-write-003",
    category: "TECHNICAL",
    question:
      "What is your approach to SEO writing? How do you balance SEO requirements with readability?",
    expectedKeywords: [
      "SEO",
      "keywords",
      "readability",
      "search intent",
      "user experience",
    ],
    jobCategories: ["WRITING_SERVICES"],
  },
  {
    id: "tech-write-004",
    category: "TECHNICAL",
    question:
      "Describe your experience with different content formats (white papers, case studies, blog posts, technical documentation).",
    expectedKeywords: [
      "content formats",
      "white papers",
      "case studies",
      "documentation",
    ],
    jobCategories: ["WRITING_SERVICES"],
  },
  {
    id: "tech-write-005",
    category: "TECHNICAL",
    question:
      "How do you ensure consistency in voice and style across a large body of content?",
    expectedKeywords: [
      "style guide",
      "brand voice",
      "consistency",
      "editorial process",
    ],
    jobCategories: ["WRITING_SERVICES"],
  },
  { id: "tech-write-006", category: "TECHNICAL", question: "What is your experience with technical documentation tools (Markdown, docs-as-code, DITA)?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-007", category: "TECHNICAL", question: "How do you approach writing persuasive copy that drives conversions?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-008", category: "TECHNICAL", question: "Describe your experience with content strategy and editorial calendars.", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-009", category: "TECHNICAL", question: "What is your approach to fact-checking and source verification?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-010", category: "TECHNICAL", question: "How do you handle revisions and feedback from multiple stakeholders?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-011", category: "TECHNICAL", question: "Explain your experience with writing for government audiences (compliance, formality).", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-012", category: "TECHNICAL", question: "What is your approach to writing compelling headlines and hooks?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-013", category: "TECHNICAL", question: "How do you measure the success of your content (metrics, KPIs)?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-014", category: "TECHNICAL", question: "Describe your experience with storytelling in technical or business writing.", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-015", category: "TECHNICAL", question: "What is your approach to writing for accessibility (plain language, screen readers)?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-016", category: "TECHNICAL", question: "How do you handle tight deadlines while maintaining quality?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-017", category: "TECHNICAL", question: "Explain your experience with content management systems (WordPress, HubSpot, etc.).", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-018", category: "TECHNICAL", question: "What is your approach to writing data-driven content with statistics and research?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-019", category: "TECHNICAL", question: "How do you develop thought leadership content for executives?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-020", category: "TECHNICAL", question: "Describe your experience with grant writing or proposal narratives.", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-021", category: "TECHNICAL", question: "What is your approach to writing for social media vs long-form content?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-022", category: "TECHNICAL", question: "How do you handle sensitive or controversial topics in your writing?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-023", category: "TECHNICAL", question: "Explain your experience with writing product descriptions or marketing copy.", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-024", category: "TECHNICAL", question: "What is your approach to interviewing SMEs and extracting usable content?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-025", category: "TECHNICAL", question: "How do you stay current with evolving writing trends and best practices?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-026", category: "TECHNICAL", question: "Describe your experience with email marketing and newsletter writing.", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-027", category: "TECHNICAL", question: "What is your approach to repurposing content across multiple formats?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-028", category: "TECHNICAL", question: "How do you handle writer's block or creative dry spells?", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-029", category: "TECHNICAL", question: "Explain your experience with editing and proofreading (Chicago Manual, AP Style).", jobCategories: ["WRITING_SERVICES"] },
  { id: "tech-write-030", category: "TECHNICAL", question: "What is your approach to building a portfolio that demonstrates your range?", jobCategories: ["WRITING_SERVICES"] },
];

// SITUATIONAL QUESTIONS (25)
const situationalQuestions: InterviewQuestion[] = [
  {
    id: "sit-001",
    category: "SITUATIONAL",
    question:
      "You're assigned a project with an extremely tight deadline that seems impossible. How do you handle it?",
    expectedKeywords: [
      "prioritization",
      "communication",
      "negotiation",
      "realistic planning",
    ],
  },
  {
    id: "sit-002",
    category: "SITUATIONAL",
    question:
      "A client is unhappy with your work and demands a complete redo. How would you respond?",
    expectedKeywords: [
      "active listening",
      "problem-solving",
      "accountability",
      "client management",
    ],
  },
  {
    id: "sit-003",
    category: "SITUATIONAL",
    question:
      "You discover a significant error in work that's already been delivered to the client. What do you do?",
    expectedKeywords: [
      "transparency",
      "accountability",
      "damage control",
      "corrective action",
    ],
  },
  { id: "sit-004", category: "SITUATIONAL", question: "You're working on multiple projects and realize you can't meet all deadlines. How do you prioritize?" },
  { id: "sit-005", category: "SITUATIONAL", question: "A team member is consistently missing deadlines and affecting your work. What's your approach?" },
  { id: "sit-006", category: "SITUATIONAL", question: "You receive conflicting direction from two different stakeholders. How do you resolve this?" },
  { id: "sit-007", category: "SITUATIONAL", question: "You're asked to do something that violates your professional ethics or company policy. What do you do?" },
  { id: "sit-008", category: "SITUATIONAL", question: "A client asks for work outside your scope without additional compensation. How do you handle it?" },
  { id: "sit-009", category: "SITUATIONAL", question: "You realize midway through a project that the approach isn't working. What's your next step?" },
  { id: "sit-010", category: "SITUATIONAL", question: "You're assigned a project in an area where you have limited experience. How do you approach it?" },
  { id: "sit-011", category: "SITUATIONAL", question: "A competitor approaches you with a job offer while you're working on a critical project. What do you do?" },
  { id: "sit-012", category: "SITUATIONAL", question: "You notice a more efficient way to do something that contradicts the client's instructions. How do you proceed?" },
  { id: "sit-013", category: "SITUATIONAL", question: "You're working with a difficult client who provides vague or changing requirements. How do you manage this?" },
  { id: "sit-014", category: "SITUATIONAL", question: "You discover that a teammate has plagiarized content. What's your course of action?" },
  { id: "sit-015", category: "SITUATIONAL", question: "A project scope expands significantly without timeline adjustment. How do you address this?" },
  { id: "sit-016", category: "SITUATIONAL", question: "You receive harsh criticism on work you believe is high quality. How do you respond?" },
  { id: "sit-017", category: "SITUATIONAL", question: "You're asked to take on a leadership role for a struggling project. What are your first steps?" },
  { id: "sit-018", category: "SITUATIONAL", question: "A client wants to use your work in a way not covered by your agreement. What do you do?" },
  { id: "sit-019", category: "SITUATIONAL", question: "You're working remotely and experiencing communication breakdowns with your team. How do you fix this?" },
  { id: "sit-020", category: "SITUATIONAL", question: "You realize you've made a commitment you can't keep. How do you handle it?" },
  { id: "sit-021", category: "SITUATIONAL", question: "A client asks for your opinion on firing another contractor. How do you respond?" },
  { id: "sit-022", category: "SITUATIONAL", question: "You're offered a high-paying project that conflicts with your values. What's your decision process?" },
  { id: "sit-023", category: "SITUATIONAL", question: "You need to deliver critical feedback to someone senior to you. How do you approach it?" },
  { id: "sit-024", category: "SITUATIONAL", question: "You're working with a team spread across multiple time zones. How do you ensure effective collaboration?" },
  { id: "sit-025", category: "SITUATIONAL", question: "A project is canceled after you've completed significant work. How do you handle billing and next steps?" },
];

// CULTURAL FIT QUESTIONS (20)
const culturalQuestions: InterviewQuestion[] = [
  {
    id: "cult-001",
    category: "CULTURAL",
    question:
      "What does work-life balance mean to you, and how do you maintain it?",
    expectedKeywords: ["boundaries", "priorities", "sustainability", "balance"],
  },
  {
    id: "cult-002",
    category: "CULTURAL",
    question:
      "How do you prefer to receive feedback - direct and immediate, or scheduled and structured?",
    expectedKeywords: ["feedback", "communication style", "growth mindset"],
  },
  {
    id: "cult-003",
    category: "CULTURAL",
    question:
      "Describe your ideal work environment. What conditions help you do your best work?",
    expectedKeywords: ["environment", "autonomy", "collaboration", "resources"],
  },
  { id: "cult-004", category: "CULTURAL", question: "What motivates you to do your best work?" },
  { id: "cult-005", category: "CULTURAL", question: "How do you handle ambiguity and uncertainty in your work?" },
  { id: "cult-006", category: "CULTURAL", question: "What role does continuous learning play in your career?" },
  { id: "cult-007", category: "CULTURAL", question: "How do you define success in your role?" },
  { id: "cult-008", category: "CULTURAL", question: "What's your approach to work when you're not feeling 100%?" },
  { id: "cult-009", category: "CULTURAL", question: "How do you build relationships with remote colleagues?" },
  { id: "cult-010", category: "CULTURAL", question: "What's your preferred communication style (async vs sync, written vs verbal)?" },
  { id: "cult-011", category: "CULTURAL", question: "How do you handle success? How do you handle failure?" },
  { id: "cult-012", category: "CULTURAL", question: "What's important to you in a company culture?" },
  { id: "cult-013", category: "CULTURAL", question: "How do you stay productive when working independently?" },
  { id: "cult-014", category: "CULTURAL", question: "What's your approach to asking for help when you need it?" },
  { id: "cult-015", category: "CULTURAL", question: "How do you contribute to a positive team culture?" },
  { id: "cult-016", category: "CULTURAL", question: "What role does transparency play in your work relationships?" },
  { id: "cult-017", category: "CULTURAL", question: "How do you handle competing demands on your time?" },
  { id: "cult-018", category: "CULTURAL", question: "What's your approach to innovation and trying new things?" },
  { id: "cult-019", category: "CULTURAL", question: "How do you measure your own performance and growth?" },
  { id: "cult-020", category: "CULTURAL", question: "What makes you excited to start working on a project?" },
];

// Export complete question bank
export const INTERVIEW_QUESTION_BANK: InterviewQuestionBank = {
  behavioral: behavioralQuestions,
  technical: {
    govcon: govconQuestions,
    sled: sledQuestions,
    itServices: itServicesQuestions,
    writingServices: writingServicesQuestions,
  },
  situational: situationalQuestions,
  cultural: culturalQuestions,
};

/**
 * Get questions for a specific job category
 */
export function getQuestionsForJob(
  jobCategory: "GOVCON" | "SLED" | "IT_SERVICES" | "WRITING_SERVICES",
  numQuestions: number = 10
): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];

  // Add behavioral questions (30%)
  const behavioralCount = Math.ceil(numQuestions * 0.3);
  questions.push(
    ...shuffleArray(INTERVIEW_QUESTION_BANK.behavioral).slice(
      0,
      behavioralCount
    )
  );

  // Add technical questions (40%)
  const technicalCount = Math.ceil(numQuestions * 0.4);
  let technicalQuestions: InterviewQuestion[] = [];
  if (jobCategory === "GOVCON") {
    technicalQuestions = INTERVIEW_QUESTION_BANK.technical.govcon;
  } else if (jobCategory === "SLED") {
    technicalQuestions = INTERVIEW_QUESTION_BANK.technical.sled;
  } else if (jobCategory === "IT_SERVICES") {
    technicalQuestions = INTERVIEW_QUESTION_BANK.technical.itServices;
  } else if (jobCategory === "WRITING_SERVICES") {
    technicalQuestions = INTERVIEW_QUESTION_BANK.technical.writingServices;
  }
  questions.push(...shuffleArray(technicalQuestions).slice(0, technicalCount));

  // Add situational questions (20%)
  const situationalCount = Math.ceil(numQuestions * 0.2);
  questions.push(
    ...shuffleArray(INTERVIEW_QUESTION_BANK.situational).slice(
      0,
      situationalCount
    )
  );

  // Add cultural questions (10%)
  const culturalCount = numQuestions - questions.length; // Remainder
  questions.push(
    ...shuffleArray(INTERVIEW_QUESTION_BANK.cultural).slice(0, culturalCount)
  );

  return shuffleArray(questions);
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get total question count
 */
export function getQuestionBankStats() {
  return {
    behavioral: INTERVIEW_QUESTION_BANK.behavioral.length,
    technical: {
      govcon: INTERVIEW_QUESTION_BANK.technical.govcon.length,
      sled: INTERVIEW_QUESTION_BANK.technical.sled.length,
      itServices: INTERVIEW_QUESTION_BANK.technical.itServices.length,
      writingServices: INTERVIEW_QUESTION_BANK.technical.writingServices.length,
    },
    situational: INTERVIEW_QUESTION_BANK.situational.length,
    cultural: INTERVIEW_QUESTION_BANK.cultural.length,
    total:
      INTERVIEW_QUESTION_BANK.behavioral.length +
      INTERVIEW_QUESTION_BANK.technical.govcon.length +
      INTERVIEW_QUESTION_BANK.technical.sled.length +
      INTERVIEW_QUESTION_BANK.technical.itServices.length +
      INTERVIEW_QUESTION_BANK.technical.writingServices.length +
      INTERVIEW_QUESTION_BANK.situational.length +
      INTERVIEW_QUESTION_BANK.cultural.length,
  };
}
