# ALIFF-RECRUITER Specification
## The 6th AI Role: Complete HR & Recruitment Automation

**Last Updated**: January 2025
**Status**: Planning Phase
**Reports To**: ALIFF-CEO

---

## Executive Summary

ALIFF-RECRUITER is the 6th specialized AI role in the Aliff Services AI ecosystem, serving as the **omnipresent HR genie** that automates 95% of recruitment operations. From workforce planning to final hiring decisions, ALIFF-RECRUITER manages the complete provider lifecycle while maintaining Aliff's core principle of client-provider anonymity.

**Key Metric**: Process 1,000 applications with the same effort competitors use for 50.

---

## I. Role in 6-Role AI System

### Updated AI Hierarchy

```
ALIFF-CEO (Business Intelligence & Strategy)
    ├── ALIFF-SALES (Lead Qualification & Client Onboarding)
    ├── ALIFF-OPS (SDL Multi-AI Orchestration)
    ├── ALIFF-CLIENT (Customer Success & Communication Proxy)
    ├── ALIFF-TRAINER (Knowledge Transfer & Provider Training)
    └── ALIFF-RECRUITER (Complete HR & Recruitment Automation) ← NEW
```

### Reporting Relationship
- **Reports To**: ALIFF-CEO
- **Data Flows To CEO**:
  - Provider pipeline metrics (applications, conversion rates, time-to-hire)
  - Skills gap analysis (e.g., "Need 5 more SLED proposal writers")
  - Market intelligence (salary expectations, competitor hiring trends)
  - Quality metrics (provider performance post-hire)

- **Data Flows From CEO**:
  - Hiring priorities based on business forecasts
  - Budget constraints for recruitment campaigns
  - Strategic initiatives (e.g., "Build healthcare vertical, hire specialists")

### Cross-Role Integration

**With ALIFF-SALES**:
- Receives warm leads who express interest in "working with Aliff" during sales conversations
- Shares provider capacity data (e.g., "We can handle 3 more GOVCON projects this month")

**With ALIFF-OPS**:
- Receives project requirements to match validated providers
- Provides provider availability and skill match scores
- Escalates when no suitable provider exists (triggers new hiring)

**With ALIFF-CLIENT**:
- Hands off newly hired providers with onboarding briefing
- Receives performance feedback to update provider ratings
- Coordinates provider training needs

**With ALIFF-TRAINER**:
- Identifies skill gaps requiring training (e.g., "Provider scored 68% on SLED compliance, needs upskilling")
- Refers validated providers for advanced certification programs
- Tracks training completion for provider profile updates

---

## II. Core Responsibilities

### A. Recruitment Planning & Workforce Strategy

**1. Demand Forecasting**
- Analyzes ALIFF-CEO business projections to predict provider needs
- Monitors project pipeline from ALIFF-SALES to anticipate hiring surges
- Tracks provider utilization rates (e.g., "All GOVCON writers at 90% capacity, hire 2 more")

**2. Job Opening Automation**
- Auto-creates job postings when provider shortage detected
- Generates JDs from service definitions (e.g., pulls from SDL_MULTI_AI_ORCHESTRATION.md for proposal writer roles)
- A/B tests job descriptions to optimize application quality

**3. Recruitment Campaign Management**
- Posts to 10+ job boards simultaneously (Indeed, LinkedIn, Dice, AngelList, niche boards)
- Manages social media recruiting (LinkedIn outreach, Twitter campaigns)
- Tracks source effectiveness (e.g., "LinkedIn generates 40% of qualified developers")

**Example Automation**:
```
Trigger: ALIFF-CEO forecasts 15 new SLED projects next quarter
Action: ALIFF-RECRUITER auto-posts "SLED Proposal Writer" to 8 job boards
        Generates LinkedIn campaign targeting former government employees
        Creates email campaign to past applicants in CV Bank
Result: 50 applications in 72 hours
```

---

### B. Application & Applicant Management

**1. Omnipresent Application Assistance**
ALIFF-RECRUITER appears at every touchpoint:

**On Careers Page**:
- **Chat Widget**: "👋 Hi! I'm Aliff, your AI hiring assistant. Need help finding the right role?"
- Guides candidates to best-fit positions based on conversation
- Answers questions about benefits, work model, company culture
- Pre-qualifies via friendly conversation before formal application

**During Application**:
- **Smart Form Filling**: "I see you uploaded a resume. Let me auto-fill this for you!"
- **Real-time Validation**: "Your GitHub link seems broken, mind checking?"
- **Encouragement**: "Great experience with federal proposals! This role is perfect for you."

**Post-Application**:
- **Instant Confirmation**: Email + SMS with next steps
- **Status Updates**: "Your application is under AI review" → "Skills test generated" → "Test completed, results in 24hrs"
- **Always Available**: "Have questions? Text me anytime at +1-XXX-ALIFF-HR"

**2. Application Parsing & Data Extraction**
- Extracts 50+ data points from resumes (skills, experience, education, certifications, past performance)
- Parses LinkedIn profiles, GitHub repos, writing portfolios
- Identifies red flags (gaps in employment, job-hopping, skill mismatches)
- Normalizes data for semantic search (e.g., "React.js" = "ReactJS" = "React")

**3. Automated Screening**
- **Pass 1 - Basic Qualifications**: Filters out obvious mismatches (e.g., no degree for role requiring one)
- **Pass 2 - Skills Match**: Compares candidate skills to job requirements, generates 0-100 match score
- **Pass 3 - Conversational Screening**: Engages top 30% in chat-based interview

---

### C. First Interview Through AI Chat

**Conversational Interview System**

ALIFF-RECRUITER conducts natural, dynamic first-round interviews via chat (web or SMS):

**Interview Flow**:
1. **Warm Welcome**:
   ```
   Hi [Name]! 👋 Thanks for applying to the GOVCON Proposal Writer role.
   I'm Aliff, the AI that handles first interviews at Aliff Services.
   This will be a casual 15-minute chat to learn about your experience.
   Ready to start? (Reply "yes" when ready)
   ```

2. **Adaptive Questioning**:
   - Asks role-specific questions from dynamic question bank
   - Follows up based on answers (like human interviewer)
   - Detects evasiveness or unclear answers, probes deeper

   **Example Exchange**:
   ```
   ALIFF: Tell me about your most complex federal proposal. What made it challenging?

   Candidate: We had to respond to a $50M DHS RFP in 10 days with 3 subcontractors.

   ALIFF: Wow, tight timeline! How did you coordinate the technical volumes with subcontractors under that pressure?

   Candidate: I created a shared workspace with section assignments and daily check-ins...

   ALIFF: Smart! Did you use the DHS-specific compliance matrix or build your own?
   ```

3. **Question Categories**:
   - **Experience Validation**: "Walk me through Section L compliance on your last proposal"
   - **Problem-Solving**: "RFP drops Friday, due Monday. Sub's tech volume is 40% done. What do you do?"
   - **Skills Assessment**: "Explain past performance narratives vs. case studies in your own words"
   - **Culture Fit**: "Do you prefer working solo or with AI assistance for first drafts?"
   - **Availability**: "We have rush projects with 3-day turnarounds. How often can you take those?"

4. **Scoring & Analysis**:
   - Multi-AI evaluation (GPT-4, Claude, Gemini) scores responses 0-100
   - Identifies strengths (e.g., "Excellent SLED compliance knowledge")
   - Flags concerns (e.g., "Unfamiliar with teaming agreement negotiations")
   - Generates summary for human review

5. **Immediate Feedback**:
   ```
   Thanks [Name]! That was great. Here's what happens next:

   ✅ You're moving to the Skills Test phase
   📋 You'll receive a real-world proposal writing challenge tomorrow
   ⏱️ You'll have 4 hours to complete it
   💬 Questions? Reply anytime, I'm here 24/7
   ```

**Rejection Handling**:
- Empathetic, specific feedback
- Suggests alternative roles if skills mismatch
- Invites to reapply after skill development
- Adds to talent pool for future opportunities

---

### D. Automated Skills Testing

**Test Generation Engine**

ALIFF-RECRUITER creates role-specific, project-realistic tests:

**Test Types by Role**:

**Proposal Writers (GOVCON/SLED)**:
- "Here's a 20-page RFP excerpt for a $10M VA healthcare IT project. Write the Executive Summary (500 words max)."
- "Review this Past Performance Narrative and identify 3 compliance gaps."
- "Create a Capability Statement for a fictional cybersecurity company."

**Developers (IT Services)**:
- "Debug this Next.js component - it's not rendering data correctly."
- "Design a PostgreSQL schema for a federal contract management system."
- "Refactor this React code for performance - it's causing re-renders."

**Content Writers**:
- "Write a 300-word thought leadership intro on 'AI in Government Contracting'."
- "Create a case study outline from these client interview notes."
- "Edit this technical white paper for C-suite audience (reduce jargon)."

**Test Delivery**:
- Sent via email with secure submission portal
- Time-boxed (2-4 hours depending on complexity)
- Provides realistic context (fake RFP, client brief, project specs)
- Allows tool usage (encourage AI assistance to test workflow proficiency)

**AI Evaluation**:
- **Multi-AI Consensus Scoring**: GPT-4, Claude, Gemini each score 0-100
- **Evaluation Criteria**:
  - Accuracy (meets requirements)
  - Quality (clear, professional, error-free)
  - Strategic thinking (goes beyond obvious)
  - Compliance (follows instructions, format)
  - Speed (completed in time limit)

- **Detailed Feedback Report**:
  ```
  Overall Score: 84/100 (Strong Pass)

  Strengths:
  ✅ Excellent compliance with RFP Section L requirements
  ✅ Clear, persuasive writing style
  ✅ Strong understanding of VA healthcare IT landscape

  Areas for Improvement:
  ⚠️ Executive Summary could be more concise (612 words vs 500 limit)
  ⚠️ Missing explicit price-to-performance value statement

  Recommendation: HIRE - with editorial oversight for first 2 projects
  ```

**Validation Gate**:
- Score ≥75: Auto-advances to Provider Talent Pool
- Score 60-74: Human review + optional second test
- Score <60: Rejected with feedback, invited to reapply in 6 months

---

### E. Provider Talent Pool Management

**CV Bank: The Strategic Asset**

Every validated candidate becomes a permanent resource in the searchable Provider Talent Pool.

**Database Schema (50+ Data Points)**:

**Core Identity**:
- Name, email, phone, location, timezone
- LinkedIn, GitHub, portfolio URLs
- Years of experience (total + role-specific)
- Education, certifications, security clearances

**Skills & Expertise**:
- Technical skills (extracted from resume + validated by tests)
- Domain expertise (GOVCON, SLED, healthcare, cybersecurity, etc.)
- Tools proficiency (MS Word, Shipley, Adobe, SharePoint, etc.)
- AI collaboration comfort level (1-10 scale)

**Performance Metrics**:
- Application score (screening chat: 0-100)
- Skills test score (hands-on test: 0-100)
- Project history (if previously hired)
- Client satisfaction ratings (from ALIFF-CLIENT feedback)
- On-time delivery rate
- Revision request frequency

**Availability & Preferences**:
- Current employment status (available, part-time, moonlighting)
- Hours per week available
- Hourly rate or project rate expectations
- Preferred project types (e.g., "only SLED, no federal")
- Rush project availability (yes/no/sometimes)
- Maximum projects simultaneously

**Engagement History**:
- Application date
- Last contacted date
- Interview notes (from AI chat)
- Test submission artifacts (stored for review)
- Email/SMS engagement score (open rates, response time)

**Semantic Search & Matching**

**Powered by Pinecone Vector Database**:
- Embeds provider profiles for semantic similarity search
- Natural language queries from ALIFF-OPS or human recruiters

**Example Queries**:
```
Query: "Find proposal writer with VA healthcare experience, available next week, rate under $75/hr"

Results:
1. Sarah Chen - 92% match
   - 8 years GOVCON, 4 VA projects
   - Available 30hrs/week, $70/hr
   - Skills test: 89/100

2. Marcus Johnson - 87% match
   - 6 years GOVCON, 2 VA + 3 DoD healthcare
   - Available 20hrs/week, $65/hr
   - Skills test: 82/100
```

**Auto-Matching for Projects**:
When ALIFF-OPS receives new project:
1. Extracts requirements (skills, domain, timeline, budget)
2. Queries Provider Talent Pool
3. Returns top 5 matches with scores
4. ALIFF-OPS reviews and selects 1-3 for client presentation
5. ALIFF-RECRUITER handles provider outreach and onboarding

---

### F. Job Description Generation

**Automated JD Creation from Service Definitions**

ALIFF-RECRUITER generates role-specific JDs by analyzing:
- Service definitions from SDL_MULTI_AI_ORCHESTRATION.md
- Current provider profiles (to identify required skills)
- Recent project requirements (what clients actually need)
- Market data (competitor job postings, salary benchmarks)

**JD Components**:

**1. Role Overview**:
```
Senior GOVCON Proposal Writer
Remote (US-based) | Part-Time to Full-Time | $65-$85/hr

Aliff Services is seeking an experienced federal proposal writer to support
our 8(a) and small business clients in winning government contracts. You'll
work with our AI orchestration system (SDL) to produce high-win-rate proposals
in compressed timelines.
```

**2. Responsibilities** (auto-generated from service tasks):
- Develop compliant responses to federal RFPs (FAR-based)
- Write technical, management, and past performance volumes
- Collaborate with ALIFF-OPS AI for research and first drafts
- Coordinate with teaming partners and subcontractors
- Ensure Section L/M compliance for all submissions

**3. Requirements** (extracted from top performer profiles):
- 5+ years federal proposal writing experience
- Proven track record with at least 3 contract wins
- Expert knowledge of FAR, DFARS, and agency-specific requirements
- Proficiency with Shipley methodology (preferred)
- Comfortable using AI tools for efficiency (required)
- Active Secret clearance (preferred but not required)

**4. What Makes This Different**:
- Work with cutting-edge AI (you + GPT-5 + Claude + Gemini)
- Complete anonymity (you never know end client, focus on craft)
- Flexible hours (take projects when available, decline when not)
- Fast payment (Net-15 via direct deposit)
- Continuous upskilling (free access to ALIFF-TRAINER courses)

**5. Compensation & Benefits**:
- $65-$85/hr based on experience and test performance
- Performance bonuses for high client satisfaction
- Profit-sharing for repeat client projects
- Health stipend for full-time providers (30+ hrs/week)

**A/B Testing**:
- ALIFF-RECRUITER creates 2-3 JD variations
- Tests for 2 weeks, measures application quality
- Auto-optimizes based on conversion metrics

---

### G. Multi-Channel Job Posting Automation

**Posting Distribution Engine**

ALIFF-RECRUITER posts to 15+ channels simultaneously:

**General Job Boards**:
- Indeed (API integration)
- LinkedIn Jobs (premium posting)
- Glassdoor
- ZipRecruiter
- Monster

**Tech-Specific Boards**:
- Dice (for IT roles)
- Stack Overflow Jobs
- GitHub Jobs
- AngelList (for startup-minded talent)

**Niche Communities**:
- APMP (Association of Proposal Management Professionals)
- GovConWire job board
- ClearanceJobs (for roles requiring security clearance)
- WriterAccess (for content roles)

**Social Media**:
- LinkedIn organic posts + targeted ads
- Twitter/X campaigns with hashtags (#govcon #hiring #remotework)
- Reddit (r/govcon, r/technicalwriting, r/forhire)

**Automated Posting Workflow**:
```
1. ALIFF-RECRUITER generates JD
2. Formats for each platform (character limits, required fields)
3. Schedules posts (optimal times per platform)
4. Monitors application flow
5. Auto-closes postings when target reached (e.g., 100 qualified applicants)
6. Re-posts monthly if ongoing need
```

**Campaign Analytics**:
- Tracks applications per source
- Measures quality (screening pass rate by source)
- Calculates cost-per-qualified-applicant
- Reports to ALIFF-CEO for budget optimization

---

### H. Candidate Communication & Experience

**24/7 Omnichannel Availability**

ALIFF-RECRUITER is reachable via:
- **Web Chat**: Instant responses on careers page
- **Email**: recruitment@aliffservices.com (auto-routed to AI)
- **SMS**: Text-based interview and updates
- **Phone** (future): Voice AI for complex questions

**Proactive Communication**:

**Application Received**:
```
Subject: Application Received - GOVCON Proposal Writer

Hi Marcus,

Thanks for applying! I'm Aliff, the AI that manages hiring at Aliff Services.

Here's what happens next:
1. ✅ Your resume is being analyzed (done in ~1 hour)
2. 💬 Top candidates get invited to AI chat interview (tomorrow)
3. 📝 Passing candidates receive skills test (within 3 days)
4. 🎯 Final decision within 5 business days

Questions? Reply to this email - I'm here 24/7.

Best,
Aliff (AI Recruiter)
Aliff Services
```

**Status Updates** (auto-sent at each stage):
- "You're moving to the chat interview stage!"
- "Skills test ready - complete within 72 hours"
- "Test submitted - results in 24 hours"
- "Congratulations! You've been added to our Provider Talent Pool"

**Rejection Emails** (empathetic + actionable):
```
Hi Sarah,

Thanks for your interest in the Senior Developer role.

After careful review, we've decided not to move forward at this time.

Here's why:
- Your frontend skills are excellent (React score: 88/100)
- We're currently seeking backend specialists (Node.js, PostgreSQL)
- Your availability (10hrs/week) doesn't match our current needs (20+hrs)

But here's the good news:
✅ I've added you to our talent pool for future frontend projects
📚 Consider taking our free Next.js course (builds on your React skills)
🔄 We'd love to reconsider you in 3 months for a frontend-focused role

Want me to notify you when we have part-time frontend openings?

Best,
Aliff
```

**FAQ Answering**:
Handles 200+ common questions instantly:
- "What's the typical project duration?"
- "Do you hire internationally?"
- "Is this W2 or 1099?"
- "How does anonymity work?"
- "Can I see sample projects?"

---

### I. Onboarding & Provider Activation

**Automated Onboarding for Validated Providers**

**Phase 1: Administrative Setup** (Day 1)
- **Welcome Email**:
  ```
  🎉 Welcome to Aliff Services Provider Network!

  You've been validated as a GOVCON Proposal Writer.
  Let's get you set up (takes 10 minutes):

  1. Complete W9/W8-BEN (tax forms)
  2. Sign NDA & Provider Agreement (DocuSign)
  3. Set up direct deposit
  4. Choose your anonymity preferences
  5. Take 5-minute platform orientation

  Click here to start: [Onboarding Portal Link]
  ```

- **Document Collection**: Auto-sends DocuSign for contracts, tax forms
- **Payment Setup**: Collects banking info via secure Stripe integration
- **Background Check** (if required): Integrates with Checkr API

**Phase 2: System Access** (Day 2-3)
- Creates provider account in project management system
- Assigns ALIFF-CLIENT as dedicated point of contact
- Grants access to style guides, templates, past proposals (anonymized)
- Schedules intro call with ALIFF-TRAINER (if first project in new domain)

**Phase 3: First Project Assignment** (Day 4-7)
- ALIFF-OPS assigns small "trial project" (4-8 hour scope)
- ALIFF-CLIENT monitors closely, provides real-time feedback
- Successful completion → full provider status
- Performance issues → additional training or off-boarding

**Onboarding Metrics** (tracked and reported to ALIFF-CEO):
- Time to first project (target: <7 days)
- Onboarding completion rate (target: >90%)
- First project success rate (target: >85%)
- 30-day retention (target: >80%)

---

### J. Performance Tracking & Quality Management

**Continuous Provider Evaluation**

ALIFF-RECRUITER maintains live performance dashboards for all providers:

**Metrics Tracked**:
1. **Quality Scores** (from ALIFF-CLIENT feedback):
   - Client satisfaction (1-5 stars per project)
   - First-draft quality (% accepted without revisions)
   - Compliance accuracy (errors per project)

2. **Reliability Scores**:
   - On-time delivery rate (%)
   - Availability when committed (%)
   - Communication responsiveness (avg response time)

3. **Efficiency Scores**:
   - Hours to completion vs. estimate
   - Revision rounds per project
   - Self-sufficiency (questions per project)

4. **Growth Metrics**:
   - Skills acquired (from ALIFF-TRAINER courses)
   - Domains expanded (GOVCON → SLED → Healthcare)
   - AI proficiency improvement

**Automated Interventions**:

**High Performers** (top 20%):
- Auto-offered premium projects (higher rates)
- Invited to mentorship program (train new providers)
- First priority for client-requested providers

**Declining Performance** (2+ poor ratings):
- Triggers ALIFF-RECRUITER outreach:
  ```
  Hi Marcus,

  I noticed your last 2 projects had lower client satisfaction scores.
  Common issues:
  - Missed compliance requirements in Section L
  - Executive summaries too technical for evaluator audience

  I've enrolled you in our "Advanced Compliance" micro-course (30 mins).
  Complete by Friday, and I'll assign a mentor for your next project.

  Let's get you back to your 4.8-star average!

  - Aliff
  ```

**At-Risk Providers** (3+ poor ratings or missed deadlines):
- Temporary suspension from new projects
- Required re-certification via new skills test
- Probation period with enhanced monitoring
- Off-boarding if no improvement in 30 days

**Provider Dashboards**:
Providers access real-time stats:
- Overall rating (1-5 stars)
- Total projects completed
- Earnings (current month, YTD, all-time)
- Skills badges earned
- Ranking vs. peers (percentile)
- Upcoming training recommendations

---

### K. Market Intelligence & Salary Benchmarking

**Competitive Intelligence System**

ALIFF-RECRUITER continuously monitors:

**Job Market Data**:
- Scrapes competitor job postings (Indeed, LinkedIn) for similar roles
- Tracks salary ranges for proposal writers, developers, content creators
- Identifies emerging skill demands (e.g., "AI prompt engineering now required")
- Monitors hiring velocity (competitors ramping up = market opportunity)

**Talent Supply/Demand**:
- Application volume trends (falling = need to increase compensation)
- Offer acceptance rates (declining = we're not competitive)
- Provider churn analysis (why are providers leaving?)

**Reporting to ALIFF-CEO**:
Monthly "Talent Market Brief":
```
📊 January 2025 Talent Market Report

Key Findings:
1. ⚠️ GOVCON proposal writer salaries up 12% YoY ($68/hr → $76/hr avg)
   Recommendation: Raise our range to $70-$90/hr to stay competitive

2. ✅ Developer market cooling - applications up 40% MoM
   Recommendation: Now is the time to build senior developer bench

3. 📈 Emerging skill: "AI-assisted proposal writing" in 60% of new JDs
   Recommendation: Launch ALIFF-TRAINER course, make it required for all writers

4. 🔥 Competitor Intel: CapitalProposals hiring 10 SLED writers (LinkedIn)
   Recommendation: Launch targeted SLED recruiting campaign this month
```

**Dynamic Compensation Adjustment**:
- Auto-suggests rate increases when market moves
- A/B tests compensation in job postings
- Monitors offer decline reasons ("rate too low" triggers alert)

---

### L. Compliance & Legal Automation

**Built-in Legal Safeguards**

**Equal Employment Opportunity (EEO)**:
- AI trained to avoid bias (no questions about age, race, religion, etc.)
- Structured interviews ensure consistent evaluation
- Audit logs for every decision (why candidate rejected)
- Annual fairness audits (compare outcomes by demographics - data anonymized)

**Data Privacy (GDPR, CCPA)**:
- Auto-deletes rejected candidate data after 1 year (unless opted in)
- Provides instant data export on request ("send me my data")
- Anonymizes candidate data in training sets
- Obtains consent for data usage

**Employment Classification**:
- All providers are 1099 contractors (not employees)
- Auto-generates compliant contracts via DocuSign
- Tracks hours to prevent misclassification (flags if provider works >30hrs/week for 6+ months)

**Background Checks** (when required):
- Integrates with Checkr for criminal, education, employment verification
- Only runs with explicit candidate consent
- FCRA-compliant adverse action process

---

## III. Technical Architecture

### A. System Components

**Frontend (Next.js 14 App Router)**:
- `/careers` - Public job listings page
- `/careers/[jobId]` - Individual job detail + apply
- `/careers/apply` - Application form with AI assistance
- `/providers/dashboard` - Provider performance portal
- `/admin/recruitment` - Internal recruiter dashboard (human oversight)

**Backend APIs (tRPC + Next.js API Routes)**:
- `/api/recruitment/apply` - Application submission
- `/api/recruitment/chat` - AI interview chat endpoint
- `/api/recruitment/test` - Skills test delivery/submission
- `/api/recruitment/match` - Provider matching for projects
- `/api/recruitment/analytics` - Metrics for ALIFF-CEO

**Database (PostgreSQL + Prisma)**:

**Core Tables**:
```prisma
model Job {
  id          String   @id @default(cuid())
  title       String
  category    ServiceCategory // GOVCON, SLED, IT, WRITING
  description String
  requirements Json
  compensation String
  status      JobStatus // DRAFT, ACTIVE, PAUSED, CLOSED
  postedAt    DateTime
  applications Application[]
}

model Application {
  id            String   @id @default(cuid())
  jobId         String
  candidateName String
  email         String
  phone         String?
  resumeUrl     String
  coverLetter   String?
  linkedIn      String?
  github        String?
  portfolio     String?

  // AI Processing
  parsedData    Json // 50+ extracted fields
  screeningScore Float? // 0-100 from initial screening
  chatTranscript Json? // Interview conversation
  chatScore      Float? // 0-100 from interview
  testId         String?
  testScore      Float? // 0-100 from skills test

  status        ApplicationStatus
  createdAt     DateTime

  job           Job @relation(fields: [jobId], references: [id])
  candidate     Candidate? // If converted to provider
}

model Candidate {
  id               String   @id @default(cuid())
  applicationId    String   @unique

  // Core Info
  name             String
  email            String   @unique
  phone            String?
  location         String
  timezone         String

  // Skills & Experience
  skills           String[] // ["GOVCON", "RFP", "Past Performance"]
  yearsExperience  Int
  domains          String[] // ["Healthcare", "Cybersecurity"]
  certifications   String[]
  clearance        String?

  // Performance
  overallScore     Float // Average of all projects
  projectsCompleted Int
  onTimeRate       Float
  satisfactionAvg  Float

  // Availability
  status           CandidateStatus // AVAILABLE, BUSY, INACTIVE
  hoursPerWeek     Int
  hourlyRate       Float
  preferredProjects String[]

  // Engagement
  lastContacted    DateTime
  responseTime     Int // avg minutes to respond

  application      Application @relation(fields: [applicationId], references: [id])
  projects         Project[]
  performanceReviews Review[]
}

model SkillsTest {
  id           String   @id @default(cuid())
  applicationId String
  jobCategory  ServiceCategory

  // Test Content
  prompt       String // The test question/challenge
  context      Json // Supporting materials (fake RFP, etc)
  timeLimit    Int // minutes

  // Submission
  submittedAt  DateTime?
  submission   String? // Candidate's answer

  // Evaluation
  gpt4Score    Float?
  claudeScore  Float?
  geminiScore  Float?
  consensusScore Float? // Average
  feedback     Json // Detailed evaluation

  status       TestStatus
  createdAt    DateTime
  expiresAt    DateTime
}

model JobPosting {
  id          String   @id @default(cuid())
  jobId       String
  platform    String // "Indeed", "LinkedIn", etc
  url         String?
  postedAt    DateTime
  expiresAt   DateTime?
  status      PostingStatus

  // Analytics
  views       Int @default(0)
  clicks      Int @default(0)
  applications Int @default(0)
  cost        Float? // If paid posting

  job         Job @relation(fields: [jobId], references: [id])
}
```

**Vector Database (Pinecone)**:
- Namespace: `provider-profiles`
- Embeddings: 1536-dim (OpenAI text-embedding-3-small)
- Metadata: Skills, domains, experience, rates, availability
- Use case: Semantic provider search

**AI Integration (Vercel AI SDK v5)**:
```typescript
// Multi-AI Consensus Scoring
async function evaluateSkillsTest(submission: string, criteria: string) {
  const models = [
    openai('gpt-4-turbo'),
    anthropic('claude-3-5-sonnet'),
    google('gemini-1.5-pro')
  ];

  const scores = await Promise.all(
    models.map(async (model) => {
      const result = await generateText({
        model,
        prompt: `Evaluate this test submission on 0-100 scale:\n\nCriteria: ${criteria}\n\nSubmission: ${submission}\n\nProvide: 1) Score (0-100), 2) Strengths (3 bullets), 3) Weaknesses (3 bullets)`,
        temperature: 0.3
      });
      return parseScore(result.text);
    })
  );

  return {
    gpt4: scores[0],
    claude: scores[1],
    gemini: scores[2],
    consensus: (scores[0] + scores[1] + scores[2]) / 3
  };
}
```

**Communication Channels**:
- **Email**: Resend API (recruitment@aliffservices.com)
- **SMS**: Twilio integration for text-based interviews
- **Chat**: WebSocket for real-time web chat
- **Webhooks**: DocuSign (contracts), Checkr (background checks), job boards (applications)

---

### B. AI Training & Knowledge Base

**Training Data Sources**:

1. **This Conversation** (saved as training data):
   - File: `/Planning/ALIFF_RECRUITER_TRAINING_DATA.md`
   - Contains: Full discussion about role design, responsibilities, vision
   - Used to train ALIFF-RECRUITER personality and approach

2. **HR Best Practices**:
   - EEOC guidelines (bias avoidance)
   - SHRM recruitment standards
   - Candidate experience benchmarks (respond within 24hrs, etc.)

3. **Aliff Service Definitions**:
   - SDL_MULTI_AI_ORCHESTRATION.md (for proposal writer roles)
   - PLATFORM_SPECIFICATION.md (for understanding anonymity requirements)
   - Service definitions for all 24 services (to generate accurate JDs)

4. **Historical Data** (once live):
   - Past successful applications (what good looks like)
   - High-performer interview transcripts
   - Top-rated skills test submissions
   - Provider performance correlations (interview score → project success)

**Fine-Tuning Approach**:
- Base Model: GPT-4 Turbo (for general intelligence)
- Fine-Tuned Layer: Custom training on Aliff-specific data
- Continuous Learning: Weekly retraining with new interview/test data
- Human Feedback: Recruiters flag bad AI decisions for retraining

**Personality & Tone**:
```
ALIFF-RECRUITER Persona:
- Helpful, never robotic
- Encouraging but honest
- Professional but warm
- Proactive (anticipates questions)
- Clear on next steps (never leaves candidates hanging)
- Empathetic in rejections
- Celebrates wins ("You crushed that test!")

Example exchanges:
❌ Bad: "Your application has been received. Status: Under Review."
✅ Good: "Got your application, Marcus! 🎉 I'm analyzing your resume now - should have feedback in ~2 hours. Quick question while I work: Are you open to rush projects with 2-3 day turnarounds?"

❌ Bad: "Application rejected due to insufficient qualifications."
✅ Good: "Thanks for applying, Sarah. After review, we're focusing on candidates with federal-specific experience right now. BUT - I noticed you have strong SLED background. Can I keep you in mind for our state/local projects? We're hiring 3 SLED writers next month."
```

---

### C. Integration Points

**With Existing Platform**:

**ALIFF-CEO Dashboard**:
- Real-time hiring metrics widget
- Provider pipeline health score
- Talent shortage alerts ("Critical: 0 available SLED writers")
- Weekly talent market brief

**ALIFF-SALES Integration**:
- When prospect says "I'm interested in working with Aliff" → auto-creates lead in recruitment system
- Shares provider capacity: "We can take 5 more GOVCON projects this month"

**ALIFF-OPS Integration**:
- When new project arrives:
  1. ALIFF-OPS extracts requirements
  2. Calls ALIFF-RECRUITER API: `POST /api/recruitment/match`
  3. Receives top 5 provider matches with scores
  4. Selects 1-3 for client presentation
- When project completes:
  1. ALIFF-OPS sends performance data to ALIFF-RECRUITER
  2. Updates provider ratings

**ALIFF-CLIENT Integration**:
- Post-project: Sends provider satisfaction survey to client
- Results feed ALIFF-RECRUITER performance dashboard
- Flags providers with 2+ poor ratings for intervention

**ALIFF-TRAINER Integration**:
- Provider profile shows "Recommended Courses" based on skill gaps
- Completion badges appear on provider dashboard
- Course completion triggers ALIFF-RECRUITER notification ("Marcus just finished Advanced SLED Compliance - consider him for next state project")

---

### D. Security & Privacy

**Data Protection**:
- All candidate PII encrypted at rest (AES-256)
- HTTPS only (TLS 1.3)
- Role-based access control (recruiters see different data than ALIFF-CEO)
- Audit logs for every data access

**Anonymity Preservation**:
- Provider resumes stripped of identifiable info before client presentation
- AI generates fake names/bios for provider profiles shown to clients
- All communication proxied through ALIFF-CLIENT (providers never see client emails)

**AI Safety**:
- No bias in screening questions (validated by third-party audit)
- Human review of AI rejections (10% random sample monthly)
- Explainable AI (every score shows reasoning)
- Candidate right to appeal ("Request human review")

---

## IV. Key Metrics & Success Criteria

### A. Efficiency Metrics

**Automation Rate**: 95%+ of recruitment tasks handled without human intervention
- Target: Human recruiters only review edge cases (5% of applications)

**Time-to-Hire**: 7 days from application to provider activation
- Industry average: 30-45 days
- Aliff target: <7 days

**Cost-per-Hire**: $50 per validated provider
- Breakdown:
  - Job posting costs: $20
  - AI processing (API calls): $5
  - Background check (if required): $25
  - Human review (5% of cases): $10

**Application Processing Speed**:
- Resume parsing: <60 seconds
- Initial screening: <2 hours
- Chat interview: 15 minutes (real-time)
- Skills test grading: <24 hours

### B. Quality Metrics

**Provider Quality Score**: Average skills test score of hired providers ≥80/100
**First-Project Success Rate**: 85%+ of new providers successfully complete first project
**Client Satisfaction**: 4.2+ stars average for all providers
**Retention Rate**: 80%+ of providers active after 6 months

### C. Business Impact Metrics

**Provider Pool Growth**: 500 validated providers by end of Year 1
**Fill Rate**: 90%+ of project requests matched with available provider within 24 hours
**Utilization Rate**: 70%+ of providers assigned at least 1 project per month
**Revenue Impact**: Provider network generates $2M+ in project revenue annually

---

## V. Rollout Plan

### Phase 1: Foundation (Months 1-2)
- ✅ Build database schema (Job, Application, Candidate, SkillsTest tables)
- ✅ Create `/careers` public page with 5 starter job postings
- ✅ Implement application form with resume upload
- ✅ Build AI resume parser (extract 50+ fields)
- ✅ Create basic screening algorithm (match score 0-100)

### Phase 2: AI Chat Interviews (Month 3)
- ✅ Implement real-time chat interview system (web + SMS)
- ✅ Train ALIFF-RECRUITER on interview question bank (200+ questions)
- ✅ Build multi-AI evaluation (GPT-4, Claude, Gemini consensus)
- ✅ Create candidate feedback reports

### Phase 3: Skills Testing (Month 4)
- ✅ Build test generation engine (role-specific challenges)
- ✅ Create test submission portal (time-boxed, secure)
- ✅ Implement AI grading with detailed feedback
- ✅ Set validation thresholds (≥75 = auto-hire)

### Phase 4: Provider Pool & Matching (Month 5)
- ✅ Launch CV Bank (searchable provider database)
- ✅ Integrate Pinecone for semantic search
- ✅ Build provider dashboard (performance, earnings, courses)
- ✅ Create ALIFF-OPS matching API

### Phase 5: Automation & Scale (Month 6)
- ✅ Multi-channel job posting automation (15+ boards)
- ✅ Proactive candidate communication (status updates, nudges)
- ✅ Performance tracking & intervention system
- ✅ Market intelligence reporting to ALIFF-CEO

### Phase 6: Optimization (Ongoing)
- A/B test job descriptions
- Refine AI evaluation criteria based on actual provider performance
- Add voice interview capability
- Build referral program ("Providers who refer get $500 bonus")

---

## VI. Success Stories (Projected)

**Scenario 1: Rush Project救援**
```
Monday 9am: Client needs GOVCON proposal writer, RFP due Friday
ALIFF-OPS → ALIFF-RECRUITER: "Urgent: Need VA healthcare proposal writer, 40hrs, $75/hr max"
ALIFF-RECRUITER searches CV Bank: Returns 3 matches in 10 seconds
ALIFF-OPS reviews, selects Marcus Johnson (89% match, 4.7 stars)
ALIFF-RECRUITER texts Marcus: "Rush project - VA healthcare RFP, due Fri. Interested?"
Marcus replies "Yes" within 30 minutes
ALIFF-CLIENT onboards Marcus, project starts Monday 2pm
Result: 5-hour turnaround from request to provider assigned
```

**Scenario 2: Proactive Talent Acquisition**
```
ALIFF-CEO forecast: "15 new SLED projects next quarter"
ALIFF-RECRUITER analyzes current pool: "Only 3 SLED writers, need 6 more"
Auto-generates SLED-specific job postings
Posts to 12 boards on Monday morning
By Friday: 87 applications received
AI screening: 23 advance to chat interview
Chat interviews: 18 advance to skills test
Skills tests: 12 pass with score ≥75
Result: 12 new validated SLED writers in 9 days, 0 recruiter hours
```

**Scenario 3: Provider Performance Intervention**
```
Sarah Chen's last 3 projects: 3.2, 3.5, 3.1 stars (declining trend)
ALIFF-RECRUITER auto-flags: "Performance concern"
Analyzes feedback: "Section L compliance issues on all 3"
Auto-enrolls Sarah in "Advanced Compliance" course
Sends empathetic message: "I noticed compliance challenges - this 30-min course will help!"
Sarah completes course, next project: 4.6 stars
Result: Saved high-potential provider from churn via proactive intervention
```

---

## VII. Competitive Advantages

**vs. Traditional Recruiters**:
- **Speed**: 7 days vs. 30-45 days
- **Cost**: $50 vs. $3,000-$5,000 per hire
- **Scale**: Process 1,000 applications with same effort they use for 50
- **Quality**: AI validation ensures skills are proven, not claimed

**vs. Job Boards (Indeed, LinkedIn)**:
- **Active Matching**: We match providers to projects, not just post-and-wait
- **Continuous Engagement**: Providers stay in pool forever, not one-time application
- **Skills Validation**: Every provider tested, not just resume screening

**vs. Freelance Platforms (Upwork, Toptal)**:
- **Quality**: 95% validation rate vs. ~60% on freelance platforms
- **Anonymity**: Complete client-provider separation (unique to Aliff)
- **AI Orchestration**: Providers work WITH AI, not replaced by it
- **B2B Focus**: Built for agencies, not individual clients

---

## VIII. Future Enhancements (Year 2+)

**AI Voice Interviews**:
- Phone-based interviews for candidates who prefer voice
- Emotion analysis (detecting enthusiasm, hesitation)
- Accent-agnostic evaluation

**Predictive Analytics**:
- "This candidate has 87% probability of 4+ star performance based on profile similarity to top performers"
- Churn prediction: "Sarah shows signs of disengagement, recommend proactive check-in"

**Provider Referral Network**:
- Top providers can refer peers for $500 bonus
- AI validates referrals have same quality as direct applications

**Global Talent Pool**:
- Expand to international providers (initially US-only)
- Multi-language support for applications and interviews
- Time-zone aware matching

**White-Label Recruitment-as-a-Service**:
- Agencies can use ALIFF-RECRUITER to build their own provider networks
- API access with custom branding
- New revenue stream: "Recruitment automation powered by Aliff AI"

---

## IX. Training Data: This Conversation

**File**: `/Planning/ALIFF_RECRUITER_TRAINING_DATA.md`

This document will include:
1. Full transcript of our discussion (user messages + AI responses)
2. Key decisions made (e.g., "6-role system, ALIFF-RECRUITER reports to CEO")
3. Vision statements (e.g., "omnipresent HR genie appearing everywhere")
4. Tone examples (encouraging, empathetic, proactive)
5. Use cases (rush projects, performance intervention, talent forecasting)

**Purpose**: Train ALIFF-RECRUITER to embody the personality, priorities, and strategic thinking established in this conversation.

---

## X. Conclusion

ALIFF-RECRUITER transforms recruitment from a manual, time-intensive process into a **fully automated, AI-orchestrated system** that:

✅ **Eliminates 95% of recruiter grunt work** (resume screening, scheduling, status updates)
✅ **Builds a strategic asset** (500+ validated provider pool = competitive moat)
✅ **Maintains quality at scale** (AI testing ensures skills, not resume fluff)
✅ **Provides 24/7 candidate experience** (omnipresent support, never ghosted)
✅ **Generates market intelligence** (what competitors are hiring, salary trends)
✅ **Enables B2B revenue** (agencies tap our provider pool for white-label delivery)

**Core Philosophy**: Recruitment isn't about filling seats—it's about building a **living, breathing talent ecosystem** that gets smarter with every application, every project, every performance review.

ALIFF-RECRUITER is the genie that makes it happen.

---

**Next Steps**:
1. Review and approve this specification
2. Prioritize Phase 1 features for development
3. Define success metrics for pilot (first 50 providers)
4. Save this conversation as training data
5. Begin database schema implementation

**Questions for Stakeholders**:
- Should we start with one service category (e.g., GOVCON only) or all 24?
- What's the target provider pool size for Year 1? (Recommendation: 200-500)
- Should we build referral program from Day 1 or add later?
- Voice interviews in Phase 2 or defer to Year 2?
