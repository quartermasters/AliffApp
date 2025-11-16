/**
 * Clean Professional Job Postings - Accurate & Compliant
 *
 * Removed: Emojis, fake bonuses, inflated benefits
 * Added: Accurate work hours, PKR compensation, realistic expectations
 */

import { PrismaClient, JobType, JobLocation, JobStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding job postings...');

  // Get or create admin user
  let adminUser = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@aliffcapital.com',
        password: 'temp_password_change_me',
        name: 'System Admin',
        role: 'SUPER_ADMIN',
      },
    });
  }

  const jobs = [
    // Senior/Expert Level (PKR 250-400/hour)
    {
      title: 'Expert Copywriter - GOVCON & Marketing',
      slug: 'expert-copywriter-govcon-marketing',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Content & Marketing',
      salary: 'PKR 250-300/hour based on portfolio strength',
      description: `Aliff Services seeks exceptional copywriters who can craft compelling narratives for government proposals and marketing content.

About This Role:
Write persuasive copy that wins federal contracts and attracts clients. You'll create executive summaries, win themes, website content, and thought leadership articles.

Work Model:
• 8 hours per day, 6 days per week minimum
• Shift-based scheduling (24/7 operations)
• 100% remote work
• Hourly contractor position (1099 equivalent)

Application Process:
1. Submit resume and writing portfolio
2. AI-powered resume analysis
3. Conversational AI interview (15 minutes)
4. Writing assessment: GOVCON executive summary
5. Final decision within 5-7 business days`,
      requirements: `Education & Experience:
• Bachelor's degree in English, Communications, Journalism, or related field
• 5-7+ years professional copywriting experience
• Portfolio demonstrating GOVCON and/or B2B marketing work

Core Writing Expertise:
• Executive summary and value proposition development
• Win theme articulation and messaging strategy
• Technical content translation for executive audiences
• Persuasive narrative development
• SEO copywriting and content strategy

GOVCON-Specific Skills:
• Federal proposal writing (executive summaries, past performance, capabilities)
• Understanding of government evaluation criteria
• Ability to align copy with Section M scoring factors
• Experience with compliance constraints

Technical Proficiency:
• Excellent English grammar, spelling, and style
• Microsoft Word advanced features
• Content management systems
• Basic HTML/Markdown (preferred)

Work Requirements:
• Self-directed with excellent time management
• Comfortable with Time Doctor activity monitoring
• Available for assigned shifts (advance notice provided)
• Reliable internet connection and professional workspace`,
      responsibilities: `Primary Responsibilities:

GOVCON Proposal Copy (40%):
• Write compelling executive summaries for federal proposals
• Develop win themes and discriminators
• Craft past performance narratives with quantifiable results
• Write capability statements and corporate qualifications
• Create cover letters and transmittal documents

Marketing Content (35%):
• Write website copy for service pages and landing pages
• Develop thought leadership articles on GOVCON topics
• Create case studies showcasing successful proposals
• Write email campaigns for lead nurture
• Develop LinkedIn posts and social media content

Brand & Messaging (15%):
• Maintain consistent brand voice across all content
• Develop messaging frameworks for service offerings
• Ensure SEO optimization without sacrificing quality
• Edit and refine AI-generated content drafts

Collaboration (10%):
• Interview SMEs and executives to gather insights
• Incorporate feedback from stakeholders and clients
• Maintain content calendars and editorial schedules
• Track hours accurately using Time Doctor
• Submit drafts on agreed timelines

Performance Standards:
• 60%+ activity rate in Time Doctor (accounting for research/thinking time)
• Error-free, polished final copy
• On-brand messaging and tone
• Meeting all deadlines`,
      benefits: `Contractor Benefits:

Compensation:
• PKR 250-300/hour based on experience and portfolio
• Paid hourly for actual work performed
• Bi-weekly payment schedule

Work Arrangement:
• 100% remote from anywhere in Pakistan
• Shift-based scheduling (8hrs/day, 6 days/week minimum)
• Opportunity for additional hours during busy periods
• Time Doctor monitoring for transparent time tracking

Professional Development:
• Exposure to diverse GOVCON and marketing projects
• Work with experienced content strategists
• Build portfolio with federal agency work
• Develop expertise in high-demand niche

Career Path:
• Copywriter → Senior Copywriter → Content Strategist → Content Director
• Rate increases based on performance reviews (every 6 months)
• Potential transition to full-time role as company scales

Tools Provided:
• Access to AI writing assistants (GPT-4, Claude)
• Content research databases
• Project management and collaboration tools

Important Notes:
• This is a 1099 contractor position (not employment)
• No health insurance, paid leave, or traditional benefits
• Contractors responsible for own taxes and equipment
• Payment contingent on logged, approved hours`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    {
      title: 'Government Contracting Proposal Writer',
      slug: 'proposal-writer-govcon',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'GOVCON Proposal Writing',
      salary: 'PKR 200-300/hour based on experience',
      description: `Join Aliff Services as a Government Contracting Proposal Writer and become part of our CV Bank—a talent pool of validated professionals who power federal contract wins.

About This Role:
We're seeking experienced proposal writers who can craft winning responses to complex RFPs, RFIs, and sources sought.

Work Model:
• 8 hours per day, 6 days per week minimum
• Shift-based operations (24/7 availability)
• 100% remote work
• Hourly contractor position

Application Process:
1. Submit application and resume
2. AI-powered resume analysis (1-2 hours)
3. AI chat interview if qualified (15 minutes)
4. Skills validation assessment
5. Decision within 5-7 business days`,
      requirements: `Education & Experience:
• Bachelor's degree in English, Communications, Business, or related field
• 5-7 years professional proposal writing experience
• Proven track record with federal government contracting (GOVCON/SLED)
• Portfolio demonstrating RFP responses and win rates

Core Competencies:
• Expert knowledge of Federal Acquisition Regulations (FAR/DFARS)
• Deep understanding of Section L and Section M
• Proven ability to interpret complex solicitation requirements
• Experience with compliance matrices and proposal outlines
• Technical writing excellence with attention to detail

GOVCON Skills Required:
• RFP/RFI response development
• Proposal management and coordination
• Win theme development
• Compliance review and quality assurance
• Shipley Associates or APMP methodology (preferred)

Language & Communication:
• Native or near-native English proficiency
• Excellent written and verbal communication
• Ability to translate technical concepts for non-technical audiences
• Strong interviewing skills for SME input gathering

Work Requirements:
• Self-directed with excellent time management
• Comfortable with Time Doctor activity monitoring (70%+ active time)
• Able to meet tight deadlines under pressure
• Available for assigned shifts`,
      responsibilities: `Primary Responsibilities:

Proposal Development (60%):
• Analyze RFP requirements and develop compliant proposal outlines
• Write compelling technical volumes and executive summaries
• Develop win themes based on client strengths
• Create past performance narratives with quantifiable results
• Coordinate with technical SMEs to gather content
• Ensure strict compliance with Section L instructions

Quality & Compliance (25%):
• Conduct color team reviews (Pink, Red, Gold)
• Maintain compliance matrices throughout proposal lifecycle
• Perform quality assurance checks against Section M criteria
• Ensure consistent formatting, branding, and style
• Validate all claims against supporting documentation

Research & Strategy (15%):
• Research agency priorities and evaluation preferences
• Analyze competitors and market positioning
• Stay current on FAR/DFARS updates

Time Tracking & Reporting:
• Track billable hours accurately using Time Doctor
• Maintain 70%+ active time during logged hours
• Submit timely status updates to project leads
• Participate in team coordination meetings`,
      benefits: `Contractor Benefits:

Compensation:
• PKR 200-300/hour based on experience
• Paid hourly for logged, approved time
• Bi-weekly payment schedule

Work Arrangement:
• 100% remote from anywhere in Pakistan
• Shift-based scheduling (8hrs/day, 6 days/week minimum)
• Flexible within assigned shift times
• Time Doctor monitoring for activity tracking

Professional Development:
• Exposure to diverse federal proposals
• Work on high-stakes government contracts
• Build expertise in GOVCON niche
• Networking with experienced professionals

Career Path:
• Provider → Senior Provider → Lead → SME
• Rate increases based on performance (6-month reviews)
• Potential full-time transition as company grows

Tools Provided:
• AI-powered proposal tools
• Template libraries
• Collaboration platforms

Important Notes:
• 1099 contractor position (not employment)
• No traditional employee benefits
• Contractors handle own taxes and equipment
• Payment based on approved logged hours`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    {
      title: 'AI-Powered Full-Stack Web Developer',
      slug: 'full-stack-web-developer-ai',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Engineering',
      salary: 'PKR 250-300/hour based on expertise',
      description: `Join Aliff Services' engineering team as an AI-powered Full-Stack Web Developer.

About This Role:
Build production-ready web applications using cutting-edge AI development tools (GitHub Copilot, Claude Code, GPT-4). Develop internal tools, client dashboards, and proposal management systems.

Work Model:
• 8 hours per day, 6 days per week minimum
• Shift-based operations (24/7)
• 100% remote work
• Hourly contractor position

Tech Stack:
Next.js, React, TypeScript, Prisma, PostgreSQL, tRPC, Tailwind CSS

Application Process:
1. Submit resume with GitHub portfolio
2. AI-powered technical skills assessment
3. AI chat interview on development practices
4. Code challenge using AI tools
5. Decision within 5-7 business days`,
      requirements: `Education & Experience:
• Bachelor's degree in Computer Science or equivalent experience
• 2-4+ years professional full-stack development
• Strong GitHub portfolio with production applications
• Experience with AI development tools (Copilot, Claude, GPT-4)

Required Technical Skills:

Frontend:
• React.js and Next.js 14+ (App Router)
• TypeScript (strong typing, interfaces, generics)
• Tailwind CSS and component libraries
• State management (Context, Zustand, or Redux)
• Responsive design and accessibility

Backend:
• Node.js and server-side TypeScript
• Next.js API routes and server components
• RESTful APIs and tRPC
• Authentication (NextAuth.js, JWT)
• Database design and optimization

Database & ORM:
• PostgreSQL (queries, indexes, performance)
• Prisma ORM (schema, migrations, queries)
• Redis for caching (bonus)

DevOps:
• Git and GitHub workflows
• CI/CD pipelines (GitHub Actions)
• Vercel deployment
• Monitoring and error tracking

Work Requirements:
• Self-directed with strong time management
• Time Doctor monitoring (60%+ activity for developers)
• Available for assigned shifts
• Reliable internet and development environment`,
      responsibilities: `Core Responsibilities:

Feature Development (55%):
• Build features for ALIFF platform (CV Bank, dashboards, etc.)
• Implement responsive, accessible UI components
• Develop API endpoints and server-side logic
• Integrate with third-party services (OpenAI, etc.)
• Write database queries and optimize performance
• Ensure code quality with TypeScript strict mode

AI-Accelerated Development (20%):
• Leverage AI tools for rapid prototyping
• Generate boilerplate code, tests, and documentation
• Review and refine AI-generated code for production
• Share AI development best practices

Code Quality & Testing (15%):
• Write unit and integration tests
• Participate in code reviews
• Refactor for maintainability and performance
• Document code and architectural decisions

Collaboration (10%):
• Participate in sprint planning and stand-ups
• Communicate blockers and progress
• Support deployment and production monitoring
• Log hours accurately in Time Doctor

Performance Standards:
• Clean, production-ready code
• 60%+ activity rate (accounting for research/thinking)
• Responsive UI matching specifications
• Meeting sprint commitments`,
      benefits: `Contractor Benefits:

Compensation:
• PKR 250-300/hour based on experience
• Paid hourly for logged, approved time
• Bi-weekly payment schedule

Work Arrangement:
• 100% remote from anywhere
• Shift-based (8hrs/day, 6 days/week minimum)
• Time Doctor with developer-adjusted expectations (60%+ activity)

Professional Development:
• Work with modern tech stack (Next.js 14, React 19, TypeScript 5+)
• AI-first development workflow
• Exposure to enterprise architecture patterns
• Build portfolio with production applications

Career Path:
• Developer → Senior Developer → Tech Lead → Engineering Manager
• Rate increases every 6 months based on performance
• Potential full-time transition

Tools Provided:
• GitHub Copilot access
• AI development tools (GPT-4 API credits)
• Collaboration platforms

Important Notes:
• 1099 contractor position
• No traditional employee benefits
• Contractors handle taxes and own equipment
• Payment based on approved logged hours`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Mid-Level Positions (PKR 200-250/hour)
    {
      title: 'Graphic Designer - Proposal & Marketing',
      slug: 'graphic-designer-proposal-marketing',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Creative Services',
      salary: 'PKR 180-250/hour based on portfolio',
      description: `Join Aliff Services' creative team as a Graphic Designer specializing in government proposal graphics and marketing collateral.

About This Role:
Create compelling visual narratives for federal contract proposals. Design infographics, technical diagrams, and marketing materials that help win multi-million dollar contracts.

Work Model:
• 8 hours per day, 6 days per week minimum
• Shift-based operations
• 100% remote work
• Hourly contractor position

Application Process:
1. Submit resume and portfolio
2. AI-powered skills analysis
3. AI interview on design process
4. Design challenge: Proposal graphics sample
5. Decision within 5-7 business days`,
      requirements: `Education & Experience:
• Bachelor's degree in Graphic Design or related field
• 3-5+ years professional design experience
• Portfolio demonstrating proposal graphics and infographics
• Experience with government/technical design preferred

Design Skills Required:
• Expert proficiency in Adobe Creative Suite (InDesign, Illustrator, Photoshop)
• Advanced infographic design and data visualization
• Technical diagram creation (architecture, process flows)
• Layout design for formal documents
• Icon design and visual system development

GOVCON-Specific:
• Understanding of federal proposal formatting
• Section 508 accessibility compliance
• Government agency branding guidelines
• Color team review processes

Technical Proficiency:
• Microsoft Office Suite (PowerPoint, Word)
• Figma or Adobe XD
• PDF optimization
• Basic HTML/CSS (bonus)

Work Requirements:
• Self-directed with strong time management
• Time Doctor monitoring (70%+ active time)
• Available for assigned shifts
• Reliable internet and design workstation`,
      responsibilities: `Primary Responsibilities:

Proposal Graphics (60%):
• Design technical architecture diagrams
• Create process flows, system diagrams, network topologies
• Develop infographics translating complex data
• Build organizational charts and team structures
• Design timeline/Gantt charts
• Ensure Section 508 accessibility

Document Layout (25%):
• Design proposal templates
• Layout executive summaries and technical volumes
• Ensure consistent branding and visual hierarchy
• Optimize graphics for print and digital
• Prepare files meeting agency specifications

Collaboration (10%):
• Attend virtual kick-off meetings
• Collaborate with writers and SMEs
• Participate in color team reviews
• Maintain design asset libraries

Time Tracking (5%):
• Log design hours in Time Doctor
• Organize files with clear naming conventions
• Maintain version control
• Archive final deliverables

Performance Standards:
• 70%+ activity during logged hours
• 24-hour turnaround for initial concepts
• Adherence to brand and compliance requirements`,
      benefits: `Contractor Benefits:

Compensation:
• PKR 180-250/hour based on portfolio
• Paid hourly for logged, approved time
• Bi-weekly payment schedule

Work Arrangement:
• 100% remote from anywhere in Pakistan
• Shift-based (8hrs/day, 6 days/week minimum)
• Time Doctor monitoring

Professional Development:
• Work on high-profile federal proposals
• Build portfolio with measurable impact
• Exposure to enterprise design standards

Career Path:
• Designer → Senior Designer → Art Director → Creative Director
• Rate increases every 6 months
• Potential full-time transition

Tools Provided:
• Adobe Creative Cloud licenses
• Design collaboration tools
• Stock photo libraries

Important Notes:
• 1099 contractor position
• No traditional employee benefits
• Contractors handle taxes and equipment
• Payment based on approved hours`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    {
      title: 'Quality Assurance & Compliance Reviewer',
      slug: 'qa-compliance-reviewer',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Quality Assurance',
      salary: 'PKR 200-250/hour based on experience',
      description: `Aliff Services seeks meticulous QA & Compliance Reviewers to ensure government proposals meet all requirements.

About This Role:
Be the final safeguard ensuring proposals comply with RFP instructions, FAR/DFARS regulations, and agency requirements. Your attention to detail directly impacts win rates.

Work Model:
• 8 hours per day, 6 days per week minimum
• Shift-based operations
• 100% remote work
• Hourly contractor position

Application Process:
1. Submit resume highlighting QA/compliance background
2. AI credential verification
3. AI interview on compliance methodology
4. Assessment: Review sample proposal
5. Decision within 5-7 business days`,
      requirements: `Education & Background:
• Bachelor's degree in Business, Public Administration, or related field
• 3-5+ years experience in QA, compliance, or legal review
• GOVCON proposal experience preferred
• Paralegal certification (bonus)

Core Competencies:
• Expert knowledge of FAR/DFARS
• Deep understanding of Section L instructions
• Familiarity with Section M evaluation criteria
• Experience with compliance matrices
• Strong legal language comprehension

Compliance Skills:
• Compliance matrix development
• Requirements traceability
• Document version control
• Quality assurance processes
• Risk identification

Technical Proficiency:
• Microsoft Word advanced features
• PDF review tools (Adobe Acrobat Pro)
• Compliance tracking software
• Document comparison tools

Work Requirements:
• Exceptional attention to detail
• Methodical, process-oriented approach
• Self-directed time management
• Time Doctor monitoring (70%+ active)
• Available for assigned shifts`,
      responsibilities: `Primary Responsibilities:

Compliance Review (50%):
• Review proposals against RFP Section L
• Verify all required elements included
• Maintain compliance matrices
• Identify and document gaps
• Ensure formatting and page limits met
• Validate certifications

Quality Assurance (30%):
• Conduct final quality checks
• Verify consistency across volumes
• Check cross-references and page numbers
• Validate claims against past performance
• Ensure completeness of appendices
• Perform Section 508 checks

Risk Documentation (15%):
• Flag compliance risks
• Document findings with remediation guidance
• Escalate critical issues
• Track resolution
• Maintain audit trail

Coordination (5%):
• Participate in color team reviews
• Provide compliance briefings
• Log review hours in Time Doctor
• Submit status reports

Performance Standards:
• 70%+ activity during logged hours
• Zero non-compliance in final submissions
• Clear, actionable feedback`,
      benefits: `Contractor Benefits:

Compensation:
• PKR 200-250/hour based on experience
• Paid hourly for logged time
• Bi-weekly payment schedule

Work Arrangement:
• 100% remote from anywhere
• Shift-based (8hrs/day, 6 days/week minimum)
• Time Doctor monitoring

Professional Development:
• FAR/DFARS training support
• Access to compliance databases
• Mentorship from senior experts
• Government contracting law education

Career Path:
• Reviewer → Senior Reviewer → Lead Compliance → Quality Director
• Rate increases every 6 months
• Potential full-time transition

Tools Provided:
• Time Doctor tracking
• AI compliance checking tools
• Document comparison software

Important Notes:
• 1099 contractor position
• No traditional employee benefits
• Contractors handle taxes
• Payment based on approved hours`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Entry/Junior Level (PKR 120-200/hour)
    {
      title: 'Junior Proposal Writer - Training Program',
      slug: 'junior-proposal-writer-training',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'GOVCON Proposal Writing',
      salary: 'PKR 150-200/hour with growth path',
      description: `Launch your GOVCON career with Aliff's structured training program for junior proposal writers.

About This Role:
Learn federal proposal writing from experienced professionals. Start with editing and research, gradually advance to full proposal sections.

Work Model:
• 8 hours per day, 6 days per week minimum
• Shift-based operations
• 100% remote work
• Hourly contractor with rapid advancement

Training Path:
Months 1-3: Foundation (PKR 150/hour)
Months 4-6: Assisted Writing (PKR 175/hour)
Months 7-12: Independent Writing (PKR 200/hour)
Year 2+: Mid-level promotion (PKR 250-300/hour)

Application Process:
1. Submit resume highlighting writing experience
2. AI writing assessment
3. AI interview on learning approach
4. Writing sample: Edit proposal text
5. Decision within 5-7 business days`,
      requirements: `Education:
• Master's degree in English, Communications, or related field (required)
• Fresh graduates or up to 2 years experience
• Strong academic writing background
• Interest in government contracting

Writing Fundamentals:
• Excellent English grammar and composition
• Strong research and analytical skills
• Clear, concise writing style
• Attention to detail
• Ability to follow style guides

Desired Qualities:
• Eagerness to learn GOVCON
• Receptive to feedback
• Strong work ethic
• Self-motivated
• Commitment to professional development

Technical Skills:
• Microsoft Word proficiency
• Basic Excel and PowerPoint
• Cloud collaboration tools
• Willingness to learn proposal software

Work Requirements:
• Self-directed time management
• Time Doctor monitoring (70%+ active)
• Available for assigned shifts
• Commitment to training program`,
      responsibilities: `Training Program Phases:

Phase 1: Foundation (Months 1-3):
• Study GOVCON fundamentals
• Review winning proposals
• Edit and proofread sections
• Research industry trends
• Create compliance matrices
• Shadow senior writers
• Complete training modules

Phase 2: Assisted Writing (Months 4-6):
• Draft past performance descriptions
• Write capability statements
• Develop sections with guidance
• Create resumes and org charts
• Observe color team reviews
• Interview SMEs

Phase 3: Independent Writing (Months 7-12):
• Own complete proposal sections
• Write executive summaries
• Develop win themes
• Lead past performance narratives
• Conduct SME interviews independently
• Participate in color team reviews

Daily Responsibilities:
• Attend training sessions (paid)
• Complete writing assignments
• Incorporate feedback
• Track learning progress
• Log hours in Time Doctor
• Participate in team meetings

Performance Standards:
• 70%+ Time Doctor activity
• Responsive communication (24 hours)
• Consistent training participation
• Openness to feedback`,
      benefits: `Training Program Benefits:

Structured Growth:
• Start: PKR 150/hour (Months 1-3)
• Grow: PKR 175/hour (Months 4-6)
• Advance: PKR 200/hour (Months 7-12)
• Promote: PKR 250-300/hour (Mid-level at 12-18 months)

Comprehensive Training:
• GOVCON curriculum (FAR, DFARS, proposal management)
• One-on-one mentorship
• Weekly coaching sessions
• Library of winning proposals
• Certification prep support

Work Arrangement:
• 100% remote training and work
• Initial 15-25 hours/week
• Grow to full-time equivalent
• Time Doctor tracking (training hours paid)

Career Fast-Track:
Junior → Mid-Level → Senior → Lead (2-3 years)

Clear advancement criteria:
• Defined skill milestones
• Portfolio of completed proposals
• Demonstrated GOVCON mastery
• Positive feedback

Tools Provided:
• AI writing assistants
• Proposal software training
• Template library
• Collaboration platforms

Important Notes:
• 1099 contractor position
• Training hours are paid
• No traditional benefits
• Contractors handle taxes
• Payment based on approved hours`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    {
      title: 'Social Media Manager - B2B GOVCON',
      slug: 'social-media-manager-govcon',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Marketing',
      salary: 'PKR 150-200/hour based on results',
      description: `Join Aliff as Social Media Manager specializing in B2B GOVCON outreach.

About This Role:
Build Aliff's presence on LinkedIn and B2B platforms. Engage federal contractors, government decision-makers, and GOVCON professionals.

Work Model:
• 8 hours per day, 6 days per week minimum
• Shift-based operations
• 100% remote work
• Hourly contractor position

Application Process:
1. Submit resume with social media portfolio and metrics
2. AI analysis of expertise
3. AI interview on B2B social strategy
4. Content challenge: LinkedIn campaign
5. Decision within 5-7 business days`,
      requirements: `Education & Experience:
• Bachelor's degree in Marketing or Communications
• 2-4+ years social media marketing experience
• B2B social media success (portfolio required)
• GOVCON sector experience preferred

Platform Expertise:
• LinkedIn (primary): Company pages, thought leadership, sponsored content
• Twitter/X: Engagement and community
• Facebook: Group management
• YouTube: Video strategy (bonus)

Core Skills:
• Content calendar development
• Community engagement
• Social listening
• Influencer outreach
• Crisis management
• Analytics and reporting

B2B & GOVCON-Specific:
• Understanding of government contracting
• GOVCON terminology and pain points
• B2B lead generation
• Professional network building
• C-suite engagement etiquette

Content Creation:
• Social copywriting
• Visual content (Canva, Adobe Express)
• Video editing basics
• Infographic design
• Hashtag strategy

Work Requirements:
• Self-directed time management
• Time Doctor monitoring (60%+ activity)
• Available for assigned shifts
• Daily engagement commitment`,
      responsibilities: `Primary Responsibilities:

Content Strategy (40%):
• Develop monthly content calendars
• Create daily LinkedIn posts
• Write thought leadership content
• Design visual content
• Curate industry news
• Develop campaign narratives

Community Management (25%):
• Engage with followers daily
• Build GOVCON influencer relationships
• Monitor brand mentions
• Respond to inquiries
• Foster LinkedIn group discussions
• Manage online reputation

Paid Social Campaigns (20%):
• Develop LinkedIn sponsored content
• Create ad creative and copy
• Set up targeting and campaigns
• Monitor and optimize performance
• Manage ad budget
• Report on ROI

Analytics (10%):
• Track engagement, reach, leads
• Prepare monthly reports
• Analyze competitor strategies
• Identify optimization opportunities
• Test content formats
• Provide recommendations

Time Tracking (5%):
• Log hours in Time Doctor
• Coordinate with content team
• Maintain content asset library

Performance Standards:
• 60%+ Time Doctor activity
• Daily engagement and monitoring
• Weekly content publication
• Monthly reporting`,
      benefits: `Contractor Benefits:

Compensation:
• PKR 150-200/hour based on experience
• Paid hourly for logged time
• Bi-weekly payment schedule

Work Arrangement:
• 100% remote from anywhere
• Shift-based (8hrs/day, 6 days/week minimum)
• Time Doctor monitoring (60%+ for creators)

Professional Development:
• Social media marketing courses
• B2B and GOVCON strategy training
• Conference attendance opportunities
• Portfolio building

Career Path:
• SMM → Senior SMM → Social Media Manager → Marketing Director
• Rate increases every 6 months
• Full-time transition potential

Tools Provided:
• Social media management tools (Hootsuite, Buffer)
• Graphic design software (Canva Pro)
• Analytics platforms
• AI content generation tools

Important Notes:
• 1099 contractor position
• No traditional benefits
• Contractors handle taxes
• Payment based on approved hours`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Expert Level (PKR 300-400/hour)
    {
      title: 'Technical SME - Federal IT Solutions',
      slug: 'technical-sme-federal-it',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Technical Services',
      salary: 'PKR 300-350/hour for expert-level',
      description: `Aliff seeks Technical Subject Matter Experts (SMEs) for federal IT proposal development.

About This Role:
Provide critical technical expertise for federal IT proposals across cybersecurity, cloud, DevSecOps, and data analytics. Your knowledge influences multi-million dollar contract wins.

Work Model:
• 8 hours per day, 6 days per week minimum
• Shift-based operations
• 100% remote work
• Expert hourly compensation

Application Process:
1. Submit resume with technical credentials
2. AI skills extraction and matching
3. AI interview on technical depth
4. Domain-specific assessment
5. Decision within 5-7 business days`,
      requirements: `Education & Credentials:
• Bachelor's in Computer Science or Engineering (Master's/PhD preferred)
• 8-10+ years hands-on federal IT experience
• Active security clearance preferred (Secret, TS, TS/SCI)
• Industry certifications (CISSP, CISM, AWS/Azure, PMP)

Core Technical Domains (Select Your Specialty):

Cybersecurity:
• NIST frameworks (800-53, CSF), RMF, ATO
• Zero Trust Architecture, SASE
• Threat intelligence, SIEM/SOAR
• FedRAMP, FISMA, CMMC

Cloud & Infrastructure:
• AWS GovCloud, Azure Government
• Infrastructure as Code (Terraform)
• Container orchestration (Kubernetes)
• Hybrid/multi-cloud architectures

DevSecOps:
• CI/CD pipeline design
• Security automation
• Configuration management
• Monitoring and observability

Data & AI/ML:
• Big Data platforms
• Data lakes and governance
• ML model deployment
• Data privacy compliance

GOVCON Skills:
• Federal IT contract experience
• Understanding of acquisition requirements
• Past performance on federal contracts
• Agency-specific standards

Work Requirements:
• Expert-level communication
• Proposal writing experience
• Self-directed time management
• Time Doctor monitoring (70%+ active)
• Available for assigned shifts`,
      responsibilities: `Core Responsibilities:

Technical Solution Development (50%):
• Design compliant architectures for RFPs
• Develop technical approach narratives
• Create system diagrams and models
• Define technical requirements
• Perform risk analysis
• Ensure agency standards alignment

Proposal Technical Content (30%):
• Author technical volumes (Volume II)
• Write technical white papers
• Develop past performance descriptions
• Support oral presentations
• Support pricing with estimates
• Respond to evaluator questions

SME Collaboration (15%):
• Guide proposal writers
• Review technical content
• Participate in color team reviews
• Interview other SMEs
• Bridge technical and proposal teams
• Ensure solution feasibility

Time Tracking (5%):
• Log hours in Time Doctor
• Maintain documentation
• Participate in planning sessions
• Provide status updates
• Coordinate with other SMEs

Performance Standards:
• 70%+ activity during logged hours
• Responsive within 4 hours
• Meet technical content deadlines
• Available for proposal crunch times`,
      benefits: `Expert-Level Benefits:

Premium Compensation:
• PKR 300-350/hour based on expertise
• Paid hourly for logged time
• Bi-weekly payment schedule

Work Arrangement:
• 100% remote with async collaboration
• Shift-based (8hrs/day, 6 days/week minimum)
• Project-based engagement
• Time Doctor monitoring

Technical Growth:
• AWS, Azure, Google Cloud training credits
• Certification reimbursement
• Continuous learning stipend
• Mentorship opportunities

Career Path:
• SME → Lead SME → Solution Architect → Technical Director
• Rate increases every 6 months
• Full-time CTO-level potential

Tools Provided:
• Cloud platform access
• Technical documentation tools
• Collaboration platforms

Important Notes:
• 1099 contractor position
• No traditional benefits
• Contractors handle taxes
• Payment based on approved hours`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    {
      title: 'Data Entry Specialist - CV Bank Processing',
      slug: 'data-entry-specialist-cv-bank',
      type: JobType.PART_TIME,
      location: JobLocation.REMOTE,
      department: 'Operations',
      salary: 'PKR 120-150/hour based on accuracy',
      description: `Join Aliff's operations team as a Data Entry Specialist for CV Bank processing.

About This Role:
Process candidate applications, verify information, and maintain our CV Bank database. Perfect for detail-oriented individuals seeking part-time remote work.

Work Model:
• 4-6 hours per day, 6 days per week
• Shift-based operations
• 100% remote work
• Part-time hourly position

Application Process:
1. Submit resume
2. Typing speed test (minimum 50 WPM)
3. Data accuracy assessment
4. AI interview on attention to detail
5. Decision within 5-7 business days`,
      requirements: `Education:
• High school diploma or equivalent
• Some college preferred
• No specific degree required

Core Skills:
• Typing speed: 50+ WPM with 98%+ accuracy
• Exceptional attention to detail
• Basic computer literacy
• Data entry experience (1-2 years)
• Familiarity with databases

Technical Proficiency:
• Microsoft Excel proficiency
• Google Sheets
• CRM systems (basic)
• PDF form filling
• Data validation

Language:
• Good English reading comprehension
• Basic written communication
• Ability to follow instructions

Work Requirements:
• Highly detail-oriented
• Methodical and patient
• Self-directed
• Time Doctor monitoring (80%+ active for data entry)
• Available for assigned shifts
• Reliable internet connection`,
      responsibilities: `Primary Responsibilities:

Data Entry (70%):
• Process candidate applications
• Enter resume information into database
• Verify contact details
• Update candidate profiles
• Tag skills and experience
• Maintain data accuracy

Quality Assurance (15%):
• Double-check entries for accuracy
• Verify data completeness
• Flag inconsistencies
• Correct errors
• Validate email addresses
• Ensure standardized formatting

File Management (10%):
• Organize resume files
• Rename documents per conventions
• Archive processed applications
• Maintain folder structure
• Backup important files

Reporting (5%):
• Log hours in Time Doctor
• Track daily processing volume
• Report issues or blockers
• Submit accuracy metrics
• Participate in team check-ins

Performance Standards:
• 80%+ activity in Time Doctor
• 98%+ data accuracy rate
• Minimum 50 applications/day processed
• Meeting quality benchmarks`,
      benefits: `Part-Time Contractor Benefits:

Compensation:
• PKR 120-150/hour based on accuracy metrics
• Paid hourly for logged time
• Bi-weekly payment schedule

Work Arrangement:
• 100% remote from anywhere
• Part-time: 4-6 hours/day, 6 days/week
• Flexible shift options
• Time Doctor monitoring

Skill Development:
• Database management experience
• CRM system training
• Data quality best practices
• Process optimization exposure

Career Path:
• Data Entry Specialist → Senior Specialist → Data Coordinator → Operations Manager
• Rate increases based on accuracy and speed
• Potential full-time opportunities

Tools Provided:
• CRM system access
• Database tools
• Collaboration platforms

Important Notes:
• 1099 contractor position
• No traditional benefits
• Contractors handle taxes
• Payment based on approved hours
• Accuracy-based performance reviews`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },
  ];

  console.log(`Creating ${jobs.length} job postings...`);

  for (const jobData of jobs) {
    try {
      const job = await prisma.jobPosting.create({
        data: jobData,
      });
      console.log(`Created: ${job.title}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`Skipped (already exists): ${jobData.title}`);
      } else {
        console.error(`Error creating ${jobData.title}:`, error);
      }
    }
  }

  console.log('\nJob postings completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
