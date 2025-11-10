# Aliff Services Platform Specification

## Executive Overview

Aliff Services is a comprehensive marketplace platform connecting businesses with pre-vetted service providers across four distinct categories: Government Contracting (GOVCON & SLED), Professional Writing Services, and IT Services (Website & Mobile Development). The platform features complete anonymity between clients and providers, with Aliff acting as an intelligent intermediary.

**Four Service Categories**:
1. **GOVCON** - Federal government contracting (8 services): $47M+ won, 22% win rate
2. **SLED** - State, Local, Education contracting (8 services): 35% win rate
3. **Writing Services** - Professional content creation (6 categories): 1000+ projects
4. **IT Services** - Website & mobile development (2 core services): 50+ apps built

**Core Value Proposition**: Aliff acts as an intelligent intermediary, handling assessment, AI-powered matching, pricing negotiation, and project management while maintaining complete anonymity between clients and service providers across all service categories.

**Business Model**: 70-90% of revenue comes from B2B channels (GOVCON service agencies reselling Aliff services white-labeled to their end clients), with 10-30% from direct B2C clients.

---

## 1. Platform Architecture

### 1.1 High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                    MARKETING WEBSITE                         │
│  - Public pages (services, case studies, blog)              │
│  - /for-agencies page (B2B focus - 70-90% of revenue)       │
│  - AI Chatbot "Aliff" (assessment & lead capture)           │
│  - Pricing handled by Aliff after free assessment           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              AUTHENTICATED PLATFORM                          │
├─────────┬──────────────┬──────────────┬──────────┬──────────┤
│ CLIENT  │   AGENCY     │   SERVICE    │  VENDOR  │  ADMIN   │
│ PORTAL  │   PORTAL     │   PROVIDER   │  PORTAL  │DASHBOARD │
│         │ (B2B - 70%)  │   PORTAL     │          │          │
└─────────┴──────────────┴──────────────┴──────────┴──────────┘
```

### 1.2 Technology Stack

**Frontend**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI components
- React Query for data fetching

**Backend**
- Next.js API Routes / Server Actions
- tRPC for type-safe APIs
- Prisma ORM
- PostgreSQL (primary database)
- Redis (caching, sessions, job queues)

**Authentication**
- NextAuth.js v5 (Auth.js)
- Role-based access control (RBAC)
- Multi-tenant isolation

**AI Integration**
- OpenAI GPT-4 (chatbot, content generation, test creation)
- Anthropic Claude (document analysis, compliance checking)
- Branded as "Aliff" throughout platform

**File Storage**
- MinIO (S3-compatible, self-hosted)
- Document versioning
- Access control per project

**Communication**
- Resend (transactional emails)
- Slack API (internal notifications, quote routing)
- In-app messaging (anonymized between parties)

**Payment Processing**
- Stripe Connect (marketplace payments)
- Split payments (Aliff commission + provider payment)
- Automated invoicing

**Deployment**
- Docker containers
- CI/CD via GitHub Actions
- Monitoring: Sentry, LogTail

---

## 2. Marketing Website

### 2.1 Public Pages Structure

```
/                          - Homepage with hero, services overview, CTAs
/services/federal          - GOVCON services (8 services)
/services/sled             - SLED services (8 services)
/services/it               - IT Services (Website & Mobile Development)
/services/writing          - Writing Services (6 categories)
/case-studies              - Success stories (anonymized clients)
/insights                  - Blog, whitepapers, industry news
/about                     - Company story, team, mission
/contact                   - Contact form, schedule consultation
/get-started               - Free assessment entry point
```

### 2.2 AI Chatbot "Aliff"

**Purpose**: Intelligent assistant for lead qualification, assessment, and initial pricing discovery.

**Capabilities**:
- Answer questions about all services (GOVCON, SLED, Writing, IT)
- Conduct free project assessments across all categories
- Gather requirements (project scope, timeline, budget, technical/compliance needs)
- Provide ballpark pricing estimates after assessment
- Schedule consultations with human team
- Route qualified leads to sales team via Slack

**Interaction Flow**:
1. User initiates chat on any page
2. Aliff asks qualifying questions
3. For serious inquiries, offers free assessment
4. Assessment captures detailed requirements
5. Aliff provides pricing range (no fixed quotes yet)
6. Routes to human team via Slack notification
7. Human team reviews and reaches out

**Implementation**:
- Widget embedded on all pages
- Conversational UI with typing indicators
- Context-aware (knows which page user is on)
- Session persistence (resume conversations)
- Logged in database for sales team review

**Slack Integration Examples**:

```
New Lead from Aliff Chatbot - GOVCON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: John Smith | Email: john@agency.gov
Service: Federal Proposal Writing
Budget: $50K-$100K | Urgency: 30 days | Score: 8.5/10
[View Transcript] [Convert] [Schedule]
```

```
New Lead from Aliff Chatbot - IT Services
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: Sarah Johnson | Email: sarah@startup.com
Service: E-commerce Website Development
Budget: $25K-$40K | Urgency: 60 days | Score: 9.0/10
[View Transcript] [Convert] [Schedule]
```

```
New Lead from Aliff Chatbot - Writing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: Mike Chen | Email: mike@techcorp.io
Service: Content Writing (Blog + SEO)
Budget: $5K/month | Urgency: Immediate | Score: 7.5/10
[View Transcript] [Convert] [Schedule]
```

### 2.3 Trust Signals

**Displayed Throughout Site** (Across All Services):
- **GOVCON/SLED**: $47M+ contracts won, 22% win rate, 5.5x industry average
- **IT Services**: 50+ apps delivered, 4.9★ rating, 100% on-time delivery
- **Writing Services**: 1000+ projects completed, 48hr turnaround, 95% client retention
- Case studies (anonymized across all categories)
- 20 years combined team experience
- Industry certifications and compliance badges
- Client testimonials by service category

**Content Generation Strategy**:
- 80-90% AI-generated by Aliff
- 10-20% human refinement for accuracy and tone
- Regular updates to blog and case studies
- SEO optimization automated

---

## 3. Client Portal

### 3.1 Dashboard Overview

**Landing Page After Login** (All Service Types):
- Active projects summary (status, deadlines)
- Recent documents uploaded
- Upcoming milestones
- Messages from Aliff (acting as project manager proxy)
- Service-specific alerts (compliance for GOVCON/SLED, content calendar for Writing, deployment status for IT)
- Invoice summaries

### 3.2 Project Management

**Project Lifecycle**:
1. **Assessment** - Client fills detailed requirements
2. **Matching** - Aliff matches with service providers (invisible to client)
3. **Proposal** - Client receives proposal from "Aliff Services"
4. **Kickoff** - Project starts, timeline set
5. **Execution** - Deliverables uploaded, feedback cycles
6. **Completion** - Final approval, payment processing
7. **Archive** - Historical reference

**Features**:
- Kanban board view of tasks
- Timeline/Gantt charts
- File upload/download
- Comment threads on deliverables
- Approval workflows
- Change request submission

### 3.3 Document Management

**Client Document Library** (By Service Type):
- **GOVCON/SLED**: RFP/RFQ documents, proposals, compliance documents, certifications
- **Writing Services**: Content briefs, drafts, final deliverables, style guides, SEO reports
- **IT Services**: Requirements docs, wireframes, design files, code repos, deployment logs
- SOW (Statements of Work) for all projects
- Contracts and amendments
- Invoices and payment receipts

**Organization**:
- Folder structure per project
- Tagging system (compliance, legal, technical)
- Version control
- Search functionality
- Download as ZIP

### 3.4 Compliance & Security

**Compliance Tracking**:
- NIST 800-171 requirements checklist
- FedRAMP moderate baseline
- StateRAMP compliance (for SLED)
- CMMC certification status
- Audit logs (who accessed what, when)

**Security Features**:
- SSO integration (optional for enterprise)
- 2FA required
- Data encryption at rest and in transit
- Role-based access within client organization
- IP whitelisting option

### 3.5 Billing & Payments

**Financial Dashboard**:
- Project budgets vs. actuals
- Invoice history
- Payment methods on file
- Payment schedules
- Tax documents (1099s if applicable)

**Payment Options**:
- ACH transfer
- Credit card (Stripe)
- Wire transfer
- Net-30/60 terms (for qualified clients)

### 3.6 Messaging

**Communication Channels**:
- Direct messages with "Aliff Services" team
  - Behind scenes: Aliff routes to appropriate human or service provider
  - Complete anonymity maintained
- Project-specific threads
- Urgent issue reporting

**Anonymity Mechanism**:
- Client thinks they're communicating with Aliff Services
- Messages actually go to assigned service provider
- Provider sees client as "Client #4523" or fake company name generated by Aliff
- Aliff acts as proxy, passing messages both ways

### 3.7 Agency Portal (B2B - 70-90% of Revenue)

**Purpose**: Dedicated dashboard for GOVCON service agencies who resell Aliff services white-labeled to their end clients.

**Account Type Selection** (During Signup):
```
┌─────────────────────────────────────┐
│      Create Your Aliff Account      │
│                                     │
│  I am a:                            │
│  ○ Government Contractor            │
│  ○ GOVCON Services Agency           │
│                                     │
│  [Continue →]                       │
└─────────────────────────────────────┘
```

**Login Routing**:
- Same credentials for both account types
- System automatically routes to appropriate dashboard based on account type
- Agency accounts see Agency Portal (multi-client management)
- Contractor accounts see standard Client Portal

**Agency Dashboard Overview**:

**Landing Page**:
- Multi-client summary (all projects across all end clients)
- Volume analytics (current tier: 15%, 20%, or 25% discount)
- This month's savings vs. standard pricing
- Team member access management
- White-label settings status

**Client Management**:
```
┌──────────────────────────────────────┐
│  MY CLIENTS                          │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ Acme Defense Solutions      │    │
│  │ 3 active projects           │    │
│  │ $45,000 total this month    │    │
│  │ [View →] [Add Project]      │    │
│  └─────────────────────────────┘    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │ TechCorp Federal            │    │
│  │ 1 active project            │    │
│  │ $12,000 total this month    │    │
│  │ [View →] [Add Project]      │    │
│  └─────────────────────────────┘    │
│                                      │
│  [+ Add New Client]                  │
└──────────────────────────────────────┘
```

**White-Label Settings**:
- Upload agency logo (displayed in client-facing deliverables)
- Set brand colors (applied to client portal if enabled)
- Custom email domain for client communications (optional)
- Custom portal subdomain: clientname.agencyname.com (optional)

**Volume Discount Tiers**:
- **5-10 projects/month**: 15% off standard pricing
- **10-20 projects/month**: 20% off standard pricing
- **20+ projects/month**: 25% off standard pricing
- Dashboard shows current tier and projected next month tier
- Automatic discount application on invoices

**Project Creation for End Clients**:
1. Agency creates client profile (one-time)
2. Agency creates project under client
3. Upload requirements (RFP, SOW, content brief, etc.)
4. Aliff processes and assigns to service provider
5. Deliverables returned to agency (white-labeled)
6. Agency delivers to end client under their brand

**Multi-Client View**:
- See all projects across all clients in single dashboard
- Filter by client, service type, status, deadline
- Bulk actions (export invoices, download deliverables)
- Team member permissions (assign clients to specific team members)

**Financial Management**:
- Pay per project after completion (no monthly fees, no platform fees)
- Consolidated invoicing (one invoice per project, grouped by month available)
- Net-30 terms available with credit card on file
- Volume savings tracker (shows amount saved vs. standard pricing)
- Agency sets their own markup when invoicing end clients

**Team Access**:
- Invite team members (BD managers, project managers, account executives)
- Assign clients to specific team members
- Role-based permissions (view only, edit, admin)
- Activity logs (who did what, when)

**Value Proposition for Agencies**:
- **Scale without hiring**: Take on more contracts without FTE overhead
- **Complete white-label**: End clients never know Aliff exists
- **Superior quality, lower rates**: AI + expert hybrid at 30-40% below traditional agencies
- **15-25% volume discounts**: More projects = more savings
- **No risk**: Pay per project after delivery, no long-term contracts

---

## 4. Service Provider Portal

### 4.1 Onboarding Process

**Registration Flow**:
1. Service provider applies via website
2. Fills detailed profile:
   - Services offered (from predefined categories)
   - Geographic coverage
   - Certifications (8(a), SDVOSB, WOSB, HUBZone, etc.)
   - Past performance examples
   - Team size and capabilities
   - Portfolio samples
3. AI-generated competency test
   - Service-specific questions
   - Writing samples
   - Technical assessments
   - Scenario-based problem solving
4. Human review of test results
5. Negotiation of rates (automated by AI)
6. Approval and portal access granted

**Competency Testing Example** (Proposal Writing):
- Review sample RFP, draft compliance matrix
- Write executive summary for hypothetical project
- Identify technical requirements from SOW
- Demonstrate understanding of FAR/DFARS

**Rate Negotiation**:
- Aliff proposes standard rate based on market research
- Provider counters or accepts
- Back-and-forth automated until agreement
- Rates stored in profile, used for project matching

### 4.2 Dashboard Overview

**Landing Page After Login**:
- Available projects (matched by Aliff)
- Active projects (accepted and in progress)
- Earnings summary (pending, paid)
- Performance metrics (on-time delivery, client ratings)
- Messages from Aliff
- Training opportunities

### 4.3 Project Matching

**How It Works**:
- Aliff analyzes new client project requirements
- Matches against provider capabilities, availability, rates, past performance
- Presents project to top 1-3 matched providers
- First to accept wins the project (or Aliff selects best fit)

**Project Invitation Examples** (By Service Type):

**GOVCON Example**:
```
New Project Match: Federal Proposal Writing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client: [Department of Innovation, State of Virginia]*
Service: Past Performance Writing + Compliance Matrix
Deadline: 14 days | Budget: $12,000 | Rate: $85/hr (120 hrs)
Requirements: NAICS 541611, FedRAMP knowledge, 5+ proposals
[Accept] [Decline] [More Info]
```

**IT Services Example**:
```
New Project Match: E-commerce Platform Development
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client: [Artisan Goods Marketplace]*
Service: Shopify + Custom Integration
Deadline: 8 weeks | Budget: $35,000 | Fixed price
Requirements: Shopify expert, payment gateway, inventory system
[Accept] [Decline] [More Info]
```

**Writing Services Example**:
```
New Project Match: Blog Content Series
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client: [TechVenture Solutions]*
Service: SEO Blog Posts (8 articles/month)
Deadline: Ongoing | Budget: $4,000/month | Rate: $500/article
Requirements: Tech industry expertise, SEO optimization, 2000+ words
[Accept] [Decline] [More Info]
```

*All names generated by Aliff. Real client identities protected.

### 4.4 Anonymity Features

**Client Identity Masking** (Examples by Service Type):
- Aliff generates fake client names (believable but fictitious)
- **GOVCON/SLED**: "Department of Innovation, State of Virginia"
- **IT Services**: "Artisan Goods Marketplace", "HealthTech Solutions Inc."
- **Writing Services**: "TechVenture Solutions", "Global Finance Advisors"
- Fake company history, website screenshots, brand guidelines
- All references consistent throughout project
- Provider never knows real client identity

**Document Sanitization** (All Service Types):
- Client-uploaded documents scrubbed of identifying info
- Company/agency names, contact info, logos replaced with fake equivalents
- **GOVCON/SLED**: RFPs, compliance docs sanitized
- **IT Services**: Requirements docs, brand guidelines anonymized
- **Writing Services**: Content briefs, existing materials cleaned
- Aliff provides "clean" version to provider
- Provider works with sanitized docs only

**Communication Proxy**:
- Provider messages "Client Representative via Aliff"
- Actually goes to Aliff, then routed to real client
- No direct contact ever established

### 4.5 Project Execution

**Workflow**:
1. Accept project assignment
2. Access sanitized project brief and documents
3. Upload deliverables to project workspace
4. Receive feedback from "client" (via Aliff proxy)
5. Iterate until approval
6. Submit final deliverables
7. Project marked complete
8. Payment processed (minus Aliff commission)

**Collaboration Tools**:
- Task management
- File versioning
- Comment threads
- Video calls (via Aliff-hosted rooms, optional)

### 4.6 Payments & Earnings

**Payment Structure**:
- Project-based or hourly (depending on service)
- Aliff commission: 15-30% (varies by service, provider tier)
- Payment schedule:
  - Milestone-based for large projects
  - Upon completion for smaller projects
  - Net-15 after client approval

**Earnings Dashboard**:
- Lifetime earnings
- Current month earnings
- Pending payments
- Payment history
- 1099 tax form access (for US providers)

**Payout Methods**:
- ACH direct deposit (US)
- Wire transfer (international)
- PayPal (option for small providers)

### 4.7 Performance Metrics

**Provider Ratings**:
- Client satisfaction scores (anonymized feedback)
- On-time delivery rate
- Revision request frequency
- Communication responsiveness
- Overall quality score

**Gamification**:
- Tier system (Bronze, Silver, Gold, Platinum)
- Higher tiers get:
  - First access to premium projects
  - Higher rates
  - Lower commission rates
  - Featured provider badge

---

## 5. Vendor Portal

**Note**: Vendors are service provider organizations that manage teams of individual service providers.

### 5.1 Vendor vs. Service Provider

**Service Provider** (Individual):
- Solo practitioner or small team
- Works on projects directly
- Managed through Service Provider Portal

**Vendor** (Organization):
- Manages multiple service providers
- Assigns projects to team members
- Oversees quality and delivery
- Consolidated billing and payments

### 5.2 Vendor Dashboard

**Landing Page**:
- All vendor projects (across team members)
- Team member availability and utilization
- Revenue analytics
- Team performance metrics
- Project pipeline

### 5.3 Team Management

**Features**:
- Add/remove team members
- Assign competency areas
- Set individual rates
- Track availability
- Performance review tools

**Resource Allocation**:
- Aliff suggests best team member for each project
- Vendor can override assignment
- Workload balancing visualizations

### 5.4 Project Assignment

**Workflow**:
1. Vendor receives project match (same as service provider)
2. Vendor assigns to specific team member
3. Team member sees project in their portal
4. Vendor oversees delivery
5. Quality review before client submission
6. Vendor approves final deliverable

### 5.5 Consolidated Billing

**Payment Structure**:
- Single payment to vendor for all team projects
- Vendor responsible for paying team members
- Aliff commission calculated on total vendor revenue

---

## 6. Admin Dashboard

### 6.1 Overview

**Purpose**: Internal tool for Aliff Services team to manage entire platform.

**Key Sections**:
1. Client Management
2. Service Provider Management
3. Vendor Management
4. Project Oversight
5. Resource Matching
6. Financial Management
7. Content Management
8. Analytics & Reporting

### 6.2 Client Management

**Features**:
- View all clients (active, inactive, leads)
- Client details (org info, contacts, projects)
- Onboarding status
- Subscription tiers (if applicable)
- Communication history
- Account health scores
- Manual interventions

**Actions**:
- Create new client account
- Assign account manager
- Flag compliance issues
- Send announcements
- Export client data

### 6.3 Service Provider Management

**Features**:
- Provider directory (searchable, filterable)
- Provider profiles (skills, certifications, rates)
- Competency test results
- Performance metrics
- Active/inactive status
- Vetting status (pending, approved, suspended)

**Actions**:
- Approve/reject applications
- Manually adjust ratings
- Suspend accounts (quality issues)
- Update commission rates
- Assign to projects manually (override AI)

### 6.4 Project Oversight

**Project Dashboard**:
- All projects across all clients
- Status filters (proposal, active, completed, cancelled)
- Search and filtering
- Project health indicators
- Overdue alerts

**Project Details View**:
- Client and provider info (real identities visible)
- Project timeline and milestones
- Files and documents
- Communication logs
- Financial summary
- Intervention history

**Actions**:
- Assign/reassign providers
- Adjust timelines
- Mediate disputes
- Cancel projects
- Issue refunds

### 6.5 Resource Matching

**AI Matching Review**:
- View Aliff's recommended matches for new projects
- Override suggestions
- Adjust matching algorithm parameters
- Feedback loop to improve AI

**Capacity Planning**:
- Provider availability heatmap
- Utilization rates
- Upcoming project pipeline
- Bottleneck identification

### 6.6 Financial Management

**Revenue Dashboard**:
- Total revenue (monthly, quarterly, annual)
- Revenue by service category (GOVCON, SLED, Writing, IT Services)
- Revenue by client segment and industry
- Commission earned (varies by service: 15-30%)
- Outstanding invoices
- Payment disputes

**Provider Payments**:
- Pending payouts
- Payment queue
- Payment history
- 1099 preparation
- Dispute resolution

**Client Invoicing**:
- Automated invoice generation
- Manual invoice creation
- Payment reminders
- Collections management

### 6.7 Content Management

**Marketing Content**:
- Blog post creation (AI-assisted)
- Case study drafting
- Service page updates
- FAQ management

**AI Chatbot Training**:
- Review chat transcripts
- Identify gaps in knowledge
- Update response templates
- Adjust tone and personality

### 6.8 Analytics & Reporting

**Key Metrics**:
- User acquisition (clients, providers)
- Conversion rates (lead → client, applicant → provider)
- Project velocity (time from lead to completion)
- Revenue growth
- Provider utilization
- Client retention
- NPS scores

**Custom Reports**:
- Export to CSV, Excel, PDF
- Scheduled email delivery
- Dashboard widgets

---

## 7. Complete Anonymity System

### 7.1 Design Principles

**Core Requirement**: Clients and service providers never know each other's true identities.

**Aliff as Intermediary**:
- All communication routed through Aliff
- All documents sanitized by Aliff
- All payments processed by Aliff (marketplace model)
- Aliff generates consistent fake identities for both sides

### 7.2 Client Identity Masking (for Providers)

**Fake Client Generation** (Examples by Service Type):
When a new project is created, Aliff generates:
- Fake company/agency name (believable based on service need)
- **GOVCON/SLED Examples**:
  - "Department of Transportation, State of Ohio"
  - "City of Portland Procurement Office"
  - "Defense Innovation Agency"
- **IT Services Examples**:
  - "Artisan Goods Marketplace"
  - "HealthTech Solutions Inc."
  - "NextGen Finance Platform"
- **Writing Services Examples**:
  - "TechVenture Solutions"
  - "Global Finance Advisors"
  - "Sustainable Living Magazine"
- Fake contact person name
- Fake email addresses (routed to Aliff proxy)
- Fake phone numbers (if calls needed, via VOIP proxy)

**Document Sanitization** (All Service Types):
- Client uploads project documents (RFP, SOW, requirements, content briefs, etc.)
- Aliff AI scans for identifying information:
  - Company/agency names
  - Logos and letterheads
  - Contact information
  - Specific location references
  - Unique project identifiers
  - Brand-specific terminology
- Replaces with fake but consistent information
- Provider receives "cleaned" document maintaining all functional requirements

**Consistency Enforcement**:
- Same fake identity used throughout project
- All documents use same fake names
- Communication style mimicked
- Aliff maintains mapping (real ↔ fake) in database

### 7.3 Provider Identity Masking (for Clients)

**Client Perspective**:
- Client thinks they're working with "Aliff Services" directly
- All deliverables appear to come from Aliff
- Provider is completely invisible

**Behind the Scenes**:
- Provider uploads deliverable
- Aliff reviews (automated + human QA)
- Aliff delivers to client as if created in-house
- Client provides feedback
- Aliff routes feedback to provider

**No Subcontractor Disclosure**:
- Legally, Aliff is prime contractor
- Providers are subcontractors
- Client contract is with Aliff only
- Providers sign NDAs and work-for-hire agreements

### 7.4 Communication Proxy

**Message Flow**:
```
CLIENT                    ALIFF PROXY                PROVIDER
   │                           │                          │
   │  "Need clarification on   │                          │
   │   compliance matrix"      │                          │
   ├──────────────────────────>│                          │
   │                           │  Logged, sanitized       │
   │                           │  forwarded as:           │
   │                           │  "Client Rep asks..."    │
   │                           ├─────────────────────────>│
   │                           │                          │
   │                           │   "Here's the detail..." │
   │                           │<─────────────────────────┤
   │  Response from            │  Logged, forwarded       │
   │  "Aliff Team"             │                          │
   │<──────────────────────────┤                          │
```

**Implementation**:
- In-app messaging system
- Email proxy (unique addresses per project)
- Optional: Phone proxy for verbal communication
- All logged for compliance and dispute resolution

### 7.5 Data Isolation

**Database Design**:
- Client table (real identities)
- Provider table (real identities)
- Project table (links client + provider)
- FakeIdentity table (maps real ↔ fake per project)

**Access Control**:
- Clients query projects: see only fake provider info (or none)
- Providers query projects: see only fake client info
- Admins see all real identities

**Audit Logging**:
- Track who accessed what data
- Anonymity breach detection
- Compliance with data privacy regulations

---

## 8. Aliff as Document Generator

### 8.1 Capabilities

**AI-Powered Content Creation** (By Service Type):
- **GOVCON/SLED**: Proposals, compliance matrices, capability statements, past performance narratives, SOW responses
- **Writing Services**: Blog posts, articles, whitepapers, case studies, social media content, email campaigns, business plans
- **IT Services**: Technical documentation, user guides, API docs, requirements specifications, project proposals
- Marketing collateral across all categories

**Human-in-the-Loop** (All Services):
- AI generates 80-90% of content
- Service provider refines 10-20%
- Quality review by Aliff team
- Client approval before finalization

### 8.2 Workflow Examples

**GOVCON Proposal Writing**:
1. Client uploads RFP → Aliff extracts requirements, evaluation criteria
2. Aliff drafts proposal using winning templates + client past performance
3. Provider refines technical details, adds domain expertise
4. Aliff QA: compliance check, grammar, formatting
5. Client receives, reviews, iterates → Final submission to agency

**Writing Services (Blog Content)**:
1. Client provides content brief → Aliff extracts topic, keywords, tone, audience
2. Aliff drafts article using SEO best practices + client brand voice
3. Writer refines style, adds unique insights, fact-checks
4. Aliff QA: SEO optimization, readability, grammar
5. Client receives, approves → Publish or schedule

**IT Services (Technical Documentation)**:
1. Client provides app/code → Aliff analyzes features, generates outline
2. Aliff drafts user guide with screenshots, code examples, API references
3. Developer refines accuracy, adds troubleshooting tips
4. Aliff QA: technical accuracy, formatting, completeness
5. Client receives, reviews → Final documentation delivered

### 8.3 Template Library

**Maintained by Aliff** (By Service Category):
- **GOVCON/SLED**: Winning proposal templates, compliance matrices, SOW templates, past performance narratives, capability statements
- **Writing Services**: Blog templates, case study formats, whitepaper structures, social media frameworks, email campaign templates
- **IT Services**: Technical documentation templates, user guide formats, API documentation structures, requirements specification templates

**Continuous Improvement** (All Services):
- AI learns from each successful project
- Templates updated based on success metrics (win rates, engagement, client satisfaction)
- Industry best practices incorporated
- Regular A/B testing of approaches

---

## 9. Quote Routing via Slack

### 9.1 Purpose

**Problem**: Not all inquiries can be auto-quoted by AI chatbot. Complex or custom projects need human review.

**Solution**: Route qualified leads from chatbot to internal sales team via Slack for immediate follow-up.

### 9.2 Workflow

**Trigger Points**:
1. Chatbot assessment completed with high score (8+/10)
2. User explicitly requests quote
3. Project budget exceeds threshold ($50K+)
4. Complex multi-service requirements

**Slack Notification**:
- Posted to #sales-leads channel
- Contains lead details, assessment summary, urgency
- Actionable buttons: View Full Transcript, Convert to Client, Schedule Call
- Assigned team member notified

**Sales Team Action**:
1. Reviews chatbot transcript
2. Contacts lead within 1 hour (SLA)
3. Conducts deeper discovery
4. Provides custom quote
5. Converts to client in CRM
6. Updates Slack thread with outcome

### 9.3 Slack Integration Details

**Slack App Setup**:
- OAuth authentication
- Bot user with permissions:
  - Post messages
  - Read channels
  - Upload files
- Slash commands (optional): `/aliff-lead [email]`

**Message Template**:
```
🚨 New High-Value Lead - Action Required

Name: Sarah Johnson
Email: sarah.johnson@citygov.com
Phone: (555) 123-4567
Organization: City of Springfield

Service Interest: SBIR/STTR Grant Writing
Project Scope: 3 grant proposals over 6 months
Budget Range: $75,000 - $100,000
Timeline: Start within 2 weeks
Urgency: High (upcoming deadline)

Assessment Score: 9.2/10
Qualifying Factors:
✓ Budget confirmed
✓ Decision-maker
✓ Immediate need
✓ Prior grant experience

[View Full Transcript] [Claim Lead] [Schedule Call]

Assigned to: @john-sales | Auto-escalate in 60 min if unclaimed
```

**Escalation Rules**:
- If unclaimed after 60 minutes: escalate to sales manager
- If unclaimed after 2 hours: send email backup
- Track response times, conversion rates per team member

---

## 10. Database Schema Overview

### 10.1 Core Tables

**users**
- id, email, passwordHash, role (client, provider, vendor, admin)
- createdAt, lastLoginAt

**clients**
- id, userId, organizationType (federal, SLED, commercial)
- companyName, website, address, taxId
- billingInfo, companySize

**serviceProviders**
- id, userId, providerType (individual, vendor)
- skills (JSON array), certifications, hourlyRate
- portfolioUrl, linkedIn, vetted (boolean)
- performanceScore, totalEarnings

**vendors**
- id, userId, companyName, teamSize
- commissionRate, paymentTerms

**vendorMembers**
- id, vendorId, serviceProviderId
- role (member, lead, admin)

**projects**
- id, clientId, serviceProviderId (nullable if vendor)
- vendorId (nullable)
- serviceType, status, budget, timeline
- createdAt, startedAt, completedAt

**fakeIdentities**
- id, projectId, realClientId, realProviderId
- fakeClientName, fakeClientEmail, fakeClientPhone
- generatedAt

**documents**
- id, projectId, uploadedBy (userId)
- fileName, fileUrl, fileSize, fileType
- isSanitized (boolean), originalDocId (if sanitized version)

**messages**
- id, projectId, fromUserId, toUserId
- content, isProxied (boolean), readAt

**chatbotSessions**
- id, sessionId, email, phase (assessment, qualification, converted)
- transcript (JSON), leadScore, routedToSlack

**payments**
- id, projectId, clientId, providerId
- amount, commission, providerPayout
- status, paidAt, stripePaymentIntentId

**auditLogs**
- id, userId, action, resourceType, resourceId
- ipAddress, timestamp

### 10.2 Relationships

```
users 1:1 clients
users 1:1 serviceProviders
users 1:1 vendors

vendors 1:N vendorMembers
vendorMembers N:1 serviceProviders

clients 1:N projects
serviceProviders 1:N projects
vendors 1:N projects

projects 1:N documents
projects 1:N messages
projects 1:1 fakeIdentities
projects 1:N payments
```

---

## 11. Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- Set up Next.js project structure
- Configure PostgreSQL, Prisma, Redis
- Implement authentication (NextAuth.js)
- Build basic UI framework (Tailwind, Shadcn)
- Create user models (clients, providers, vendors, admins)

### Phase 2: Marketing Website (Weeks 5-8)
- Design and build public pages
- Implement AI chatbot (OpenAI integration)
- Lead capture forms
- Slack integration for quote routing
- SEO optimization

### Phase 3: Client Portal (Weeks 9-12)
- Client dashboard
- Project creation and management
- Document upload/download
- Basic messaging
- Billing and payment (Stripe integration)

### Phase 4: Service Provider Portal (Weeks 13-16)
- Provider onboarding and competency testing
- Provider dashboard
- Project matching algorithm (AI-based)
- Provider project workspace
- Payment and earnings management

### Phase 5: Anonymity System (Weeks 17-20)
- Fake identity generation (AI)
- Document sanitization (AI-based)
- Communication proxy
- Data isolation and access control
- Audit logging

### Phase 6: Vendor Portal (Weeks 21-24)
- Vendor onboarding
- Team management
- Resource allocation
- Consolidated billing

### Phase 7: Admin Dashboard (Weeks 25-28)
- Client and provider management
- Project oversight
- Financial management
- Analytics and reporting
- Content management

### Phase 8: AI Content Generation (Weeks 29-32)
- Proposal writing automation
- Compliance matrix generation
- Template library
- Human-in-the-loop workflows

### Phase 9: Testing & Refinement (Weeks 33-36)
- End-to-end testing
- Security audits
- Performance optimization
- User acceptance testing
- Bug fixes

### Phase 10: Launch (Week 37+)
- Soft launch with select clients
- Onboard initial service providers
- Monitor and iterate
- Scale marketing efforts
- Full public launch

---

## 12. Security & Compliance Considerations

### 12.1 Data Security

**Encryption**:
- All data encrypted at rest (AES-256)
- All data encrypted in transit (TLS 1.3)
- Database encryption enabled

**Access Control**:
- Role-based access control (RBAC)
- Principle of least privilege
- 2FA required for all users
- IP whitelisting for admin accounts

**Vulnerability Management**:
- Regular dependency updates
- Automated security scanning (Snyk, Dependabot)
- Penetration testing (annual)

### 12.2 Compliance

**Federal Requirements**:
- NIST 800-171 compliance for CUI handling
- FedRAMP moderate baseline (if handling federal data)
- CMMC Level 2 (for DoD contracts)

**SLED Requirements**:
- StateRAMP compliance
- State-specific security requirements

**Privacy**:
- GDPR compliance (if EU clients/providers)
- CCPA compliance (California)
- Data retention policies
- Right to deletion

### 12.3 Audit Logging

**All Actions Logged**:
- User login/logout
- Document access
- Project status changes
- Payment transactions
- Admin interventions
- API calls

**Log Retention**:
- 7 years (compliance requirement)
- Immutable logs
- Regular backups

---

## 13. Migrating Aliff Capital Client History

### 13.1 Historical Data Import

**Client Migration**:
- Export client list from Aliff Capital records
- Create client accounts in new platform
- Send onboarding emails with login credentials
- Offer training sessions

**Project History**:
- Import past projects as "completed" status
- Upload historical documents (proposals, deliverables)
- Preserve for reference and past performance examples

**Financial Data**:
- Import invoice history
- Maintain for tax and compliance purposes

### 13.2 Communication Plan

**Announcement**:
- Email announcement to all Aliff Capital clients
- Explain platform benefits (transparency, self-service, faster turnaround)
- Offer migration assistance

**Onboarding Support**:
- Dedicated migration team
- One-on-one walkthroughs
- FAQ documentation
- Video tutorials

---

## 14. Future Enhancements

**Phase 11+**:
- Mobile apps (iOS, Android) for clients and providers
- Advanced AI features:
  - Predictive analytics (project success probability)
  - Automated compliance checking
  - Risk assessment
- Integration marketplace:
  - SAM.gov API integration (auto-pull opportunities)
  - GovWin integration
  - CRM integrations (Salesforce, HubSpot)
- White-label solution for partners
- International expansion (beyond US federal/SLED)

---

## 15. Success Metrics

**Key Performance Indicators (KPIs)**:

**Growth**:
- Monthly Active Clients
- Monthly Active Providers
- New Project Volume (monthly)
- Revenue Growth Rate

**Quality**:
- Client Satisfaction Score (CSAT)
- Net Promoter Score (NPS)
- Provider Performance Score (average)
- Project Success Rate (completed on time, within budget)

**Efficiency**:
- Time from Lead to Conversion
- Time from Project Request to Provider Assignment
- Average Project Completion Time
- Provider Utilization Rate

**Financial**:
- Monthly Recurring Revenue (MRR)
- Average Project Value
- Commission Revenue
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (CLV)

---

## 16. Conclusion

This platform specification outlines a comprehensive, AI-powered marketplace for government contracting services. The core differentiator is complete anonymity between clients and service providers, with Aliff acting as an intelligent intermediary for matching, project management, and quality assurance.

Key innovations:
- AI chatbot "Aliff" for lead qualification and assessment
- Automated service provider matching and competency testing
- Complete identity masking and communication proxy
- AI-assisted content generation (80-90% automated)
- Seamless integration of human expertise (10-20% refinement)
- Quote routing via Slack for high-touch sales
- Multi-tenant architecture supporting clients, providers, vendors, and admins

The phased implementation approach allows for iterative development and validation, with the marketing website and client portal launching first to generate revenue while the more complex anonymity and AI features are built out.

**Next Steps**:
1. Review and refine this specification
2. Create detailed wireframes and user flows
3. Set up development environment
4. Begin Phase 1 implementation
5. Recruit beta clients and service providers for testing
