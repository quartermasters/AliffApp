# Aliff Services Dashboard - Complete Implementation Plan
## The Central Operating System for AI-Orchestrated Service Delivery

**Last Updated:** January 2025
**Company:** Aliff Services
**Platform:** Next.js 14 App Router, React 18, TypeScript, Prisma, PostgreSQL
**Purpose:** Multi-stakeholder dashboard managing the entire business operation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Complete Business Model](#2-complete-business-model)
3. [The Real Dashboard: Multi-Portal Architecture](#3-the-real-dashboard-multi-portal-architecture)
4. [Project Lifecycle Management (12 Stages)](#4-project-lifecycle-management-12-stages)
5. [AI Orchestration System](#5-ai-orchestration-system)
6. [Stakeholder Portals](#6-stakeholder-portals)
7. [Database Schema & Integrations](#7-database-schema--integrations)
8. [Business Intelligence & Metrics](#8-business-intelligence--metrics)
9. [Design System & Components](#9-design-system--components)
10. [Implementation Roadmap](#10-implementation-roadmap)

---

## 1. Executive Summary

### 1.1 What Is This Dashboard?

The **Aliff Services Dashboard** is NOT just a candidate portal—it's the **central nervous system** managing an AI-orchestrated professional services delivery platform. It coordinates:

- **Complete project lifecycle**: RFP intake → SDL analysis → Team assembly → Delivery → Quality gates → Win/loss tracking
- **Multi-stakeholder operations**: Super Admin, Clients (B2B/B2C), Providers (anonymized), Candidates, AI systems
- **AI orchestration**: 34-task SDL, multi-AI consensus (GPT-4 + Claude + Gemini), automated quality gates
- **Resource management**: Provider matching, time tracking, fraud detection, payroll
- **Financial operations**: Client invoicing, provider payments, profit margin analysis
- **Business intelligence**: 22% win rate tracking, revenue analytics, operational efficiency

###

 1.2 The Real Plan (500 Words)

**The Central Operating System**

The **Aliff Services Dashboard** is the central nervous system managing the entire AI-orchestrated professional services business—from RFP intake through project delivery, quality control, talent management, and financial operations.

**What It Actually Manages:**

**1. Complete Project Lifecycle (12 Stages)**
Client Intake → SDL Analysis → Strategic Intel → Team Assembly → Execution → AI Validation (Pink Gate) → Expert Review (Red Gate) → Client Approval (Gold Gate) → Submission → Win/Loss Tracking

Every project flows through this pipeline with real-time status tracking, automated AI orchestration across 34 SDL tasks, and multi-stakeholder coordination (clients never see providers, providers never see client names).

**2. Multi-Stakeholder Operations**

**Super Admin Portal** (Operations Engine):
- Kanban project pipeline with win probability, contract value, deadlines
- SDL task queue monitoring (34 tasks × N projects)
- Split decision escalations (when AI consensus <60%)
- Quality gate queues (Pink/Red/Gold approval workflows)
- Provider assignment interface with CV Bank semantic search
- Time entry fraud detection (activity %, idle time, screenshots)
- Financial dashboard (revenue, payroll, profit margins)
- Business intelligence (22% win rate tracking, client satisfaction, operational efficiency)

**Client Portal** (View-Only Experience):
- Project progress tracking (anonymized—no provider visibility)
- Deliverable review and revision requests
- SDL-generated win probability scores
- Document access and communication
- Agency-specific: Multi-project dashboard, volume analytics, white-label branding

**Team Portal** (Anonymized Work Environment):
- Codename-based assignments ("Operation Phoenix"—not "ABC Agency")
- Deliverable upload with quality feedback
- Time tracking integration (Time Doctor/Hubstaff)
- Performance scores and payment tracking
- Zero client name exposure (complete operational security)

**Candidate Portal** (Recruitment Pipeline):
- Real-time application status with pipeline visualization
- Fit score display (87% match with skills breakdown)
- Embedded AI interview interface (15-min chat)
- Multi-AI evaluation results (GPT-4/Claude/Gemini consensus)
- CV Bank profile management (50+ fields, dual photos)

**3. AI Orchestration at Scale**

**ALIFF-RECRUITER**: Auto-matches CV Bank to project needs, posts jobs if no match, conducts 100% AI interviews, creates validated provider profiles

**SDL (Solicitation Diagnosis Lab)**: Executes 34 tasks across 3 phases (Triage → Strategic Intel → Win Strategy), generates win probability (0-100%), complexity scoring (1-10), and team assembly plans

**Multi-AI Consensus**: Every critical decision validated by GPT-4 + Claude + Gemini with automatic escalation when agreement <60%

**Quality Gates**: Pink (AI validation—compliance, hallucinations, grammar) → Red (3 expert reviews—strategy, differentiation, authenticity) → Gold (client approval)

**4. Financial & Performance Operations**

**Revenue Management**: Project-based pricing (no subscriptions), volume discounts for B2B agencies (70-90% revenue), client invoicing automation, payment tracking

**Provider Payroll**: Bi-weekly PKR payments offshore, Net-15 USD for US providers, fraud detection via activity monitoring, performance-based bonuses (5-star = +$500, win bonus = 10% profit share)

**Business Intelligence**: Real-time KPIs (active projects, win rate, revenue, utilization, quality scores), forecasting (pipeline value × win probability), provider leaderboards, client satisfaction NPS, operational efficiency metrics

**5. The Data Model**

Each **Project** tracks: codename, client (hidden from team), contract value, deadline, SDL win probability, complexity score, current stage, quality score, team assignments, deliverables, time entries, quality gate status

Each **Provider** tracks: projects completed, quality scores, on-time rate, client satisfaction, activity %, hourly rate, fraud flags, earnings, performance trend

Each **Candidate** tracks: application status, fit score, interview transcript, multi-AI scores, skills validation, CV Bank profile (50+ fields), matched opportunities

**The Vision**: This isn't a CRM—it's an **AI-powered service delivery orchestration platform** coordinating humans + AI systems to achieve 22% win rates (5.5x industry baseline) through strategic human intelligence validated and accelerated by multi-AI consensus across 34 discrete tasks per project.

---

## 2. Complete Business Model

### 2.1 Revenue Streams

**B2B Agency Partnerships (70-90% of revenue)**
- White-label service delivery to GOVCON agencies
- Volume discounts: 15% (5-10 projects), 20% (10-20), 25% (20+)
- Zero platform fees, pure project-based pricing
- Agencies resell under their brand

**Direct B2C Clients (10-30% of revenue)**
- Small businesses needing GOVCON/SLED proposals
- Individual contractors seeking compliance support
- Direct engagement through website/SDL tool

**Service Categories:**
1. **GOVCON** (Federal proposals, capture, compliance, win themes)
2. **SLED** (State/local government, education sector)
3. **IT Services** (Architecture-first custom software)
4. **Writing** (Strategic content, anti-AI-slop positioning)

### 2.2 Service Delivery Workflow

**12-Stage Project Lifecycle:**

```
PENDING_REVIEW → INTAKE → SDL_PROCESSING → HUMAN_VALIDATION →
RECRUITER_HIRING → TEAM_EXECUTION → AI_VALIDATION (Pink Gate) →
GOLD_GATE (Red Gate) → CLIENT_APPROVAL (Gold Gate) → SUBMITTED →
WON/LOST → RETROSPECTIVE
```

**Key Performance Metrics:**
- **Win Rate**: 22% (vs 4% industry) = 5.5x better
- **Turnaround**: 5-7 days (vs 3-4 weeks)
- **Cost**: 40% lower than traditional firms
- **Quality**: Pink-Red-Gold gates + 3-AI consensus

### 2.3 AI-First Value Proposition

**"Human Strategy + AI Execution"** - NOT pure AI automation

**Three-Phase Process:**
1. **Strategic Intelligence** (Human-Led): Senior experts analyze, identify unstated needs
2. **AI-Powered Execution**: 80-90% of work at 10x speed via GPT-4/Claude/Gemini
3. **Expert Refinement**: Strategic excellence validation, authentic voice

---

## 3. The Real Dashboard: Multi-Portal Architecture

### 3.1 Super Admin Dashboard (Operations Engine)

**Route**: `/admin/dashboard`

**Kanban Project Pipeline:**
```
┌─────────────────────────────────────────────────────────┐
│ Business Dashboard - ALIFF Services                     │
├─────────────────────────────────────────────────────────┤
│ STATS ROW:                                              │
│ [Active: 12] [Win Rate: 22%] [Revenue: $125k]          │
│ [Utilization: 73%] [Quality: 85] [Margin: 48%]         │
├─────────────────────────────────────────────────────────┤
│ QUICK ACTIONS:                                          │
│ [+ New Project] [SDL Queue] [Quality Insights]         │
│ [Provider Pool] [Client Analytics] [Finance]           │
├─────────────────────────────────────────────────────────┤
│ PROJECT PIPELINE (Kanban):                              │
│                                                          │
│ PENDING  SDL      HIRING   EXECUTION  QA                │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   ┌─────┐            │
│ │PROJ │ │PROJ │ │PROJ │ │PROJ │   │PROJ │            │
│ │-001 │ │-002 │ │-003 │ │-004 │   │-005 │            │
│ │$500k│ │$120k│ │$85k │ │$230k│   │$95k │            │
│ │Dec15│ │Dec20│ │Dec18│ │Dec22│   │Dec19│            │
│ │68%  │ │72%  │ │45%  │ │91%  │   │88%  │            │
│ └─────┘ └─────┘ └─────┘ └─────┘   └─────┘            │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ ALERTS & ESCALATIONS:                                    │
│ 🚨 PROJ-004 Red Gate revisions needed                  │
│ ⚠️  PROJ-003 Recruiter hiring delayed (48hrs)          │
│ 💡 SDL split decision on PROJ-002 (review required)    │
└─────────────────────────────────────────────────────────┘
```

**Core Modules:**
1. **Project Management**: Pipeline, SDL tasks, team assignment
2. **SDL Orchestration**: 34-task queue, consensus review, human validation
3. **Recruiter Management**: Job postings, applicant pipeline, CV Bank search
4. **Quality Control**: Pink/Red/Gold gate queues, provider rankings
5. **Provider Management**: Directory, assignments, time review, payroll
6. **Client Management**: Directory, project history, satisfaction, revenue
7. **Financial Operations**: Revenue, invoicing, payroll, margins
8. **Business Intelligence**: Win rates, forecasting, efficiency

### 3.2 Client Portal (B2B/B2C)

**Route**: `/client/dashboard`

**Features:**
- View-only project tracking (anonymized providers)
- Deliverable review and revision requests
- SDL-generated win probability scores
- Document access and communication
- **Agency-specific**: Multi-project dashboard, volume analytics, white-label branding

### 3.3 Team Portal (Providers - Anonymized)

**Route**: `/team/dashboard`

**Features:**
- Codename-based assignments ("Operation Phoenix")
- Deliverable upload with quality feedback
- Time tracking integration
- Performance scores and payment tracking
- **Zero client exposure**: Complete operational security

### 3.4 Candidate Portal (Applicants)

**Route**: `/candidate/dashboard`

**Features** (As previously documented):
- Application status tracking
- Fit score display with skills breakdown
- AI interview interface
- Multi-AI evaluation results
- CV Bank profile management

---

## 4. Project Lifecycle Management (12 Stages)

### Stage 1: PENDING_REVIEW
- Client/agency uploads RFP documents
- Initial intake form (client info, deadline, contract value)
- System assigns project code (PROJ-2025-001)

### Stage 2: INTAKE
- Super Admin validates completeness
- Confirms scope, pricing alignment
- Decision: Accept, Request Info, Decline

### Stage 3: SDL_PROCESSING
- **34 SDL Tasks** across 3 phases:
  - Phase 1 Triage (Tasks 1-10): Complexity scoring, requirements
  - Phase 2 Strategic Intel (Tasks 11-22): Competitive analysis, evaluator psychology
  - Phase 3 Win Strategy (Tasks 23-34): Win themes, messaging, team plan
- Multi-AI consensus (GPT-4/Claude/Gemini)
- Output: Win probability (0-100%), complexity (1-10), roadmap

### Stage 4: HUMAN_VALIDATION
- Former contracting officers validate SDL outputs
- Escalation for split decisions (<60% AI agreement)
- Final strategic direction locked

### Stage 5: RECRUITER_HIRING
- SDL generates job package (roles, skills, hours)
- ALIFF-RECRUITER searches CV Bank
- Posts to careers if no matches
- AI interviews, skills tests, team assembly
- **Anonymized assignments**: Codename only

### Stage 6: TEAM_EXECUTION
- Providers work on deliverables
- Time tracking via Time Doctor/Hubstaff
- Activity monitoring: Screenshots, apps, idle detection
- Deliverable submissions

### Stage 7: AI_VALIDATION (Pink Gate)
- Multi-AI review of deliverables
- Compliance matrix verification
- Hallucination detection
- Grammar, tone, completeness
- Pass/Fail/Revision decision

### Stage 8: GOLD_GATE (Red Gate)
- Senior strategist review
- Strategic alignment, competitive differentiation
- Authentic voice confirmation
- **3 independent reviews** required

### Stage 9: CLIENT_APPROVAL (Gold Gate)
- Client reviews deliverables
- Feedback/revision requests
- Unlimited revisions within scope
- Client approves for submission

### Stage 10: SUBMITTED
- Super Admin marks submission date
- Agency/client confirms
- Awaiting award decision

### Stage 11: WON / LOST
- Win rate calculation
- Retrospective analysis
- Team bonuses (if won)
- Provider ratings updated

### Stage 12: RETROSPECTIVE
- Post-mortem analysis
- SDL accuracy review
- Provider performance evaluation
- Lessons learned documentation

---

## 5. AI Orchestration System

### 5.1 ALIFF-RECRUITER (Talent Acquisition)

**Workflow:**
1. SDL output generates job descriptions
2. CV Bank semantic search for matches
3. Automated outreach (email/SMS)
4. AI interview (100% of applicants, 15-min target)
5. Multi-AI evaluation (GPT-4/Claude/Gemini)
6. Hiring decision: 85+ = Auto-hire, 70-84 = Skills test, <70 = Reject
7. CV Bank entry (50+ fields, dual photos, salary, availability)

### 5.2 SDL (Solicitation Diagnosis Lab)

**34-Task Breakdown:**

**Phase 1: Triage (24 hours)**
- Tasks 1-5: Document parsing, requirement extraction
- Tasks 6-8: Compliance matrix generation
- Task 9: Evaluation criteria mapping
- Task 10: Complexity scoring (1-10)

**Phase 2: Strategic Intel (24 hours)**
- Tasks 11-15: Competitive landscape analysis
- Tasks 16-20: Evaluator psychology
- Tasks 21-22: Unstated requirement discovery

**Phase 3: Win Strategy (24 hours)**
- Tasks 23-26: Win theme development, win probability
- Tasks 27-30: Messaging framework
- Tasks 31-33: Differentiation strategy
- Task 34: Team assembly plan

### 5.3 Multi-AI Consensus System

**Decision Logic:**
- **Full Consensus (>80%)**: Auto-accept
- **Majority (60-80%)**: Accept with confidence score
- **Split Decision (<60%)**: Escalate to human expert

**Use Cases:**
1. SDL tasks
2. Resume screening
3. Interview evaluation
4. Deliverable QA

---

## 6. Stakeholder Portals

### 6.1 Super Admin Portal

**File Structure:**
```
src/app/admin/
├── dashboard/page.tsx (Main Overview)
├── projects/
│   ├── page.tsx (Kanban Pipeline)
│   ├── [id]/page.tsx (Project Detail)
│   └── new/page.tsx (Create Project)
├── sdl/
│   ├── queue/page.tsx (34-Task Queue)
│   ├── consensus/page.tsx (Split Decisions)
│   └── analytics/page.tsx (SDL Accuracy)
├── providers/
│   ├── directory/page.tsx (CV Bank)
│   ├── assignments/page.tsx (Assign to Projects)
│   ├── time/page.tsx (Time Entry Review)
│   └── payroll/page.tsx (Payment Processing)
├── clients/
│   ├── directory/page.tsx (Client List)
│   ├── [id]/page.tsx (Client Detail)
│   └── analytics/page.tsx (Satisfaction, Revenue)
├── quality/
│   ├── pink-gate/page.tsx (AI Validation Queue)
│   ├── red-gate/page.tsx (Expert Review Queue)
│   ├── gold-gate/page.tsx (Client Approval Queue)
│   └── insights/page.tsx (Quality Analytics)
└── analytics/
    ├── win-rate/page.tsx
    ├── revenue/page.tsx
    └── efficiency/page.tsx
```

### 6.2 Client Portal

**File Structure:**
```
src/app/client/
├── dashboard/page.tsx (Project List)
├── projects/
│   └── [id]/page.tsx (Progress, Deliverables)
├── documents/page.tsx (Upload RFPs)
└── billing/page.tsx (Invoices, Payments)
```

### 6.3 Team Portal

**File Structure:**
```
src/app/team/
├── dashboard/page.tsx (Assignments)
├── assignments/
│   └── [id]/page.tsx (Deliverable Upload)
├── performance/page.tsx (Scores, Feedback)
└── earnings/page.tsx (Hours, Payments)
```

### 6.4 Candidate Portal

(As documented in original plan - Application tracking, interview, CV Bank profile)

---

## 7. Database Schema & Integrations

### 7.1 Project Model

```typescript
model Project {
  id                String   @id @default(cuid())

  // Identifiers
  projectCode       String   @unique // "PROJ-2025-001"
  projectCodename   String   // "Operation Phoenix" (for team)

  // Client (Hidden from team)
  clientId          String
  clientName        String   // Hidden from providers
  contractValue     Float

  // Timeline
  deadline          DateTime
  submittedAt       DateTime?
  awardedAt         DateTime?

  // Status
  currentStage      ProjectStage // 12-stage enum
  progressPercent   Int          // 0-100

  // SDL Data
  sdlStatus         SDLPhase     // TRIAGE, STRATEGIC_INTEL, WIN_STRATEGY, COMPLETE
  sdlWinProbability Float?       // 0-100 from Task 26
  sdlComplexityScore Int?        // 1-10 from Task 10
  sdlTasksCompleted Int          @default(0) // out of 34
  sdlConsensusLog   Json?        // AI agreement logs

  // Quality
  qualityScore      Float?       // 0-100 average
  pinkGateStatus    GateStatus   // PENDING, PASSED, FAILED
  redGateStatus     GateStatus
  goldGateStatus    GateStatus

  // Team (Anonymized)
  anonymizeForTeam  Boolean      @default(true)
  teamAssignments   ProjectAssignment[]

  // Documents
  rfpDocuments      Json         // URLs, metadata
  deliverables      Json         // Submitted work

  // Win/Loss
  outcome           Outcome?     // WON, LOST, PENDING
  actualContractValue Float?
  retrospectiveNotes String?     @db.Text

  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  // Relations
  client            Client       @relation(fields: [clientId], references: [id])
  sdlTasks          SDLTask[]
  timeEntries       TimeEntry[]
}

enum ProjectStage {
  PENDING_REVIEW
  INTAKE
  SDL_PROCESSING
  HUMAN_VALIDATION
  RECRUITER_HIRING
  TEAM_EXECUTION
  AI_VALIDATION
  GOLD_GATE
  CLIENT_APPROVAL
  SUBMITTED
  WON_LOST
  RETROSPECTIVE
}

enum GateStatus {
  PENDING
  IN_REVIEW
  PASSED
  FAILED
  REVISION_NEEDED
}

enum Outcome {
  WON
  LOST
  PENDING
}
```

### 7.2 SDL Task Model

```typescript
model SDLTask {
  id                String   @id @default(cuid())
  projectId         String

  taskNumber        Int      // 1-34
  taskPhase         SDLPhase // TRIAGE, STRATEGIC_INTEL, WIN_STRATEGY
  taskName          String
  taskDescription   String   @db.Text

  // AI Execution
  primaryAI         AIModel  // GPT4, CLAUDE, GEMINI
  secondaryAI       AIModel? // For consensus

  // Results
  gpt4Output        Json?
  claudeOutput      Json?
  geminiOutput      Json?

  // Consensus
  consensusType     ConsensusType // FULL, MAJORITY, SPLIT
  consensusConfidence Float?      // 0-100
  escalatedToHuman  Boolean       @default(false)
  finalResult       Json?

  // Status
  status            TaskStatus    // PENDING, IN_PROGRESS, COMPLETE, ESCALATED
  startedAt         DateTime?
  completedAt       DateTime?

  project           Project       @relation(fields: [projectId], references: [id])
}

enum SDLPhase {
  TRIAGE
  STRATEGIC_INTEL
  WIN_STRATEGY
  COMPLETE
}

enum AIModel {
  GPT4
  CLAUDE
  GEMINI
}

enum ConsensusType {
  FULL_CONSENSUS    // >80%
  MAJORITY_CONSENSUS // 60-80%
  SPLIT_DECISION    // <60%
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETE
  ESCALATED
  FAILED
}
```

### 7.3 Time Entry & Fraud Detection

```typescript
model TimeEntry {
  id                String   @id @default(cuid())

  candidateId       String
  projectId         String

  // Time
  date              DateTime
  hoursWorked       Float
  hoursClaimed      Float
  hoursApproved     Float?   // After fraud detection

  // Activity Monitoring
  activityPercent   Float?   // From Time Doctor
  idleMinutes       Int?
  screenshots       Json?    // Random screenshot URLs
  appUsage          Json?    // Apps used during session

  // Fraud Detection
  fraudFlags        String[] // ["Low activity", "Browser idle"]
  fraudScore        Float?   // 0-100 (100 = definitely fraud)
  reviewRequired    Boolean  @default(false)

  // Approval
  status            TimeEntryStatus
  approvedBy        String?
  approvedAt        DateTime?

  createdAt         DateTime @default(now())

  candidate         Candidate @relation(fields: [candidateId], references: [id])
  project           Project   @relation(fields: [projectId], references: [id])
}

enum TimeEntryStatus {
  PENDING
  APPROVED
  REJECTED
  DISPUTED
}
```

### 7.4 External Integrations

**Time Tracking:**
- Time Doctor API
- Hubstaff API

**Payments:**
- Stripe (US providers)
- PayPal (international)
- Bank transfers (Pakistan)

**AI Services:**
- OpenAI GPT-4
- Anthropic Claude 3.5
- Google Gemini 1.5 Pro

**Communication:**
- Resend (email)
- Twilio (SMS)

**Storage:**
- Vercel Blob (documents)
- S3 (backups)

**Search:**
- Pinecone (CV Bank semantic search)
- pgvector (alternative)

---

## 8. Business Intelligence & Metrics

### 8.1 Win Rate Analytics

```typescript
interface WinRateMetrics {
  overallWinRate: 22% // vs 4% industry
  winRateByClient: {clientId, winRate}[]
  winRateBySDLScore: {scoreRange, winRate}[]
  winRateByComplexity: {complexity, winRate}[]
  avgContractValue: $450k
  totalWon: 47
  totalLost: 167
  winRateTrend: {month, winRate}[] // 12-month
}
```

### 8.2 Revenue Analytics

```typescript
interface RevenueMetrics {
  monthlyRevenue: $125k
  revenueByClient: {clientId, totalSpend}[]
  revenueByService: {service, revenue}[]
  agencyRevenue: $95k // 76%
  directRevenue: $30k // 24%
  avgProjectValue: $8,500
  pendingPayments: $42k
  providerCosts: $35k
  profitMargin: 48%
}
```

### 8.3 Provider Performance

```typescript
interface ProviderMetrics {
  projectsCompleted: 23
  avgQualityScore: 87 // Pink + Red avg
  onTimeRate: 95%
  clientSatisfaction: 4.7/5
  revisionRate: 12%
  activityAvg: 89%
  hourlyRate: PKR 3800
  totalEarnings: PKR 456,000
  fraudFlags: 0
  status: "ACTIVE"
}
```

### 8.4 Operational Efficiency

```typescript
interface OperationalMetrics {
  avgSDLTime: 52 // hours
  avgExecutionTime: 128 // hours
  avgCycleTime: 6.8 // days
  providerUtilization: 73% // % available hours worked
  aiTaskSuccessRate: 94% // % without human escalation
  pinkGatePassRate: 87%
  redGatePassRate: 78%
  clientFirstApproval: 65%
  avgConsensusConfidence: 85%
}
```

---

## 9. Design System & Components

(Inherit from original candidate portal design system - Navy/Gold/Teal palette, glassmorphism, Framer Motion, etc.)

**Additional Components for Admin Portal:**

### 9.1 Kanban Board
```tsx
<ProjectKanban
  stages={12} // 12-stage pipeline
  projects={projects}
  onDragEnd={handleStageChange}
  showMetrics={["winProb", "contractValue", "deadline"]}
/>
```

### 9.2 SDL Task Queue
```tsx
<SDLTaskQueue
  tasks={34}
  project={project}
  showConsensus={true}
  onEscalate={handleEscalation}
/>
```

### 9.3 Time Entry Review
```tsx
<TimeEntryTable
  entries={entries}
  showFraudFlags={true}
  onApprove={handleApproval}
  onReject={handleRejection}
/>
```

---

## 10. Implementation Roadmap

### Phase 1: Super Admin - Project Management (Week 1-3)

**Deliverables:**
- [ ] Admin dashboard layout with navigation
- [ ] Project kanban board (12 stages)
- [ ] Project detail view
- [ ] Create project flow
- [ ] Basic status tracking

### Phase 2: SDL Orchestration (Week 3-5)

**Deliverables:**
- [ ] SDL task queue (34 tasks)
- [ ] Multi-AI consensus display
- [ ] Split decision escalation UI
- [ ] Human validation interface
- [ ] SDL analytics dashboard

### Phase 3: Quality Gates (Week 5-7)

**Deliverables:**
- [ ] Pink Gate queue (AI validation)
- [ ] Red Gate queue (expert review)
- [ ] Gold Gate queue (client approval)
- [ ] Quality scoring system
- [ ] Revision workflow

### Phase 4: Provider Management (Week 7-9)

**Deliverables:**
- [ ] Provider directory (CV Bank integration)
- [ ] Assignment interface
- [ ] Time entry review with fraud detection
- [ ] Payroll processing
- [ ] Performance dashboards

### Phase 5: Client Portal (Week 9-11)

**Deliverables:**
- [ ] Client dashboard
- [ ] Project progress view
- [ ] Deliverable review interface
- [ ] Communication system
- [ ] Agency white-label features

### Phase 6: Team Portal (Week 11-13)

**Deliverables:**
- [ ] Team dashboard (anonymized)
- [ ] Assignment view with codenames
- [ ] Deliverable upload
- [ ] Time tracking integration
- [ ] Performance feedback

### Phase 7: Candidate Portal (Week 13-15)

(As documented in original plan)

### Phase 8: Business Intelligence (Week 15-17)

**Deliverables:**
- [ ] Win rate analytics
- [ ] Revenue dashboards
- [ ] Provider performance tracking
- [ ] Operational efficiency metrics
- [ ] Forecasting tools

### Phase 9: Integrations (Week 17-19)

**Deliverables:**
- [ ] Time Doctor/Hubstaff integration
- [ ] Stripe/PayPal payment processing
- [ ] Email/SMS automation
- [ ] Document storage (Vercel Blob/S3)
- [ ] AI service integrations (GPT-4/Claude/Gemini)

### Phase 10: Testing & Launch (Week 19-20)

**Deliverables:**
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment
- [ ] User training documentation

---

## Summary

This is the **real dashboard** for Aliff Services—a comprehensive, multi-stakeholder platform managing:

✅ **12-stage project lifecycle** from RFP intake to win/loss tracking
✅ **4 distinct portals** (Admin, Client, Team, Candidate) with role-based access
✅ **AI orchestration** across 34 SDL tasks with multi-AI consensus
✅ **Complete anonymization** (providers never see client names, clients never see providers)
✅ **Quality gates** (Pink/Red/Gold) with automated + human validation
✅ **Resource management** (CV Bank search, auto-assignment, time tracking, fraud detection)
✅ **Financial operations** (invoicing, payroll, margin tracking)
✅ **Business intelligence** (22% win rate, revenue forecasting, operational efficiency)

This platform coordinates **humans + AI systems** to deliver GOVCON proposals at 5.5x industry win rates through strategic human expertise amplified by multi-AI consensus validation.

**Let's build the engine that powers the entire business! 🚀**
