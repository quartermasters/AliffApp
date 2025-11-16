<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Careers - Aliff Capital | Join Our Government Contracting Team</title>
    <meta name="description" content="Join Aliff Capital's team of government contracting professionals. Global remote positions with competitive pay and career growth.">
    
    <?php include 'includes/head.php'; ?>
    <link rel="stylesheet" href="/css/careers-redesign.css">
</head>
<body>
    <?php 
    include 'includes/header.php';
    
    // Calculate job count early for hero section
    require_once 'includes/config.php';
    
    // Sample job data for development/fallback
    $sampleJobs = [
            [
                'id' => 1,
                'title' => 'Proposal Writer',
                'department' => 'Proposal Development',
                'location' => 'Remote (Global)',
                'employment_type' => 'Permanent Full-time',
                'experience_required' => '5-7 years',
                'education_required' => 'PhD preferred',
                'short_description' => 'Lead development of winning government proposals for Federal, State, and Municipal contracts. Work with professional teams and AI-powered tools to create compelling proposals.',
                'highlights' => json_encode(['Ph.D. preferred', '5-7 years experience', 'Office 365/Adobe Suite', 'AI-powered tools']),
                'status' => 'active'
            ],
            [
                'id' => 2,
                'title' => 'Technical Subject Matter Expert (SME)',
                'department' => 'Technical Services',
                'location' => 'Remote (Global)',
                'employment_type' => 'Permanent Full-time',
                'experience_required' => '8-10 years',
                'education_required' => 'Master or PhD',
                'short_description' => 'Provide technical expertise on international development and infrastructure projects. Deep technical knowledge and experience in relevant sector required.',
                'highlights' => json_encode(['Ph.D. preferred', '8-10 years experience', 'Public sector knowledge (preferred)', 'International development']),
                'status' => 'active'
            ],
            [
                'id' => 3,
                'title' => 'Graphic Designer (Proposal Visualizer)',
                'department' => 'Design',
                'location' => 'Remote (Global)',
                'employment_type' => 'Permanent Full-time',
                'experience_required' => '3-5 years',
                'education_required' => 'Bachelor',
                'short_description' => 'Create compelling visual narratives for government proposals. Adobe Creative Suite and social media graphics expertise required. Transform complex data into winning visuals.',
                'highlights' => json_encode(['Bachelor\'s required', '3-5 years experience', 'Adobe/Canva expertise', 'Social media graphics']),
                'status' => 'active'
            ],
            [
                'id' => 4,
                'title' => 'Compliance/Quality Reviewer (Red Team Lead)',
                'department' => 'Compliance',
                'location' => 'Remote (Global)',
                'employment_type' => 'Permanent Full-time',
                'experience_required' => '3-5 years',
                'education_required' => 'LLB',
                'short_description' => 'Lead final quality reviews ensuring 100% RFP compliance. Legal background required. Conduct red team reviews on high-stakes proposals.',
                'highlights' => json_encode(['LLB required', '3-5 years experience', 'Quality assurance', 'Red team leadership']),
                'status' => 'active'
            ],
            [
                'id' => 5,
                'title' => 'Pricing/Cost Analyst',
                'department' => 'Finance',
                'location' => 'Remote (Global)',
                'employment_type' => 'Permanent Full-time',
                'experience_required' => '3-5 years',
                'education_required' => 'Bachelor',
                'short_description' => 'Develop competitive pricing strategies for government contracts. Financial modeling and FAR cost principles expertise required.',
                'highlights' => json_encode(['Bachelor\'s in Finance', '3-5 years experience', 'FAR pricing knowledge', 'Excel expertise']),
                'status' => 'active'
            ],
            [
                'id' => 6,
                'title' => 'AI-Powered Web Developer',
                'department' => 'Technical Services',
                'location' => 'Remote (Global)',
                'employment_type' => 'Permanent Full-time',
                'experience_required' => '2-4 years',
                'education_required' => 'Bachelor',
                'short_description' => 'Build modern websites using cutting-edge AI tools like GitHub Copilot, Cursor, and Claude Code. Develop government contracting platforms and client applications with AI-powered acceleration.',
                'highlights' => json_encode(['AI coding tools (Copilot, Cursor)', '2-4 years experience', 'React/Vue/Node.js', 'Portfolio required']),
                'status' => 'active'
            ],
            [
                'id' => 7,
                'title' => 'Expert Copywriter',
                'department' => 'Proposal Development',
                'location' => 'Remote (Global)',
                'employment_type' => 'Permanent Full-time',
                'experience_required' => '5-7 years',
                'education_required' => 'Bachelor',
                'short_description' => 'Craft high-converting copy for websites, proposals, and marketing campaigns. Master persuasion and drive multi-million dollar business outcomes through exceptional writing.',
                'highlights' => json_encode(['5-7 years copywriting', 'B2B/GovCon experience', 'Portfolio required', 'Conversion-focused']),
                'status' => 'active'
            ],
            [
                'id' => 8,
                'title' => 'Social Media Marketing Expert',
                'department' => 'Marketing',
                'location' => 'Remote (Global)',
                'employment_type' => 'Permanent Full-time',
                'experience_required' => '3-5 years',
                'education_required' => 'Bachelor',
                'short_description' => 'Build and execute social media strategies across LinkedIn, Twitter, and other platforms. Establish thought leadership in government contracting with data-driven campaigns.',
                'highlights' => json_encode(['3-5 years social media', 'LinkedIn B2B expertise', 'Content creation', 'Analytics-driven']),
                'status' => 'active'
            ],
            [
                'id' => 9,
                'title' => 'Junior Proposal Writer',
                'department' => 'Proposal Development',
                'location' => 'Remote (Global)',
                'employment_type' => 'Permanent Full-time',
                'experience_required' => '2-3 years',
                'education_required' => 'Master',
                'short_description' => 'Join our elite proposal development team as a Junior Proposal Writer. Work under senior mentorship to develop winning multi-million-dollar federal contract proposals. Learn our proprietary Pink-Red-Gold Quality Gate System and master FAR/DFARS compliance.',
                'highlights' => json_encode(['Master\'s Degree required', '2-3 years technical writing', 'Competitive Salary + Perks', 'Learn Pink-Red-Gold Quality Gates', 'Shipley & APMP training', 'Clear career advancement path']),
                'status' => 'active'
            ]
        ];
        
        try {
            // Get database connection
            $conn = getDBConnection();
            
            // Fetch active job postings
            $stmt = $conn->prepare("SELECT * FROM job_postings WHERE status = 'active' ORDER BY id ASC");
            $stmt->execute();
            $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // If no database jobs, use sample data
            if (empty($jobs)) {
                $jobs = $sampleJobs;
            }
        } catch (Exception $e) {
            // Fallback to sample data if database unavailable
            $jobs = $sampleJobs;
            error_log("Failed to fetch jobs, using sample data: " . $e->getMessage());
        }
    ?>

    <!-- Hero Section -->
    <section class="careers-hero">
        <div class="hero-overlay"></div>
        <div class="container hero-content">
            <h1 class="hero-title" data-testid="heading-hero">Build Your Career in Government Contracting</h1>
            <p class="hero-subtitle">Join a growing team specializing in government contracting • 100% Remote • Global Opportunities • AI-powered tools • Competitive compensation</p>
            
            <!-- Quick Stats -->
            <div class="hero-stats">
                <div class="stat-card">
                    <div class="stat-number"><?= count($jobs) ?></div>
                    <div class="stat-label">Open Positions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">Growing</div>
                    <div class="stat-label">Portfolio</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">100%</div>
                    <div class="stat-label">Remote Work</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">AI Support</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <section class="section careers-main">
        <div class="container">
            <div class="careers-layout">
                
                <!-- Filters Sidebar -->
                <aside class="filters-sidebar">
                    <div class="filters-card">
                        <h3 class="filters-title">
                            <i data-lucide="sliders-horizontal"></i>
                            Filters
                        </h3>
                        
                        <!-- Search Box -->
                        <div class="filter-group">
                            <label class="filter-label">
                                <i data-lucide="search"></i>
                                Search Jobs
                            </label>
                            <input 
                                type="text" 
                                id="searchInput" 
                                class="search-input" 
                                placeholder="Job title, keywords..."
                                data-testid="input-search"
                            >
                        </div>

                        <!-- Department Filter -->
                        <div class="filter-group">
                            <label class="filter-label">
                                <i data-lucide="briefcase"></i>
                                Department
                            </label>
                            <select id="departmentFilter" class="filter-select" data-testid="select-department">
                                <option value="">All Departments</option>
                                <option value="Proposal Development">Proposal Development</option>
                                <option value="Technical Services">Technical Services</option>
                                <option value="Design">Design</option>
                                <option value="Compliance">Compliance</option>
                                <option value="Finance">Finance</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>

                        <!-- Experience Filter -->
                        <div class="filter-group">
                            <label class="filter-label">
                                <i data-lucide="award"></i>
                                Experience Level
                            </label>
                            <select id="experienceFilter" class="filter-select" data-testid="select-experience">
                                <option value="">All Levels</option>
                                <option value="2-3">2-3 years</option>
                                <option value="2-4">2-4 years</option>
                                <option value="3-5">3-5 years</option>
                                <option value="5-7">5-7 years</option>
                                <option value="8-10">8-10 years</option>
                            </select>
                        </div>

                        <!-- Education Filter -->
                        <div class="filter-group">
                            <label class="filter-label">
                                <i data-lucide="graduation-cap"></i>
                                Education
                            </label>
                            <select id="educationFilter" class="filter-select" data-testid="select-education">
                                <option value="">All Levels</option>
                                <option value="Bachelor">Bachelor's Degree</option>
                                <option value="Master">Master's Degree</option>
                                <option value="PhD">Ph.D.</option>
                            </select>
                        </div>

                        <!-- Clear Filters -->
                        <button id="clearFilters" class="btn-clear-filters" data-testid="button-clear-filters">
                            <i data-lucide="x"></i>
                            Clear All Filters
                        </button>
                    </div>
                </aside>

                <!-- Jobs Grid -->
                <div class="jobs-content">
                        
                    <div class="jobs-header">
                        <h2 class="jobs-count" data-testid="text-job-count">
                            <span id="jobCount"><?= count($jobs) ?></span> Open Positions
                        </h2>
                        <div class="jobs-sort">
                            <label for="sortSelect">Sort by:</label>
                            <select id="sortSelect" class="sort-select" data-testid="select-sort">
                                <option value="newest">Newest First</option>
                                <option value="title">Job Title</option>
                                <option value="department">Department</option>
                            </select>
                        </div>
                    </div>

                    <div id="jobsGrid" class="jobs-grid">
                        <?php
                        foreach ($jobs as $job):
                            // Decode highlights if JSON
                            $highlights = is_string($job['highlights']) ? json_decode($job['highlights'], true) : $job['highlights'];
                            if (!is_array($highlights)) {
                                $highlights = [];
                            }
                            
                            // Get short description or create from full description
                            $shortDesc = isset($job['short_description']) ? $job['short_description'] : 
                                         (isset($job['description']) ? substr($job['description'], 0, 150) . '...' : '');
                        ?>
                        
                        <!-- Job Card -->
                        <div class="job-card" 
                             data-testid="job-card-<?php echo $job['id']; ?>"
                             data-department="<?php echo htmlspecialchars($job['department']); ?>"
                             data-experience="<?php echo isset($job['experience_required']) ? htmlspecialchars($job['experience_required']) : ''; ?>"
                             data-education="<?php echo isset($job['education_required']) ? htmlspecialchars($job['education_required']) : ''; ?>"
                             data-title="<?php echo htmlspecialchars($job['title']); ?>">
                            
                            <div class="job-card-header">
                                <h3 class="job-title"><?php echo htmlspecialchars($job['title']); ?></h3>
                                <span class="job-badge"><?php echo htmlspecialchars($job['employment_type']); ?></span>
                            </div>

                            <div class="job-meta">
                                <span class="meta-item">
                                    <i data-lucide="briefcase"></i>
                                    <?php echo htmlspecialchars($job['department']); ?>
                                </span>
                                <span class="meta-item">
                                    <i data-lucide="map-pin"></i>
                                    <?php echo htmlspecialchars($job['location']); ?>
                                </span>
                            </div>

                            <p class="job-description"><?php echo htmlspecialchars($shortDesc); ?></p>

                            <?php if (!empty($highlights)): ?>
                            <div class="job-highlights">
                                <?php foreach (array_slice($highlights, 0, 4) as $highlight): ?>
                                <span class="highlight-tag">
                                    <i data-lucide="check"></i>
                                    <?php echo htmlspecialchars($highlight); ?>
                                </span>
                                <?php endforeach; ?>
                            </div>
                            <?php endif; ?>

                            <div class="job-card-footer">
                                <a href="/job.php?id=<?php echo $job['id']; ?>" 
                                   class="btn btn-outline" 
                                   data-testid="button-view-details-<?php echo $job['id']; ?>">
                                    <i data-lucide="eye"></i>
                                    View Details
                                </a>
                                <a href="/apply.php?job=<?php echo $job['id']; ?>" 
                                   class="btn btn-primary" 
                                   data-testid="button-quick-apply-<?php echo $job['id']; ?>">
                                    <i data-lucide="send"></i>
                                    Quick Apply
                                </a>
                            </div>
                        </div>
                        
                        <?php endforeach; ?>
                    </div>

                    <!-- No Results Message -->
                    <div id="noResults" class="no-results" style="display: none;">
                        <i data-lucide="search-x"></i>
                        <h3>No jobs found</h3>
                        <p>Try adjusting your filters or search terms</p>
                        <button onclick="clearAllFilters()" class="btn btn-primary">Clear All Filters</button>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta-section">
        <div class="container">
            <div class="cta-card">
                <h2 class="cta-title" data-testid="heading-cta">Don't See Your Role?</h2>
                <p class="cta-text">We're always looking for exceptional talent. Send us your resume and we'll reach out when the right opportunity opens up.</p>
                <a href="/contact.php" class="btn btn-primary btn-lg" data-testid="button-cta">
                    <i data-lucide="mail"></i>
                    Send Your Resume
                </a>
            </div>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <script src="/js/careers-filters.js"></script>
    <script>
        lucide.createIcons();
    </script>

</body>
</html>
