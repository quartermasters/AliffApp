# Candidate Dashboard - Complete Implementation Plan
## Aliff Services: AI-Powered Recruitment & Provider Management Platform

**Last Updated:** January 2025
**Company:** Aliff Services
**Platform:** Next.js 14 App Router, React 18, TypeScript, Prisma, PostgreSQL
**Purpose:** Business-aligned candidate dashboard for AI-first recruitment system

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Model Context](#2-business-model-context)
3. [Dashboard Architecture](#3-dashboard-architecture)
4. [Core Dashboard Sections](#4-core-dashboard-sections)
5. [Database Schema & Data Sources](#5-database-schema--data-sources)
6. [Design System & Components](#6-design-system--components)
7. [Technical Implementation](#7-technical-implementation)
8. [Implementation Phases](#8-implementation-phases)

---

## 1. Executive Summary

### 1.1 What is the Candidate Dashboard?

The **Aliff Services Candidate Dashboard** is a next-generation, AI-powered portal that transforms candidates into strategic partners in Aliff's unique "Human Strategy + AI Execution" service delivery model.

**Core Purpose:**
- Track application status from submission through hiring
- Display AI-powered performance metrics and multi-AI consensus scores
- Show business impact (win rates, client satisfaction, agency partnerships)
- Provide career progression path and skills development
- Enable transparent, meritocratic compensation tracking

### 1.2 Key Differentiators

✅ **Multi-AI Transparency**: Show GPT-4 + Claude + Gemini consensus scores
✅ **Business Metric Alignment**: Every metric ties to client success (22% win rate, B2B agency satisfaction)
✅ **AI Collaboration Performance**: Track AI partnership efficiency, not replacement
✅ **Quality Gate Visibility**: Pink-Red-Gold quality progression tracking
✅ **B2B White-Label Impact**: Show contribution to agency partnerships (70-90% revenue)
✅ **Career Growth Path**: Clear progression from Applicant → Provider → Lead Provider

### 1.3 Target Users

**Primary**: Job applicants tracking application status
**Secondary**: Active providers monitoring performance and earnings
**Tertiary**: Validated candidates in CV Bank talent pool

---

## 2. Business Model Context

### 2.1 Aliff Services Business Model

**Core Model**: AI-Orchestrated Service Delivery

```
Strategic Human Expertise (Diagnosis/Refinement)
           ↓
    AI Execution (80-90% of work)
           ↓
    Expert Polish (10-20% refinement)
           ↓
Enterprise Quality at 10x Speed, 40% Lower Cost
```

**Revenue Distribution:**
- **70-90% B2B**: White-label partnerships with GOVCON agencies
- **10-30% B2C**: Direct clients and contractors

**Key Performance Metrics:**
- **Win Rate**: 22% (vs 4% industry average) = 5.5x better
- **Turnaround**: 5-7 days (vs 3-4 weeks industry standard)
- **Cost Reduction**: 40% lower than traditional firms
- **Quality**: Pink-Red-Gold gate system, 3-AI consensus validation

### 2.2 Service Categories

**GOVCON Services** (Federal Contracting):
- Proposal writing, capture management, compliance
- Win theme development, past performance narratives
- Technical writing, pricing analysis

**SLED Services** (State, Local & Education):
- State/local government contracting
- Education sector proposals (K-12, higher ed)
- DBE/MBE/WBE compliance

**IT Services** (Custom Software Development):
- Architecture-first system design
- AI code generation (80-90%)
- Expert refinement (prevents technical debt)

**Writing Services** (Strategic Content):
- Content strategy and brand messaging
- Anti-AI-slop positioning
- Authentic voice maintenance

### 2.3 AI-First Value Proposition

**"Human Strategy + AI Execution"** - NOT pure AI automation

**Three-Phase Process:**

1. **Strategic Intelligence (Human-Led)**
   - Senior experts analyze requirements
   - Identify unstated needs and pain points
   - Design strategic approach

2. **AI-Powered Execution**
   - 80-90% of work at 10x speed
   - Multi-AI orchestration (GPT-4 + Claude + Gemini)
   - Consensus-driven decisions

3. **Expert Refinement**
   - Strategic excellence validation
   - Authentic voice maintenance
   - Quality assurance

### 2.4 Competitive Positioning

**Vs. AI-Only Solutions:**
- Problem: Generic, creates technical debt, AI slop
- Aliff Advantage: Human strategy ensures quality and differentiation

**Vs. Traditional Firms:**
- Problem: Slow (3-6 months), expensive ($150K+)
- Aliff Advantage: 40% lower cost, 5x faster, same quality

**Vs. Freelancers:**
- Problem: Inconsistent quality, no scalability, no strategic capability
- Aliff Advantage: Enterprise-level strategy + consistent AI delivery

---

## 3. Dashboard Architecture

### 3.1 Page Structure

```
/candidate/dashboard (Main Dashboard)
│
├── /candidate/applications (All Applications List)
│   └── /candidate/applications/[id] (Application Detail)
│
├── /candidate/performance (Performance Metrics)
│
├── /candidate/profile (Profile Settings)
│   ├── /candidate/profile/edit (Edit Information)
│   └── /candidate/profile/cv-bank (CV Bank Status)
│
├── /candidate/interview/[id] (AI Interview Center)
│
├── /candidate/earnings (Financial Dashboard)
│
└── /candidate/training (Skills Development)
```

### 3.2 Three-Portal Architecture

**Candidate Portal** (This Dashboard):
- Application tracking
- Performance metrics
- Profile management
- Interview interface

**Admin Portal** (Internal Use):
- CV Bank search and management
- Recruiter notes and evaluations
- Provider assignment
- Quality oversight

**Provider Portal** (For Active Providers):
- Project assignments
- Time tracking
- Earnings and bonuses
- Skills development

---

## 4. Core Dashboard Sections

### 4.1 Dashboard Home (`/candidate/dashboard`)

**Hero Stats Row:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  📊 Your Performance Pulse                                  │
│  ───────────────────────────────────────────────────────── │
│                                                             │
│  [Total Applications]  [Interviews Done]  [Avg Fit Score]  │
│       3                     2                  87%         │
│                                                             │
│  [CV Bank Status]                                           │
│   VALIDATED - Top 5% Talent Pool                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Active Applications Grid:**
```
┌──────────────────────────────────────┐ ┌────────────────────┐
│ GOVCON Proposal Writer              │ │ SLED Specialist    │
│                                      │ │                    │
│ Status: INTERVIEW_COMPLETE           │ │ Status: SCREENING  │
│ Fit Score: 87/100 ⭐⭐⭐⭐⭐          │ │ Fit Score: 72/100  │
│                                      │ │                    │
│ ✅ 6 of 8 skills matched             │ │ ⏳ AI analyzing... │
│ ✅ Interview: 92/100                 │ │                    │
│                                      │ │                    │
│ [View Details →]                     │ │ [Check Status →]   │
└──────────────────────────────────────┘ └────────────────────┘
```

**ALIFF's Latest Update:**
```
┌─────────────────────────────────────────────────────────────┐
│ 💬 ALIFF says:                                              │
│                                                             │
│ "Marcus, great news! Your GOVCON Proposal Writer           │
│ interview scored 92/100 (top 8% of applicants). Our        │
│ hiring committee is reviewing your profile. You should     │
│ hear back within 24 hours.                                 │
│                                                             │
│ In the meantime, consider completing the Shipley           │
│ Foundation course to boost your profile strength to 98%!"  │
│                                                             │
│ [Ask ALIFF a Question →]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.2 Application Detail (`/candidate/applications/[id]`)

**Header Section:**
```
Application #APP-2025-11-001234
GOVCON Proposal Writer - Full-Time Remote

Submitted: Nov 16, 2025 at 3:46 PM
Last Updated: Nov 17, 2025 at 10:22 AM
```

**Pipeline Timeline:**
```
✅ Application Submitted
   └─ Nov 16, 3:46 PM - Resume verified

✅ AI Resume Screening
   └─ Nov 16, 5:30 PM - Fit score: 87/100

✅ Chat Interview
   └─ Nov 17, 9:15 AM - Completed (15 min)

🔄 Multi-AI Evaluation (In Progress)
   └─ GPT-4: 94/100
   └─ Claude: 91/100
   └─ Gemini: 90/100
   └─ Consensus: 92/100 (calculating...)

⏳ Human Review (Pending)
   └─ Estimated: Nov 17, 6:00 PM

⏳ Final Decision (Pending)
```

**Fit Score Card:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         🎯 Your Match Score                                 │
│                                                             │
│              87/100                                         │
│         ⭐⭐⭐⭐⭐                                             │
│         Strong Fit - Top 15%                                │
│                                                             │
│  ───────────────────────────────────────────────────────── │
│                                                             │
│  Required Skills Match: 75% (6 of 8)                        │
│  Experience: 8 years (Exceeds 5-year minimum) ✓             │
│  AI Tool Proficiency: Expert (GPT-4, Claude) ✓              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Skills Breakdown:**
```
Your Skills vs. Job Requirements:

Required Skills (8):
✅ Federal Proposal Writing    You: 8 years
✅ RFP Response                You: Expert
✅ Past Performance Narratives You: 15+ samples
✅ Section L/M Compliance      You: Advanced
✅ Shipley Methodology         You: Certified
✅ Team Collaboration          You: 10+ projects
❌ SLED Experience             Not found in resume
❌ Active Secret Clearance     Not indicated

Preferred Skills (4):
✅ AI Tool Proficiency         You: GPT-4, Claude
✅ Capture Planning            You: 3 years
⚠️ Healthcare IT Domain        Limited experience
❌ Proposal Management SW      Not mentioned
```

**Interview Results (If Completed):**
```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 Multi-AI Interview Evaluation                           │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ Overall Score: 92/100 (Top 8% of applicants)               │
│                                                             │
│ Individual AI Scores:                                       │
│ • GPT-4 Score:    94/100 ⭐⭐⭐⭐⭐                          │
│ • Claude Score:   91/100 ⭐⭐⭐⭐⭐                          │
│ • Gemini Score:   90/100 ⭐⭐⭐⭐                            │
│ • Consensus:      92/100 ⭐⭐⭐⭐⭐                          │
│                                                             │
│ Score Breakdown:                                            │
│ • Experience Relevance:    28/30 ████████████████░░         │
│ • Technical Knowledge:     23/25 ████████████████░           │
│ • Problem-Solving:         18/20 ████████████████            │
│ • Communication:           14/15 ██████████████░             │
│ • Culture Fit:              9/10 ████████████░               │
│                                                             │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ 💪 Strengths Identified:                                    │
│ ✅ Excellent GOVCON experience (8 years federal proposals)  │
│ ✅ Strong AI tool proficiency (GPT-4, Claude integration)   │
│ ✅ Quantifiable achievements ($150M contract wins)          │
│ ✅ Strategic thinking in responses                          │
│ ✅ Shipley methodology certification                        │
│                                                             │
│ ⚠️ Areas for Growth:                                        │
│ • SLED experience limited (can develop on the job)         │
│ • Healthcare IT domain knowledge (training available)       │
│ • Proposal management software (we provide training)        │
│                                                             │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ 🎯 Recommendation: HIRE                                     │
│                                                             │
│ "Marcus demonstrates exceptional proposal writing skills    │
│ and strategic thinking. His AI tool proficiency aligns     │
│ perfectly with our AI-first culture. The SLED experience   │
│ gap is minor and can be addressed through our internal     │
│ training program. Strong candidate for immediate hire."    │
│                                                             │
│ [View Full Interview Transcript →]                          │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.3 Performance Dashboard (`/candidate/performance`)

**Multi-AI Consensus Scores:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 Your Performance Pulse                                   │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ Overall Performance Score: 88/100                           │
│                                                             │
│ AI Consensus Breakdown:                                     │
│ • GPT-4 Score:      90/100 ⭐⭐⭐⭐⭐                        │
│ • Claude Score:     87/100 ⭐⭐⭐⭐                          │
│ • Gemini Score:     86/100 ⭐⭐⭐⭐                          │
│ • Human Review:     89/100 ⭐⭐⭐⭐⭐                        │
│                                                             │
│ Quality Gate Status:                                        │
│ ✅ Pink Gate: Draft Quality (AI evaluation)                │
│ ✅ Red Gate: Compliance Check (human review)               │
│ ✅ Gold Gate: Client-Ready (final approval)                │
│                                                             │
│ Current Project: Gold Gate Approved 🏆                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Project Win Record:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🏆 Your Win Record                                          │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ Projects Completed: 47                                      │
│ Client Win Rate: 24% (your proposals that won contracts)   │
│ On-Time Delivery: 94% (vs 90% team average)                │
│ Quality Score Trend: 📈 +8% over last 6 months             │
│ Rush Projects: 12 (3-day turnarounds handled)              │
│                                                             │
│ Breakdown by Service Type:                                  │
│                                                             │
│ GOVCON Proposals:        30 projects │ 26% win rate        │
│ SLED Proposals:          10 projects │ 20% win rate        │
│ IT Documentation:         5 projects │ 100% satisfaction   │
│ Marketing Content:        2 projects │ 90% quality score   │
│                                                             │
│ 📊 Your impact: 5.5x better than industry (4% baseline)    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Client Satisfaction Scorecard:**
```
┌─────────────────────────────────────────────────────────────┐
│ ⭐ Client Success Scorecard                                 │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ Client 5-Star Ratings: 42/47 projects (89%)                 │
│ Repeat Client Rate: 75% (clients request you again)        │
│ Agency Partner NPS: +65 (agencies rating your work)        │
│                                                             │
│ Recent Client Feedback:                                     │
│                                                             │
│ 💬 "This proposal reads like a senior strategist wrote it  │
│    - because one did. Worth every penny."                  │
│    - Federal Agency Partner, Nov 2025                      │
│                                                             │
│ 💬 "Finally, a proposal that addresses our unstated needs. │
│    You won us the contract."                               │
│    - SLED End Client, Oct 2025                             │
│                                                             │
│ 💬 "Strategic, not generic. This is the quality we pay     │
│    premium rates for."                                     │
│    - Healthcare IT Agency, Sep 2025                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**AI Collaboration Efficiency:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 Your AI Partnership Performance                          │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ AI Drafts Accepted: 85% (vs 70% team average)              │
│ AI Time Saved: 340 hours (vs manual writing)               │
│ Strategic Hours Focus: 160 hours on human-only strategy    │
│ Efficiency Multiplier: 3.2x (your output vs traditional)   │
│                                                             │
│ AI Tools Usage:                                             │
│ • GPT-4:  85% ████████████████████████░░  (research, drafts)│
│ • Claude: 10% ████░░░░░░░░░░░░░░░░░░░░░░  (technical)      │
│ • Gemini:  5% ██░░░░░░░░░░░░░░░░░░░░░░░░  (compliance)     │
│                                                             │
│ Human Refinement: 12% of total time (optimal range: 10-20%)│
│                                                             │
│ 💡 Insight: You're excellent at refining AI output - this  │
│    is a key skill in our AI-first culture!                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.4 Skills Development (`/candidate/training`)

**Capability Evolution:**
```
┌─────────────────────────────────────────────────────────────┐
│ 📈 Your Skills Growth Tracker                               │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ GOVCON Expertise:                                           │
│ 6 months ago: 75/100 ████████████████░░░░░░                │
│ Today:        88/100 ████████████████████░░░░  (+13 points)│
│ Target:       90/100 (Section L/M mastery)                  │
│                                                             │
│ AI Tool Proficiency:                                        │
│ • GPT-4 Prompting:    95/100 ████████████████████░  Expert │
│ • Claude Integration: 82/100 ████████████████░░░░  Advanced│
│ • Gemini Usage:       68/100 █████████████░░░░░░  Developing│
│                                                             │
│ Domain Knowledge:                                           │
│ • Healthcare IT:      90/100 ██████████████████░░  Expert  │
│ • Cybersecurity:      78/100 ███████████████░░░░  Advanced │
│ • VA/DHS Agencies:    72/100 ██████████████░░░░░  Proficient│
│                                                             │
│ Certifications Earned:                                      │
│ ✅ Shipley Associates Foundations                           │
│ ✅ APMP Foundation                                          │
│ 🔄 In Progress: Advanced Federal Pricing (60% complete)    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**AI Quality Coach:**
```
┌─────────────────────────────────────────────────────────────┐
│ 💡 AI Quality Coach - Personalized Recommendations          │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ Recent Strengths (AI-identified):                           │
│ ✅ Excellent win theme development                          │
│ ✅ Strong past performance narratives with quantifiable     │
│    results                                                  │
│ ✅ Compliance matrix accuracy: 98%                          │
│ ✅ Consistent brand voice maintenance                       │
│                                                             │
│ Growth Opportunities (AI-identified):                       │
│ ⚠️ Section M scoring alignment could improve (+5% potential)│
│ ⚠️ Executive summary conciseness (avg 3.2 pages, target: 2.5)│
│ 💡 Consider adding more healthcare IT domain examples      │
│                                                             │
│ Recommended Training:                                       │
│ 📚 Advanced Section M Optimization (2 hours)               │
│ 📚 Executive Summary Mastery (1 hour workshop)             │
│ 📚 Healthcare IT Terminology Course (4 hours)              │
│                                                             │
│ [Enroll in Courses →]                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.5 Financial Dashboard (`/candidate/earnings`)

**Current Period Earnings:**
```
┌─────────────────────────────────────────────────────────────┐
│ 💰 Your Earnings & Compensation                             │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ Current Period (Last 30 Days):                              │
│                                                             │
│ Hourly Rate:         PKR 280/hour (↑ from PKR 250)         │
│ Hours Logged:        192 hours (8hrs/day × 24 days)        │
│ Gross Earnings:      PKR 53,760                            │
│                                                             │
│ Performance Bonuses:                                        │
│ • 5-star project bonus:  PKR 1,500 (3 projects)            │
│ • On-time streak:        PKR 1,000 (5 projects)            │
│ • Repeat client:         PKR 1,000 (client requested you)  │
│ Total Bonuses:           PKR 3,500                          │
│                                                             │
│ ═══════════════════════════════════════════════════════════│
│ Total This Period:       PKR 57,260                         │
│ ═══════════════════════════════════════════════════════════│
│                                                             │
│ Next Rate Review: 45 days (every 6 months based on         │
│ performance)                                                │
│                                                             │
│ Projected Rate: PKR 290-300/hour (if performance maintained)│
│                                                             │
│ Earnings Trend: 📈 +18% over 6 months                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Career Progression:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 Your Career Path - Level Progression                     │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ Current Level: Senior Provider (Level 3/5)                  │
│                                                             │
│ Next Milestone: Lead Provider (Level 4/5)                   │
│                                                             │
│ Requirements:                                               │
│ ✅ 50+ projects completed     (47/50 - 94% complete)       │
│ ✅ 90%+ client satisfaction   (92% - exceeds!)             │
│ ⚠️ 25% win rate average       (24% - almost there!)        │
│ ⚠️ Advanced APMP certification (in progress)               │
│ ⚠️ Mentor 5 junior providers  (3/5 - 60%)                  │
│                                                             │
│ Projected Timeline: 2-3 months if current pace maintained   │
│                                                             │
│ Level 4 Benefits:                                           │
│ • Rate increase: PKR 300-320/hour                          │
│ • Priority project assignment                              │
│ • Voice in quality standards committee                     │
│ • Potential transition to full-time role                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.6 CV Bank Profile (`/candidate/profile/cv-bank`)

**Profile Status:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🏆 Your CV Bank Talent Profile                              │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ Profile Completeness: 95%                                   │
│                                                             │
│ ✅ Resume & portfolio uploaded                              │
│ ✅ Skills validated (12 assessments passed)                 │
│ ✅ Certifications current                                   │
│ ✅ Work samples added (18 pieces)                           │
│ ⚠️ Missing: Healthcare IT writing samples (add 2 more)     │
│                                                             │
│ Profile Visibility:                                         │
│ • Searchable by: 15 agencies                               │
│ • Matched to: 87 future opportunities                      │
│ • Specialty Tags: GOVCON, Healthcare IT, Win Themes,       │
│   Executive Summaries                                      │
│                                                             │
│ Profile Strength: ⭐⭐⭐⭐⭐ (Top 5% of talent pool)        │
│                                                             │
│ Status: VALIDATED - Active in Talent Pool                   │
│                                                             │
│ [Update Profile →] [Add Work Samples →]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Database Schema & Data Sources

### 5.1 Application Model

**Source**: `prisma/schema.prisma` - Application table

**Key Fields:**
```typescript
model Application {
  id                String   @id @default(cuid())
  jobId             String

  // Personal Info
  firstName         String
  lastName          String
  email             String
  phone             String?

  // Files
  resumeUrl         String
  uploadedPhotoUrl  String
  cvExtractedPhotoUrl String?
  photoMetadata     Json?

  // Compensation & Availability
  currentSalary     Float?
  expectedSalary    Float?
  salaryType        String?  // "HOURLY" or "ANNUAL"
  salaryNotes       String?
  hoursPerDay       Int?
  daysPerMonth      Int?
  startDate         DateTime?
  employmentStatus  String?

  // AI Processing
  resumeText        String   @db.Text
  resumeParsedData  Json     // 50+ extracted fields
  fitScore          Float?   // 0-100
  aiScore           Float?
  aiNotes           String?  @db.Text
  humanNotes        String?  @db.Text

  // Interview
  interviewCompleted Boolean @default(false)
  interviewTranscript Json?
  interviewScore    Float?
  interviewDate     DateTime?

  // Status
  status            ApplicationStatus
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  job               JobPosting @relation(fields: [jobId], references: [id])
  interviewSessions InterviewSession[]
  candidateProfile  CandidateProfile?
}

enum ApplicationStatus {
  SUBMITTED
  PARSING
  INTERVIEWING
  INTERVIEW_COMPLETE
  UNDER_REVIEW
  ACCEPTED
  REJECTED
  WITHDRAWN
}
```

### 5.2 InterviewSession Model

**Source**: `prisma/schema.prisma` - InterviewSession table

**Key Fields:**
```typescript
model InterviewSession {
  id                String   @id @default(cuid())
  applicationId     String

  // Session Info
  startedAt         DateTime @default(now())
  completedAt       DateTime?
  duration          Int?     // Seconds

  // Conversation
  messages          Json     // Full conversation array
  questionsAsked    String[] // Question IDs

  // Multi-AI Evaluation
  gpt4Score         Float?
  claudeScore       Float?
  geminiScore       Float?
  consensusScore    Float?   // Average

  // Score Breakdown
  experienceScore   Float?   // 0-30
  technicalScore    Float?   // 0-25
  problemSolvingScore Float? // 0-20
  communicationScore Float?  // 0-15
  cultureFitScore   Float?   // 0-10

  // Feedback
  strengths         String[] // AI-identified strengths
  concerns          String[] // Red flags or gaps
  recommendation    String?  // HIRE, MAYBE, REJECT
  detailedFeedback  String?  @db.Text

  // Relations
  application       Application @relation(fields: [applicationId], references: [id])
}
```

### 5.3 Candidate Model (CV Bank)

**Source**: `prisma/schema.prisma` - Candidate table

**Key Fields:**
```typescript
model Candidate {
  id                String   @id @default(cuid())

  // Core Identity
  name              String
  email             String   @unique
  phone             String?
  location          String?
  timezone          String?

  // Photos
  uploadedPhotoUrl  String
  cvExtractedPhotoUrl String?

  // Professional Links
  linkedIn          String?
  github            String?
  portfolio         String?

  // Resume Data
  resumeUrl         String
  resumeText        String   @db.Text
  resumeParsedData  Json

  // Skills & Experience
  skills            String[] // ["GOVCON", "RFP", "Section L/M"]
  yearsExperience   Int?
  domains           String[] // ["Healthcare IT", "Cybersecurity"]
  certifications    String[]
  clearance         String?
  tools             String[]
  languages         String[]

  // Salary & Availability
  currentSalary     Float?
  expectedSalary    Float?
  salaryType        String?
  hourlyRatePKR     Float?   // ADMIN ONLY - CONFIDENTIAL
  hoursPerDay       Int?
  daysPerMonth      Int?
  hoursPerWeek      Int?
  startDate         DateTime?
  employmentStatus  String?

  // AI Interview Data
  interviewTranscript Json?
  interviewScore    Float?
  interviewScores   Json?    // {gpt4: 85, claude: 88, gemini: 82}
  interviewFeedback String?  @db.Text
  interviewDate     DateTime?

  // Performance (If Hired)
  overallScore      Float?   // 0-100
  projectsCompleted Int      @default(0)
  onTimeRate        Float?   // 0-100%
  satisfactionAvg   Float?   // 0-5 stars
  revisionRate      Float?   // 0-100%

  // Status
  status            CandidateStatus
  applicationDate   DateTime @default(now())
  applicationSource String?
  activatedAt       DateTime?
  lastContacted     DateTime?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

enum CandidateStatus {
  APPLIED
  SCREENING
  INTERVIEWED
  VALIDATED
  ACTIVE
  INACTIVE
  ARCHIVED
}
```

---

## 6. Design System & Components

### 6.1 Color Palette

**From**: `tailwind.config.ts`

```typescript
colors: {
  // Primary - Professional Authority
  navy: {
    900: '#080d1a',
    800: '#0f172a',
    700: '#1a2744',
    600: '#1e3a5f',
  },

  // Brand Gold - Premium Excellence
  gold: {
    500: '#E5C17F',
    400: '#D4AF37',
  },

  // Accent Teal - Innovation
  teal: {
    600: '#0891B2',
    500: '#14B8A6',
  },

  // Success/Victory - Wins & Metrics
  victory: {
    500: '#10B981',
    600: '#059669',
  },

  // Service Categories
  govcon: { 600: '#2563EB' },  // Blue
  it: { 500: '#8B5CF6' },      // Purple
  writing: { 400: '#EC4899' }, // Pink
}
```

**Status Colors:**
- **Pending**: Gray 400-500
- **In Progress**: Blue 500-600
- **Completed**: Green 500-600
- **Warning**: Yellow/Amber
- **Error/Rejected**: Red 500-600
- **Premium/Featured**: Gold 400-500

### 6.2 Typography

**Font Stack:**
- **Sans**: Inter (primary)
- **Mono**: JetBrains Mono (code, data)

**Display Sizes:**
```css
display-lg: 56px (3.5rem)
display-md: 40px (2.5rem)
display-sm: 32px (2rem)
```

**Hierarchy:**
- Page titles: `text-3xl` to `text-4xl`, `font-bold`
- Section headers: `text-2xl`, `font-bold`
- Card titles: `text-lg` to `text-xl`, `font-semibold`
- Body text: `text-sm` to `text-base`, `text-gray-600/700`
- Metadata: `text-xs`, `text-gray-500`

### 6.3 Component Library

**Card System** (`/src/components/ui/card.tsx`):
```tsx
// Glassmorphism Card
<Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Supporting text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

**Badge System** (`/src/components/ui/badge.tsx`):
```tsx
// Status Badges
<Badge variant="default">Default</Badge>
<Badge variant="premium">Premium</Badge>
<Badge variant="victory">Success</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="gold">Gold Gate</Badge>
```

**Button System** (`/src/components/ui/button.tsx`):
```tsx
// Button Variants
<Button variant="default">Gold Primary</Button>
<Button variant="victory">Success</Button>
<Button variant="darkOutline">Dark Outline</Button>
<Button variant="outline">Light Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Button Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

**Progress Timeline** (Custom):
```tsx
// From /src/app/careers/track/page.tsx
<div className="space-y-6">
  {steps.map((step) => (
    <div key={step.id} className="flex gap-4">
      <div className="flex flex-col items-center">
        {/* Icon based on status */}
        {step.status === 'completed' && (
          <CheckCircle className="w-6 h-6 text-green-600" />
        )}
        {step.status === 'in_progress' && (
          <Loader className="w-6 h-6 text-blue-600 animate-spin" />
        )}
        {step.status === 'pending' && (
          <Clock className="w-6 h-6 text-gray-400" />
        )}

        {/* Connector line */}
        {!isLast && (
          <div className="w-0.5 h-12 bg-gray-200 mt-2" />
        )}
      </div>

      <div>
        <h4 className="font-semibold">{step.title}</h4>
        <p className="text-sm text-gray-600">{step.description}</p>
        <p className="text-xs text-gray-500">{step.timestamp}</p>
      </div>
    </div>
  ))}
</div>
```

### 6.4 Glassmorphism Patterns

```tsx
// Frosted Glass Card
className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200"

// Dark Glass Card
className="bg-navy-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-navy-600"

// Gradient Backgrounds
className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6"
className="bg-gradient-to-r from-navy-900 to-navy-700 rounded-2xl p-8"
```

### 6.5 Animation Patterns

**Framer Motion:**
```tsx
// Card Entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  {/* Card content */}
</motion.div>

// Hover Effect
<motion.div
  whileHover={{ y: -4, scale: 1.01 }}
  transition={{ duration: 0.2 }}
>
  {/* Interactive card */}
</motion.div>

// Stagger Children
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.div variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

**CSS Transitions:**
```tsx
// Smooth Transitions
className="transition-all duration-300 hover:shadow-xl"
className="transition-colors duration-200 hover:bg-gray-100"
className="transition-transform duration-300 hover:scale-105"
```

---

## 7. Technical Implementation

### 7.1 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Lucide Icons

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)

**AI Services:**
- OpenAI GPT-4 (parsing, evaluation)
- Anthropic Claude 3.5 (evaluation)
- Google Gemini 1.5 (evaluation)

**Real-Time:**
- Server-Sent Events (SSE) or polling
- WebSocket (optional for chat)

### 7.2 File Structure

```
src/
├── app/
│   ├── candidate/
│   │   ├── dashboard/
│   │   │   └── page.tsx (Main Dashboard)
│   │   ├── applications/
│   │   │   ├── page.tsx (Applications List)
│   │   │   └── [id]/
│   │   │       └── page.tsx (Application Detail)
│   │   ├── performance/
│   │   │   └── page.tsx (Performance Metrics)
│   │   ├── profile/
│   │   │   ├── page.tsx (Profile View)
│   │   │   ├── edit/
│   │   │   │   └── page.tsx (Edit Profile)
│   │   │   └── cv-bank/
│   │   │       └── page.tsx (CV Bank Status)
│   │   ├── interview/
│   │   │   └── [id]/
│   │   │       └── page.tsx (AI Interview)
│   │   ├── earnings/
│   │   │   └── page.tsx (Financial Dashboard)
│   │   └── training/
│   │       └── page.tsx (Skills Development)
│   └── api/
│       ├── applications/
│       │   ├── [id]/
│       │   │   └── route.ts
│       │   ├── submit/
│       │   │   └── route.ts
│       │   └── parse-resume/
│       │       └── route.ts
│       ├── interviews/
│       │   ├── [id]/
│       │   │   └── route.ts
│       │   ├── evaluate/
│       │   │   └── route.ts
│       │   └── next-question/
│       │       └── route.ts
│       └── candidates/
│           ├── [id]/
│           │   └── route.ts
│           └── performance/
│               └── route.ts
│
├── components/
│   ├── candidate/
│   │   ├── DashboardHero.tsx
│   │   ├── ApplicationCard.tsx
│   │   ├── PipelineTimeline.tsx
│   │   ├── FitScoreCard.tsx
│   │   ├── SkillsBreakdown.tsx
│   │   ├── InterviewResults.tsx
│   │   ├── PerformanceMetrics.tsx
│   │   ├── MultiAIScores.tsx
│   │   ├── QualityGateStatus.tsx
│   │   ├── ProjectWinRecord.tsx
│   │   ├── ClientSatisfaction.tsx
│   │   ├── AICollaborationMetrics.tsx
│   │   ├── SkillsGrowthTracker.tsx
│   │   ├── EarningsSummary.tsx
│   │   ├── CareerProgressionPath.tsx
│   │   └── CVBankProfile.tsx
│   └── ui/
│       ├── card.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── progress.tsx
│       └── ... (other UI components)
│
└── lib/
    ├── services/
    │   ├── applicationService.ts
    │   ├── interviewService.ts
    │   ├── candidateService.ts
    │   ├── aiEvaluationService.ts
    │   └── performanceService.ts
    └── utils/
        ├── scoreCalculations.ts
        ├── statusHelpers.ts
        └── formatters.ts
```

### 7.3 API Endpoints

**Applications:**
```typescript
// Get all applications for candidate
GET /api/applications?candidateEmail=marcus@example.com

// Get single application
GET /api/applications/[id]

// Submit new application
POST /api/applications/submit

// Parse resume
POST /api/applications/parse-resume
```

**Interviews:**
```typescript
// Get interview session
GET /api/interviews/[id]

// Submit interview message
POST /api/interviews/[id]/message

// Get multi-AI evaluation
POST /api/interviews/[id]/evaluate

// Get next question
POST /api/interviews/next-question
```

**Candidates:**
```typescript
// Get candidate profile
GET /api/candidates/[id]

// Get performance metrics
GET /api/candidates/[id]/performance

// Update candidate profile
PATCH /api/candidates/[id]

// Get CV Bank status
GET /api/candidates/[id]/cv-bank
```

### 7.4 Data Fetching Patterns

**Server Components (Default):**
```tsx
// app/candidate/dashboard/page.tsx
import { prisma } from '@/lib/prisma';

export default async function CandidateDashboard() {
  const applications = await prisma.application.findMany({
    where: { email: session.user.email },
    include: {
      job: true,
      interviewSessions: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return <DashboardView applications={applications} />;
}
```

**Client Components (Interactive):**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ApplicationCard({ application }) {
  const [status, setStatus] = useState(application.status);

  useEffect(() => {
    // Poll for status updates
    const interval = setInterval(async () => {
      const res = await fetch(`/api/applications/${application.id}`);
      const data = await res.json();
      setStatus(data.status);
    }, 5000);

    return () => clearInterval(interval);
  }, [application.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <Badge variant={getStatusVariant(status)}>
            {status}
          </Badge>
        </CardHeader>
        {/* ... */}
      </Card>
    </motion.div>
  );
}
```

### 7.5 Real-Time Updates

**Server-Sent Events (Recommended):**
```typescript
// app/api/applications/[id]/stream/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Poll database for updates
      const interval = setInterval(async () => {
        const application = await prisma.application.findUnique({
          where: { id: params.id },
        });

        const data = `data: ${JSON.stringify(application)}\n\n`;
        controller.enqueue(encoder.encode(data));
      }, 2000);

      // Cleanup
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

**Client Usage:**
```tsx
'use client';

import { useEffect, useState } from 'react';

export function ApplicationStatus({ applicationId }) {
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/applications/${applicationId}/stream`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setApplication(data);
    };

    return () => eventSource.close();
  }, [applicationId]);

  return <StatusDisplay application={application} />;
}
```

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goals:**
- Set up candidate dashboard routes
- Create basic layout and navigation
- Implement authentication/authorization
- Build reusable UI components

**Deliverables:**
- [ ] `/candidate/dashboard` route structure
- [ ] Dashboard layout with sidebar navigation
- [ ] Auth middleware (candidate access only)
- [ ] Card, Badge, Button components tested
- [ ] Timeline component
- [ ] Multi-AI score display component

**Tasks:**
1. Create folder structure: `app/candidate/*`
2. Build `DashboardLayout.tsx` with navigation
3. Create auth middleware to restrict access
4. Port UI components from careers section
5. Build `PipelineTimeline.tsx` component
6. Build `MultiAIScores.tsx` component

---

### Phase 2: Application Tracking (Week 2-3)

**Goals:**
- Display all applications for candidate
- Show detailed application status
- Implement pipeline timeline visualization
- Display fit scores and skills breakdown

**Deliverables:**
- [ ] Applications list page
- [ ] Application detail page with full pipeline
- [ ] Fit score card with visual indicators
- [ ] Skills breakdown comparison
- [ ] Real-time status updates (polling)

**Tasks:**
1. Build `ApplicationsList` component
2. Create API route: `GET /api/applications?email=X`
3. Build `ApplicationDetail` page
4. Implement `FitScoreCard` with radial chart
5. Build `SkillsBreakdown` component
6. Add SSE for real-time updates

---

### Phase 3: Interview System (Week 3-4)

**Goals:**
- Display interview results and scores
- Show multi-AI evaluation breakdown
- Present strengths and concerns
- Provide interview transcript access

**Deliverables:**
- [ ] Interview results card
- [ ] Multi-AI score breakdown display
- [ ] Strengths/concerns list
- [ ] Interview transcript viewer
- [ ] Recommendation display

**Tasks:**
1. Build `InterviewResults.tsx` component
2. Create score breakdown visualization
3. Build `StrengthsConcerns.tsx` list component
4. Create transcript viewer with message bubbles
5. Add recommendation badge with reasoning

---

### Phase 4: Performance Dashboard (Week 4-5)

**Goals:**
- Show candidate performance metrics
- Display project win record
- Show client satisfaction scores
- Track AI collaboration efficiency

**Deliverables:**
- [ ] Performance dashboard page
- [ ] Quality gate status display
- [ ] Project win record card
- [ ] Client satisfaction scorecard
- [ ] AI collaboration metrics

**Tasks:**
1. Create `/candidate/performance` route
2. Build `QualityGateStatus.tsx` component
3. Create `ProjectWinRecord.tsx` with charts
4. Build `ClientSatisfaction.tsx` with testimonials
5. Implement `AICollaborationMetrics.tsx`
6. Create API: `GET /api/candidates/[id]/performance`

---

### Phase 5: Skills & Training (Week 5-6)

**Goals:**
- Track skills growth over time
- Display AI-powered recommendations
- Show certification progress
- Provide training enrollment

**Deliverables:**
- [ ] Skills development page
- [ ] Skills growth tracker with charts
- [ ] AI quality coach recommendations
- [ ] Certification progress tracker
- [ ] Training course enrollment

**Tasks:**
1. Create `/candidate/training` route
2. Build `SkillsGrowthTracker.tsx` with line charts
3. Implement `AIQualityCoach.tsx` component
4. Create certification progress display
5. Build training course catalog
6. Add enrollment API integration

---

### Phase 6: Financial Dashboard (Week 6-7)

**Goals:**
- Display earnings and compensation
- Show performance bonuses
- Track career progression
- Project future earnings

**Deliverables:**
- [ ] Financial dashboard page
- [ ] Earnings summary card
- [ ] Bonus breakdown display
- [ ] Career progression tracker
- [ ] Rate review timeline

**Tasks:**
1. Create `/candidate/earnings` route
2. Build `EarningsSummary.tsx` component
3. Create bonus breakdown visualization
4. Implement `CareerProgressionPath.tsx`
5. Add rate projection calculator
6. Build earnings trend chart

---

### Phase 7: CV Bank Integration (Week 7-8)

**Goals:**
- Display CV Bank profile status
- Show profile completeness
- Track visibility and matches
- Provide profile optimization tips

**Deliverables:**
- [ ] CV Bank profile page
- [ ] Profile completeness indicator
- [ ] Visibility metrics display
- [ ] Matched opportunities count
- [ ] Profile optimization recommendations

**Tasks:**
1. Create `/candidate/profile/cv-bank` route
2. Build `CVBankProfile.tsx` component
3. Create profile completeness calculator
4. Implement visibility metrics display
5. Build opportunity matcher
6. Add optimization suggestions AI

---

### Phase 8: Polish & Testing (Week 8-9)

**Goals:**
- Mobile responsiveness
- Performance optimization
- Error handling
- User acceptance testing

**Deliverables:**
- [ ] Mobile-optimized layouts
- [ ] Loading states for all components
- [ ] Error boundaries and fallbacks
- [ ] Performance metrics < 2s load time
- [ ] Accessibility compliance (WCAG 2.1)

**Tasks:**
1. Test on mobile devices (iOS, Android)
2. Optimize images and lazy loading
3. Add skeleton loaders for data fetching
4. Implement error boundaries
5. Run Lighthouse audits
6. Conduct accessibility testing

---

### Phase 9: Launch (Week 9-10)

**Goals:**
- Production deployment
- Documentation
- User onboarding
- Monitoring setup

**Deliverables:**
- [ ] Production deployment
- [ ] User documentation
- [ ] Onboarding flow
- [ ] Analytics integration
- [ ] Error monitoring (Sentry)

**Tasks:**
1. Deploy to Vercel production
2. Write user guide documentation
3. Create onboarding tutorial
4. Integrate analytics (Plausible/Posthog)
5. Set up error monitoring
6. Create admin monitoring dashboard

---

## Summary

This comprehensive dashboard plan aligns the candidate experience with Aliff Services' core business model:

**Business Alignment:**
- Multi-AI transparency reflects the 3-AI consensus system that ensures 22% win rates
- B2B partnership metrics show contribution to 70-90% revenue stream
- Quality gate visibility demonstrates the Pink-Red-Gold system
- AI collaboration metrics reinforce AI-first culture
- Career progression path drives retention and performance

**Technical Foundation:**
- Built on existing Next.js/React/Prisma stack
- Reuses design system from careers section
- Leverages glassmorphism and Framer Motion patterns
- Database schema already supports all required data

**Implementation:**
- 9-10 week phased rollout
- Incremental delivery of value
- Parallel development possible
- Clear milestones and deliverables

**Let's build this world-class candidate dashboard! 🚀**
