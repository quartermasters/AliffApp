<?php
require_once 'includes/config.php';

// Get job ID from URL
$jobId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$jobId) {
    header('Location: /careers.php');
    exit;
}

// Sample detailed job data (matches database structure)
$sampleJobs = [
    1 => [
        'id' => 1,
        'title' => 'Proposal Writer',
        'department' => 'Proposal Development',
        'location' => 'Remote (Global)',
        'employment_type' => 'Permanent Full-time',
        'experience_required' => '5-7 years',
        'education_required' => 'Ph.D. preferred',
        'salary_range' => 'Competitive + Performance Bonuses',
        'description' => 'Lead the development of winning proposals for government contracts across Federal, State, and Municipal levels. This role is critical to our success in securing contracts and growing our business. You will work directly with clients, managing the entire proposal lifecycle from RFP analysis to final submission. Your work directly impacts our ability to win contracts and expand our portfolio. You will have access to cutting-edge AI tools and work with a team of professionals dedicated to excellence in government contracting.',
        'requirements' => json_encode([
            'Bachelor\'s or Master\'s degree in relevant field (Ph.D. preferred but not required)',
            '5-7 years of proven experience writing government proposals',
            'Deep understanding of government contracting processes and proposal requirements',
            'Exceptional writing skills with ability to craft compelling narratives',
            'Strong project management capabilities',
            'Ability to work independently in remote environment',
            'Excellent attention to detail and ability to meet tight deadlines',
            'Experience with Office 365 and Adobe Creative Suite (preferred)',
            'Strong communication skills for client interaction'
        ]),
        'responsibilities' => json_encode([
            'Lead proposal development from RFP analysis through final submission',
            'Develop compelling technical and management narratives',
            'Coordinate with subject matter experts to gather technical content',
            'Ensure all proposal sections comply with RFP requirements',
            'Manage proposal schedule and ensure on-time delivery',
            'Conduct proposal reviews and incorporate feedback',
            'Develop win themes and discriminators',
            'Create executive summaries and cover letters',
            'Maintain proposal library and reusable content',
            'Participate in lessons learned sessions to improve future proposals'
        ]),
        'benefits' => json_encode([
            'Competitive base salary with performance bonuses',
            'Work remotely from anywhere globally with flexible hours',
            'Access to cutting-edge AI-powered proposal tools',
            'Professional development and training opportunities',
            'Career growth path with expanding contracting portfolio',
            'Work with international clients',
            'Health benefits package',
            'Collaborative team environment with global exposure'
        ]),
        'qualifications' => json_encode([
            'Education: Bachelor\'s/Master\'s degree (Ph.D. preferred)',
            'Experience: 5-7 years in government proposal writing',
            'Technical Skills: Proficiency in Office 365, Adobe Suite',
            'Writing: Exceptional business writing and editing skills',
            'Industry Knowledge: Government contracting processes',
            'Soft Skills: Project management, attention to detail',
            'Language: Fluent English (written and verbal)',
            'Work Style: Self-motivated, deadline-driven, remote work capable'
        ]),
        'status' => 'active'
    ],
    2 => [
        'id' => 2,
        'title' => 'Technical Subject Matter Expert (SME)',
        'department' => 'Technical Services',
        'location' => 'Remote (Global)',
        'employment_type' => 'Permanent Full-time',
        'experience_required' => '8-10 years',
        'education_required' => 'Master\'s or Ph.D.',
        'salary_range' => 'Premium Compensation',
        'description' => 'Serve as the technical authority for international development and infrastructure projects. This role requires deep expertise in Pakistan\'s government sector operations, public infrastructure, and development programs. You will provide critical technical guidance for proposals targeting USAID, World Bank, and other international development contracts. Your knowledge of local context, regulations, and implementation challenges will be instrumental in developing winning technical solutions. This position offers the opportunity to shape major development initiatives and contribute to projects that impact millions of lives.',
        'requirements' => json_encode([
            'Master\'s degree required, Ph.D. strongly preferred',
            '8-10 years of technical experience in relevant sector',
            'Experience with government sector operations (preferred)',
            'Strong technical writing and documentation skills',
            'Ability to translate complex technical concepts for non-technical audiences',
            'Experience working with international development organizations',
            'Proven track record in technical proposal development',
            'Excellent analytical and problem-solving skills',
            'Fluent English communication (written and verbal)'
        ]),
        'responsibilities' => json_encode([
            'Provide technical expertise for proposal development',
            'Develop technical approaches and methodologies',
            'Review and validate technical content for accuracy',
            'Conduct technical feasibility assessments',
            'Prepare technical volume sections of proposals',
            'Interface with clients on technical requirements',
            'Develop innovative technical solutions to complex challenges',
            'Mentor junior technical staff',
            'Stay current on industry trends and best practices',
            'Support post-award technical planning and implementation'
        ]),
        'benefits' => json_encode([
            'Premium compensation package',
            'Remote work flexibility',
            'Opportunity to work on high-impact development projects',
            'Professional development and conference attendance',
            'Access to international networks and experts',
            'Career advancement opportunities'
        ]),
        'qualifications' => json_encode([
            'Education: Master\'s or Ph.D. in relevant technical field',
            'Experience: 8-10 years in technical roles',
            'Expertise: Deep sector knowledge (preferred)',
            'Skills: Technical writing, analytical thinking',
            'Language: Fluent English',
            'Work Style: Independent, detail-oriented'
        ]),
        'status' => 'active'
    ],
    3 => [
        'id' => 3,
        'title' => 'Graphic Designer (Proposal Visualizer)',
        'department' => 'Design',
        'location' => 'Remote (Global)',
        'employment_type' => 'Permanent Full-time',
        'experience_required' => '3-5 years',
        'education_required' => 'Bachelor\'s Degree',
        'salary_range' => 'Competitive',
        'description' => 'Transform complex proposal content into compelling visual narratives that win contracts. This role combines graphic design expertise with an understanding of government proposal requirements. You will create professional graphics, infographics, process diagrams, and visual layouts that enhance our proposals and make them stand out. Your work directly contributes to winning government contracts. You must be proficient in Adobe Creative Suite and familiar with social media graphic design and content creation. Experience with Canva and document formatting is highly valued.',
        'requirements' => json_encode([
            'Bachelor\'s degree in Graphic Design or related field',
            '3-5 years of professional graphic design experience',
            'Expert proficiency in Adobe Creative Suite (Illustrator, InDesign, Photoshop)',
            'Familiarity with social media graphic design and content creation (required)',
            'Experience with Canva (preferred)',
            'Strong understanding of visual hierarchy and information design',
            'Experience with document formatting (preferred)',
            'Ability to work under tight deadlines',
            'Portfolio demonstrating professional design work'
        ]),
        'responsibilities' => json_encode([
            'Design professional graphics for government proposals',
            'Create infographics, process diagrams, and organizational charts',
            'Develop visual themes and branding for proposals',
            'Design page layouts and document templates',
            'Create social media graphics and content',
            'Format complex documents for professional appearance',
            'Ensure brand consistency across all visual elements',
            'Collaborate with proposal writers to visualize concepts',
            'Maintain design library and templates',
            'Produce print-ready and digital-ready deliverables'
        ]),
        'benefits' => json_encode([
            'Competitive salary',
            'Remote work from Pakistan',
            'Access to Adobe Creative Cloud and design tools',
            'Portfolio-building opportunities with high-profile projects',
            'Professional development in government contracting',
            'Collaborative creative environment',
            'Flexible working hours',
            'Career growth opportunities'
        ]),
        'qualifications' => json_encode([
            'Education: Bachelor\'s in Graphic Design or related field',
            'Experience: 3-5 years professional design',
            'Software: Adobe Creative Suite (expert level)',
            'Additional Tools: Canva, document formatting tools',
            'Design Skills: Social media graphics, infographics, layouts',
            'Soft Skills: Deadline-driven, detail-oriented, collaborative',
            'Portfolio: Required (showcasing professional work)'
        ]),
        'status' => 'active'
    ],
    4 => [
        'id' => 4,
        'title' => 'Compliance/Quality Reviewer (Red Team Lead)',
        'department' => 'Compliance',
        'location' => 'Remote (Global)',
        'employment_type' => 'Permanent Full-time',
        'experience_required' => '3-5 years',
        'education_required' => 'LLB or equivalent',
        'salary_range' => 'Competitive',
        'description' => 'Lead the critical quality assurance process for government proposals, ensuring 100% compliance with RFP requirements. This role requires a legal background and exceptional attention to detail. You will serve as the final gatekeeper, conducting comprehensive "red team" reviews before proposal submission. Your expertise in legal compliance and quality assurance directly impacts our win rate. You will identify gaps, ensure regulatory compliance, and verify that every requirement is addressed. This is a high-impact role for someone who takes pride in perfection and understands the consequences of non-compliance.',
        'requirements' => json_encode([
            'LLB (Bachelor of Laws) or equivalent legal degree required',
            '3-5 years of experience in compliance, quality assurance, or legal review',
            'Strong analytical and critical thinking skills',
            'Exceptional attention to detail',
            'Experience with complex document review',
            'Understanding of regulatory compliance',
            'Excellent written and verbal communication',
            'Ability to work under pressure and meet tight deadlines',
            'Experience in quality management systems (preferred)'
        ]),
        'responsibilities' => json_encode([
            'Lead red team reviews of government proposals',
            'Ensure 100% compliance with RFP requirements',
            'Develop and maintain compliance checklists',
            'Review proposals for legal and regulatory compliance',
            'Identify gaps and inconsistencies in proposal content',
            'Coordinate with proposal team to resolve compliance issues',
            'Conduct final quality checks before submission',
            'Document review findings and recommendations',
            'Develop standard operating procedures for quality reviews',
            'Train team members on compliance requirements'
        ]),
        'benefits' => json_encode([
            'Competitive compensation',
            'Remote work flexibility',
            'High-impact role with direct influence on win rate',
            'Professional development in government contracting',
            'Work with experienced proposal teams',
            'Career advancement opportunities',
            'Collaborative work environment'
        ]),
        'qualifications' => json_encode([
            'Education: LLB or equivalent legal degree',
            'Experience: 3-5 years in compliance/quality assurance',
            'Legal Knowledge: Regulatory compliance, contract law',
            'Skills: Critical thinking, attention to detail, document review',
            'Language: Fluent English',
            'Work Style: Methodical, deadline-driven, quality-focused'
        ]),
        'status' => 'active'
    ],
    5 => [
        'id' => 5,
        'title' => 'Pricing/Cost Analyst',
        'department' => 'Finance',
        'location' => 'Remote (Global)',
        'employment_type' => 'Permanent Full-time',
        'experience_required' => '3-5 years',
        'education_required' => 'Bachelor\'s in Finance/Accounting',
        'salary_range' => 'Competitive',
        'description' => 'Develop competitive and compliant pricing strategies for government contracts. This role requires expertise in financial modeling, cost analysis, and government pricing regulations. You will be responsible for developing detailed cost proposals, ensuring pricing competitiveness while maintaining profitability. Your work directly impacts our ability to win contracts and achieve business objectives. You must have strong Excel skills and understanding of government cost principles. This is an excellent opportunity for a financial analyst looking to specialize in government contracting.',
        'requirements' => json_encode([
            'Bachelor\'s degree in Finance, Accounting, or related field',
            '3-5 years of experience in financial analysis or cost accounting',
            'Advanced Excel skills (pivot tables, complex formulas, financial modeling)',
            'Strong analytical and quantitative skills',
            'Understanding of government cost principles and pricing',
            'Experience with financial modeling and forecasting',
            'Excellent attention to detail and accuracy',
            'Ability to work under tight deadlines',
            'Strong communication skills to explain pricing strategies'
        ]),
        'responsibilities' => json_encode([
            'Develop detailed cost proposals for government contracts',
            'Create financial models and pricing strategies',
            'Analyze labor rates, overhead, and indirect costs',
            'Ensure pricing compliance with government regulations',
            'Conduct price-to-win analyses',
            'Support proposal teams with cost volume development',
            'Review and validate cost data for accuracy',
            'Prepare budget and financial projections',
            'Maintain pricing databases and historical cost data',
            'Collaborate with finance team on cost allocation'
        ]),
        'benefits' => json_encode([
            'Competitive salary',
            'Remote work globally',
            'Professional development in government finance',
            'Exposure to complex financial modeling',
            'Career growth opportunities',
            'Work with experienced finance professionals',
            'Flexible hours',
            'Performance bonuses'
        ]),
        'qualifications' => json_encode([
            'Education: Bachelor\'s in Finance or Accounting',
            'Experience: 3-5 years in financial analysis',
            'Technical Skills: Advanced Excel, financial modeling',
            'Knowledge: Government cost principles, pricing strategies',
            'Certifications: CPA or relevant certifications (preferred)',
            'Soft Skills: Analytical thinking, attention to detail',
            'Language: Fluent English',
            'Work Style: Detail-oriented, deadline-driven'
        ]),
        'status' => 'active'
    ],
    6 => [
        'id' => 6,
        'title' => 'AI-Powered Web Developer',
        'department' => 'Technical Services',
        'location' => 'Remote (Global)',
        'employment_type' => 'Permanent Full-time',
        'experience_required' => '2-4 years',
        'education_required' => 'Bachelor\'s degree',
        'salary_range' => 'Competitive + Performance Bonuses',
        'description' => 'Build modern, responsive websites and web applications using cutting-edge AI-powered development tools like GitHub Copilot, Cursor, and Claude Code. Perfect for developers who embrace the future of software development—using AI assistants to amplify productivity. Work on government contracting platforms, client websites, proposal automation systems, and innovative web applications. Leverage AI to accelerate development while maintaining high code quality and security standards.',
        'requirements' => json_encode([
            'Bachelor\'s degree in Computer Science, Software Engineering, or related field',
            'Minimum 2-4 years of professional web development experience',
            'Demonstrated experience using AI coding tools (Cursor, GitHub Copilot, Replit AI, ChatGPT, Claude)',
            'Portfolio of completed websites or web applications (required)',
            'Front-End: HTML5, CSS3, JavaScript (ES6+), React/Vue.js/Next.js, Tailwind CSS/Bootstrap',
            'Back-End: Node.js, PHP, Python or similar, RESTful APIs, MySQL/PostgreSQL/MongoDB',
            'Git version control and GitHub/GitLab workflows',
            'Experience using AI APIs (OpenAI, Anthropic Claude, Google AI)',
            'Strong problem-solving and analytical thinking abilities',
            'Excellent communication skills in English'
        ]),
        'responsibilities' => json_encode([
            'Build modern, responsive websites using AI-powered development tools',
            'Leverage AI coding assistants to accelerate development and optimize code',
            'Develop front-end interfaces using modern frameworks',
            'Create back-end systems using Node.js, PHP, Python',
            'Integrate AI capabilities into web applications (OpenAI API, Claude API)',
            'Build chatbots, intelligent forms, and automated workflows',
            'Implement RESTful APIs and integrate third-party services',
            'Deploy applications to cloud platforms (Hostinger, AWS, Vercel, Netlify)',
            'Write clean, maintainable, well-documented code with AI assistance',
            'Implement security best practices (OWASP, input validation, authentication)',
            'Translate business requirements into technical specifications',
            'Collaborate with designers, content creators, and stakeholders'
        ]),
        'benefits' => json_encode([
            'Competitive pay commensurate with experience and qualifications',
            'Permanent full-time employment with long-term career growth',
            'Fully remote working environment with flexible hours',
            'Access to premium AI development tools (GitHub Copilot, Cursor Pro)',
            'Work on diverse projects across government contracting',
            'Cutting-edge tech stack with freedom to experiment',
            'Professional development budget for courses and certifications',
            'Performance bonuses tied to project delivery',
            'Recognition for innovative solutions'
        ]),
        'qualifications' => json_encode([
            'Education: Bachelor\'s in Computer Science or related field',
            'Experience: 2-4 years of professional web development',
            'AI Tool Proficiency: Cursor, Copilot, Replit AI, ChatGPT',
            'Portfolio: GitHub profile with 3-5 completed projects',
            'Technical Skills: HTML5, CSS3, JavaScript, React/Vue, Node.js/PHP/Python',
            'AI Integration: Experience with AI APIs and prompt engineering',
            'Communication: Excellent written and verbal skills in English',
            'Preferred: Government contracting experience, cloud platforms, DevOps'
        ]),
        'status' => 'active'
    ],
    7 => [
        'id' => 7,
        'title' => 'Expert Copywriter',
        'department' => 'Proposal Development',
        'location' => 'Remote (Global)',
        'employment_type' => 'Permanent Full-time',
        'experience_required' => '5-7 years',
        'education_required' => 'Bachelor\'s degree',
        'salary_range' => 'Competitive + Performance Bonuses',
        'description' => 'Craft high-converting copy for websites, proposals, and marketing campaigns that drives action and converts readers into clients. Master persuasive writing to directly impact business outcomes—from winning federal contracts to generating leads. Create compelling value propositions, persuasive proposal narratives, and thought leadership content for the government contracting industry. Your words will influence decisions worth millions.',
        'requirements' => json_encode([
            'Minimum 5-7 years of professional copywriting experience with proven results',
            'Demonstrated track record of writing high-converting copy that drives revenue',
            'Portfolio showcasing diverse copywriting work (required)',
            'Experience writing for B2B audiences, particularly professional services',
            'Exceptional command of English language with impeccable grammar',
            'Deep understanding of persuasion psychology and buyer psychology',
            'Mastery of copywriting frameworks: AIDA, PAS, FAB, Before-After-Bridge',
            'Ability to write in multiple voices and styles',
            'Strong research capabilities',
            'Experience with direct response copywriting'
        ]),
        'responsibilities' => json_encode([
            'Write high-converting website copy that transforms visitors into leads',
            'Craft compelling value propositions and brand messaging',
            'Develop persuasive sales pages and landing pages',
            'Create powerful headlines and calls-to-action',
            'Write persuasive proposal narratives for government contracts',
            'Develop marketing collateral: brochures, one-pagers, presentations',
            'Create thought leadership content: articles, white papers',
            'Write ad copy for digital campaigns',
            'Conduct voice of customer research',
            'A/B test headlines and copy variations',
            'Collaborate with marketing and business development teams'
        ]),
        'benefits' => json_encode([
            'Competitive pay commensurate with expertise',
            'Global remote opportunity - work from anywhere',
            'Permanent full-time employment with career growth',
            'Flexible working hours',
            'High-impact, revenue-generating projects',
            'Professional development budget for courses',
            'Performance bonuses tied to conversion metrics',
            'Recognition for exceptional work'
        ]),
        'qualifications' => json_encode([
            'Education: Bachelor\'s degree in English, Communications, Marketing',
            'Experience: 5-7 years professional copywriting',
            'Portfolio: Minimum 8-10 diverse writing samples (required)',
            'Mastery: Persuasion psychology, copywriting frameworks',
            'Skills: Strategic thinking, conversion optimization',
            'Industry: B2B/Government contracting (preferred)',
            'Technical: CMS platforms, SEO copywriting, email marketing',
            'Communication: Excellent written and verbal English'
        ]),
        'status' => 'active'
    ],
    8 => [
        'id' => 8,
        'title' => 'Social Media Marketing Expert',
        'department' => 'Marketing',
        'location' => 'Remote (Global)',
        'employment_type' => 'Permanent Full-time',
        'experience_required' => '3-5 years',
        'education_required' => 'Bachelor\'s degree',
        'salary_range' => 'Competitive + Performance Bonuses',
        'description' => 'Build and execute comprehensive social media strategies that establish Aliff Capital as a thought leader in government contracting. Create engaging narratives around federal procurement, proposal development, and business strategies that resonate with contractors and government professionals. Manage presence across LinkedIn, Twitter, Facebook, and other platforms. Drive engagement, generate leads, and build authentic communities.',
        'requirements' => json_encode([
            'Minimum 3-5 years of professional social media marketing experience',
            'Proven track record managing social media for B2B companies',
            'Demonstrated success growing followers, engagement, and generating leads',
            'Experience creating content strategies and executing campaigns',
            'Portfolio showcasing social media content and results (required)',
            'Expert-level knowledge of LinkedIn for B2B marketing',
            'Proficiency across major platforms: Facebook, Instagram, Twitter/X, YouTube',
            'Excellent writing skills with ability to craft engaging copy',
            'Basic graphic design skills using Canva or similar tools',
            'Experience with social media analytics tools'
        ]),
        'responsibilities' => json_encode([
            'Develop and execute comprehensive social media strategies',
            'Create monthly and quarterly content calendars',
            'Create compelling content including posts, articles, videos, stories',
            'Manage daily posting and engagement across all platforms',
            'Build and nurture online communities',
            'Develop LinkedIn strategy for B2B lead generation',
            'Plan and optimize paid social media campaigns',
            'Monitor social media metrics and create performance reports',
            'Maintain consistent brand voice across platforms',
            'Collaborate with content writers and designers',
            'Stay current with platform updates and trends'
        ]),
        'benefits' => json_encode([
            'Competitive pay commensurate with experience',
            'Permanent full-time employment with career growth',
            'Fully remote working with flexible hours',
            'Access to premium social media management tools',
            'Creative freedom to experiment',
            'Professional development budget',
            'Performance bonuses tied to engagement metrics',
            'Recognition for creative campaigns'
        ]),
        'qualifications' => json_encode([
            'Education: Bachelor\'s in Marketing, Communications, Business',
            'Experience: 3-5 years social media marketing',
            'Platform Expertise: LinkedIn B2B marketing, Facebook, Instagram, Twitter',
            'Content Creation: Writing, graphic design (Canva), video editing',
            'Analytics: Social media analytics tools, Google Analytics',
            'Skills: Creative thinking, data-driven optimization',
            'Industry: B2B/Professional services (preferred)',
            'Communication: Excellent written and verbal English'
        ]),
        'status' => 'active'
    ],
    9 => [
        'id' => 9,
        'title' => 'Junior Proposal Writer',
        'department' => 'Proposal Development',
        'location' => 'Remote (Global)',
        'employment_type' => 'Permanent Full-time',
        'experience_required' => '2-3 years',
        'education_required' => 'Master\'s Degree (Required)',
        'salary_range' => 'Competitive + Performance Bonuses',
        'description' => 'Join our elite proposal development team as a Junior Proposal Writer. This role is designed for ambitious professionals with a Master\'s Degree and technical writing experience who are eager to break into the high-stakes world of government contracting proposal development. You will work under the mentorship of senior proposal writers and contribute to winning multi-million-dollar federal contracts through meticulous technical writing, compliance verification, and quality control. This is an exceptional opportunity to learn our proprietary Pink-Red-Gold Quality Gate System and develop expertise in FAR/DFARS compliance while working on proposals that directly impact national security and government operations. In an era where AI hallucinations have cost firms like Deloitte $440,000 in refunds and sanctions, Aliff Capital\'s human-verified approach demands junior writers who understand the critical importance of accuracy, verification, and epistemic integrity.',
        'requirements' => json_encode([
            'Master\'s Degree (Required) in English, Rhetoric, Professional Writing, Communications, Technical Communication, Business Administration, Engineering, Computer Science, Public Policy, or related field',
            'Coursework or certification in technical writing strongly preferred',
            '2-3 years of professional technical writing experience in technical documentation, grant writing, business writing, academic writing, science/engineering writing, or legal/compliance writing',
            'Microsoft Office Suite mastery: Word (styles, track changes, mail merge), Excel (pivot tables, formulas), PowerPoint',
            'Adobe Acrobat Pro (PDF manipulation, form filling, accessibility)',
            'Document management systems (SharePoint, Confluence, Google Workspace)',
            'Grammar and style tools (Grammarly, ProWritingAid, Chicago Manual of Style)',
            'Exceptional attention to detail—ability to spot inconsistencies and errors',
            'Strong research skills using databases, government websites, and academic sources',
            'Excellent written communication—clarity, precision, and persuasion',
            'Ability to receive and incorporate feedback constructively',
            'Professional demeanor in client-facing situations'
        ]),
        'responsibilities' => json_encode([
            'Draft clear, compliant technical sections for government proposals under senior guidance',
            'Write technical descriptions, solution architectures, and capability statements',
            'Transform complex technical concepts into accessible, persuasive narrative',
            'Develop past performance summaries and case study narratives',
            'Review RFP/RFI requirements and extract compliance matrices',
            'Cross-reference all FAR/DFARS citations against official sources',
            'Verify that proposal sections address all mandatory requirements (M-clauses)',
            'Participate in Pink Team reviews focusing on compliance gaps',
            'Conduct research on government agencies, programs, and procurement history',
            'Verify all past performance claims with contract numbers and client POCs',
            'Format proposal documents according to RFP specifications',
            'Create tables, charts, and visual elements (with design team support)',
            'Manage version control and document repositories',
            'Participate in proposal kickoff meetings and strategy sessions',
            'Coordinate with capture managers, technical SMEs, and pricing analysts',
            'Incorporate feedback from Red Team and Gold Team reviews'
        ]),
        'benefits' => json_encode([
            'Competitive compensation commensurate with experience and qualifications',
            'Performance-based bonuses tied to win rate and quality metrics',
            'Permanent full-time employment with long-term career stability',
            'Clear advancement path: Junior Writer → Proposal Writer → Senior Writer → Proposal Manager',
            'Mentorship from industry veterans with 10+ years of GovCon experience',
            'Exposure to $5M-$50M contract opportunities across federal agencies',
            'Training in Shipley methodology, APMP BOK, and proprietary quality systems',
            'Professional development opportunities in government contracting',
            'Fully remote work with flexible hours and global team collaboration',
            'Access to cutting-edge tools: AI-augmented research with human verification',
            'Work on high-impact proposals for national security and critical infrastructure',
            'Build expertise in FAR/DFARS compliance and federal procurement',
            'Develop portfolio of winning proposals with measurable impact',
            'Recognition for quality work and contribution to team success'
        ]),
        'qualifications' => json_encode([
            'Education: Master\'s Degree (Required) in relevant field',
            'Experience: 2-3 years professional technical writing',
            'Technical Writing: User manuals, specs, white papers, case studies, research papers',
            'Technical Skills: Microsoft Office Suite (advanced), Adobe Acrobat Pro',
            'Document Management: SharePoint, Confluence, Google Workspace',
            'Research: Strong research and fact-checking capabilities',
            'Writing Quality: Exceptional clarity, precision, and persuasion',
            'Attention to Detail: Ability to spot errors and inconsistencies',
            'Collaboration: Ability to work with SMEs and incorporate feedback',
            'Government Knowledge: Basic understanding of federal procurement (trainable)',
            'Preferred: Shipley/APMP training, FAR/DFARS familiarity, security clearance',
            'Work Style: Self-motivated, deadline-driven, remote work capable'
        ]),
        'status' => 'active'
    ]
];

try {
    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT * FROM job_postings WHERE id = ? AND status = 'active'");
    $stmt->execute([$jobId]);
    $job = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$job && isset($sampleJobs[$jobId])) {
        $job = $sampleJobs[$jobId];
    }
} catch (Exception $e) {
    if (isset($sampleJobs[$jobId])) {
        $job = $sampleJobs[$jobId];
    }
}

if (!$job) {
    header('Location: /careers.php');
    exit;
}

// Decode JSON fields
$requirements = is_string($job['requirements']) ? json_decode($job['requirements'], true) : $job['requirements'];
$responsibilities = is_string($job['responsibilities']) ? json_decode($job['responsibilities'], true) : $job['responsibilities'];
$benefits = is_string($job['benefits']) ? json_decode($job['benefits'], true) : $job['benefits'];
$qualifications = is_string($job['qualifications']) ? json_decode($job['qualifications'], true) : $job['qualifications'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($job['title']); ?> - Aliff Capital Careers</title>
    <meta name="description" content="<?php echo htmlspecialchars(substr($job['description'], 0, 160)); ?>">
    
    <?php include 'includes/head.php'; ?>
    <link rel="stylesheet" href="/css/job-detail.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <!-- Breadcrumb -->
    <section class="breadcrumb-section">
        <div class="container">
            <nav class="breadcrumb">
                <a href="/" data-testid="link-home">Home</a>
                <i data-lucide="chevron-right"></i>
                <a href="/careers.php" data-testid="link-careers">Careers</a>
                <i data-lucide="chevron-right"></i>
                <span><?php echo htmlspecialchars($job['title']); ?></span>
            </nav>
        </div>
    </section>

    <!-- Job Header -->
    <section class="job-header">
        <div class="container">
            <div class="job-header-content">
                <div class="job-header-main">
                    <h1 class="job-title" data-testid="heading-job-title"><?php echo htmlspecialchars($job['title']); ?></h1>
                    <div class="job-meta-row">
                        <span class="meta-badge">
                            <i data-lucide="briefcase"></i>
                            <?php echo htmlspecialchars($job['department']); ?>
                        </span>
                        <span class="meta-badge">
                            <i data-lucide="map-pin"></i>
                            <?php echo htmlspecialchars($job['location']); ?>
                        </span>
                        <span class="meta-badge">
                            <i data-lucide="clock"></i>
                            <?php echo htmlspecialchars($job['employment_type']); ?>
                        </span>
                        <?php if (isset($job['salary_range'])): ?>
                        <span class="meta-badge salary">
                            <i data-lucide="dollar-sign"></i>
                            <?php echo htmlspecialchars($job['salary_range']); ?>
                        </span>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="job-header-actions">
                    <a href="/apply.php?job=<?php echo $job['id']; ?>" class="btn btn-primary btn-lg" data-testid="button-apply-now">
                        <i data-lucide="send"></i>
                        Apply Now
                    </a>
                    <button class="btn btn-outline" onclick="shareJob()" data-testid="button-share">
                        <i data-lucide="share-2"></i>
                        Share
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Job Content -->
    <section class="job-content-section">
        <div class="container">
            <div class="job-layout">
                
                <!-- Main Content -->
                <div class="job-main">
                    
                    <!-- Overview -->
                    <div class="content-card">
                        <h2 class="section-title">
                            <i data-lucide="file-text"></i>
                            Position Overview
                        </h2>
                        <p class="job-description"><?php echo nl2br(htmlspecialchars($job['description'])); ?></p>
                    </div>

                    <!-- Requirements -->
                    <?php if (!empty($requirements)): ?>
                    <div class="content-card">
                        <h2 class="section-title">
                            <i data-lucide="check-square"></i>
                            Requirements
                        </h2>
                        <ul class="requirements-list">
                            <?php foreach ($requirements as $requirement): ?>
                            <li><?php echo htmlspecialchars($requirement); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                    <?php endif; ?>

                    <!-- Responsibilities -->
                    <?php if (!empty($responsibilities)): ?>
                    <div class="content-card">
                        <h2 class="section-title">
                            <i data-lucide="clipboard-list"></i>
                            Key Responsibilities
                        </h2>
                        <ul class="responsibilities-list">
                            <?php foreach ($responsibilities as $responsibility): ?>
                            <li><?php echo htmlspecialchars($responsibility); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                    <?php endif; ?>

                    <!-- Benefits -->
                    <?php if (!empty($benefits)): ?>
                    <div class="content-card">
                        <h2 class="section-title">
                            <i data-lucide="gift"></i>
                            Benefits & Compensation
                        </h2>
                        <ul class="benefits-list">
                            <?php foreach ($benefits as $benefit): ?>
                            <li><?php echo htmlspecialchars($benefit); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                    <?php endif; ?>

                    <!-- Qualifications Summary -->
                    <?php if (!empty($qualifications)): ?>
                    <div class="content-card">
                        <h2 class="section-title">
                            <i data-lucide="graduation-cap"></i>
                            Qualifications Summary
                        </h2>
                        <ul class="qualifications-list">
                            <?php foreach ($qualifications as $qualification): ?>
                            <li><?php echo htmlspecialchars($qualification); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                    <?php endif; ?>

                    <!-- Apply CTA -->
                    <div class="apply-cta-card">
                        <h3>Ready to Apply?</h3>
                        <p>Join our growing team and contribute to winning government contracts.</p>
                        <a href="/apply.php?job=<?php echo $job['id']; ?>" class="btn btn-primary btn-lg" data-testid="button-apply-bottom">
                            <i data-lucide="send"></i>
                            Apply for <?php echo htmlspecialchars($job['title']); ?>
                        </a>
                    </div>

                </div>

                <!-- Sidebar -->
                <aside class="job-sidebar">
                    
                    <!-- Quick Info -->
                    <div class="sidebar-card">
                        <h3 class="sidebar-title">Quick Info</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Department</span>
                                <span class="info-value"><?php echo htmlspecialchars($job['department']); ?></span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Location</span>
                                <span class="info-value"><?php echo htmlspecialchars($job['location']); ?></span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Experience</span>
                                <span class="info-value"><?php echo htmlspecialchars($job['experience_required']); ?></span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Education</span>
                                <span class="info-value"><?php echo htmlspecialchars($job['education_required']); ?></span>
                            </div>
                        </div>
                    </div>

                    <!-- Other Openings -->
                    <div class="sidebar-card">
                        <h3 class="sidebar-title">Other Openings</h3>
                        <div class="related-jobs">
                            <?php
                            // Get other jobs
                            $otherJobs = array_filter($sampleJobs, function($j) use ($jobId) {
                                return $j['id'] != $jobId && $j['status'] == 'active';
                            });
                            
                            $count = 0;
                            foreach (array_slice($otherJobs, 0, 3) as $otherJob):
                                $count++;
                            ?>
                            <a href="/job.php?id=<?php echo $otherJob['id']; ?>" class="related-job-link" data-testid="link-related-job-<?php echo $count; ?>">
                                <h4><?php echo htmlspecialchars($otherJob['title']); ?></h4>
                                <span><?php echo htmlspecialchars($otherJob['department']); ?></span>
                            </a>
                            <?php endforeach; ?>
                            
                            <a href="/careers.php" class="view-all-link" data-testid="link-view-all">
                                View All Openings →
                            </a>
                        </div>
                    </div>

                </aside>

            </div>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <script>
        function shareJob() {
            const url = window.location.href;
            const title = <?php echo json_encode($job['title'] . ' - Aliff Capital'); ?>;
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: url
                }).catch(err => console.log('Share failed:', err));
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(url).then(() => {
                    alert('Job link copied to clipboard!');
                });
            }
        }

        lucide.createIcons();
    </script>

</body>
</html>
