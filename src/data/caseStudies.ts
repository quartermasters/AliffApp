// Case Studies Data Structure for Aliff Services
// Priority 2: Case Studies Database

export interface CaseStudy {
  slug: string;
  title: string;
  category: "govcon" | "sled" | "writing" | "it" | "b2b-agency";
  services: string[]; // Array of service slugs
  clientType: string; // e.g., "Federal Agency", "B2B Agency", "State Government"
  industry?: string; // Optional industry/sector
  keyMetric: string; // Hero metric: "3x capacity increase", "22% win rate"
  metricType: "win-rate" | "time-saved" | "cost-saved" | "capacity" | "revenue";
  teaser: string; // Brief summary for card display
  date: string; // ISO date string
  challenge: {
    title: string;
    problem: string;
    whyTraditionalFailed: string;
    stakes: string;
  };
  solution: {
    approach: string;
    servicesDeployed: string[];
    threePhaseInAction: {
      strategic: string;
      ai: string;
      expert: string;
    };
  };
  results: {
    metrics: {
      label: string;
      value: string;
    }[];
    timeline: string;
    clientQuote?: {
      text: string;
      author: string;
      role: string;
    };
  };
  relatedServices: string[]; // Service slugs
}

// GOVCON Case Studies
export const govconCaseStudies: CaseStudy[] = [
  {
    slug: "dc-agency-capacity-increase",
    title: "DC-Area Agency Increases Proposal Capacity 3x Without New Hires",
    category: "b2b-agency",
    services: ["proposal-development", "capture-strategy"],
    clientType: "B2B Agency",
    industry: "Government Contracting Services",
    keyMetric: "3x capacity increase",
    metricType: "capacity",
    teaser:
      "How a boutique GovCon consulting firm tripled their proposal output while maintaining quality and reducing turnaround time by 40%.",
    date: "2024-10-15",
    challenge: {
      title: "Scaling Without Sacrificing Quality or Margin",
      problem:
        "A 12-person government contracting consulting firm was turning down 60% of incoming proposal requests due to capacity constraints. Their senior consultants were spending 80% of their time writing instead of client strategy work, creating a bottleneck that limited growth.",
      whyTraditionalFailed:
        "Hiring more writers would destroy margins (senior GovCon writers cost $150K+ and require 6 months to become productive). Using generic freelance writers produced low-quality work that required extensive senior review, negating any time savings. AI tools like ChatGPT created generic content that clients rejected.",
      stakes:
        "At their current capacity, the agency was leaving $800K+ in annual revenue on the table while exhausting their senior team with repetitive writing tasks instead of high-value strategy work.",
    },
    solution: {
      approach:
        "We implemented our 3-phase Strategic Diagnosis + AI Execution + Expert Refinement model specifically for their agency workflow, focusing on maintaining their strategic positioning while scaling execution capacity.",
      servicesDeployed: [
        "Proposal Development (as-a-service for their clients)",
        "Capture Strategy (training + templates)",
        "Custom AI integration for their specific RFP types",
      ],
      threePhaseInAction: {
        strategic:
          "Their senior consultants continued to own client strategy and RFP diagnosis (their core value), but reduced writing time by 75%. We created a diagnostic framework they could complete in 90 minutes instead of 8 hours per proposal.",
        ai:
          "Our AI system (trained on their past winning proposals and style) generated first drafts from their strategic frameworks. Unlike generic ChatGPT, our AI understood federal evaluation criteria, compliance requirements, and their clients' differentiators.",
        expert:
          "Former contracting officers and senior GovCon writers on our team refined AI drafts to match the agency's quality standards. Final review by the agency's consultants took 2 hours instead of 20 hours per proposal.",
      },
    },
    results: {
      metrics: [
        { label: "Proposal Capacity Increase", value: "3x (from 8 to 24 proposals/month)" },
        { label: "Senior Consultant Time Saved", value: "75% reduction in writing time" },
        { label: "Turnaround Time Improvement", value: "40% faster (7 days to 4 days avg)" },
        { label: "Additional Annual Revenue", value: "$850K from previously declined work" },
        { label: "Client Win Rate", value: "Maintained at 22% (no quality degradation)" },
      ],
      timeline: "Results achieved within 60 days of implementation",
      clientQuote: {
        text: "We were skeptical about AI-written proposals, but Aliff's approach is completely different. They're not replacing our strategy—they're scaling our execution. Our consultants can now focus on what they do best while handling 3x the volume.",
        author: "Managing Partner",
        role: "DC-Area GovCon Consulting Firm",
      },
    },
    relatedServices: ["proposal-development", "capture-strategy", "technical-volume"],
  },
  {
    slug: "federal-contractor-win-rate",
    title: "Small Federal Contractor Doubles Win Rate from 11% to 22%",
    category: "govcon",
    services: ["proposal-development", "past-performance", "capture-strategy"],
    clientType: "Federal Contractor",
    industry: "IT Services & Cybersecurity",
    keyMetric: "22% win rate (from 11%)",
    metricType: "win-rate",
    teaser:
      "A small IT contractor competing against large primes transformed their proposal quality through strategic diagnosis and expert execution.",
    date: "2024-09-20",
    challenge: {
      title: "Generic Proposals Against Experienced Competition",
      problem:
        "A 50-person federal IT contractor was winning only 11% of bids (industry average: 15-20%). Post-debrief feedback consistently cited 'generic responses' and 'failure to demonstrate understanding of agency needs.' Their proposals read like every other small contractor using ChatGPT templates.",
      whyTraditionalFailed:
        "Their in-house team had strong technical skills but limited proposal experience. Hiring a dedicated proposal manager ($120K salary) didn't fit their budget. Proposal consulting firms charged $50K+ per proposal, making it uneconomical for smaller opportunities.",
      stakes:
        "With an 11% win rate, they needed to bid 18 contracts to win 2. The company was burning resources on proposals that never stood a chance, creating cash flow issues and team burnout.",
    },
    solution: {
      approach:
        "We analyzed their past 12 proposals to identify systematic weaknesses, then rebuilt their entire proposal approach using strategic diagnosis before writing.",
      servicesDeployed: [
        "Capture Strategy (for all opportunities >$2M)",
        "Proposal Development (full service)",
        "Past Performance narratives (strategic positioning)",
      ],
      threePhaseInAction: {
        strategic:
          "Former contracting officers on our team analyzed each RFP to identify: (1) unstated evaluation priorities, (2) incumbent weaknesses, (3) agency pain points from past performance issues. This diagnosis revealed what evaluators really wanted vs. what the RFP stated.",
        ai:
          "Using insights from strategic diagnosis, our AI generated customized proposal sections that addressed agency-specific concerns. Unlike generic AI tools, our system referenced their specific past performance, team credentials, and technical approach.",
        expert:
          "Senior GovCon proposal writers refined AI drafts to add persuasive elements: proof points, risk mitigation strategies, and evaluation-focused structure. Final proposals demonstrated deep agency understanding that ChatGPT competitors couldn't match.",
      },
    },
    results: {
      metrics: [
        { label: "Win Rate Improvement", value: "22% (doubled from 11%)" },
        { label: "Revenue Impact", value: "$4.2M in new contract wins (first 6 months)" },
        { label: "Proposal Cost Reduction", value: "60% vs. traditional consulting" },
        { label: "Time to Submit", value: "5 days average (from 3 weeks)" },
        { label: "Debriefs Received", value: "'Strategic understanding' cited as key strength" },
      ],
      timeline: "Win rate improvement measurable within 90 days (first 5 proposals)",
      clientQuote: {
        text: "Our proposals used to be technical spec sheets. Now they tell a strategic story about why we're the lowest-risk choice. Contracting officers actually call us to discuss our approach—that never happened before.",
        author: "CEO",
        role: "Small Federal IT Contractor",
      },
    },
    relatedServices: [
      "proposal-development",
      "capture-strategy",
      "past-performance",
      "technical-volume",
    ],
  },
  {
    slug: "past-performance-win",
    title: "New Federal Contractor Wins First Prime Contract Using Strategic Past Performance",
    category: "govcon",
    services: ["past-performance", "capability-statements", "proposal-development"],
    clientType: "Federal Contractor",
    industry: "Professional Services",
    keyMetric: "First prime win",
    metricType: "win-rate",
    teaser:
      "A company with only subcontract experience won a $1.8M prime contract by strategically positioning past performance to overcome the 'no prime experience' objection.",
    date: "2024-08-10",
    challenge: {
      title: "Breaking Into Prime Contracts Without Prime Experience",
      problem:
        "A professional services firm had 5 years of successful subcontract work but couldn't win prime contracts. Evaluators consistently rated them 'Acceptable' instead of 'Outstanding' on past performance due to lack of prime contract experience—creating a catch-22.",
      whyTraditionalFailed:
        "Their past performance narratives listed subcontract work chronologically without strategic framing. Evaluators saw 'subcontractor' and assumed they couldn't handle prime responsibilities (contract management, customer relationships, quality control).",
      stakes:
        "Stuck in the subcontractor trap, they were leaving money on the table (primes take 20-30% margin) and couldn't control their destiny. Without breaking into prime work, long-term growth was impossible.",
    },
    solution: {
      approach:
        "We reframed their past performance to demonstrate prime-level capabilities through strategic narrative structure, even though all experience was as a subcontractor.",
      servicesDeployed: [
        "Past Performance strategic narratives",
        "Capability Statements (prime-focused positioning)",
        "Proposal Development (for target opportunity)",
      ],
      threePhaseInAction: {
        strategic:
          "We analyzed the evaluation criteria to identify what 'prime contractor capabilities' really meant: customer relationship management, quality control systems, risk mitigation, and performance oversight. Then mapped their subcontract experience to demonstrate these exact capabilities.",
        ai:
          "Our AI generated past performance narratives structured around prime capabilities rather than subcontract tasks. Each narrative highlighted client-facing work, problem-solving, and outcomes—not just 'supported the prime contractor.'",
        expert:
          "Senior proposal writers added proof points and metrics that positioned the company as 'de facto prime' on past work: 'Managed customer relationships directly,' 'Implemented quality control processes that the prime contractor adopted agency-wide,' 'Resolved critical issues autonomously.'",
      },
    },
    results: {
      metrics: [
        { label: "Outcome", value: "Won first prime contract ($1.8M, 3-year)" },
        { label: "Past Performance Rating", value: "Outstanding (vs. previous Acceptable ratings)" },
        { label: "Margin Improvement", value: "25% as prime vs. 10% as sub" },
        { label: "Follow-on Impact", value: "Won 2 additional primes within 6 months" },
      ],
      timeline: "Prime win achieved 45 days after past performance repositioning",
      clientQuote: {
        text: "Aliff showed us how to tell our story differently. We weren't hiding that we were subs—we were highlighting how we operated at a prime level even in subcontract roles. The evaluators finally saw our capabilities.",
        author: "President",
        role: "Professional Services Contractor",
      },
    },
    relatedServices: ["past-performance", "capability-statements", "proposal-development"],
  },
];

// SLED Case Studies
export const sledCaseStudies: CaseStudy[] = [
  {
    slug: "multi-state-expansion",
    title: "EdTech Company Wins Contracts in 8 New States Using Multi-State Strategy",
    category: "sled",
    services: ["multi-state", "state-contracts", "education-rfps"],
    clientType: "EdTech Company",
    industry: "Education Technology",
    keyMetric: "8 new states in 12 months",
    metricType: "capacity",
    teaser:
      "How a regional EdTech provider systematically expanded from 3 states to 11 states using strategic state-specific positioning.",
    date: "2024-07-25",
    challenge: {
      title: "Scaling Beyond Home State Without State-Specific Expertise",
      problem:
        "An EdTech company successful in their home state (California) struggled to win contracts in other states. Their proposals failed because they didn't understand state-specific education priorities, compliance requirements, or procurement processes.",
      whyTraditionalFailed:
        "Generic proposals that worked in California failed elsewhere. Each state has different: education standards, procurement rules, vendor registration processes, and political priorities. Hiring state-specific consultants for each target state was cost-prohibitive.",
      stakes:
        "Growth was stalled. Their product could serve any state, but they couldn't translate California success into wins elsewhere. Competitors with multi-state experience were capturing markets.",
    },
    solution: {
      approach:
        "We created a systematic multi-state expansion framework that adapted their core value proposition to each state's specific context.",
      servicesDeployed: [
        "Multi-State Expansion Strategy",
        "State-Specific Proposal Development (8 states)",
        "Education RFP expertise",
      ],
      threePhaseInAction: {
        strategic:
          "We researched each target state's: (1) current education initiatives, (2) recent procurement trends, (3) incumbent vendor weaknesses, (4) compliance requirements. Created state-specific positioning that aligned their product to local priorities.",
        ai:
          "Our AI generated state-customized proposals using each state's terminology, standards references, and political priorities. Texas proposals emphasized 'accountability and results,' Massachusetts proposals emphasized 'innovation and equity,' etc.",
        expert:
          "Education sector experts refined proposals to incorporate state-specific proof points: references to state standards (TEKS, CCSS, etc.), alignment to state improvement plans, and compliance with state-specific regulations.",
      },
    },
    results: {
      metrics: [
        { label: "States Won", value: "8 new states (Texas, Florida, Ohio, Michigan, NY, Mass, VA, NC)" },
        { label: "Win Rate in New States", value: "35% (vs. 5% before strategic approach)" },
        { label: "Revenue Growth", value: "$3.2M in new state contracts" },
        { label: "Time to First Win", value: "60 days per state (vs. 18 months in prior attempts)" },
      ],
      timeline: "8 state wins achieved over 12 months (systematic rollout)",
      clientQuote: {
        text: "We thought we'd need to hire people in each state. Instead, Aliff gave us a playbook that works everywhere. Now we can enter any state confidently with proposals that sound like we've been there for years.",
        author: "VP of Growth",
        role: "EdTech Company",
      },
    },
    relatedServices: ["multi-state", "state-contracts", "education-rfps"],
  },
  {
    slug: "dbe-compliance-win",
    title: "Construction Firm Wins $12M City Contract Through Strategic DBE Compliance",
    category: "sled",
    services: ["dbe-mbe-compliance", "local-government"],
    clientType: "Construction Company",
    industry: "Infrastructure & Construction",
    keyMetric: "$12M contract win",
    metricType: "revenue",
    teaser:
      "A mid-size contractor turned DBE compliance from a checkbox into a competitive advantage, winning their largest municipal contract.",
    date: "2024-06-15",
    challenge: {
      title: "Meeting DBE Goals Without Established Relationships",
      problem:
        "A construction firm bidding on a major city infrastructure project faced a 25% DBE participation requirement. They had no existing DBE subcontractor relationships and didn't know how to build credible partnerships in 30 days before the proposal deadline.",
      whyTraditionalFailed:
        "Most competitors treated DBE compliance as a checkbox: list random DBE firms from the city database without real partnerships. Evaluators spotted these 'paper commitments' immediately and rated them poorly on DBE approach.",
      stakes:
        "This $12M contract represented their largest opportunity in 3 years. Losing due to DBE compliance would mean another year of smaller projects and missed revenue targets.",
    },
    solution: {
      approach:
        "We transformed DBE compliance from a requirement into a strategic differentiator by building genuine partnerships and documenting commitment.",
      servicesDeployed: [
        "DBE/MBE Compliance Strategy & Plan Development",
        "Local Government Proposal Development",
        "Subcontractor Partnership Documentation",
      ],
      threePhaseInAction: {
        strategic:
          "We analyzed the city's DBE goals to identify: (1) which trades had the most certified DBE firms (less competition for partnerships), (2) where the city had struggled to meet goals historically (opportunity to exceed requirements), (3) evaluation criteria beyond percentage (quality of partnerships, mentorship, capacity building).",
        ai:
          "Our AI generated DBE partnership narratives that emphasized relationship-building, not just percentages: past mentorship programs, capacity-building commitments, and specific roles for each DBE partner tied to their unique capabilities.",
        expert:
          "SLED procurement experts helped structure genuine partnerships: letters of commitment from DBE firms, capacity development plans, and mentorship agreements. The proposal demonstrated authentic commitment that exceeded the 25% requirement (achieved 32%).",
      },
    },
    results: {
      metrics: [
        { label: "Contract Win", value: "$12M (largest in company history)" },
        { label: "DBE Participation", value: "32% (exceeded 25% requirement)" },
        { label: "Evaluation Score", value: "95/100 on DBE approach (highest score)" },
        { label: "Long-term Impact", value: "DBE partnerships now drive repeat wins" },
      ],
      timeline: "Won contract 45 days after implementing strategic DBE approach",
      clientQuote: {
        text: "We used to see DBE requirements as a burden. Aliff showed us how to make it a competitive strength. Our DBE partnerships are now real relationships that help us win work consistently.",
        author: "Business Development Director",
        role: "Infrastructure Construction Firm",
      },
    },
    relatedServices: ["dbe-mbe-compliance", "local-government", "rfp-response"],
  },
];

// IT & Writing Case Studies
export const itCaseStudies: CaseStudy[] = [
  {
    slug: "enterprise-platform-architecture",
    title: "B2B SaaS Company Scales Platform to 50K Users After Strategic Architecture Overhaul",
    category: "it",
    services: ["enterprise-architecture", "full-stack-development"],
    clientType: "B2B SaaS Company",
    industry: "HR Technology",
    keyMetric: "50K users (from 5K)",
    metricType: "capacity",
    teaser:
      "A growing HR tech platform rebuilt their architecture to support 10x user growth without performance degradation.",
    date: "2024-05-30",
    challenge: {
      title: "Scaling Beyond Initial Architecture's Capacity",
      problem:
        "A Series A HR tech startup built their MVP quickly to get to market, but the architecture couldn't scale. At 5,000 users, page loads took 8+ seconds, database queries timed out, and they were losing enterprise deals due to performance concerns.",
      whyTraditionalFailed:
        "Their original dev team built for speed-to-market, not scale. Hiring a senior architect ($200K+ salary) would take 6 months to recruit and onboard. Offshore dev shops offered cheap rewrites but couldn't deliver strategic architecture.",
      stakes:
        "With $5M Series B funding on the table, investors wanted proof the platform could scale to 50K+ users. Current performance issues were causing enterprise customer churn and blocking expansion.",
    },
    solution: {
      approach:
        "We designed a phased architecture migration that improved performance incrementally while maintaining business operations.",
      servicesDeployed: [
        "Enterprise Architecture strategic design",
        "Full-Stack Development (migration execution)",
        "Performance optimization consulting",
      ],
      threePhaseInAction: {
        strategic:
          "Our architects analyzed the existing system to identify bottlenecks: monolithic architecture, N+1 query problems, missing caching layer, inefficient database indexes. Created a migration roadmap prioritized by user impact and business value.",
        ai:
          "We used AI-assisted code analysis to identify performance issues across 200K+ lines of code and generate migration scripts. AI helped refactor database queries and identify opportunities for caching/optimization that would take humans months to find manually.",
        expert:
          "Senior full-stack developers executed the migration in phases: (1) database optimization, (2) caching layer, (3) microservices extraction, (4) frontend optimization. Each phase delivered measurable improvements while maintaining uptime.",
      },
    },
    results: {
      metrics: [
        { label: "User Capacity", value: "50K users (10x increase)" },
        { label: "Performance Improvement", value: "Page loads: 8s → 1.2s (85% faster)" },
        { label: "Database Query Time", value: "Average query: 2.5s → 120ms (95% faster)" },
        { label: "Infrastructure Cost", value: "30% reduction (better resource utilization)" },
        { label: "Enterprise Deals", value: "Closed 3 major contracts blocked by performance concerns" },
      ],
      timeline: "Architecture migration completed in 4 months (phased rollout)",
      clientQuote: {
        text: "Aliff gave us enterprise-grade architecture without the enterprise timeline or cost. Our platform now handles 10x the users at a fraction of the infrastructure cost. Series B investors loved it.",
        author: "CTO",
        role: "HR Tech SaaS Startup",
      },
    },
    relatedServices: ["enterprise-architecture", "full-stack-development"],
  },
];

export const writingCaseStudies: CaseStudy[] = [
  {
    slug: "thought-leadership-pipeline",
    title: "Consulting Firm Generates $2M Pipeline From Thought Leadership Content",
    category: "writing",
    services: ["thought-leadership", "white-papers", "case-studies"],
    clientType: "Consulting Firm",
    industry: "Management Consulting",
    keyMetric: "$2M pipeline generated",
    metricType: "revenue",
    teaser:
      "A boutique consulting firm transformed their business development through strategic thought leadership content that attracted inbound leads.",
    date: "2024-04-20",
    challenge: {
      title: "Generating Inbound Leads Without Brand Recognition",
      problem:
        "A 15-person management consulting firm relied entirely on referrals and cold outreach for new business. Without thought leadership content, they had no inbound lead generation and couldn't compete against larger firms with established content marketing.",
      whyTraditionalFailed:
        "Partners were too busy with billable work to write. Hiring a content writer produced generic content that didn't reflect their expertise. AI tools like ChatGPT created obvious AI content that damaged credibility instead of building it.",
      stakes:
        "Over-reliance on referrals made revenue unpredictable. During slow referral periods, consultants sat on the bench. They needed a consistent inbound pipeline to smooth revenue and grow predictably.",
    },
    solution: {
      approach:
        "We created a thought leadership content engine that turned partner insights into high-value content without consuming their billable time.",
      servicesDeployed: [
        "Thought Leadership article development",
        "White Papers (lead magnets)",
        "Case Studies (client success stories)",
      ],
      threePhaseInAction: {
        strategic:
          "We interviewed partners to extract their unique insights and methodologies. Identified content themes that aligned with their ideal client problems and search intent. Created editorial calendar targeting decision-makers at target accounts.",
        ai:
          "Our AI generated first drafts from partner interviews and client work examples. Unlike generic AI content, these drafts incorporated firm-specific frameworks, methodologies, and terminology that reflected genuine expertise.",
        expert:
          "Professional writers refined AI drafts to match each partner's voice and add persuasive storytelling. Content demonstrated deep expertise while remaining accessible—positioning the firm as advisors, not vendors.",
      },
    },
    results: {
      metrics: [
        { label: "Pipeline Generated", value: "$2M in qualified opportunities (12 months)" },
        { label: "Inbound Leads", value: "45 qualified leads from content (vs. 0 previously)" },
        { label: "Content Published", value: "24 articles, 4 white papers, 8 case studies" },
        { label: "Partner Time Investment", value: "2 hours/month per partner (vs. 20 hours to write themselves)" },
        { label: "LinkedIn Engagement", value: "15K+ views, 300+ meaningful connections" },
      ],
      timeline: "First inbound lead within 30 days; consistent pipeline within 90 days",
      clientQuote: {
        text: "We went from 100% outbound to 40% inbound in 12 months. The content attracts clients who already understand our value—they're calling us, not the other way around. ROI is undeniable.",
        author: "Managing Partner",
        role: "Management Consulting Firm",
      },
    },
    relatedServices: ["thought-leadership", "white-papers", "case-studies", "website-copy"],
  },
];

// Combine all case studies
export const allCaseStudies: CaseStudy[] = [
  ...govconCaseStudies,
  ...sledCaseStudies,
  ...itCaseStudies,
  ...writingCaseStudies,
];

// Helper functions
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return allCaseStudies.find((study) => study.slug === slug);
}

export function getCaseStudiesByCategory(
  category: "govcon" | "sled" | "writing" | "it" | "b2b-agency"
): CaseStudy[] {
  return allCaseStudies.filter((study) => study.category === category);
}

export function getCaseStudiesByService(serviceSlug: string): CaseStudy[] {
  return allCaseStudies.filter((study) => study.services.includes(serviceSlug));
}

export function getCaseStudiesByMetricType(
  metricType: "win-rate" | "time-saved" | "cost-saved" | "capacity" | "revenue"
): CaseStudy[] {
  return allCaseStudies.filter((study) => study.metricType === metricType);
}

export function searchCaseStudies(query: string): CaseStudy[] {
  const lowerQuery = query.toLowerCase();
  return allCaseStudies.filter(
    (study) =>
      study.title.toLowerCase().includes(lowerQuery) ||
      study.teaser.toLowerCase().includes(lowerQuery) ||
      study.clientType.toLowerCase().includes(lowerQuery) ||
      study.challenge.problem.toLowerCase().includes(lowerQuery) ||
      study.keyMetric.toLowerCase().includes(lowerQuery)
  );
}
