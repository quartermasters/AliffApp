# Marketing Website - Phase 2 Development Plan

**Project:** Aliff Services Phase 2 - Deep Content & Interactive Tools
**Timeline:** TBD
**Status:** Planning
**Prerequisites:** Phase 1 Complete ✅

---

## Phase 2 Goals

**Objectives:**
1. **Deep Service Content** - Detailed pages for all 24 individual services (SEO + conversion)
2. **Interactive Tools** - ROI calculator and chatbot for lead qualification
3. **Content Marketing** - Blog/resources for thought leadership and SEO
4. **Social Proof** - Case studies database with filtering and search
5. **Unique Differentiators** - SDL public-facing explanation
6. **Talent Pipeline** - Careers section if hiring is active

**Success Metrics:**
- Organic traffic increase through 24 new service pages
- Improved conversion rates via interactive tools
- Agency partnership inquiries increase via ROI calculator
- Reduced manual lead qualification via chatbot
- Blog drives 20%+ of organic traffic within 6 months

---

## Phase 2 Priority Order

### Priority 1: Individual Service Pages (High Impact, Foundation)
**24 pages total - SEO goldmine and detailed service explanation**

### Priority 2: Case Studies Database (Social Proof)
**Searchable, filterable collection of client success stories**

### Priority 3: Blog/Resources Section (Content Marketing)
**Thought leadership, SEO, lead magnets**

### Priority 4: SDL Public Page (Unique Differentiator)
**Explain Solicitation Diagnosis Lab without revealing proprietary methodology**

### Priority 5: ROI Calculator for Agencies (B2B Conversion Tool)
**Interactive calculator showing cost savings vs hiring/freelancers**

### Priority 6: Chatbot Integration (Automation)
**AI-powered lead qualification and service routing**

### Priority 7: Careers Section (If Hiring Active)
**Job postings, company culture, application flow**

### Priority 8: ATS Integration (If Hiring Active)
**Applicant tracking system integration**

---

## PRIORITY 1: Individual Service Pages (24 Pages)

### Overview

Build detailed pages for each individual service offering:
- **GOVCON Services:** 8 pages
- **SLED Services:** 8 pages
- **Writing Services:** 6 pages
- **IT Services:** 2 pages

### URL Structure

```
/services/govcon/[service-slug]
/services/sled/[service-slug]
/services/writing/[service-slug]
/services/it/[service-slug]
```

### GOVCON Service Pages (8 pages)

Based on previous planning, the 8 GOVCON services are:

1. **Proposal Development** (`/services/govcon/proposal-development`)
2. **Capture Strategy** (`/services/govcon/capture-strategy`)
3. **Past Performance Narratives** (`/services/govcon/past-performance`)
4. **Price Volume Development** (`/services/govcon/price-volume`)
5. **Technical Volume Writing** (`/services/govcon/technical-volume`)
6. **Capability Statements** (`/services/govcon/capability-statements`)
7. **Teaming Agreements** (`/services/govcon/teaming-agreements`)
8. **Subcontracting Plans** (`/services/govcon/subcontracting-plans`)

### SLED Service Pages (8 pages)

1. **RFP Response Development** (`/services/sled/rfp-response`)
2. **State Contract Proposals** (`/services/sled/state-contracts`)
3. **Local Government Bids** (`/services/sled/local-government`)
4. **Education RFPs** (`/services/sled/education-rfps`)
5. **DBE/MBE Compliance** (`/services/sled/dbe-mbe-compliance`)
6. **Multi-State Proposals** (`/services/sled/multi-state`)
7. **Grant Writing** (`/services/sled/grant-writing`)
8. **SLED Capability Statements** (`/services/sled/capability-statements`)

### Writing Service Pages (6 pages)

1. **Thought Leadership** (`/services/writing/thought-leadership`)
2. **Technical Documentation** (`/services/writing/technical-documentation`)
3. **Website Copy** (`/services/writing/website-copy`)
4. **Case Studies** (`/services/writing/case-studies`)
5. **White Papers** (`/services/writing/white-papers`)
6. **Blog Content** (`/services/writing/blog-content`)

### IT Service Pages (2 pages)

1. **Full-Stack Development** (`/services/it/full-stack-development`)
2. **Enterprise Architecture** (`/services/it/enterprise-architecture`)

---

### Service Page Template Structure

**Reusable template for all 24 pages:**

#### Section 1: Hero
```
- Service name (H1)
- Compelling headline specific to this service
- 1-2 sentence value proposition
- Primary CTA: "Get Started" or "Request Quote"
- Secondary CTA: "See Examples" or "Schedule Consultation"
```

#### Section 2: Overview
```
- What this service is
- Who needs it
- Key challenges this service solves
- Why strategic thinking matters for THIS specific service
```

#### Section 3: Our Approach (3-Phase Process)
```
Customized for each service:

Phase 1: Strategic Diagnosis
- What human experts analyze for THIS service
- Questions we ask that AI can't answer
- Strategic decisions made before execution

Phase 2: AI-Powered Execution
- Which AI systems we deploy for THIS service
- What gets automated (the 80%)
- How we ensure quality during execution

Phase 3: Expert Refinement
- Human review specific to THIS service
- What we check for and refine
- Quality assurance process
```

#### Section 4: What You Get (Deliverables)
```
- Specific deliverables for this service
- Formats provided (PDF, Word, etc.)
- Turnaround time
- Revisions included
```

#### Section 5: Why We're Different
```
3-column comparison:
- AI-Only Competitors: What they miss for THIS service
- Traditional Firms: Why they're slow/expensive
- Aliff Services: How we combine best of both
```

#### Section 6: Pricing
```
- "Custom pricing based on project scope"
- No specific rates displayed
- CTA: "Request Quote"
- Note: "Agency volume discounts available"
```

#### Section 7: Related Services
```
- 3-4 related services (cross-sell)
- Brief description + link to each
```

#### Section 8: Case Study/Example
```
- 1-2 anonymized case studies specific to this service
- Challenge → Solution → Result format
- Metrics-driven results
```

#### Section 9: FAQ
```
- 5-7 frequently asked questions specific to this service
- Technical questions, process questions, pricing questions
```

#### Section 10: CTA
```
- "Ready to get started?"
- Primary CTA: "Request Quote"
- Secondary CTA: "Schedule Consultation"
- Trust signal: "20+ years combined expertise"
```

---

### Technical Implementation

**Page Generation Options:**

**Option A: Static Pages (24 individual TSX files)**
- Pros: Full customization per service, easier to manage initially
- Cons: More files to maintain, harder to enforce consistency

**Option B: Dynamic Route with Service Data (Recommended)**
- Create single template: `/services/[category]/[slug]/page.tsx`
- Service data in JSON or TypeScript constants
- Programmatically generate pages
- Pros: Consistency enforced, easier to update template
- Cons: Requires data structure upfront

**Recommended: Option B - Dynamic Route with Service Data**

```typescript
// src/data/services.ts
export const services = {
  govcon: [
    {
      slug: 'proposal-development',
      name: 'Proposal Development',
      headline: 'Win 22% of Federal Contracts with Strategic Proposals',
      description: '...',
      approach: { ... },
      deliverables: [ ... ],
      relatedServices: [ ... ],
      caseStudies: [ ... ],
      faq: [ ... ],
    },
    // ... 7 more GOVCON services
  ],
  sled: [ ... ],
  writing: [ ... ],
  it: [ ... ],
};
```

**SEO Optimization:**
- Unique meta title per service
- Unique meta description (150-160 characters)
- Schema.org Service markup
- Breadcrumb navigation
- Internal linking between related services
- Alt text for all images

**Performance:**
- Static generation (ISR optional for content updates)
- Image optimization
- Lazy load below-fold content
- Target: Same performance as Phase 1 (< 2s load, > 90 Lighthouse)

---

## PRIORITY 2: Case Studies Database

### Overview

Searchable, filterable collection of client success stories demonstrating results across all service categories.

### URL Structure

```
/case-studies (index with filtering)
/case-studies/[slug] (individual case study)
```

### Case Study Index Page Features

**Filtering Options:**
- By service category (GOVCON, SLED, IT, Writing)
- By service type (Proposal Development, RFP Response, etc.)
- By result metric (Win rate, Time saved, Cost saved)
- By client type (Federal, State, Local, Commercial)

**Display:**
- Grid layout with cards
- Each card shows:
  - Client type (anonymized: "Large DC-area Agency")
  - Service(s) used
  - Key metric (22% win rate, 3x capacity increase)
  - Brief teaser
  - "Read Case Study" CTA

**Search:**
- Full-text search across case studies
- Search by keyword, challenge, industry

### Individual Case Study Page Structure

**Template:**

```
Hero:
- Client type (anonymized)
- Industry/sector
- Services used
- Key result metric (hero number)

Challenge:
- What problem the client faced
- Why traditional solutions weren't working
- What was at stake

Solution:
- How we approached the problem strategically
- What services we deployed
- Our 3-phase process in action for this client

Results:
- Specific metrics (quantified wins)
- Timeline (how fast we delivered)
- Client quote (if available and approved)

Services Used:
- Links to relevant service pages

CTA:
- "Achieve Similar Results"
- Link to contact form pre-filled with service
```

### Content Strategy

**Launch Target:** 6-10 case studies to start
- 3-4 GOVCON examples
- 2-3 B2B agency examples
- 1-2 IT examples
- 1-2 Writing examples

**Ongoing:** Add 2-3 case studies per month

### Technical Implementation

**Data Storage Options:**
- CMS integration (Contentful, Sanity, Payload CMS)
- Markdown files with frontmatter (simpler for now)
- Database (if building admin panel)

**Recommended for Phase 2:** Markdown files + frontmatter

```markdown
---
title: "Large DC-Area Agency Increases Capacity 3x"
slug: "dc-agency-capacity"
category: "govcon"
services: ["proposal-development", "capture-strategy"]
clientType: "B2B Agency"
keyMetric: "3x capacity increase"
date: "2024-11-01"
---

Challenge content here...
```

---

## PRIORITY 3: Blog/Resources Section

### Overview

Content marketing hub for thought leadership, SEO, and lead generation.

### URL Structure

```
/blog (index)
/blog/[slug] (individual article)
/resources (resource hub)
/resources/guides/[slug] (downloadable guides)
```

### Blog Index Features

**Categories:**
- GOVCON Insights
- SLED Strategies
- IT & Development
- Content & Writing
- AI & Innovation
- Agency Partnerships (B2B)

**Display:**
- Featured post (hero)
- Grid layout for other posts
- Category filtering
- Search functionality
- Pagination

**Sidebar:**
- Popular posts
- Category navigation
- Newsletter signup
- CTA to services

### Blog Post Template

```
Hero:
- Featured image
- Title
- Author (or "Aliff Services Team")
- Publish date
- Read time
- Category tags

Content:
- Rich text with proper formatting
- Code blocks (for IT content)
- Images/screenshots
- Pull quotes
- Internal links to services

Related Content:
- 3-4 related blog posts
- Relevant service page links

CTA:
- "Need help with [topic]?"
- Link to relevant service or contact

Social Sharing:
- Twitter, LinkedIn, Facebook share buttons
```

### Content Strategy

**Launch Content (10-15 articles):**

GOVCON Articles:
1. "Why 30 Federal Proposals All Look Identical (And How to Stand Out)"
2. "Strategic Diagnosis: The Missing Phase in Proposal Development"
3. "22% Win Rate vs 4%: What Winners Do Differently"
4. "How to Beat AI Commodity Proposals"
5. "Capture Strategy Before RFP Release: A Timeline"

B2B Agency Articles:
1. "How Agencies Scale Delivery Without Hiring"
2. "White-Label Services: A Guide for GOVCON Agencies"
3. "The Economics of In-House vs White-Label Proposal Writing"

IT Articles:
1. "Why AI Can't Design Enterprise Architecture"
2. "Architecture-First Development: Preventing Technical Debt"
3. "The Future of Software Development: Human Strategy + AI Execution"

Writing Articles:
1. "How to Develop Brand Voice Before AI Content Production"
2. "Beating AI Content Commodity: The Strategic Content Approach"

**Ongoing:** 2-4 articles per month

### Resources Section

**Downloadable Lead Magnets:**
- PDF guides
- Checklists
- Templates
- Worksheets

**Examples:**
- "GOVCON RFP Response Checklist"
- "Agency White-Label Services Evaluation Guide"
- "IT Project Architecture Planning Template"
- "Brand Voice Development Worksheet"

**Gating Strategy:**
- Email required to download
- Lead capture for nurturing
- Auto-tag leads by resource type

### Technical Implementation

**CMS Options:**
1. **Markdown + MDX (Simple)** - Markdown files, git-based
2. **Headless CMS (Scalable)** - Contentful, Sanity, Payload
3. **Notion + API (Hybrid)** - Content team uses Notion, API pulls content

**Recommended for Phase 2:** MDX (Markdown + JSX components)

```
src/content/blog/
  ├── govcon-win-rate-secrets.mdx
  ├── agency-scaling-guide.mdx
  └── ...
```

**SEO Implementation:**
- Proper heading hierarchy
- Internal linking to service pages
- Schema.org Article markup
- Social meta tags (Open Graph, Twitter Card)
- Sitemap inclusion

---

## PRIORITY 4: SDL Public Page

### Overview

Public-facing explanation of the Solicitation Diagnosis Lab methodology without revealing proprietary details.

### URL Structure

```
/sdl (or /diagnosis-lab)
```

### Page Structure

**Hero:**
```
Headline: "The Solicitation Diagnosis Lab"
Subhead: "Why We Diagnose Before We Execute"
Value Prop: "Strategic analysis that beats AI commodity competitors"
```

**Section 1: The Problem**
```
- AI tools can execute fast, but they can't think strategically
- Result: 30 proposals that all look identical
- Contracting officers spot AI templates immediately
- Generic = Losing
```

**Section 2: Our Solution - The SDL Approach**
```
What We Diagnose:
- Solicitation intent (what they really want vs what they asked for)
- Evaluation criteria analysis (how to maximize points)
- Competitive landscape (who else is bidding, how to differentiate)
- Win themes development (strategic messaging unique to YOU)
- Compliance requirements (hidden traps and gotchas)

(WITHOUT revealing the 34-task breakdown or multi-AI orchestration)
```

**Section 3: How It Works (High-Level)**
```
Step 1: Human Expert Analysis
- Former contracting officers review solicitation
- Strategic diagnosis phase
- Custom approach designed

Step 2: Execution Planning
- Task breakdown
- Resource allocation
- Timeline development

Step 3: Quality Checkpoints
- Multiple review stages
- Expert validation
- Strategic alignment verification
```

**Section 4: What Makes SDL Different**
```
3-column comparison:
- AI-Only Tools: No diagnosis, template-based
- Traditional Consulting: Slow, expensive, all-human
- Aliff SDL: Strategic diagnosis + AI execution + Expert refinement
```

**Section 5: Results**
```
Metrics:
- 22% win rate vs 4% industry average
- 5-7 day turnaround (vs 2-3 weeks traditional)
- Strategic differentiation in every proposal
```

**Section 6: Services That Use SDL**
```
- GOVCON Proposal Development
- SLED RFP Response
- Capture Strategy
- (Links to service pages)
```

**Section 7: FAQ**
```
- What is solicitation diagnosis?
- How long does diagnosis take?
- Can I see a sample diagnosis?
- What if my solicitation is urgent?
- Is SDL available as a standalone service?
```

**Section 8: CTA**
```
"Get Your Solicitation Diagnosed"
- Link to contact form
- Pre-fill service interest: "SDL / Proposal Development"
```

### Technical Implementation

- Static page (single route)
- Animated diagrams/infographics for process visualization
- Video explainer (optional, future enhancement)
- Testimonials specific to SDL effectiveness

---

## PRIORITY 5: ROI Calculator for Agencies

### Overview

Interactive calculator showing agencies the cost savings of white-label partnership vs hiring or using freelancers.

### URL Structure

```
/for-agencies/roi-calculator
```

### Calculator Functionality

**Input Fields:**

```
Current State:
- Number of proposals/projects per month
- Average proposal size (Small/Medium/Large/Enterprise)
- Current approach:
  - In-house team
  - Freelancers
  - Mix

Team Costs (if in-house):
- Number of proposal writers
- Average salary per writer
- Benefits multiplier (1.3x typical)
- Overhead allocation

Freelancer Costs (if freelancers):
- Average cost per proposal
- Management time overhead
```

**Output/Results:**

```
Current Annual Costs:
- Total personnel costs
- Or freelancer costs
- Management overhead
- Total

Aliff Services Partnership:
- Cost per project (based on volume)
- Volume discount applied
- Annual cost estimate
- Management time saved

Savings:
- Annual cost savings ($)
- Annual cost savings (%)
- Time savings (hours per month)
- Capacity increase potential

ROI Visualization:
- Bar chart comparison
- Breakeven analysis
- 12-month projection
```

**Assumptions Display:**
```
- Volume discount tiers shown (15%, 20%, 25% at different volumes)
- Average turnaround time comparison
- Quality metrics comparison
```

**CTA:**
```
"See How We Can Help Your Agency"
- "Schedule Agency Partnership Call"
- "Download ROI Report" (PDF with calculations)
```

### Technical Implementation

**Frontend:**
- React state for calculator inputs
- Real-time calculations
- Chart.js or Recharts for visualizations
- Export to PDF functionality (html2pdf or similar)

**Calculations:**
```typescript
// Simplified example
const calculateROI = (inputs) => {
  const currentCost = inputs.teamSize * inputs.avgSalary * 1.3; // with benefits
  const aliffCost = inputs.monthlyProjects * getPricing(inputs.projectSize, inputs.volume);
  const savings = currentCost - aliffCost;
  const savingsPercent = (savings / currentCost) * 100;

  return { currentCost, aliffCost, savings, savingsPercent };
};
```

**Pricing Logic:**
- Not actual pricing, but ballpark estimates
- Volume discount tiers visible
- "Contact for exact pricing" disclaimer

---

## PRIORITY 6: Chatbot Integration

### Overview

AI-powered chatbot for lead qualification, service routing, and basic questions.

### Functionality

**Use Cases:**
1. Lead Qualification - Ask qualifying questions before contact form
2. Service Routing - Help users find the right service
3. FAQ Answers - Answer common questions
4. Agency Partnership Inquiry - Special handling for B2B leads
5. Handoff to Human - When complex questions arise

### Chatbot Flow

**Greeting:**
```
"Hi! I'm Aliff, your AI assistant. How can I help you today?"

Options:
- I need help with a government contract proposal
- I'm an agency looking to partner
- I need IT/development services
- I need content/writing services
- I have a question
```

**Qualification Questions (Based on Selection):**

For GOVCON:
```
- What type of solicitation? (RFP, RFQ, IFB, etc.)
- Federal or SLED?
- Solicitation value range?
- Response deadline?
- First time bidder or experienced contractor?
```

For Agency Partnership:
```
- How many proposals do you handle per month?
- Current team size?
- Looking to white-label services or just capacity?
- Timeline to start?
```

For IT/Writing:
```
- Project type?
- Timeline?
- Budget range?
```

**Output:**
```
"Based on your needs, I recommend [Service Name]."
- Link to service page
- "Schedule a consultation"
- "Talk to a human"
```

### Technical Implementation

**Options:**

**Option A: Third-Party Platform (Faster)**
- Intercom
- Drift
- Crisp
- Pros: Quick setup, proven UI, analytics built-in
- Cons: Monthly cost, less customization

**Option B: Custom Build**
- OpenAI API (GPT-4)
- Custom React component
- Conversation history stored
- Pros: Full control, custom logic, cheaper long-term
- Cons: Development time, maintenance

**Recommended for Phase 2:** Option A (Intercom or Drift) for speed

**Future Enhancement:** Custom build with Aliff AI integration (Phase 3)

---

## PRIORITY 7: Careers Section (If Hiring Active)

### Overview

Recruitment pages for growing the team. Only build if actively hiring.

### URL Structure

```
/careers (overview)
/careers/[job-slug] (individual job posting)
```

### Careers Overview Page

**Sections:**

```
Hero:
- "Join the Future of Strategic AI Execution"
- Mission-driven messaging
- Team photo or illustration

Why Aliff:
- Work on cutting-edge AI + human collaboration
- Impact: Help companies win contracts, build better systems
- Growth: Be part of a scaling operation
- Culture: Remote-first, results-oriented

Open Positions:
- List of current openings
- Department, location, type (full-time, contract)
- "Apply Now" CTAs

What We Value:
- Strategic thinking over execution speed
- Quality over quantity
- Innovation over templates
- Partnership mindset

Benefits:
- Compensation
- Health insurance
- Remote work
- Professional development
- (Actual benefits list)

CTA:
- "View Open Positions"
- "Send General Application"
```

### Job Posting Template

```
Job Title
Location, Department, Type

Overview:
- Role summary
- Impact on business
- Team you'll work with

Responsibilities:
- Key duties
- Projects you'll own

Qualifications:
- Required skills
- Preferred experience
- Education

What We Offer:
- Compensation range (if disclosed)
- Benefits
- Growth opportunities

Apply:
- Application form
- Resume upload
- Cover letter (optional)
- Portfolio/work samples (if relevant)
```

### Roles to Consider

**If Building Team:**
- Proposal Writer/Editor (GOVCON expert)
- Capture Manager
- Full-Stack Developer
- Content Strategist
- AI Engineer (multi-model orchestration)
- Sales/Business Development (B2B focus)

---

## PRIORITY 8: ATS Integration (If Hiring Active)

### Overview

Applicant Tracking System integration for managing recruitment pipeline.

### Options

**Third-Party ATS:**
- Greenhouse
- Lever
- Ashby
- BambooHR

**Integration:**
- Job posting data sync
- Application form submission to ATS
- Candidate tracking
- Email automation

**Implementation:**
- ATS provider API
- Webhook for application submissions
- Hosted application forms (embedded or redirect)

---

## Development Timeline Estimate

**Priority 1: Individual Service Pages (24 pages)**
- Template design: 3-4 days
- Service data structure: 2-3 days
- Content writing: 10-15 days (can be parallelized)
- Implementation: 5-7 days
- SEO optimization: 2-3 days
- **Total: 4-5 weeks**

**Priority 2: Case Studies Database**
- Design: 2-3 days
- Implementation: 4-5 days
- Content writing (6-10 case studies): 5-7 days
- **Total: 2-3 weeks**

**Priority 3: Blog/Resources**
- Design: 2-3 days
- Implementation: 5-7 days
- Initial content (10-15 articles): 2-3 weeks (can be parallelized)
- **Total: 3-4 weeks**

**Priority 4: SDL Public Page**
- Design: 2 days
- Content strategy: 2-3 days
- Implementation: 3-4 days
- **Total: 1-2 weeks**

**Priority 5: ROI Calculator**
- Design: 2-3 days
- Calculator logic: 3-4 days
- Charts/visualizations: 2-3 days
- PDF export: 2-3 days
- **Total: 2-3 weeks**

**Priority 6: Chatbot**
- Third-party setup: 3-5 days
- Flow design: 2-3 days
- Testing: 2-3 days
- **Total: 1-2 weeks**

**Priority 7-8: Careers + ATS** (only if hiring)
- Design: 2-3 days
- Implementation: 3-5 days
- ATS integration: 3-5 days
- **Total: 2-3 weeks**

---

## Overall Phase 2 Timeline

**If building sequentially:**
- Priorities 1-3: 9-12 weeks
- Priorities 4-6: 5-8 weeks
- **Total: 14-20 weeks (3.5-5 months)**

**If parallelizing content + development:**
- Service pages + case studies + blog can have content written in parallel
- Development can happen concurrently with content creation
- **Optimized: 10-14 weeks (2.5-3.5 months)**

---

## Phase 2 Success Metrics

**SEO & Traffic:**
- 24 new indexed pages driving organic traffic
- Blog generates 20%+ of site traffic
- Long-tail keyword rankings for specific services

**Conversion:**
- Service page conversion rate > category page rate
- ROI calculator drives 15%+ of agency inquiries
- Chatbot qualifies 30%+ of leads before human contact

**Content Marketing:**
- Blog email signups: 50+ per month
- Resource downloads: 30+ per month
- Average session duration increases 30%

**Social Proof:**
- Case studies referenced in 40%+ of sales conversations
- Case study pages have high time-on-page

---

## Next Steps

1. **Finalize Priorities** - Confirm which priorities to build first
2. **Service Content Audit** - List exact services and gather SME input for content
3. **Content Writing Strategy** - Determine internal vs outsourced writing
4. **Design System Extension** - New components for blog, calculator, etc.
5. **Begin Priority 1** - Individual service pages (highest SEO value)

---

**Ready to begin Phase 2 planning discussions. Which priority should we tackle first?**
