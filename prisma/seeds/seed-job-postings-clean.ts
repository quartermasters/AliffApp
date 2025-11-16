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
