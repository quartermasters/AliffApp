/**
 * Seed Job Postings for ALIFF-RECRUITER
 *
 * 9 job postings adapted from existing careers.php with ALIFF-RECRUITER enhancements:
 * - Hourly provider model language
 * - PKR compensation ranges
 * - AI chat interview mentions
 * - Time Doctor tracking
 * - CV Bank references
 * - Career advancement paths
 */

import { PrismaClient, JobType, JobLocation, JobStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding ALIFF-RECRUITER job postings...');

  // Get or create a super admin user for job posting creator
  let adminUser = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (!adminUser) {
    console.log('Creating default super admin user for job postings...');
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
    // Job 1: Proposal Writer
    {
      title: 'Government Contracting Proposal Writer',
      slug: 'proposal-writer-govcon',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'GOVCON Proposal Writing',
      salary: 'PKR 3,000-6,000/hour (competitive rates based on experience)',
      description: `Join Aliff Services as a Government Contracting Proposal Writer and become part of our strategic CV Bank—an elite talent pool of validated professionals who power federal contract wins.

**About This Role:**
We're seeking experienced proposal writers who can craft winning responses to complex RFPs, RFIs, and sources sought. This is a provider-based opportunity with flexible hourly engagement, perfect for seasoned professionals who want autonomy while contributing to high-impact government contracting projects.

**Why Join Aliff's CV Bank:**
✅ Flexible hourly engagement—work on projects that match your expertise
✅ Competitive PKR hourly rates with performance-based increases
✅ Remote-first culture with global collaboration
✅ Access to cutting-edge AI tools and proposal management systems
✅ Clear career advancement path from Provider → Lead → Subject Matter Expert
✅ Performance tracking via Time Doctor for transparent billing
✅ Join a community of elite GOVCON professionals

**The ALIFF-RECRUITER Experience:**
Our hiring process is designed for efficiency and fairness:
1. Submit your application and resume
2. AI-powered resume analysis (instant feedback on fit)
3. Conversational AI chat interview (at your convenience)
4. Skills validation assessment
5. Human expert review for top candidates
6. Welcome to the CV Bank!

Candidates scoring 75+ in our screening automatically advance to the CV Bank and interview stages.`,
      requirements: `**Education & Experience:**
• Bachelor's degree in English, Communications, Business, or related field (Master's preferred but not required)
• 5-7 years of professional proposal writing experience
• Proven track record with federal government contracting (GOVCON/SLED)
• Portfolio demonstrating successful RFP responses and win rates

**Core Competencies:**
• Expert knowledge of Federal Acquisition Regulations (FAR/DFARS)
• Deep understanding of Section L (Instructions) and Section M (Evaluation Criteria)
• Proven ability to interpret complex solicitation requirements
• Experience with compliance matrices and proposal outlines
• Strong past performance narrative development
• Technical writing excellence with attention to detail

**GOVCON Skills Required:**
• RFP/RFI response development
• Proposal management and coordination
• Win theme development
• Compliance review and quality assurance
• Shipley Associates or APMP methodology (preferred)
• Experience with proposal management software

**Language & Communication:**
• Native or near-native English proficiency
• Excellent written and verbal communication
• Ability to translate technical concepts for non-technical audiences
• Strong interviewing skills for SME input gathering

**Work Style:**
• Self-directed with excellent time management
• Comfortable with Time Doctor activity monitoring for hourly billing
• Able to meet tight deadlines under pressure
• Collaborative mindset for virtual team environments
• Proven ability to manage multiple concurrent proposals`,
      responsibilities: `**Primary Responsibilities:**

**Proposal Development (60% of role):**
• Analyze RFP requirements and develop compliant proposal outlines
• Write compelling technical volumes and executive summaries
• Develop win themes and discriminators based on client strengths
• Create past performance narratives with quantifiable results
• Coordinate with technical SMEs to gather and integrate content
• Ensure strict compliance with Section L instructions

**Quality & Compliance (25% of role):**
• Conduct color team reviews (Pink, Red, Gold)
• Maintain compliance matrices throughout proposal lifecycle
• Perform quality assurance checks against Section M criteria
• Ensure consistent formatting, branding, and style
• Validate all claims against supporting documentation
• Final proofreading and editing before submission

**Research & Strategy (15% of role):**
• Research agency priorities and evaluation preferences
• Analyze competitors and market positioning
• Contribute to capture planning and BD efforts
• Stay current on FAR/DFARS updates and acquisition trends
• Participate in lessons learned and continuous improvement

**Time Tracking & Reporting:**
• Track billable hours accurately using Time Doctor
• Maintain activity levels meeting company standards (70%+ active time)
• Submit timely status updates to project leads
• Document research sources and writing iterations
• Participate in weekly virtual stand-ups`,
      benefits: `**Provider Benefits & Perks:**

**Compensation & Growth:**
💰 Competitive PKR 3,000-6,000/hour based on experience and performance
📈 Performance-based rate increases every 6 months
🎯 Bonus opportunities for high-performing proposals and client wins
💼 Access to premium GOVCON training and certifications

**Work Flexibility:**
🌍 100% remote work—collaborate from anywhere in Pakistan
⏰ Flexible scheduling (core collaboration hours required)
🏖️ Project-based engagement—control your workload
📱 Modern tech stack with AI-powered proposal tools

**Career Development:**
🚀 Clear advancement path: Provider → Senior Provider → Lead → SME
📚 Access to Shipley Associates training and APMP certification prep
🤝 Mentorship from seasoned GOVCON proposal managers
🏆 Recognition program for exceptional performance

**Community & Support:**
👥 Join Aliff's exclusive CV Bank of elite GOVCON talent
💬 Slack community for peer collaboration and knowledge sharing
🎓 Monthly webinars on proposal best practices
🌟 Opportunity to build long-term client relationships

**Transparency & Fair Treatment:**
⏱️ Time Doctor tracking ensures accurate compensation
📊 Real-time performance dashboards
✅ Clear expectations and objective evaluation criteria
🤖 AI-assisted quality reviews for consistent feedback

**Future Opportunities:**
As you prove your capabilities, you'll gain access to:
• Higher-value strategic proposals
• Lead writer roles on complex bids
• Capture planning and BD involvement
• Training delivery for junior providers
• Potential transition to full-time leadership roles`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Job 2: Technical Subject Matter Expert
    {
      title: 'Technical Subject Matter Expert (SME) - Federal IT',
      slug: 'technical-sme-federal-it',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Technical Services',
      salary: 'PKR 4,000-8,000/hour (expert-level compensation)',
      description: `Aliff Services seeks seasoned Technical Subject Matter Experts (SMEs) to join our strategic CV Bank and support federal IT proposal development. This provider role offers flexible hourly engagement for experts who can translate complex technical solutions into winning proposal narratives.

**About This Opportunity:**
As a Technical SME in our CV Bank, you'll provide critical technical expertise for federal IT proposals across domains like cybersecurity, cloud infrastructure, enterprise architecture, DevSecOps, and data analytics. Your deep technical knowledge will directly influence multi-million dollar contract wins.

**Why Join as a Provider:**
✅ Premium hourly rates (PKR 4,000-8,000/hour) reflecting your expertise
✅ Work only on projects matching your technical specialization
✅ Remote engagement with flexible scheduling around your commitments
✅ Collaborate with elite GOVCON teams on high-impact federal contracts
✅ Career path: SME → Lead SME → Solution Architect → Technical Director
✅ Transparent time tracking via Time Doctor
✅ Access to cutting-edge proposal development tools and AI assistants

**ALIFF-RECRUITER Process:**
Our AI-powered hiring identifies technical excellence efficiently:
1. Submit resume highlighting technical credentials and clearances
2. Automated skills extraction and domain matching
3. AI chat interview focused on technical depth
4. Domain-specific technical assessment
5. Expert validation and CV Bank onboarding

Top performers (75+ screening score) fast-track to interviews and CV Bank entry.`,
      requirements: `**Education & Credentials:**
• Bachelor's degree in Computer Science, Engineering, or related field (Master's/PhD preferred for specialized roles)
• 8-10+ years of hands-on technical experience in federal IT environments
• Active security clearance (Secret, Top Secret, or TS/SCI preferred)
• Industry certifications highly valued (CISSP, CISM, AWS/Azure certs, PMP, etc.)

**Core Technical Expertise (Select Your Domain):**

**Cybersecurity:**
• NIST frameworks (800-53, CSF), RMF, ATO processes
• Zero Trust Architecture, SASE, secure cloud implementations
• Threat intelligence, SIEM/SOAR, incident response
• FedRAMP, FISMA, CMMC compliance

**Cloud & Infrastructure:**
• AWS GovCloud, Azure Government, Google Cloud
• Infrastructure as Code (Terraform, CloudFormation)
• Container orchestration (Kubernetes, Docker, ECS)
• Hybrid/multi-cloud architectures

**DevSecOps & Automation:**
• CI/CD pipeline design (Jenkins, GitLab, GitHub Actions)
• Security automation and policy-as-code
• Configuration management (Ansible, Puppet, Chef)
• Monitoring and observability (Prometheus, Grafana, ELK)

**Data & AI/ML:**
• Big Data platforms (Hadoop, Spark, Kafka)
• Data lakes, warehouses, and governance
• Machine learning model deployment
• Data privacy and security (GDPR, CCPA compliance)

**GOVCON-Specific Skills:**
• Experience with federal IT contract vehicles (GSA Schedules, SEWP, etc.)
• Understanding of federal acquisition and compliance requirements
• Past performance on federal contracts (demonstrable wins)
• Familiarity with agency-specific technical standards (DoD, DHS, VA, etc.)

**Communication Requirements:**
• Excellent English writing for technical narratives
• Ability to explain complex architectures to non-technical audiences
• Experience developing technical volumes for proposals
• Strong presentation skills for oral proposal support`,
      responsibilities: `**Core Responsibilities:**

**Technical Solution Development (50%):**
• Design compliant technical architectures for federal IT RFPs
• Develop technical approach narratives and solution descriptions
• Create system diagrams, data flow charts, and architecture models
• Define technical requirements and acceptance criteria
• Perform technical risk analysis and mitigation planning
• Ensure alignment with agency technical standards and mandates

**Proposal Technical Content (30%):**
• Author technical volumes (Volume II) for federal proposals
• Write technical white papers and solution overviews
• Develop past performance descriptions highlighting technical wins
• Contribute to oral proposal presentations and demonstrations
• Support pricing teams with technical basis of estimates
• Respond to technical questions from evaluators

**SME Collaboration (15%):**
• Provide technical guidance to proposal writers
• Review and validate technical content for accuracy
• Participate in color team reviews (technical focus)
• Interview other SMEs to gather domain expertise
• Bridge communication between engineers and proposal teams
• Ensure technical feasibility of proposed solutions

**Time Tracking & Coordination (5%):**
• Log hours accurately in Time Doctor during active work
• Maintain documentation of technical research and sources
• Participate in virtual technical planning sessions
• Provide status updates to proposal managers
• Coordinate with other SMEs on integrated solutions

**Expected Activity:**
• 70%+ activity rate during logged hours (Time Doctor monitoring)
• Responsive communication within 4 hours during business days
• Meet interim deadlines for technical content delivery
• Available for proposal crunch times (with advance notice)`,
      responsibilities: `**Core Responsibilities:**

**Technical Solution Development (50%):**
• Design compliant technical architectures for federal IT RFPs
• Develop technical approach narratives and solution descriptions
• Create system diagrams, data flow charts, and architecture models
• Define technical requirements and acceptance criteria
• Perform technical risk analysis and mitigation planning
• Ensure alignment with agency technical standards and mandates

**Proposal Technical Content (30%):**
• Author technical volumes (Volume II) for federal proposals
• Write technical white papers and solution overviews
• Develop past performance descriptions highlighting technical wins
• Contribute to oral proposal presentations and demonstrations
• Support pricing teams with technical basis of estimates
• Respond to technical questions from evaluators

**SME Collaboration (15%):**
• Provide technical guidance to proposal writers
• Review and validate technical content for accuracy
• Participate in color team reviews (technical focus)
• Interview other SMEs to gather domain expertise
• Bridge communication between engineers and proposal teams
• Ensure technical feasibility of proposed solutions

**Time Tracking & Coordination (5%):**
• Log hours accurately in Time Doctor during active work
• Maintain documentation of technical research and sources
• Participate in virtual technical planning sessions
• Provide status updates to proposal managers
• Coordinate with other SMEs on integrated solutions

**Expected Activity:**
• 70%+ activity rate during logged hours (Time Doctor monitoring)
• Responsive communication within 4 hours during business days
• Meet interim deadlines for technical content delivery
• Available for proposal crunch times (with advance notice)`,
      benefits: `**Expert-Level Provider Benefits:**

**Premium Compensation:**
💰 PKR 4,000-8,000/hour based on expertise, clearance level, and specialization
🎖️ Clearance bonuses: +20% for TS/SCI, +10% for Top Secret
🏆 Performance bonuses for proposal wins (up to 15% of hours worked)
📈 Bi-annual rate reviews with performance-based increases

**Technical Growth:**
🚀 Access to AWS, Azure, Google Cloud training credits
🎓 Certification reimbursement (CISSP, CISM, cloud certs, etc.)
📚 Continuous learning stipend for technical courses
🤝 Mentorship opportunities with federal CTO-level experts

**Work Flexibility:**
🌍 100% remote with asynchronous collaboration
⏰ Project-based engagement—select projects matching your expertise
🏖️ Control your availability and workload
💼 Work with multiple federal agencies across domains

**Career Advancement:**
Technical SME → Lead Technical SME → Solution Architect → Technical Director → CTO-level roles

Each level unlocks:
• Higher hourly rates and priority project selection
• Leadership roles in capture and business development
• Opportunity to mentor junior SMEs
• Potential equity participation in major wins

**Community & Prestige:**
🏅 Join Aliff's exclusive technical expert community
💬 Private Slack channels for domain-specific collaboration
🎤 Opportunity to present at GOVCON conferences
📝 Publish technical articles and thought leadership
🌟 Build reputation as a federal IT subject matter authority

**Transparency & Support:**
⏱️ Time Doctor ensures accurate billing and activity validation
📊 Real-time dashboards showing your performance metrics
✅ Objective technical evaluation criteria
🤖 AI writing assistants to accelerate proposal development
🛡️ Legal and compliance support for complex proposals

**Long-Term Opportunities:**
• Transition to capture planning and technical strategy
• Lead architect roles on $100M+ proposals
• Business development collaboration with equity upside
• Full-time leadership positions as company scales`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Job 3: Graphic Designer
    {
      title: 'Graphic Designer - Proposal & Marketing',
      slug: 'graphic-designer-proposal',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Creative Services',
      salary: 'PKR 2,000-4,000/hour (based on portfolio and experience)',
      description: `Join Aliff Services' creative team as a Graphic Designer specializing in government proposal graphics, infographics, and marketing collateral. This flexible provider role lets you leverage your design expertise for high-stakes federal contract proposals.

**About the Role:**
Create compelling visual narratives that help win multi-million dollar federal contracts. You'll design everything from technical architecture diagrams to executive-level infographics, ensuring proposals stand out while maintaining strict government compliance.

**Provider Model Benefits:**
✅ Hourly engagement (PKR 2,000-4,000/hour) with project flexibility
✅ Build portfolio with prestigious federal agency work
✅ Remote work with async collaboration
✅ Creative freedom within GOVCON compliance guidelines
✅ Career growth: Designer → Senior Designer → Creative Director
✅ Time Doctor tracking for transparent billing

**Our Hiring Process:**
1. Portfolio submission with GOVCON/technical design samples
2. AI-powered resume and skills analysis
3. AI chat interview about design process and tools
4. Design challenge: Create sample proposal graphics
5. Expert portfolio review and CV Bank onboarding

High scorers (75+) advance immediately to interview and talent pool.`,
      requirements: `**Education & Experience:**
• Bachelor's degree in Graphic Design, Visual Communication, or related field
• 3-5+ years professional design experience (government/technical design preferred)
• Strong portfolio demonstrating proposal graphics, infographics, and technical diagrams
• Experience with brand guidelines and compliance requirements

**Design Skills Required:**
• Expert proficiency in Adobe Creative Suite (InDesign, Illustrator, Photoshop)
• Advanced infographic design and data visualization
• Technical diagram creation (architecture, process flows, organizational charts)
• Layout design for formal government documents
• Icon design and visual system development
• Print production and file preparation

**GOVCON-Specific Experience:**
• Understanding of federal proposal formatting requirements
• Experience with Section 508 accessibility compliance
• Knowledge of government agency branding guidelines
• Familiarity with color team review processes
• Ability to work within strict compliance constraints while maintaining visual appeal

**Technical Proficiency:**
• Microsoft Office Suite (PowerPoint, Word) for proposal templates
• Collaboration tools (Figma, Miro, Adobe XD)
• File management and version control
• PDF optimization for large document submissions
• Basic HTML/CSS for digital deliverables (bonus)

**Communication & Collaboration:**
• Excellent English communication (written and verbal)
• Ability to interpret feedback from technical SMEs and writers
• Strong presentation skills for design rationale
• Comfortable with virtual collaboration and time zone coordination
• Responsive to tight deadlines and last-minute changes`,
      responsibilities: `**Primary Responsibilities:**

**Proposal Graphics Development (60%):**
• Design technical architecture diagrams for federal IT proposals
• Create process flow charts, system diagrams, and network topologies
• Develop infographics translating complex data into visual stories
• Design organizational charts and team structure graphics
• Build timeline/Gantt charts and project management visuals
• Ensure all graphics meet Section 508 accessibility standards

**Document Layout & Production (25%):**
• Design proposal templates compliant with RFP requirements
• Layout executive summaries, technical volumes, and past performance
• Ensure consistent branding, typography, and visual hierarchy
• Optimize graphics for print and digital submission
• Prepare final production files meeting agency specifications
• Coordinate with print vendors for physical proposal delivery

**Collaboration & Iteration (10%):**
• Attend virtual kick-off meetings to understand requirements
• Collaborate with writers and SMEs to visualize content
• Participate in color team reviews and incorporate feedback
• Maintain design asset libraries and template repositories
• Create style guides for consistent visual identity

**Time Tracking & File Management (5%):**
• Log design hours accurately in Time Doctor
• Organize design files with clear naming conventions
• Maintain version control for all graphics
• Archive final deliverables with editable source files
• Document design decisions and rationale

**Expected Standards:**
• 70%+ activity rate during logged design hours
• 24-hour turnaround for initial concepts (rush projects)
• Unlimited revisions until approval (within scope)
• Adherence to brand guidelines and compliance requirements`,
      benefits: `**Creative Provider Benefits:**

**Compensation & Growth:**
💰 PKR 2,000-4,000/hour based on portfolio strength and experience
🎨 Project bonuses for exceptional creative work
📈 Rate increases tied to skill development and client satisfaction
🏆 Performance bonuses when proposals win

**Portfolio Building:**
🏅 Work on high-profile federal agency proposals (DoD, DHS, VA, etc.)
📊 Design for Fortune 500 companies competing for GOVCON contracts
🌟 Build portfolio pieces with measurable impact ($M contract wins)
🎓 Case study development support for your professional growth

**Work Flexibility:**
🌍 100% remote work from anywhere in Pakistan
⏰ Flexible hours with project-based deadlines
🏖️ Control your workload and project selection
💼 Balance multiple clients and personal projects

**Creative Development:**
🚀 Access to Adobe Creative Cloud licenses (company-provided)
📚 Training budget for design courses and certifications
🤝 Mentorship from senior GOVCON creative directors
🎤 Opportunity to present at design and GOVCON conferences

**Career Advancement Path:**
Graphic Designer → Senior Designer → Art Director → Creative Director

Each level includes:
• Higher hourly rates and priority project access
• Leadership on larger proposal teams
• Strategy involvement in capture planning
• Potential equity in major contract wins

**Community & Recognition:**
👥 Join Aliff's creative professional community
💬 Design critique sessions and skill-sharing workshops
🏆 Monthly showcase of best creative work
🌟 Client testimonials and LinkedIn recommendations

**Tools & Support:**
⏱️ Time Doctor for transparent activity tracking
🤖 AI-powered design assistants for rapid iteration
📊 Real-time feedback from automated compliance checks
✅ Clear design requirements and success criteria
🛡️ Legal support for intellectual property questions

**Long-Term Opportunities:**
• Transition to full-time Creative Director role
• Lead branding and marketing for Aliff Services
• Build and manage creative team as company scales
• Strategic involvement in business development`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Job 4: Compliance/Quality Reviewer
    {
      title: 'Compliance & Quality Reviewer - Government Proposals',
      slug: 'compliance-quality-reviewer',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Quality Assurance',
      salary: 'PKR 2,500-5,000/hour (based on legal/compliance background)',
      description: `Aliff Services seeks meticulous Compliance & Quality Reviewers to join our CV Bank and ensure government proposals meet all solicitation requirements. This provider role is ideal for legal professionals or compliance experts who want flexible hourly engagement.

**About This Critical Role:**
You'll be the final safeguard ensuring proposals are compliant with RFP instructions, FAR/DFARS regulations, and agency-specific requirements. Your eagle-eyed attention to detail directly impacts win rates on federal contracts.

**Why Join as a Provider:**
✅ Competitive hourly rates (PKR 2,500-5,000/hour) for specialized expertise
✅ Remote, flexible engagement around your schedule
✅ Work on diverse federal proposals across agencies
✅ Clear advancement: Reviewer → Senior Reviewer → Quality Director
✅ Transparent Time Doctor tracking
✅ Access to AI compliance tools for efficiency

**ALIFF-RECRUITER Process:**
1. Submit resume highlighting compliance/legal background
2. Automated credential verification and skills matching
3. AI chat interview on compliance methodology
4. Compliance assessment: Review sample proposal section
5. Expert validation and CV Bank entry

Top candidates (75+ score) fast-track to interviews and talent pool.`,
      requirements: `**Education & Background:**
• LLB, paralegal certification, or equivalent legal/compliance training preferred (not required)
• Bachelor's degree in Business, Public Administration, or related field
• 3-5+ years experience in compliance, quality assurance, or legal review
• GOVCON proposal experience strongly preferred

**Core Competencies:**
• Expert knowledge of Federal Acquisition Regulations (FAR/DFARS)
• Deep understanding of Section L (Instructions to Offerors)
• Familiarity with Section M (Evaluation Criteria) and compliance matrices
• Experience with government contract compliance requirements
• Strong understanding of legal language and contractual terms

**Compliance Skills:**
• Compliance matrix development and maintenance
• Requirements traceability and gap analysis
• Document version control and configuration management
• Quality assurance processes and checklists
• Risk identification and mitigation documentation

**Technical Proficiency:**
• Microsoft Word advanced features (cross-references, styles, track changes)
• PDF review and annotation tools (Adobe Acrobat Pro)
• Compliance tracking software and spreadsheets
• Document comparison tools
• Basic understanding of proposal management systems

**Essential Qualities:**
• Exceptional attention to detail
• Methodical, process-oriented approach
• Excellent English reading comprehension
• Ability to interpret complex legal and technical language
• Strong communication skills for documenting findings
• Calm under pressure during proposal crunch times`,
      responsibilities: `**Primary Responsibilities:**

**Compliance Review (50%):**
• Review proposals against RFP Section L instructions
• Verify all required elements are included and properly addressed
• Maintain compliance matrices tracking all requirements
• Identify and document compliance gaps and risks
• Ensure page limits, formatting, and submission requirements are met
• Validate required certifications and representations

**Quality Assurance (30%):**
• Conduct final quality checks before submission
• Verify consistency across all proposal volumes
• Check cross-references, table of contents, and page numbers
• Validate all claims against supporting past performance
• Ensure acronym lists, glossaries, and appendices are complete
• Perform accessibility checks (Section 508 compliance)

**Risk Documentation (15%):**
• Flag potential compliance risks and non-responsive content
• Document review findings with clear remediation guidance
• Escalate critical issues to proposal managers
• Track resolution of identified issues
• Maintain audit trail of compliance decisions

**Coordination & Reporting (5%):**
• Participate in color team reviews (focus on compliance)
• Provide compliance briefings to proposal teams
• Log review hours accurately in Time Doctor
• Submit compliance status reports to project leads
• Maintain compliance checklist templates

**Expected Standards:**
• 70%+ activity during logged review hours
• Complete compliance reviews within deadlines
• Zero non-compliance issues in final submissions
• Clear, actionable feedback documentation`,
      benefits: `**Compliance Provider Benefits:**

**Competitive Compensation:**
💰 PKR 2,500-5,000/hour (higher rates for legal backgrounds)
📜 Bonus for zero-defect final submissions
📈 Rate increases based on accuracy and efficiency metrics
🎯 Win bonuses when proposals are awarded

**Professional Development:**
🎓 FAR/DFARS training and certification support
📚 Access to compliance and legal research databases
🤝 Mentorship from senior compliance experts
🏆 Continuous learning in government contracting law

**Work Flexibility:**
🌍 100% remote compliance review from anywhere
⏰ Project-based engagement with predictable review windows
🏖️ Control your availability and workload
💼 Gain experience across multiple federal agencies

**Career Advancement:**
Compliance Reviewer → Senior Reviewer → Lead Compliance → Quality Director

Each promotion brings:
• Higher hourly rates and priority assignment
• Leadership in compliance process improvement
• Strategy involvement in capture planning
• Potential transition to full-time quality leadership

**Tools & Technology:**
⏱️ Time Doctor for transparent time tracking
🤖 AI-powered compliance checking tools
📊 Automated requirement traceability systems
✅ Digital collaboration platforms
🔍 Advanced document comparison software

**Community & Recognition:**
👥 Join Aliff's quality assurance expert community
💬 Monthly compliance workshops and case studies
🌟 Recognition for exceptional accuracy
📝 LinkedIn recommendations from satisfied clients

**Long-Term Opportunities:**
• Build internal compliance training programs
• Lead quality assurance for $100M+ proposals
• Consult on capture strategy and risk assessment
• Transition to full-time compliance director role`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Job 5: Pricing/Cost Analyst
    {
      title: 'Pricing & Cost Analyst - Government Proposals',
      slug: 'pricing-cost-analyst-govcon',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Pricing & Finance',
      salary: 'PKR 3,000-6,000/hour (based on finance expertise)',
      description: `Aliff Services seeks detail-oriented Pricing & Cost Analysts to join our CV Bank and develop winning pricing strategies for federal proposals. This provider role offers flexible hourly engagement for finance professionals with GOVCON experience.

**About the Role:**
Develop competitive, compliant pricing for federal IT and services contracts. You'll create cost models, basis of estimates, and pricing narratives that balance competitiveness with profitability while meeting strict government cost accounting standards.

**Provider Benefits:**
✅ Strong hourly compensation (PKR 3,000-6,000/hour)
✅ Remote work with project-based flexibility
✅ Exposure to diverse contract types and pricing models
✅ Career path: Analyst → Senior Analyst → Pricing Director
✅ Time Doctor tracking for accurate billing
✅ Access to advanced pricing and modeling tools

**ALIFF-RECRUITER Hiring:**
1. Resume submission with finance and GOVCON background
2. AI skills analysis and credential verification
3. Conversational AI interview on pricing methodology
4. Pricing case study: Develop sample BOE
5. Expert review and CV Bank onboarding

High performers (75+) advance directly to interviews and talent pool.`,
      requirements: `**Education & Professional Background:**
• Bachelor's degree in Finance, Accounting, Economics, or Business
• 3-5+ years experience in cost estimating, pricing, or financial analysis
• Government contracting pricing experience required
• CPA, CMA, or cost estimating certification preferred

**Core Expertise:**
• Federal acquisition cost principles (FAR Part 15, Part 31)
• Cost/price analysis methodologies
• Direct/indirect rate structures and G&A allocation
• Labor category development and pricing
• Subcontractor pricing evaluation
• Basis of Estimate (BOE) development

**Pricing Models & Contracts:**
• Firm-Fixed-Price (FFP) pricing strategies
• Time-and-Materials (T&M) rate development
• Cost-Plus contracts and fee structures
• Economic Price Adjustment (EPA) clauses
• Options pricing and discount strategies
• Multi-year contract pricing

**Technical Proficiency:**
• Advanced Microsoft Excel (financial modeling, macros, pivot tables)
• Cost estimating software (Costpoint, Deltek, or similar)
• Microsoft Word for pricing narratives
• Data analysis and statistical tools
• ERP/accounting system familiarity

**Analytical Skills:**
• Financial modeling and forecasting
• Competitive price analysis
• Labor hour estimation
• Risk quantification and contingency planning
• Profit/fee optimization
• Should-cost analysis`,
      responsibilities: `**Primary Responsibilities:**

**Cost Development (45%):**
• Develop detailed Basis of Estimates (BOE) for all cost elements
• Build labor hour estimates by task and labor category
• Calculate direct costs (labor, materials, travel, subcontractors)
• Determine indirect rates (fringe, overhead, G&A, profit/fee)
• Create comprehensive cost models in Excel
• Perform sensitivity analysis and risk assessment

**Pricing Strategy (30%):**
• Analyze RFP pricing instructions and evaluation criteria
• Conduct competitive pricing research and benchmarking
• Develop win-oriented pricing strategies
• Balance competitiveness with profitability targets
• Calculate price-to-win scenarios
• Recommend optimal pricing approaches (LPTA vs best value)

**Documentation & Narratives (20%):**
• Write cost/price volume narratives explaining pricing approach
• Develop supporting documentation for cost realism
• Create pricing summary tables and exhibits
• Document cost estimating methodology
• Prepare responses to cost/price evaluation factors
• Support proposal team with pricing Q&A

**Collaboration & Review (5%):**
• Coordinate with technical SMEs for realistic effort estimates
• Review subcontractor quotes and pricing proposals
• Participate in pricing strategy sessions
• Support color team reviews from pricing perspective
• Log hours accurately in Time Doctor
• Maintain pricing model version control

**Expected Performance:**
• 70%+ activity during logged hours
• Accurate, defendable cost estimates
• Zero arithmetic or formula errors in final submissions
• Timely delivery of pricing deliverables`,
      benefits: `**Pricing Provider Benefits:**

**Compensation & Incentives:**
💰 PKR 3,000-6,000/hour based on experience and certifications
🎯 Win bonuses: 10-15% of hours worked when proposal is awarded
📈 Bi-annual rate reviews with performance increases
🏆 Accuracy bonuses for error-free final submissions

**Professional Growth:**
🎓 Training in government cost accounting and FAR/DFARS
📚 Support for CPA, CMA, or cost estimating certifications
🤝 Mentorship from experienced GOVCON pricing directors
📊 Access to industry pricing databases and benchmarks

**Work Flexibility:**
🌍 100% remote pricing work from anywhere
⏰ Project-based engagement with clear deliverable dates
🏖️ Control your workload and project selection
💼 Exposure to diverse agencies and contract types

**Career Advancement:**
Pricing Analyst → Senior Analyst → Lead Pricing → Pricing Director → CFO-level roles

Each level unlocks:
• Higher hourly rates and complex pricing opportunities
• Strategic involvement in capture planning
• Leadership of pricing teams on major proposals
• Business development and client relationship roles

**Tools & Technology:**
⏱️ Time Doctor for transparent billing
🤖 AI-powered cost estimating assistants
📊 Advanced Excel templates and pricing models
✅ Automated error-checking and validation tools
🔍 Competitive intelligence databases

**Community & Expertise:**
👥 Join Aliff's pricing professional network
💬 Monthly pricing workshops and case study reviews
🌟 Recognition for innovative pricing strategies
📝 Publish pricing thought leadership

**Transparency & Support:**
📊 Real-time dashboards showing your performance metrics
✅ Clear pricing requirements and success criteria
🛡️ Legal and compliance support for cost accounting questions
🤝 Collaborative environment with technical and proposal teams

**Long-Term Opportunities:**
• Lead pricing strategy for $100M+ proposals
• Develop internal pricing training programs
• Capture planning and business development involvement
• Transition to full-time CFO or Pricing Director`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Job 6: AI-Powered Web Developer
    {
      title: 'AI-Powered Full-Stack Web Developer',
      slug: 'full-stack-web-developer-ai',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Engineering',
      salary: 'PKR 3,500-7,000/hour (based on tech stack expertise)',
      description: `Join Aliff Services' engineering team as an AI-powered Full-Stack Web Developer. This provider role is perfect for developers who leverage modern AI tools to build enterprise applications at exceptional velocity.

**About This Role:**
Build production-ready web applications using cutting-edge AI development tools (GitHub Copilot, Claude Code, GPT-4, etc.). You'll develop internal tools for our GOVCON platform, client dashboards, and proposal management systems.

**Why Join Our CV Bank:**
✅ Premium hourly rates (PKR 3,500-7,000/hour) for skilled developers
✅ Work with modern tech stack (Next.js, React, TypeScript, Prisma, tRPC)
✅ Fully remote with asynchronous collaboration
✅ Career growth: Developer → Senior Developer → Tech Lead → CTO
✅ Time Doctor activity tracking (with developer-friendly guidelines)
✅ Access to latest AI development tools

**ALIFF-RECRUITER Process:**
1. Submit resume with GitHub portfolio
2. AI-powered technical skills assessment
3. AI chat interview on development practices
4. Code challenge: Build feature using AI tools
5. Technical expert review and CV Bank entry

Top performers (75+) advance to technical interview and talent pool.`,
      requirements: `**Education & Experience:**
• Bachelor's degree in Computer Science or related field (or equivalent experience)
• 2-4+ years professional full-stack development experience
• Strong GitHub portfolio demonstrating production applications
• Experience with AI development tools (Copilot, Claude, GPT-4, etc.)

**Required Technical Skills:**

**Frontend:**
• React.js and Next.js 14+ (App Router)
• TypeScript (strong typing, interfaces, generics)
• Tailwind CSS and modern component libraries
• State management (React Context, Zustand, or Redux)
• Responsive design and accessibility (WCAG 2.1)

**Backend:**
• Node.js and server-side TypeScript
• Next.js API routes and server components
• RESTful APIs and tRPC
• Authentication (NextAuth.js, JWT, OAuth)
• Database design and optimization

**Database & ORM:**
• PostgreSQL (queries, indexes, performance)
• Prisma ORM (schema design, migrations, queries)
• Redis for caching (bonus)
• Database security and access control

**DevOps & Tools:**
• Git version control and GitHub workflows
• CI/CD pipelines (GitHub Actions preferred)
• Vercel deployment and optimization
• Docker basics (bonus)
• Monitoring and error tracking (Sentry, LogRocket)

**AI Development:**
• Proficient with GitHub Copilot or similar AI coding assistants
• Experience with prompt engineering for code generation
• Understanding of AI limitations and when to manually code
• Ability to review and validate AI-generated code

**Soft Skills:**
• Excellent problem-solving and debugging
• Self-directed with strong time management
• Clear technical communication in English
• Comfortable with async remote collaboration`,
      responsibilities: `**Core Responsibilities:**

**Feature Development (55%):**
• Build new features for ALIFF platform (CV Bank, SDL, Recruiter dashboards)
• Implement responsive, accessible UI components
• Develop API endpoints and server-side logic
• Integrate with third-party services (OpenAI, Pinecone, Time Doctor, etc.)
• Write database queries and optimize performance
• Ensure code quality with TypeScript strict mode

**AI-Accelerated Development (20%):**
• Leverage AI tools for rapid prototyping and feature development
• Generate boilerplate code, tests, and documentation with AI
• Review and refine AI-generated code for production quality
• Identify opportunities for AI automation in development workflow
• Share AI development best practices with team

**Code Quality & Testing (15%):**
• Write unit tests and integration tests
• Participate in code reviews (give and receive feedback)
• Refactor code for maintainability and performance
• Document code and architectural decisions
• Follow established coding standards and patterns

**Collaboration & Communication (10%):**
• Participate in sprint planning and stand-ups (async-first)
• Translate requirements into technical implementations
• Communicate blockers and progress updates
• Collaborate with designers on UI/UX implementation
• Support deployment and production monitoring

**Time Tracking:**
• Log development hours accurately in Time Doctor
• Developer-friendly guidelines: 60%+ activity (accounting for research/thinking time)
• Track feature development progress in project management tools
• Document daily accomplishments and blockers

**Expected Standards:**
• Clean, well-documented, production-ready code
• Responsive UI/UX matching design specifications
• Comprehensive error handling and validation
• Secure, optimized database queries
• Timely communication and deadline adherence`,
      benefits: `**Developer Provider Benefits:**

**Competitive Compensation:**
💰 PKR 3,500-7,000/hour based on experience and tech stack expertise
🚀 Bonuses for successful feature launches
📈 Rate increases based on code quality and velocity metrics
🏆 Recognition bonuses for innovative solutions

**Technical Growth:**
🎓 Access to AI development tools (GitHub Copilot, Claude, GPT-4 API credits)
📚 Training budget for courses, conferences, and certifications
🤝 Code review and mentorship from senior engineers
💡 Exposure to enterprise architecture and scalability patterns

**Work Flexibility:**
🌍 100% remote development from anywhere
⏰ Async-first culture respecting deep work time
🏖️ Project-based engagement with sprint commitments
💼 Control your workload and specialization areas

**Modern Tech Stack:**
⚛️ Work with cutting-edge technologies (Next.js 14, React 19, TypeScript 5+)
🤖 AI-first development workflow
☁️ Serverless architecture and edge computing
🔧 Best-in-class developer tools and infrastructure

**Career Advancement:**
Junior/Mid Developer → Senior Developer → Tech Lead → Engineering Manager → CTO

Each level includes:
• Higher hourly rates and complex project ownership
• Architecture and technical decision authority
• Mentorship and team leadership opportunities
• Equity participation in major product launches

**Community & Collaboration:**
👥 Join Aliff's engineering community
💬 Technical knowledge sharing sessions
🏆 Internal hackathons and innovation sprints
📝 Contribute to engineering blog and open-source projects
🌟 Build reputation in GOVCON tech community

**Developer-Friendly Policies:**
⏱️ Time Doctor with developer-adjusted activity expectations (60%+ vs 70%+)
🧠 Respect for thinking/planning time in productivity metrics
📊 Focus on deliverables over keystrokes
✅ Clear acceptance criteria and definition of done
🛡️ Support for production issues and on-call compensation

**Long-Term Opportunities:**
• Tech lead on flagship product features
• Architecture design for scalable GOVCON platforms
• Open-source project leadership
• Transition to full-time engineering leadership`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Job 7: Expert Copywriter
    {
      title: 'Expert Copywriter - GOVCON & Marketing',
      slug: 'expert-copywriter-govcon-marketing',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Content & Marketing',
      salary: 'PKR 2,500-5,000/hour (based on portfolio strength)',
      description: `Aliff Services seeks exceptional copywriters who can craft compelling narratives for government proposals and marketing content. Join our CV Bank as a provider with flexible hourly engagement.

**About This Role:**
Write persuasive copy that wins federal contracts and attracts clients. You'll create everything from executive summaries and win themes to website content and thought leadership articles.

**Provider Model Benefits:**
✅ Competitive hourly rates (PKR 2,500-5,000/hour)
✅ Diverse projects: GOVCON proposals + marketing content
✅ Remote work with creative freedom
✅ Career path: Copywriter → Senior Copywriter → Content Director
✅ Time Doctor tracking with writer-friendly activity guidelines
✅ Access to AI writing assistants for efficiency

**ALIFF-RECRUITER Process:**
1. Submit resume and writing portfolio
2. AI analysis of writing style and expertise
3. AI chat interview on copywriting approach
4. Writing challenge: GOVCON executive summary
5. Expert editorial review and CV Bank entry

Strong candidates (75+) fast-track to interview and talent pool.`,
      requirements: `**Education & Experience:**
• Bachelor's degree in English, Communications, Journalism, or related field
• 5-7+ years professional copywriting experience
• Portfolio demonstrating GOVCON and/or B2B marketing work
• Proven track record of persuasive, results-driven writing

**Core Writing Expertise:**
• Executive summary and value proposition development
• Win theme articulation and messaging strategy
• Technical content translation for executive audiences
• Persuasive narrative development
• Brand voice development and consistency
• SEO copywriting and content strategy

**GOVCON-Specific Skills:**
• Federal proposal writing (executive summaries, past performance, capabilities)
• Understanding of government evaluation criteria
• Ability to align copy with Section M scoring factors
• Experience with compliance constraints
• Familiarity with government agency priorities

**Content Types:**
• Proposal executive summaries and cover letters
• Website copy and landing pages
• Thought leadership articles and blog posts
• Case studies and success stories
• Email campaigns and nurture sequences
• Social media copy (LinkedIn-focused)
• White papers and e-books

**Technical Proficiency:**
• Excellent English grammar, spelling, and style
• Microsoft Word advanced features
• Content management systems (WordPress, etc.)
• SEO tools (SEMrush, Ahrefs, or similar)
• Collaboration platforms (Google Docs, Notion)
• Basic HTML/Markdown (bonus)

**Essential Qualities:**
• Exceptional storytelling ability
• Strong research and interviewing skills
• Attention to detail without losing creativity
• Adaptability to different brand voices
• Comfort with deadlines and revisions`,
      responsibilities: `**Primary Responsibilities:**

**GOVCON Proposal Copy (40%):**
• Write compelling executive summaries for federal proposals
• Develop win themes and discriminators
• Craft past performance narratives with quantifiable results
• Write capability statements and corporate qualifications
• Create cover letters and transmittal documents
• Support proposal teams with persuasive messaging

**Marketing Content (35%):**
• Write website copy for service pages and landing pages
• Develop thought leadership articles on GOVCON topics
• Create case studies showcasing successful proposals and contracts
• Write email campaigns for lead nurture and client engagement
• Develop LinkedIn posts and social media content
• Craft white papers and long-form content assets

**Brand & Messaging (15%):**
• Maintain consistent brand voice across all content
• Develop messaging frameworks for service offerings
• Create content briefs and outlines for longer projects
• Collaborate with design team on visual content
• Ensure SEO optimization without sacrificing quality
• Edit and refine AI-generated content drafts

**Collaboration & Iteration (10%):**
• Interview SMEs and executives to gather insights
• Participate in content planning and strategy sessions
• Incorporate feedback from stakeholders and clients
• Maintain content calendars and editorial schedules
• Log writing hours accurately in Time Doctor
• Manage content revisions and version control

**Time Tracking (Writer-Friendly):**
• 60%+ activity in Time Doctor (accounting for research/thinking)
• Track hours by project and content type
• Document content briefs and research sources
• Submit drafts on agreed timelines

**Expected Standards:**
• Error-free, polished final copy
• Compelling narratives that drive results
• On-brand messaging and tone
• SEO optimization where applicable`,
      benefits: `**Copywriter Provider Benefits:**

**Compensation & Recognition:**
💰 PKR 2,500-5,000/hour based on experience and portfolio
📈 Bonuses for high-performing content (proposal wins, conversion rates)
🏆 Rate increases based on client satisfaction and content performance
✍️ Byline credit on thought leadership articles

**Professional Growth:**
🎓 Access to copywriting courses and certification programs
📚 Training on GOVCON-specific writing techniques
🤝 Mentorship from senior content strategists
💡 Exposure to diverse industries and writing styles

**Work Flexibility:**
🌍 100% remote writing from anywhere
⏰ Async collaboration with flexible deadlines
🏖️ Control your project workload and content types
💼 Build diverse portfolio across GOVCON and marketing

**Creative Freedom:**
🎨 Collaborate with design team on integrated campaigns
🤖 Use AI writing assistants while maintaining your creative voice
📊 Data-driven content strategy with performance analytics
✅ Clear content briefs with creative latitude

**Career Advancement:**
Copywriter → Senior Copywriter → Content Strategist → Content Director

Each level includes:
• Higher hourly rates and premium project access
• Strategy development and editorial leadership
• Team mentorship and training delivery
• Equity participation in content-driven wins

**Community & Visibility:**
👥 Join Aliff's content professional community
💬 Writer workshops and peer critique sessions
🏆 Recognition for high-converting content
📝 Published bylines on industry platforms
🌟 Build thought leadership presence

**Writer-Friendly Policies:**
⏱️ Time Doctor with writer-adjusted activity (60%+ vs 70%+)
🧠 Recognition of research/thinking time in productivity
📊 Focus on content quality over typing speed
✅ Clear content briefs and success metrics
🤝 Editorial support and AI writing tools

**Tools & Support:**
🤖 Access to GPT-4, Claude, and other AI writing assistants
📚 Content research databases and SEO tools
✍️ Grammarly Premium and editing software
📊 Analytics dashboards for content performance

**Long-Term Opportunities:**
• Content strategy leadership for GOVCON practice
• Build content marketing programs from scratch
• Train and manage team of writers
• Transition to full-time Content Director role`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Job 8: Social Media Marketing Expert
    {
      title: 'Social Media Marketing Expert - B2B GOVCON',
      slug: 'social-media-marketing-govcon',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'Marketing',
      salary: 'PKR 2,000-4,500/hour (based on proven results)',
      description: `Join Aliff Services as a Social Media Marketing Expert specializing in B2B GOVCON outreach. This provider role offers flexible hourly engagement for social media professionals who understand government contracting audiences.

**About This Role:**
Build Aliff's presence on LinkedIn and other B2B platforms, engaging federal contractors, government decision-makers, and GOVCON professionals. You'll create content, manage campaigns, and drive lead generation.

**Provider Benefits:**
✅ Competitive hourly rates (PKR 2,000-4,500/hour)
✅ Remote work with creative autonomy
✅ Performance bonuses tied to engagement metrics
✅ Career path: SMM Expert → Senior SMM → Marketing Director
✅ Time Doctor tracking with content creator guidelines
✅ Access to social media management tools

**ALIFF-RECRUITER Process:**
1. Submit resume with social media portfolio and metrics
2. AI analysis of social media expertise and results
3. AI chat interview on B2B social strategy
4. Content challenge: Create LinkedIn campaign for GOVCON audience
5. Marketing expert review and CV Bank onboarding

High performers (75+) advance to interview and talent pool immediately.`,
      requirements: `**Education & Experience:**
• Bachelor's degree in Marketing, Communications, or related field
• 3-5+ years professional social media marketing experience
• Proven B2B social media success (portfolio with metrics required)
• GOVCON or government sector experience strongly preferred

**Platform Expertise:**
• LinkedIn (primary focus): Company pages, thought leadership, sponsored content
• Twitter/X: Engagement and community building
• Facebook: Group management and advertising
• YouTube: Video content strategy (bonus)
• Instagram: Visual storytelling (secondary)

**Core Social Media Skills:**
• Content calendar development and management
• Community engagement and relationship building
• Social listening and trend identification
• Influencer and partnership outreach
• Crisis management and reputation monitoring
• Social media analytics and reporting

**B2B & GOVCON-Specific:**
• Understanding of government contracting landscape
• Familiarity with GOVCON terminology and pain points
• B2B lead generation strategies
• Professional network building and thought leadership
• Industry event promotion and live coverage
• C-suite and government official engagement etiquette

**Content Creation:**
• Copywriting for social posts (concise, engaging)
• Visual content creation (Canva, Adobe Express)
• Video editing basics (for short-form content)
• Infographic and carousel design
• Hashtag strategy and SEO for social

**Technical Tools:**
• Social media management platforms (Hootsuite, Buffer, Sprout Social)
• Analytics tools (LinkedIn Analytics, Google Analytics, etc.)
• Graphic design software (Canva minimum, Adobe Creative Suite preferred)
• Scheduling and automation tools
• CRM integration for lead tracking

**Metrics & Analytics:**
• Engagement rate optimization
• Reach and impression growth
• Lead generation and conversion tracking
• Content performance analysis
• A/B testing and optimization
• ROI measurement for social campaigns`,
      responsibilities: `**Primary Responsibilities:**

**Content Strategy & Creation (40%):**
• Develop monthly content calendars aligned with marketing goals
• Create daily LinkedIn posts targeting GOVCON professionals
• Write thought leadership content for executives
• Design visual content (graphics, infographics, short videos)
• Curate relevant industry news and insights
• Develop content themes and campaign narratives

**Community Management (25%):**
• Engage with followers, comments, and messages daily
• Build relationships with GOVCON influencers and companies
• Monitor brand mentions and industry conversations
• Respond to inquiries and route leads to sales team
• Foster community discussions in LinkedIn groups
• Manage online reputation and address concerns

**Paid Social Campaigns (20%):**
• Develop LinkedIn sponsored content campaigns
• Create ad creative and copy for GOVCON audiences
• Set up audience targeting and campaign parameters
• Monitor campaign performance and optimize
• Manage advertising budget efficiently
• Report on campaign ROI and lead quality

**Analytics & Reporting (10%):**
• Track key metrics (engagement, reach, leads, conversions)
• Prepare monthly performance reports with insights
• Analyze competitor social media strategies
• Identify trends and optimization opportunities
• Test content formats and posting times
• Provide strategic recommendations

**Collaboration & Time Tracking (5%):**
• Coordinate with content and design teams
• Align social strategy with overall marketing campaigns
• Participate in weekly marketing planning sessions
• Log hours accurately in Time Doctor
• Maintain content asset library

**Expected Activity:**
• 60%+ Time Doctor activity (content creation time)
• Daily engagement and monitoring
• Weekly content publication schedule
• Monthly strategic planning and reporting`,
      responsibilities: `**Primary Responsibilities:**

**Content Strategy & Creation (40%):**
• Develop monthly content calendars aligned with marketing goals
• Create daily LinkedIn posts targeting GOVCON professionals
• Write thought leadership content for executives
• Design visual content (graphics, infographics, short videos)
• Curate relevant industry news and insights
• Develop content themes and campaign narratives

**Community Management (25%):**
• Engage with followers, comments, and messages daily
• Build relationships with GOVCON influencers and companies
• Monitor brand mentions and industry conversations
• Respond to inquiries and route leads to sales team
• Foster community discussions in LinkedIn groups
• Manage online reputation and address concerns

**Paid Social Campaigns (20%):**
• Develop LinkedIn sponsored content campaigns
• Create ad creative and copy for GOVCON audiences
• Set up audience targeting and campaign parameters
• Monitor campaign performance and optimize
• Manage advertising budget efficiently
• Report on campaign ROI and lead quality

**Analytics & Reporting (10%):**
• Track key metrics (engagement, reach, leads, conversions)
• Prepare monthly performance reports with insights
• Analyze competitor social media strategies
• Identify trends and optimization opportunities
• Test content formats and posting times
• Provide strategic recommendations

**Collaboration & Time Tracking (5%):**
• Coordinate with content and design teams
• Align social strategy with overall marketing campaigns
• Participate in weekly marketing planning sessions
• Log hours accurately in Time Doctor
• Maintain content asset library

**Expected Activity:**
• 60%+ Time Doctor activity (content creation time)
• Daily engagement and monitoring
• Weekly content publication schedule
• Monthly strategic planning and reporting`,
      benefits: `**Social Media Provider Benefits:**

**Performance-Based Compensation:**
💰 PKR 2,000-4,500/hour based on experience and proven results
📈 Performance bonuses tied to engagement growth and lead generation
🎯 Campaign win bonuses for high-converting social campaigns
🏆 Recognition rewards for viral content

**Professional Development:**
🎓 Access to social media marketing courses and certifications
📚 Training on B2B and GOVCON marketing strategies
🤝 Mentorship from senior digital marketing strategists
💡 Conference attendance for networking and learning

**Work Flexibility:**
🌍 100% remote social media management
⏰ Flexible scheduling with daily engagement commitments
🏖️ Control your workload and campaign focus
💼 Diverse project portfolio across GOVCON sectors

**Tools & Resources:**
🛠️ Access to premium social media management tools (Hootsuite, Buffer, Sprout Social)
🎨 Graphic design software licenses (Canva Pro, Adobe Creative Cloud)
📊 Analytics and social listening platforms
🤖 AI content generation tools for efficiency
📷 Stock photo and video libraries

**Career Advancement:**
Social Media Expert → Senior Expert → Social Media Manager → Marketing Director

Each level brings:
• Higher hourly rates and strategic authority
• Leadership of social media team
• Campaign strategy and budget ownership
• Integration with broader marketing initiatives

**Community & Networking:**
👥 Join Aliff's marketing professional network
💬 Monthly strategy sessions and trend discussions
🏆 Recognition for high-performing campaigns
🌟 Build personal brand as GOVCON marketing expert
📝 Speaking opportunities at marketing events

**Creator-Friendly Policies:**
⏱️ Time Doctor with creator-adjusted activity expectations (60%+)
🧠 Respect for research and strategy time
📊 Focus on engagement metrics over hours logged
✅ Clear KPIs and success criteria
🎨 Creative freedom within brand guidelines

**Impact & Visibility:**
📈 Direct impact on company growth and lead generation
🌟 Build Aliff's brand presence in GOVCON community
💼 Client testimonials for your portfolio
🏅 LinkedIn recommendations from leadership

**Long-Term Opportunities:**
• Lead entire digital marketing strategy
• Build and manage social media team
• Expand into content marketing and demand generation
• Transition to full-time Marketing Director role`,
      status: JobStatus.PUBLISHED,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },

    // Job 9: Junior Proposal Writer
    {
      title: 'Junior Proposal Writer - GOVCON Training Program',
      slug: 'junior-proposal-writer-govcon',
      type: JobType.CONTRACT,
      location: JobLocation.REMOTE,
      department: 'GOVCON Proposal Writing',
      salary: 'PKR 1,500-3,000/hour (training program with growth path)',
      description: `Launch your GOVCON proposal writing career with Aliff Services' structured training program. This provider role is designed for talented writers ready to break into federal government contracting.

**About This Opportunity:**
Join our mentorship-driven program where you'll learn federal proposal writing from experienced GOVCON professionals. Start with editing and research tasks, gradually taking on full proposal sections as you develop expertise.

**Why Join as a Junior Provider:**
✅ Competitive entry-level rates (PKR 1,500-3,000/hour) with rapid growth potential
✅ Structured training program with clear advancement milestones
✅ Mentorship from senior proposal writers and SMEs
✅ Remote work with flexible learning schedule
✅ Fast-track career path: Junior → Mid → Senior → Lead (18-24 months)
✅ Time Doctor tracking with training time included
✅ Access to AI writing tools and proposal libraries

**ALIFF-RECRUITER Process:**
1. Submit resume highlighting writing experience and education
2. AI writing style and potential assessment
3. AI chat interview on learning approach and motivation
4. Writing sample: Edit and improve sample proposal text
5. Training program interview and CV Bank entry

Strong candidates (75+) receive immediate training program offer.`,
      requirements: `**Education & Background:**
• Master's degree in English, Communications, Business, or related field required
• Fresh graduates or up to 2-3 years professional writing experience
• Strong academic writing background (thesis, research papers)
• Interest in government contracting and public sector work

**Writing Fundamentals:**
• Excellent English grammar, spelling, and composition
• Strong research and analytical skills
• Ability to synthesize complex information
• Clear, concise, and persuasive writing style
• Attention to detail and accuracy
• Ability to follow style guides and templates

**Desired Qualities:**
• Eagerness to learn federal contracting and proposal writing
• Coachability and receptiveness to feedback
• Strong work ethic and self-motivation
• Curiosity about government and policy
• Ability to work independently in remote environment
• Commitment to professional development

**Technical Skills:**
• Proficient in Microsoft Word (styles, formatting, track changes)
• Basic Microsoft Excel and PowerPoint
• Comfortable with cloud collaboration tools (Google Docs, Notion)
• Willingness to learn proposal management software
• Basic internet research skills

**Bonus Qualifications:**
• Any exposure to government contracting or public sector
• Internship experience in writing or research roles
• Familiarity with project management concepts
• Basic understanding of business or technical writing
• Multilingual abilities (English + Urdu/other languages)

**Learning Mindset:**
• Growth-oriented attitude toward skill development
• Comfort with structured training and milestones
• Willingness to start with editing/research and progress to writing
• Open to AI-assisted writing (with human oversight)
• Interest in long-term GOVCON career development`,
      requirements: `**Education & Background:**
• Master's degree in English, Communications, Business, or related field required
• Fresh graduates or up to 2-3 years professional writing experience
• Strong academic writing background (thesis, research papers)
• Interest in government contracting and public sector work

**Writing Fundamentals:**
• Excellent English grammar, spelling, and composition
• Strong research and analytical skills
• Ability to synthesize complex information
• Clear, concise, and persuasive writing style
• Attention to detail and accuracy
• Ability to follow style guides and templates

**Desired Qualities:**
• Eagerness to learn federal contracting and proposal writing
• Coachability and receptiveness to feedback
• Strong work ethic and self-motivation
• Curiosity about government and policy
• Ability to work independently in remote environment
• Commitment to professional development

**Technical Skills:**
• Proficient in Microsoft Word (styles, formatting, track changes)
• Basic Microsoft Excel and PowerPoint
• Comfortable with cloud collaboration tools (Google Docs, Notion)
• Willingness to learn proposal management software
• Basic internet research skills

**Bonus Qualifications:**
• Any exposure to government contracting or public sector
• Internship experience in writing or research roles
• Familiarity with project management concepts
• Basic understanding of business or technical writing
• Multilingual abilities (English + Urdu/other languages)

**Learning Mindset:**
• Growth-oriented attitude toward skill development
• Comfort with structured training and milestones
• Willingness to start with editing/research and progress to writing
• Open to AI-assisted writing (with human oversight)
• Interest in long-term GOVCON career development`,
      responsibilities: `**Training Program Phases:**

**Phase 1: Foundation (Months 1-3) - PKR 1,500-2,000/hour:**
• Study GOVCON fundamentals (FAR, RFP structure, evaluation criteria)
• Review past winning proposals and annotate learning points
• Edit and proofread proposal sections written by senior writers
• Research industry trends and agency priorities
• Create compliance matrices from RFP instructions
• Shadow senior writers during proposal development
• Complete GOVCON training modules and assessments

**Phase 2: Assisted Writing (Months 4-6) - PKR 2,000-2,500/hour:**
• Draft past performance descriptions under mentorship
• Write capability statements and company qualifications
• Develop sections of technical volumes with guidance
• Create resumes and org charts for proposal teams
• Participate in color team reviews as observer/note-taker
• Begin interviewing SMEs to gather content
• Learn proposal management workflow and tools

**Phase 3: Independent Writing (Months 7-12) - PKR 2,500-3,000/hour:**
• Take ownership of complete proposal sections
• Write executive summaries for smaller proposals
• Develop win themes and discriminators
• Lead past performance narrative development
• Conduct SME interviews independently
• Participate actively in color team reviews
• Manage proposal schedules for assigned sections

**Phase 4: Advancement (Months 12+) - Promotion to Mid-Level:**
• Transition to mid-level proposal writer rates (PKR 3,000-4,500/hour)
• Lead entire proposal volumes
• Mentor incoming junior writers
• Contribute to capture planning and strategy
• Specialize in specific GOVCON domains

**Daily Responsibilities:**
• Attend training sessions and mentorship meetings (paid time)
• Complete writing assignments on schedule
• Incorporate feedback from senior writers
• Track learning progress and skill development
• Log hours in Time Doctor (including training time)
• Participate in weekly team stand-ups
• Document lessons learned from each proposal

**Expected Commitment:**
• 15-25 hours/week during training phases
• 70%+ Time Doctor activity during work hours
• Responsive communication (within 24 hours)
• Consistent participation in training program
• Openness to constructive feedback`,
      benefits: `**Junior Writer Training Benefits:**

**Structured Compensation Growth:**
💰 Start: PKR 1,500-2,000/hour (Months 1-3)
📈 Grow to: PKR 2,500-3,000/hour (Months 7-12)
🚀 Advance to: PKR 3,000-4,500/hour (Mid-level promotion at 12-18 months)
🎯 Long-term: PKR 6,000+/hour (Senior level at 24-30 months)

**Comprehensive Training:**
🎓 Structured GOVCON curriculum covering FAR, DFARS, proposal management
📚 Access to Shipley Associates or APMP training materials
🤝 One-on-one mentorship from senior proposal writers
💡 Weekly coaching sessions and feedback reviews
📖 Library of past winning proposals for study
🏆 Certification prep support (APMP Foundation, etc.)

**Career Fast-Track:**
Junior (0-6 months) → Mid-Level (6-18 months) → Senior (18-30 months) → Lead (30+ months)

Clear advancement criteria at each level:
• Defined skill milestones and assessments
• Portfolio of successfully completed proposals
• Demonstrated mastery of GOVCON concepts
• Positive client and team feedback

**Work Flexibility:**
🌍 100% remote training and work
⏰ Flexible learning schedule (15-25 hours/week initially)
🏖️ Grow into full-time equivalent as you advance
💼 Gain experience across diverse agencies and industries

**Tools & Resources:**
⏱️ Time Doctor (training hours are paid and tracked)
🤖 Access to AI writing assistants (GPT-4, Claude, etc.)
📊 Proposal management software training
✍️ Grammarly Premium and editing tools
📚 Extensive proposal template library

**Community & Support:**
👥 Join cohort of fellow junior writers for peer learning
💬 Weekly group training sessions and Q&A
🏆 Recognition program for top performers
🌟 Build professional network in GOVCON community
📝 LinkedIn recommendations from senior mentors

**Learning-Friendly Policies:**
🧠 Training time is paid (not just billable client work)
📈 Progressive responsibility based on demonstrated competency
✅ Clear rubrics and success criteria for each phase
🤝 Supportive environment encouraging questions
🎯 Regular check-ins and development planning

**Long-Term Career Opportunities:**
• Become senior proposal writer earning PKR 6,000+/hour
• Specialize in high-value technical or executive writing
• Transition to proposal management or capture leadership
• Potential full-time employment as company scales
• Build expertise that's in high demand across GOVCON industry

**Why This Program Works:**
✅ Proven track record of developing successful GOVCON writers
✅ Hands-on learning with real proposals, not just theory
✅ Immediate earning while learning (no unpaid internship)
✅ Clear path from entry-level to expert in 2-3 years
✅ Remote opportunity accessible anywhere in Pakistan
✅ Join a growing industry with constant demand for talent`,
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
      console.log(`✅ Created: ${job.title}`);
    } catch (error) {
      console.error(`❌ Error creating ${jobData.title}:`, error);
    }
  }

  console.log('\n🎉 Job postings seed completed!');
  console.log('📋 Summary:');
  console.log(`   - Total jobs: ${jobs.length}`);
  console.log('   - All jobs published and visible on /careers');
  console.log('   - ALIFF-RECRUITER features integrated:');
  console.log('     ✓ PKR hourly compensation ranges');
  console.log('     ✓ Provider model language');
  console.log('     ✓ AI chat interview mentions');
  console.log('     ✓ Time Doctor tracking references');
  console.log('     ✓ CV Bank and career advancement paths');
  console.log('     ✓ GOVCON-specific requirements and benefits');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
