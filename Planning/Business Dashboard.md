# Business Dashboard - Complete Documentation

**Comprehensive Documentation for the Human-First, AI-Validates RFP/Proposal Management System**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Core Philosophy & Design Principles](#2-core-philosophy--design-principles)
3. [Multi-Capability Architecture](#3-multi-capability-architecture)
4. [Comprehensive Process Flow](#4-comprehensive-process-flow)
5. [Three-Portal Architecture](#5-three-portal-architecture)
6. [Integration Strategy with Admin Dashboard](#6-integration-strategy-with-admin-dashboard)
7. [Database Schema](#7-database-schema)
8. [Technical Implementation Details](#8-technical-implementation-details)
9. [Component Reuse Strategy](#9-component-reuse-strategy)
10. [Page-by-Page Implementation](#10-page-by-page-implementation)
11. [Implementation Phases](#11-implementation-phases)
12. [Admin Dashboard Context & Modules](#12-admin-dashboard-context--modules)

---

## 1. Executive Summary

### What is the Business Dashboard?

The Business Dashboard is a comprehensive RFP/proposal management system built on the principle of "Human-First, AI-Validates" workflow. It manages the complete lifecycle of government contracting proposals from initial RFP submission through final delivery.

### Current State
- **Admin Dashboard**: Mature HR/recruitment/content management system with gold-purple gradient design, card-based layout, and business intelligence focus
- **Design Philosophy**: Professional, data-driven, visual clarity, enterprise-grade UI
- **Tech Stack**: PHP 8+, MySQL, Vanilla JS, CSS custom properties, Lucide icons

### Target State
- **Integrated Business Dashboard**: Add RFP/proposal management as new module within existing admin system
- **Three Portals**: Super Admin (orchestration), Client Portal (view-only), Team Portal (work-only)
- **Maintain Consistency**: Use existing design system, components, and patterns
- **Zero Breaking Changes**: Existing HR/content features remain untouched

### Key Differentiator

**"Other platforms use AI to replace humans. We use AI to perfect human expertise - with complete operational security."**

---

## 2. Core Philosophy & Design Principles

### 2.1 Human-First, AI-Validates Philosophy

**Standard Procedure**: Every RFP undergoes dual validation where human experts lead the analysis and AI acts as the quality control layer to catch gaps and perfect the strategy.

#### Why Human-First is Superior

**Traditional Problem**:
- AI-only tools: Generic, miss nuance (85% failure rate)
- Human-only consultants: Can miss requirements in 100+ page docs
- **Solution**: Human strategic thinking + AI completeness checking = 22% win rate

#### The Dual Validation System:
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  👤 HUMAN ANALYSIS (Primary)                                │
│     ↓                                                       │
│  Strategic thinking, pain point identification,             │
│  relationship insights, capture strategy                    │
│     ↓                                                       │
│  🤖 AI VALIDATION (Quality Control)                         │
│     ↓                                                       │
│  Requirement completeness, compliance gaps,                 │
│  optimization suggestions, hallucination prevention         │
│     ↓                                                       │
│  ✅ PERFECTED ANALYSIS (98% Quality)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Design Philosophy Alignment

#### Existing Admin Dashboard Philosophy
```
✅ Business Intelligence First
✅ Visual Clarity (cards, gradients, generous white space)
✅ Data-Driven Decision Making
✅ Modern Professional Aesthetic (enterprise-grade UI)
✅ Mobile-Responsive
```

#### Business Dashboard Philosophy
```
✅ Human-First, AI-Validates
✅ Three-Portal Compartmentalization
✅ Progress Transparency
✅ Quality Score Tracking
✅ Real-Time Status Updates
```

#### Perfect Alignment ✨
Both systems prioritize:
- **Visual clarity** over information density
- **Progress tracking** with percentage indicators
- **Status-based color coding** (new, in-progress, completed)
- **Real-time updates** via AJAX
- **Card-based layouts** for modular content
- **Business metrics** prominently displayed

### 2.3 Integration Approach

✅ **EXTEND, not rebuild** - Add new modules to existing sidebar
✅ **REUSE components** - Leverage existing cards, modals, tables, Kanban boards
✅ **SAME design system** - Gold-purple gradients, Inter font, status badges
✅ **CONSISTENT patterns** - Same PHP structure, AJAX patterns, authentication
✅ **MODULAR architecture** - Business Dashboard can be disabled via feature flag

---

## 3. Multi-Capability Architecture

### 3.1 Vision: Service-Agnostic Business Dashboard

**Core Principle:** The Business Dashboard is fundamentally a **project orchestration system** that can handle ANY service capability - not just proposal writing.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         BUSINESS DASHBOARD FOUNDATION                       │
│         "Universal Project Orchestration Platform"         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current:                                                   │
│  ✅ Proposal Writing (RFP/RFQ Response)                     │
│                                                             │
│  Future Capabilities:                                       │
│  🔮 Website Development                                     │
│  🔮 Mobile App Development                                  │
│  🔮 CMMC 2.0 Consultancy                                    │
│  🔮 Copywriting Services                                    │
│  🔮 SEO/Digital Marketing                                   │
│  🔮 Brand Strategy                                          │
│  🔮 Technical Consulting                                    │
│  🔮 Training & Workshops                                    │
│  🔮 ANY future service line                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Service Catalog System

**Service Catalog** defines what capabilities Aliff Capital offers, each with its own workflow, stages, deliverables, and team roles.

```php
// File: /public/includes/classes/ServiceCatalog.php

class ServiceCatalog {

    /**
     * Get all available service capabilities
     */
    public static function getAllServices() {
        $db = getDBConnection();
        $stmt = $db->query("
            SELECT * FROM bd_service_catalog
            WHERE status = 'active'
            ORDER BY category, display_order
        ");
        return $stmt->fetchAll();
    }

    /**
     * Get service by ID
     */
    public static function getService($serviceId) {
        $db = getDBConnection();
        $stmt = $db->prepare("
            SELECT * FROM bd_service_catalog WHERE id = ?
        ");
        $stmt->execute([$serviceId]);
        return $stmt->fetch();
    }

    /**
     * Get workflow template for a service
     */
    public static function getWorkflowTemplate($serviceId) {
        $db = getDBConnection();
        $stmt = $db->prepare("
            SELECT * FROM bd_workflow_templates
            WHERE service_id = ?
            ORDER BY stage_order
        ");
        $stmt->execute([$serviceId]);
        return $stmt->fetchAll();
    }
}
```

### 3.3 Service Configuration Examples

#### **Service 1: Proposal Writing (Current)**

```
Service Name: RFP/Proposal Writing
Category: Government Contracting
Icon: 📝
Color Scheme: Purple-Gold (#667eea → #764ba2)

Workflow Stages:
1. Intake & Triage (4 hours) - Admin
2. Deep Research (2 days) - Team
3. Strategic Analysis (1 day) - Team
4. AI Validation Phase 1 (3 hours) - AI
5. Proposal Writing - Pink Gate (4 days) - Team
6. AI Validation Phase 2 - Red Gate (4 hours) - AI
7. Final Review - Gold Gate (1 day) - Admin
8. Client Approval (1 day) - Client
9. Submission (0.5 days) - Admin

Team Roles Required:
- Lead Researcher (Gov Contracting)
- Technical SME
- Proposal Writer
- Pricing Analyst
- Compliance Reviewer

Deliverable Types:
- Research Report
- Technical Approach
- Proposal Draft
- Pricing Proposal
- Final Proposal Package

Custom Fields:
- Solicitation Number
- Agency Name
- Contract Type (FFP, T&M, CPFF)
- NAICS Code
- Set-Aside Type
- Submission Deadline
```

#### **Service 2: Website Development**

```
Service Name: Website Development
Category: IT Services
Icon: 🌐
Color Scheme: Blue-Cyan (#3b82f6 → #06b6d4)

Workflow Stages:
1. Discovery & Requirements (3 days) - Admin + Client
2. Design Mockups (5 days) - Team (Designer)
3. Client Design Review (2 days) - Client
4. Frontend Development (10 days) - Team (Developer)
5. Backend Development (7 days) - Team (Developer)
6. Content Integration (3 days) - Team (Content)
7. QA & Testing (4 days) - Team (QA)
8. Client UAT (3 days) - Client
9. Launch & Deployment (1 day) - Admin
10. Post-Launch Support (30 days) - Team

Team Roles Required:
- UI/UX Designer
- Frontend Developer
- Backend Developer
- Content Specialist
- QA Engineer
- DevOps Engineer

Deliverable Types:
- Requirements Document
- Wireframes
- Design Mockups
- Frontend Code
- Backend API
- Content Assets
- Testing Reports
- Deployment Package

Custom Fields:
- Website Type (Corporate, E-commerce, Blog, Portfolio)
- Tech Stack (WordPress, React, Laravel, Custom)
- Number of Pages
- Hosting Provider
- Domain Name
- Go-Live Date
- Monthly Maintenance (Yes/No)
```

#### **Service 3: CMMC 2.0 Consultancy**

```
Service Name: CMMC 2.0 Consultancy
Category: Compliance & Security
Icon: 🛡️
Color Scheme: Red-Orange (#ef4444 → #f97316)

Workflow Stages:
1. Initial Assessment (2 days) - Team (Assessor)
2. Gap Analysis Report (3 days) - Team (Consultant)
3. Client Review & Planning (2 days) - Client
4. Remediation Plan Creation (5 days) - Team
5. Implementation Support (30 days) - Team
6. Pre-Assessment Audit (3 days) - Team
7. Corrective Actions (7 days) - Team
8. Final CMMC Assessment (2 days) - Team (C3PAO)
9. Certification Submission (1 day) - Admin

Team Roles Required:
- CMMC Assessor (C3PAO)
- Cybersecurity Consultant
- Technical Implementer
- Documentation Specialist
- Compliance Auditor

Deliverable Types:
- Gap Analysis Report
- System Security Plan (SSP)
- Plan of Action & Milestones (POA&M)
- Evidence Collection
- Assessment Report
- Certification Package

Custom Fields:
- CMMC Level (Level 1, Level 2, Level 3)
- Current Maturity Level
- Number of Assets
- CUI Types Handled
- Assessment Deadline
- C3PAO Assigned
- Certification Goal Date
```

#### **Service 4: Copywriting Services**

```
Service Name: Professional Copywriting
Category: Content & Marketing
Icon: ✍️
Color Scheme: Green-Teal (#10b981 → #14b8a6)

Workflow Stages:
1. Brief & Research (1 day) - Admin + Client
2. Outline & Strategy (1 day) - Team (Strategist)
3. First Draft (2 days) - Team (Copywriter)
4. AI Quality Check (2 hours) - AI
5. Internal Review (1 day) - Admin
6. Client Review Round 1 (2 days) - Client
7. Revisions (1 day) - Team (Copywriter)
8. Client Review Round 2 (1 day) - Client
9. Final Delivery (0.5 days) - Admin

Team Roles Required:
- Content Strategist
- Copywriter
- Editor/Proofreader
- SEO Specialist (optional)

Deliverable Types:
- Content Brief
- Research Notes
- Draft Copy
- Revised Copy
- Final Copy
- SEO Metadata (if applicable)

Custom Fields:
- Copy Type (Website, Blog, Ad, Email, Social)
- Word Count Target
- Tone of Voice (Professional, Casual, Technical)
- Target Audience
- SEO Keywords
- Brand Guidelines URL
- Usage Rights
```

#### **Service 5: Mobile App Development**

```
Service Name: Mobile App Development
Category: IT Services
Icon: 📱
Color Scheme: Indigo-Purple (#6366f1 → #8b5cf6)

Workflow Stages:
1. Discovery & Planning (5 days) - Admin + Client
2. UI/UX Design (10 days) - Team (Designer)
3. Client Design Approval (3 days) - Client
4. iOS Development (20 days) - Team (iOS Dev)
5. Android Development (20 days) - Team (Android Dev)
6. Backend API Development (15 days) - Team (Backend Dev)
7. Integration & Testing (7 days) - Team (QA)
8. Beta Testing (10 days) - Client + Users
9. App Store Submission (3 days) - Team
10. Launch & Monitoring (2 days) - Admin

Team Roles Required:
- Mobile UI/UX Designer
- iOS Developer (Swift)
- Android Developer (Kotlin)
- Backend Developer
- QA Engineer
- DevOps Engineer

Deliverable Types:
- Requirements Document
- User Flow Diagrams
- Design Mockups
- iOS App Binary
- Android App Binary
- Backend API
- Admin Dashboard
- Testing Reports
- App Store Assets

Custom Fields:
- Platform (iOS, Android, Both)
- App Category (Business, Social, E-commerce, etc.)
- Monetization (Free, Paid, Freemium, Subscription)
- Target iOS Version
- Target Android Version
- Backend Technology
- Expected User Base
- Launch Date
```

### 3.4 Database Schema: Multi-Capability Support

**New Tables for Service Catalog:**

```sql
-- =========================================
-- SERVICE CATALOG TABLES
-- =========================================

-- 1. Service Catalog (All capabilities Aliff Capital offers)
CREATE TABLE bd_service_catalog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(255) NOT NULL,
    service_slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color_primary VARCHAR(20),
    color_secondary VARCHAR(20),
    description TEXT,
    estimated_duration_days INT,
    base_price DECIMAL(10,2),
    status ENUM('active', 'inactive', 'coming_soon') DEFAULT 'active',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status)
);

-- 2. Workflow Templates (Configurable stages per service)
CREATE TABLE bd_workflow_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    stage_slug VARCHAR(100) NOT NULL,
    stage_order INT NOT NULL,
    estimated_hours INT,
    assigned_to_type ENUM('admin', 'team', 'ai', 'client') NOT NULL,
    requires_approval BOOLEAN DEFAULT FALSE,
    is_optional BOOLEAN DEFAULT FALSE,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES bd_service_catalog(id) ON DELETE CASCADE,
    INDEX idx_service_id (service_id),
    INDEX idx_stage_order (stage_order)
);

-- 3. Service Team Roles (Required roles per service)
CREATE TABLE bd_service_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    role_description TEXT,
    required_skills JSON,
    is_required BOOLEAN DEFAULT TRUE,
    typical_rate_per_hour DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES bd_service_catalog(id) ON DELETE CASCADE,
    INDEX idx_service_id (service_id)
);

-- 4. Service Deliverable Types
CREATE TABLE bd_service_deliverables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    deliverable_name VARCHAR(255) NOT NULL,
    deliverable_type VARCHAR(100),
    is_required BOOLEAN DEFAULT TRUE,
    template_file_path VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES bd_service_catalog(id) ON DELETE CASCADE,
    INDEX idx_service_id (service_id)
);

-- 5. Service Custom Fields (Dynamic fields per service type)
CREATE TABLE bd_service_custom_fields (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type ENUM('text', 'textarea', 'number', 'date', 'select', 'checkbox', 'file') NOT NULL,
    field_options JSON, -- For select/checkbox types
    is_required BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    validation_rules JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES bd_service_catalog(id) ON DELETE CASCADE,
    INDEX idx_service_id (service_id)
);

-- 6. Project Custom Field Values (Store dynamic field data)
CREATE TABLE bd_project_custom_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    custom_field_id INT NOT NULL,
    field_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES bd_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (custom_field_id) REFERENCES bd_service_custom_fields(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_field (project_id, custom_field_id),
    INDEX idx_project_id (project_id)
);
```

**Update Existing bd_projects Table:**

```sql
-- Add service_id to link projects to services
ALTER TABLE bd_projects
ADD COLUMN service_id INT AFTER id,
ADD FOREIGN KEY (service_id) REFERENCES bd_service_catalog(id);

-- Update project_codename to be more generic
ALTER TABLE bd_projects
MODIFY COLUMN project_codename VARCHAR(100) COMMENT 'Anonymized project name for team';
```

### 3.5 Admin UI: Service Management

**Service Catalog Manager** (`/admin/service-catalog.php`):

```
┌──────────────────────────────────────────────────────────┐
│  ⚙️ SERVICE CATALOG MANAGER                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [ + Add New Service ]                 🔍 Search...     │
│                                                          │
│  📝 GOVERNMENT CONTRACTING                               │
│  ┌────────────────────────────────────────────────┐    │
│  │ RFP/Proposal Writing                    ACTIVE │    │
│  │ 9 stages • 5 roles • 12 days avg               │    │
│  │ [Edit] [View Workflow] [Disable]               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  🌐 IT SERVICES                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Website Development                     ACTIVE │    │
│  │ 10 stages • 6 roles • 37 days avg              │    │
│  │ [Edit] [View Workflow] [Disable]               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Mobile App Development             COMING SOON │    │
│  │ 10 stages • 6 roles • 60 days avg              │    │
│  │ [Edit] [View Workflow] [Activate]              │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  🛡️ COMPLIANCE & SECURITY                                │
│  ┌────────────────────────────────────────────────┐    │
│  │ CMMC 2.0 Consultancy                    ACTIVE │    │
│  │ 9 stages • 5 roles • 56 days avg               │    │
│  │ [Edit] [View Workflow] [Disable]               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ✍️ CONTENT & MARKETING                                  │
│  ┌────────────────────────────────────────────────┐    │
│  │ Professional Copywriting                ACTIVE │    │
│  │ 9 stages • 4 roles • 9 days avg                │    │
│  │ [Edit] [View Workflow] [Disable]               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Workflow Template Editor** (`/admin/workflow-template-edit.php?service_id=2`):

```
┌──────────────────────────────────────────────────────────┐
│  WORKFLOW EDITOR: Website Development                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [ + Add Stage ]                                         │
│                                                          │
│  STAGE 1  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ┌────────────────────────────────────────────────┐    │
│  │ Stage Name: Discovery & Requirements           │    │
│  │ Duration: 3 days                               │    │
│  │ Assigned To: ● Admin  ○ Team  ○ AI  ○ Client  │    │
│  │ Requires Approval: ☑                           │    │
│  │ Optional: ☐                                    │    │
│  │ Instructions: Gather client requirements...    │    │
│  │ [Move Up] [Move Down] [Delete]                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  STAGE 2  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ┌────────────────────────────────────────────────┐    │
│  │ Stage Name: Design Mockups                     │    │
│  │ Duration: 5 days                               │    │
│  │ Assigned To: ○ Admin  ● Team  ○ AI  ○ Client  │    │
│  │ Requires Approval: ☑                           │    │
│  │ Optional: ☐                                    │    │
│  │ Instructions: Create visual designs...         │    │
│  │ [Move Up] [Move Down] [Delete]                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ... (more stages)                                       │
│                                                          │
│  [ Save Workflow ]  [ Preview ]  [ Cancel ]             │
└──────────────────────────────────────────────────────────┘
```

### 3.6 Client Experience: Service Selection

**Client Portal - New Project** (`/client-portal/new-project.php`):

```
┌──────────────────────────────────────────────────────────┐
│  START A NEW PROJECT                                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  What service do you need?                              │
│                                                          │
│  📝 GOVERNMENT CONTRACTING                               │
│  ┌────────────────────────────────────────────────┐    │
│  │ RFP/Proposal Writing                           │    │
│  │ Win government contracts with expert proposals │    │
│  │ ⏱️ ~12 days  •  💰 Starting at $5,000           │    │
│  │ [ Select Service ]                             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  🌐 IT SERVICES                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Website Development                            │    │
│  │ Custom websites that drive results             │    │
│  │ ⏱️ ~37 days  •  💰 Starting at $8,000           │    │
│  │ [ Select Service ]                             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Mobile App Development                         │    │
│  │ iOS & Android apps built for scale            │    │
│  │ ⏱️ ~60 days  •  💰 Starting at $25,000          │    │
│  │ [ Request Quote ]                              │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  🛡️ COMPLIANCE & SECURITY                                │
│  ┌────────────────────────────────────────────────┐    │
│  │ CMMC 2.0 Consultancy                           │    │
│  │ Achieve CMMC certification with confidence     │    │
│  │ ⏱️ ~56 days  •  💰 Starting at $12,000          │    │
│  │ [ Select Service ]                             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ✍️ CONTENT & MARKETING                                  │
│  ┌────────────────────────────────────────────────┐    │
│  │ Professional Copywriting                       │    │
│  │ Words that convert and engage                  │    │
│  │ ⏱️ ~9 days  •  💰 Starting at $500/piece        │    │
│  │ [ Select Service ]                             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Dynamic Project Form Based on Service:**

When client selects "Website Development", they see:

```
┌──────────────────────────────────────────────────────────┐
│  NEW PROJECT: Website Development                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📋 PROJECT DETAILS                                      │
│                                                          │
│  Project Name: ________________________________          │
│                                                          │
│  Website Type: [ Corporate ▼ ]                          │
│     Options: Corporate, E-commerce, Blog, Portfolio     │
│                                                          │
│  Tech Stack Preference: [ WordPress ▼ ]                 │
│     Options: WordPress, React, Laravel, Custom          │
│                                                          │
│  Number of Pages: [____]                                │
│                                                          │
│  Hosting Provider: ________________________________      │
│                                                          │
│  Domain Name: ________________________________           │
│                                                          │
│  Go-Live Date: [📅 Select Date]                         │
│                                                          │
│  Monthly Maintenance: ☐ Yes  ☐ No                       │
│                                                          │
│  📎 UPLOAD DOCUMENTS                                     │
│  • Brand Guidelines (optional)                          │
│  • Content/Copy (optional)                              │
│  • Design References (optional)                         │
│  • Existing Website Export (optional)                   │
│                                                          │
│  [Drag & Drop or Browse Files]                          │
│                                                          │
│  📝 ADDITIONAL REQUIREMENTS                              │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  [ Submit Project ]  [ Save Draft ]                     │
└──────────────────────────────────────────────────────────┘
```

When client selects "CMMC 2.0 Consultancy", they see different fields:

```
┌──────────────────────────────────────────────────────────┐
│  NEW PROJECT: CMMC 2.0 Consultancy                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📋 PROJECT DETAILS                                      │
│                                                          │
│  Organization Name: ________________________________      │
│                                                          │
│  CMMC Level Needed: ● Level 1  ● Level 2  ○ Level 3     │
│                                                          │
│  Current Maturity Level: [ Not Started ▼ ]              │
│     Options: Not Started, Basic, Intermediate, Advanced │
│                                                          │
│  Number of Assets: [____]                               │
│                                                          │
│  CUI Types Handled: ________________________________      │
│                                                          │
│  Assessment Deadline: [📅 Select Date]                  │
│                                                          │
│  C3PAO Preference: [ Any ▼ ]                            │
│                                                          │
│  Certification Goal Date: [📅 Select Date]              │
│                                                          │
│  📎 UPLOAD DOCUMENTS                                     │
│  • Current System Security Plan (SSP) (optional)        │
│  • Network Diagrams (optional)                          │
│  • Existing Policies (optional)                         │
│                                                          │
│  [Drag & Drop or Browse Files]                          │
│                                                          │
│  [ Submit Project ]  [ Save Draft ]                     │
└──────────────────────────────────────────────────────────┘
```

### 3.7 Benefits of Multi-Capability Architecture

✅ **Scalability**: Add new services without touching core code
✅ **Flexibility**: Each service has unique workflow, roles, and fields
✅ **Consistency**: All services use same portal system and UI
✅ **Client Clarity**: Clients see exactly what they're buying
✅ **Team Efficiency**: Workflows auto-configure based on service type
✅ **Data Integrity**: Service-specific validation and requirements
✅ **Business Growth**: Easy to expand into new markets
✅ **Reusability**: Duplicate and modify existing service templates

### 3.8 Migration Strategy

**Phase 1: Add Service Infrastructure** (Week 1-2)
- Create service catalog tables
- Build service management UI
- Create default "Proposal Writing" service

**Phase 2: Migrate Existing Projects** (Week 3)
- Link all existing projects to "Proposal Writing" service
- Preserve all current functionality
- Zero downtime migration

**Phase 3: Add Second Service** (Week 4-5)
- Add "Website Development" as proof of concept
- Test multi-service workflows
- Validate dynamic forms

**Phase 4: Enable Client Service Selection** (Week 6)
- Update client portal with service catalog
- Allow new project creation with service selection
- Maintain backward compatibility

**Phase 5: Add Remaining Services** (Ongoing)
- CMMC 2.0 Consultancy
- Copywriting Services
- Mobile App Development
- Future capabilities as needed

---

## 4. Comprehensive Process Flow

### 4.1 Three-Portal Architecture Overview

**Key Principle:** Clients and teams NEVER interact directly. Super Admin orchestrates all communication and maintains complete compartmentalization.

```
┌─────────────────────────────────────────────────────────┐
│         SUPER ADMIN PORTAL (Orchestration Hub)          │
│  • Full visibility of clients + teams + vendors         │
│  • Assign work to teams (anonymized for teams)          │
│  • Share client updates (filtered/sanitized)            │
│  • Approve deliverables before showing to clients       │
└─────────────────────────────────────────────────────────┘
                    ↓              ↓
        ┌───────────────┐   ┌────────────────┐
        │ CLIENT PORTAL │   │  TEAM PORTAL   │
        │ (View Only)   │   │ (Work Only)    │
        └───────────────┘   └────────────────┘
             ↕                      ↕
        Super Admin            Super Admin
        (Communication)        (Communication)
```

### 4.2 Stage 1: Project Initiation (Day 0)

**CLIENT PORTAL - Project Submission:**
```
┌──────────────────────────────────────────────────────────┐
│  CLIENT PORTAL                                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Client logs in → Clicks "New Project"                  │
│                                                          │
│  📝 PROJECT SUBMISSION FORM:                            │
│  ├─ RFP/RFQ Document Upload (Multiple files supported) │
│  ├─ Project Name: "VA Medical Center IT"               │
│  ├─ Solicitation Number                                 │
│  ├─ Deadline: Nov 15, 2025                             │
│  ├─ Estimated Contract Value: $2.5M                    │
│  ├─ Special Requirements: CMMC Level 2                 │
│  └─ [ Submit Project ]                                  │
│                                                          │
│  📎 SUPPORTED DOCUMENT UPLOADS:                         │
│  All major file formats supported for maximum flexibility│
│                                                          │
│  📄 Documents:                                           │
│  • PDF, DOCX, DOC, DOCM, DOTX, ODT, RTF, TXT, MD       │
│                                                          │
│  📊 Spreadsheets:                                        │
│  • XLSX, XLS, XLSM, CSV, ODS                            │
│                                                          │
│  📑 Presentations:                                       │
│  • PPTX, PPT, PPTM, ODP                                 │
│                                                          │
│  🖼️ Images:                                              │
│  • PNG, JPG, JPEG, GIF, WEBP, SVG, BMP, TIFF           │
│                                                          │
│  📦 Archives:                                            │
│  • ZIP, RAR, 7Z, TAR, GZ                                │
│                                                          │
│  🔧 Technical:                                           │
│  • XML, JSON, YAML, HTML, CSS, JS                       │
│                                                          │
│  ⚠️ Client can upload documents anytime during project  │
│     Super Admin has full control over distribution      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**What Happens:**
1. **Client OR Super Admin** can upload RFP/project documents
2. System creates project record (status: `pending_review`)
3. Super Admin receives instant email/SMS notification
4. **Super Admin has exclusive rights to:**
   - Delete any uploaded documents
   - Assign documents to team members
   - Receive deliverables from team
   - Control document visibility
5. Client sees: "Project submitted. We'll review within 24 hours"

### 4.3 Stage 2: Admin Intake & Planning (Day 0-1)

**SUPER ADMIN PORTAL - Project Setup:**
```
┌──────────────────────────────────────────────────────────┐
│  SUPER ADMIN: PROJECT SETUP                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📋 Project: VA Medical Center IT Services              │
│  Client: Acme Defense Solutions                         │
│                                                          │
│  STEP 1: PROJECT CONFIGURATION                          │
│  ├─ Generate Project Code: PROJ-2025-047               │
│  ├─ Internal Codename: "Operation Phoenix"             │
│  ├─ Industry Category: Healthcare IT (for team)        │
│  ├─ Anonymize Client: Yes ☑                            │
│  └─ Estimated Timeline: 12 days                         │
│                                                          │
│  STEP 2: WORKFLOW SETUP                                 │
│  Workflow Stages Created:                               │
│  1️⃣ Intake & Triage (Admin) - 4 hours                  │
│  2️⃣ Deep Research (Team) - 2 days                      │
│  3️⃣ Strategic Analysis (Team) - 1 day                  │
│  4️⃣ AI Validation Phase 1 (AI) - 3 hours               │
│  5️⃣ Proposal Writing - Pink Gate (Team) - 4 days      │
│  6️⃣ AI Validation Phase 2 - Red Gate (AI) - 4 hours   │
│  7️⃣ Final Review - Gold Gate (Admin) - 1 day          │
│  8️⃣ Client Approval (Client) - 1 day                   │
│  9️⃣ Submission (Admin) - 0.5 days                      │
│                                                          │
│  [ Save & Activate Project ]                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Client Receives Auto-Update:**
```
✅ Project Accepted!

Your project "VA Medical Center IT Services" has been
accepted and assigned Project ID: PROJ-2025-047

Timeline: 12 days (completing by Nov 14, 2025)
Next Update: Within 24 hours

[ View Project Dashboard ]
```

### 4.4 Stage 3: Admin Initial Analysis (Day 1)

**SUPER ADMIN - Work Breakdown:**
```
┌──────────────────────────────────────────────────────────┐
│  📋 WORK BREAKDOWN:                                      │
│  ┌────────────────────────────────────────────────┐    │
│  │ Assignment 1: Deep Research                     │    │
│  │ Need: Lead Researcher (gov contracting exp)     │    │
│  │ Tasks:                                          │    │
│  │ - CPARS analysis of incumbent                   │    │
│  │ - Past solicitation review (3-5 years)         │    │
│  │ - Competitive intelligence                      │    │
│  │ Deliverable: 15-20 page research report        │    │
│  │ Budget: $1,200 | Timeline: 2 days              │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Assignment 2: Technical Analysis                │    │
│  │ Need: IT/Healthcare SME                         │    │
│  │ Tasks:                                          │    │
│  │ - Technical requirements breakdown              │    │
│  │ - Solution architecture design                  │    │
│  │ - Risk assessment                               │    │
│  │ Deliverable: Technical approach outline        │    │
│  │ Budget: $1,500 | Timeline: 3 days              │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  [ Create Assignments & Post to Team Portal ]          │
└──────────────────────────────────────────────────────────┘
```

### 4.5 Stage 4: Team Assignment & Work (Days 2-4)

**TEAM PORTAL - Assignment View:**
```
┌──────────────────────────────────────────────────────────┐
│  TEAM MEMBER: Sarah Martinez (Lead Researcher)           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  🔔 NEW ASSIGNMENT AVAILABLE                             │
│                                                          │
│  📋 Assignment Details:                                  │
│  Project Code: PROJ-2025-047                            │
│  Project Name: Operation Phoenix                        │
│  Industry: Healthcare IT                                 │
│  Contract Type: Federal FFP                             │
│  Value Range: $1M-$5M                                   │
│                                                          │
│  Your Role: Lead Researcher                             │
│  Payment: $1,200 upon approval                          │
│  Deadline: Nov 4, 2025 5:00 PM (2 days)                │
│                                                          │
│  ⚠️ WORK REQUIREMENTS (IMPORTANT):                       │
│  ❌ DO NOT use external GenAI tools (ChatGPT, etc.)     │
│  ✅ READ all RFP documents thoroughly (digital/print)   │
│  ✅ Take detailed study notes and highlights            │
│  ✅ Use built-in AI Workplace if AI assistance needed   │
│                                                          │
│  DELIVERABLE FORMAT:                                     │
│  • 15-20 page analysis report (template provided)       │
│  • Executive summary (2 pages)                          │
│  • Recommended win themes (3-5)                         │
│  • 📝 YOUR STUDY NOTES (required for verification)      │
│  • 🖍️ DOCUMENT HIGHLIGHTS/ANNOTATIONS (required)        │
│                                                          │
│  🤖 NEED AI ASSISTANCE?                                  │
│  [ 💬 Open AI Workplace ] - Monitored, secure AI chat   │
│                                                          │
│  [ ✅ Accept Assignment ]  [ ❌ Decline ]                │
└──────────────────────────────────────────────────────────┘
```

**Team CANNOT see:**
- Client company name (anonymized as "Operation Phoenix")
- Client contact information
- Other team members on project
- Final client pricing

**Team MUST provide:**
- ✅ Analysis report
- ✅ Study notes (proves they read documents)
- ✅ Highlights/annotations from RFP review
- ✅ All work done manually or via controlled AI Workplace

**AI Workplace Feature:**
```
┌──────────────────────────────────────────────────────────┐
│  🤖 AI WORKPLACE - Secure Assistance                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Project: PROJ-2025-047 "Operation Phoenix"             │
│                                                          │
│  ⚠️ MONITORED ENVIRONMENT                                │
│  All AI interactions logged and reviewed by admin        │
│                                                          │
│  💬 CHAT WITH AI ASSISTANT:                             │
│  ┌────────────────────────────────────────────────┐    │
│  │ You: "Help me analyze this CPARS rating..."     │    │
│  │                                                  │    │
│  │ AI: "Based on the excerpt you provided..."      │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  📋 CONVERSATION HISTORY (saved to project)             │
│  • All queries logged                                   │
│  • Attached to your final submission                    │
│  • Admin reviews AI usage                               │
│                                                          │
│  ✅ ALLOWED: Questions, clarifications, formatting      │
│  ❌ NOT ALLOWED: "Write my entire analysis"            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.6 Stage 5: Team Submission & Admin Review (Day 4)

**Team Submits to Admin:**
```
┌──────────────────────────────────────────────────────────┐
│  📤 DELIVERABLE SUBMISSION                               │
│                                                          │
│  📄 Required Files:                                      │
│  ✅ Research_Report_Operation_Phoenix_v1.pdf (18 pages) │
│  ✅ Study_Notes_Sarah_Martinez.pdf (12 pages)           │
│  ✅ RFP_Highlights_Annotated.pdf (147 pages)            │
│  ✅ AI_Workplace_Conversation_Log.txt (3 queries)       │
│                                                          │
│  📝 Study Notes Summary:                                 │
│  "Read entire 147-page RFP twice. First pass: overview  │
│  and highlighting key requirements. Second pass: deep   │
│  analysis with note-taking on incumbent weaknesses,     │
│  evaluation criteria, and compliance requirements.      │
│  Total reading time: 8.5 hours across 2 days."         │
│                                                          │
│  🖍️ Annotation Summary:                                  │
│  • 47 highlighted requirements (Section L)              │
│  • 23 evaluation criteria notes (Section M)            │
│  • 18 technical requirement annotations                │
│  • 12 incumbent weakness markers                       │
│                                                          │
│  🤖 AI Usage Declaration:                                │
│  3 queries in AI Workplace (all logged):                │
│  1. "Clarify CMMC Level 2 timeline requirements"       │
│  2. "Format past performance table"                    │
│  3. "Verify FAR clause interpretation"                 │
│                                                          │
│  [ ✅ Confirm Submission ]                               │
└──────────────────────────────────────────────────────────┘
```

### 4.7 Stage 6: AI Validation (Day 4-5)

**Admin Triggers AI:**
```
┌──────────────────────────────────────────────────────────┐
│  SUPER ADMIN: AI Validation Controls                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  INPUT DOCUMENTS FOR AI:                                 │
│  ✅ Original RFP (147 pages)                             │
│  ✅ Research Report (18 pages)                          │
│  ✅ Strategic Analysis (12 pages)                       │
│  ✅ Win Themes Document (4 pages)                       │
│  ✅ Team Study Notes (12 pages) - NEW                   │
│  ✅ Annotated RFP (147 pages with highlights) - NEW     │
│  ✅ AI Workplace Logs (3 queries) - NEW                 │
│                                                          │
│  VALIDATION TASKS:                                       │
│  ☑ Completeness Check                                   │
│  ☑ Strategic Alignment                                  │
│  ☑ Compliance Validation (FAR/DFARS)                   │
│  ☑ Optimization Suggestions                             │
│  ☑ Study Notes Verification (manual work proof)        │
│  ☑ AI Usage Review (workplace logs)                    │
│                                                          │
│  AI MODELS (from .env configuration):                   │
│  🔧 OPENAI_API_KEY: ******************* (active)       │
│  🔧 CLAUDE_API_KEY: ******************* (active)       │
│  🔧 GEMINI_API_KEY: ******************* (inactive)     │
│                                                          │
│  SELECTED MODELS:                                        │
│  ☑ Primary: OpenAI GPT-4o (compliance checking)         │
│  ☑ Secondary: Claude Sonnet 4 (strategic analysis)      │
│                                                          │
│  [ ▶️ Start AI Validation ]                             │
└──────────────────────────────────────────────────────────┘
```

**AI Results:**
```
┌──────────────────────────────────────────────────────────┐
│  ✅ AI VALIDATION COMPLETE                               │
│  (Using OpenAI GPT-4o + Claude Sonnet 4)               │
│                                                          │
│  ✅ MANUAL WORK VERIFICATION:                            │
│  Study Notes Analysis: VERIFIED ✓                       │
│  • 12 pages of detailed reading notes                   │
│  • 8.5 hours documented reading time                    │
│  • 47 highlighted Section L requirements               │
│  • 23 evaluation criteria annotations                   │
│  • Evidence of two-pass reading strategy                │
│  ✓ Conclusion: Team member thoroughly read RFP         │
│                                                          │
│  🤖 AI WORKPLACE USAGE REVIEW:                           │
│  Total AI Queries: 3 (Appropriate usage ✓)             │
│  1. "Clarify CMMC Level 2 timeline" - ALLOWED ✓        │
│  2. "Format past performance table" - ALLOWED ✓        │
│  3. "Verify FAR clause interpretation" - ALLOWED ✓     │
│  ⚠️ No violations detected                              │
│  ✓ AI used for clarification, not content generation   │
│                                                          │
│  📊 CONTENT QUALITY ASSESSMENT:                          │
│  Human Work Quality: 88%                                 │
│  After AI Enhancements: 96% (+8%)                       │
│                                                          │
│  ⚠️ GAPS DETECTED (6 items):                            │
│                                                          │
│  🔴 CRITICAL (1):                                        │
│  └─ CMMC Level 2 certification timeline not specified   │
│                                                          │
│  🟡 MEDIUM (4):                                          │
│  ├─ Small Business Subcontracting Plan not addressed    │
│  ├─ SF-1449 form not mentioned                         │
│  ├─ Section 508 accessibility needs detail             │
│  └─ Transition plan timeline vague                      │
│                                                          │
│  💡 AI ENHANCEMENT SUGGESTIONS (12):                    │
│  1. Quantify veteran workforce percentage               │
│     Impact: +12% scoring potential                      │
│                                                          │
│  WIN PROBABILITY UPDATE:                                 │
│  Before AI: 72%                                          │
│  After Fixes Applied: 79% (projected) ↑                 │
└──────────────────────────────────────────────────────────┘
```

### 4.8 Complete Cycle Summary

```
DAY 0:   Client submits RFP
         ↓ Admin accepts & configures

DAY 1:   Admin initial analysis
         ↓ Creates team assignments (anonymized)

DAY 2-3: Team works on research
         ↓ Submits to admin (not client)

DAY 4:   Admin reviews & sanitizes
         ↓ Triggers AI validation
         ↓ AI finds 6 gaps, 12 enhancements
         ↓ Admin creates curated client update

DAY 5-8: Team writes proposal (Pink Gate)
         ↓ Admin reviews draft
         ↓ AI Red Gate validation
         ↓ Team fixes issues (never sees client)

DAY 9-11: Admin Gold Gate review
          ↓ Client preview & approval

DAY 12:  Final submission to government portal
```

**Total Touchpoints:**
- **Client**: 8-10 curated updates (all from admin)
- **Team**: 4-6 anonymized assignments
- **Admin**: Orchestrates 20+ actions
- **AI**: 3-4 validation cycles

**Key Achievement:** Complete transparency for client while maintaining full compartmentalization between client and team!

---

## 5. Three-Portal Architecture

### 4.1 Portal Roles & Access Control

```php
// File: /public/includes/classes/PortalAccessControl.php

class PortalAccessControl {

    // Define portal types
    const PORTAL_SUPER_ADMIN = 'super_admin';
    const PORTAL_CLIENT = 'client';
    const PORTAL_TEAM = 'team';

    /**
     * Check if current user can access portal type
     */
    public static function canAccessPortal($portalType) {
        $user = getCurrentUser();

        switch ($portalType) {
            case self::PORTAL_SUPER_ADMIN:
                return $user['type'] === 'admin' && $user['role'] === 'Super Admin';

            case self::PORTAL_CLIENT:
                return $user['type'] === 'client';

            case self::PORTAL_TEAM:
                return $user['type'] === 'admin' && in_array($user['role'], ['Recruiter', 'Proposal Writer', 'Researcher']);

            default:
                return false;
        }
    }

    /**
     * Get accessible projects for current user
     */
    public static function getAccessibleProjects() {
        $user = getCurrentUser();
        $db = getDBConnection();

        if ($user['type'] === 'admin' && $user['role'] === 'Super Admin') {
            // Super Admin: see ALL projects
            $stmt = $db->query("SELECT * FROM bd_projects WHERE status = 'active'");
            return $stmt->fetchAll();
        }

        if ($user['type'] === 'client') {
            // Client: see only THEIR projects
            $stmt = $db->prepare("
                SELECT p.* FROM bd_projects p
                INNER JOIN bd_project_clients pc ON p.id = pc.project_id
                WHERE pc.client_id = ? AND p.status = 'active'
            ");
            $stmt->execute([$user['id']]);
            return $stmt->fetchAll();
        }

        if ($user['type'] === 'admin') {
            // Team Member: see only ASSIGNED projects (anonymized)
            $stmt = $db->prepare("
                SELECT
                    p.id,
                    p.project_code,
                    p.project_codename AS project_title, -- Use codename, not real client name
                    NULL AS client_name, -- Hide client name
                    p.industry_category,
                    p.current_stage,
                    p.deadline,
                    pa.assignment_type,
                    pa.status AS assignment_status
                FROM bd_projects p
                INNER JOIN bd_project_assignments pa ON p.id = pa.project_id
                WHERE pa.team_member_id = ? AND p.status = 'active'
            ");
            $stmt->execute([$user['id']]);
            return $stmt->fetchAll();
        }

        return [];
    }
}
```

### 4.2 Portal-Specific Features

#### **Super Admin Portal** (`/admin/projects-*.php`)
- Full visibility of all projects
- Can see real client names
- Can assign teams
- Can approve/reject deliverables
- Can trigger AI validation
- Can create client updates

#### **Client Portal** (`/client-portal/`)
- View-only access to THEIR projects
- See progress updates
- Upload additional documents
- Download deliverables
- Cannot see team member names
- Cannot see internal pricing/costs

#### **Team Portal** (`/team-portal/`)
- Work-only access to ASSIGNED projects
- Cannot see client names (anonymized)
- Cannot see other team members
- Can upload deliverables
- Can use AI Workplace
- Cannot communicate directly with clients

---

## 6. Integration Strategy with Admin Dashboard

### 5.1 Navigation Integration

**Current Sidebar Structure:**
```
📊 Dashboard
━━━━━━━━━━━━━━
BUSINESS
  📈 Conversions
  📋 Audits
  📥 Support Inbox
  🎯 Leads Pipeline
━━━━━━━━━━━━━━
CONTENT & MARKETING
  📄 Insights Manager
  🏆 Case Studies
  📧 Newsletter
━━━━━━━━━━━━━━
LINKEDIN CAMPAIGN
  📊 Campaign Dashboard
  ✨ Content Generator
  ...
━━━━━━━━━━━━━━
HR & RECRUITMENT
  💼 Jobs
  👥 Applications
  📊 Pipeline
  📅 Interviews
━━━━━━━━━━━━━━
SYSTEM
  🛡️ Admin Users
  🔒 Two-Factor Auth
```

**NEW Integrated Sidebar Structure:**
```
📊 Dashboard
━━━━━━━━━━━━━━
BUSINESS
  📈 Conversions
  📋 Audits
  📥 Support Inbox
  🎯 Leads Pipeline
━━━━━━━━━━━━━━
📝 PROPOSAL MANAGEMENT [NEW SECTION]
━━━━━━━━━━━━━━
  🎯 Projects Dashboard     [NEW] - Super Admin: All projects overview
  📂 Active Projects        [NEW] - Super Admin: Active RFPs
  ✅ Completed Projects     [NEW] - Super Admin: Archive
  👥 Team Assignments       [NEW] - Super Admin: Assign work
  📊 AI Validation Queue    [NEW] - Super Admin: AI processing status
  💬 Client Portal Access   [NEW] - Super Admin: View as client
  🔧 Team Portal Access     [NEW] - Super Admin: View as team
  ⚙️ Project Settings       [NEW] - Super Admin: Workflow config
━━━━━━━━━━━━━━
CONTENT & MARKETING
  (existing items)
━━━━━━━━━━━━━━
LINKEDIN CAMPAIGN
  (existing items)
━━━━━━━━━━━━━━
HR & RECRUITMENT
  (existing items)
━━━━━━━━━━━━━━
SYSTEM
  (existing items)
```

### 5.2 Feature Flag Toggle

```php
// File: /public/includes/config.php

define('FEATURE_PROPOSAL_MANAGEMENT', true); // Set to false to hide entirely
```

```php
// File: /public/admin/includes/sidebar.php

<?php if (FEATURE_PROPOSAL_MANAGEMENT): ?>
<div class="sidebar-section">
    <div class="sidebar-section-header">📝 PROPOSAL MANAGEMENT</div>
    <a href="/admin/projects-dashboard.php" class="sidebar-link">
        <i data-lucide="target"></i>
        <span>Projects Dashboard</span>
    </a>
    <!-- More links -->
</div>
<?php endif; ?>
```

---

## 7. Database Schema

### 6.1 New Tables (All prefixed with `bd_`)

```sql
-- =========================================
-- BUSINESS DASHBOARD TABLES
-- =========================================

-- 1. Projects (RFP/Proposal Projects)
CREATE TABLE bd_projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    project_codename VARCHAR(100),
    client_name VARCHAR(255) NOT NULL,
    client_contact_email VARCHAR(255),
    client_contact_phone VARCHAR(50),
    project_title VARCHAR(500) NOT NULL,
    solicitation_number VARCHAR(100),
    contract_value DECIMAL(12,2),
    deadline DATE,
    industry_category VARCHAR(100),
    current_stage ENUM('pending_review', 'intake', 'human_analysis', 'ai_validation_1', 'pink_gate', 'ai_validation_2_red_gate', 'gold_gate', 'client_approval', 'submitted', 'won', 'lost') DEFAULT 'pending_review',
    progress_percentage INT DEFAULT 0,
    win_probability INT DEFAULT 0,
    quality_score INT DEFAULT 0,
    anonymize_for_team BOOLEAN DEFAULT TRUE,
    created_by INT, -- admin_users.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    status ENUM('active', 'completed', 'archived', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (created_by) REFERENCES admin_users(id),
    INDEX idx_project_code (project_code),
    INDEX idx_current_stage (current_stage),
    INDEX idx_status (status)
);

-- 2. Project Documents
CREATE TABLE bd_project_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    document_type ENUM('rfp_main', 'amendment', 'attachment', 'past_performance', 'capability_statement', 'deliverable', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    uploaded_by_type ENUM('admin', 'client', 'team') NOT NULL,
    uploaded_by INT, -- ID from respective user table
    visible_to_client BOOLEAN DEFAULT FALSE,
    visible_to_team BOOLEAN DEFAULT FALSE,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES bd_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_document_type (document_type)
);

-- 3. Project Assignments (Team Members)
CREATE TABLE bd_project_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    team_member_id INT NOT NULL, -- admin_users.id (team member)
    assignment_type ENUM('lead_researcher', 'technical_sme', 'proposal_writer', 'pricing_analyst', 'reviewer', 'other') NOT NULL,
    assignment_description TEXT,
    budget DECIMAL(10,2),
    deadline TIMESTAMP,
    status ENUM('pending', 'accepted', 'in_progress', 'submitted', 'approved', 'revision_requested', 'rejected') DEFAULT 'pending',
    assigned_by INT, -- admin_users.id (super admin)
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL,
    submitted_at TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES bd_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (team_member_id) REFERENCES admin_users(id),
    FOREIGN KEY (assigned_by) REFERENCES admin_users(id),
    INDEX idx_project_id (project_id),
    INDEX idx_team_member (team_member_id),
    INDEX idx_status (status)
);

-- 4. Team Deliverables
CREATE TABLE bd_team_deliverables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    deliverable_type ENUM('research_report', 'technical_analysis', 'proposal_draft', 'pricing_proposal', 'study_notes', 'annotated_rfp', 'other') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    submission_notes TEXT,
    study_notes_file VARCHAR(500),
    annotated_rfp_file VARCHAR(500),
    reading_time_hours DECIMAL(4,2),
    reading_method ENUM('digital', 'print', 'both'),
    ai_workplace_log_file VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_reviewed BOOLEAN DEFAULT FALSE,
    admin_approved BOOLEAN DEFAULT FALSE,
    admin_feedback TEXT,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES bd_project_assignments(id) ON DELETE CASCADE,
    INDEX idx_assignment_id (assignment_id),
    INDEX idx_admin_reviewed (admin_reviewed)
);

-- 5. AI Validation Queue
CREATE TABLE bd_ai_validation_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    validation_type ENUM('completeness', 'strategic_alignment', 'compliance', 'quality_check', 'study_notes_verification', 'full_validation') NOT NULL,
    input_documents JSON, -- Array of document IDs and paths
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    ai_provider VARCHAR(50), -- 'openai', 'claude', 'gemini'
    results JSON,
    quality_score INT,
    gaps_found INT DEFAULT 0,
    enhancements_suggested INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    error_message TEXT,
    FOREIGN KEY (project_id) REFERENCES bd_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);

-- 6. AI Workplace Sessions
CREATE TABLE bd_ai_workplace_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    team_member_id INT NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL,
    total_queries INT DEFAULT 0,
    status ENUM('active', 'completed', 'flagged') DEFAULT 'active',
    admin_reviewed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (project_id) REFERENCES bd_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (team_member_id) REFERENCES admin_users(id),
    INDEX idx_project_id (project_id),
    INDEX idx_team_member (team_member_id)
);

-- 7. AI Workplace Logs
CREATE TABLE bd_ai_workplace_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    query_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_query TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    ai_provider ENUM('openai', 'claude', 'gemini') NOT NULL,
    tokens_used INT,
    flagged BOOLEAN DEFAULT FALSE,
    flag_reason VARCHAR(255),
    FOREIGN KEY (session_id) REFERENCES bd_ai_workplace_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_flagged (flagged)
);

-- 8. Team Study Notes
CREATE TABLE bd_team_study_notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    team_member_id INT NOT NULL,
    notes_file_path VARCHAR(500) NOT NULL,
    pages_count INT NOT NULL,
    word_count INT NOT NULL,
    reading_time_hours DECIMAL(4,2),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ai_verified BOOLEAN DEFAULT FALSE,
    ai_verification_score INT,
    ai_verification_notes TEXT,
    admin_reviewed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (assignment_id) REFERENCES bd_project_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (team_member_id) REFERENCES admin_users(id),
    INDEX idx_assignment_id (assignment_id)
);

-- 9. Document Annotations
CREATE TABLE bd_document_annotations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    study_notes_id INT NOT NULL,
    document_section VARCHAR(100),
    page_number INT,
    highlight_text TEXT,
    annotation_note TEXT,
    annotation_type ENUM('requirement', 'evaluation_criteria', 'technical', 'compliance', 'other'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (study_notes_id) REFERENCES bd_team_study_notes(id) ON DELETE CASCADE,
    INDEX idx_study_notes_id (study_notes_id),
    INDEX idx_annotation_type (annotation_type)
);

-- 10. Project Activity Log
CREATE TABLE bd_project_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    activity_type ENUM('status_change', 'document_upload', 'assignment_created', 'deliverable_submitted', 'ai_validation', 'client_update', 'team_communication', 'other') NOT NULL,
    activity_title VARCHAR(255) NOT NULL,
    activity_description TEXT,
    performed_by_type ENUM('admin', 'client', 'team', 'system') NOT NULL,
    performed_by INT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES bd_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
);

-- 11. Client Portal Access
CREATE TABLE bd_client_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email)
);

-- 12. Project-Client Mapping
CREATE TABLE bd_project_clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    client_id INT NOT NULL,
    role ENUM('primary', 'collaborator', 'viewer') DEFAULT 'primary',
    FOREIGN KEY (project_id) REFERENCES bd_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES bd_client_users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_client (project_id, client_id),
    INDEX idx_project_id (project_id),
    INDEX idx_client_id (client_id)
);

-- 13. Client Updates
CREATE TABLE bd_client_updates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    update_title VARCHAR(255) NOT NULL,
    update_message TEXT NOT NULL,
    progress_percentage INT,
    win_probability INT,
    stage VARCHAR(100),
    attachments JSON, -- Array of document IDs
    sent_by INT, -- admin_users.id
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_by_client BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES bd_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (sent_by) REFERENCES admin_users(id),
    INDEX idx_project_id (project_id),
    INDEX idx_sent_at (sent_at)
);

-- 14. Workflow Configuration
CREATE TABLE bd_workflow_stages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    stage_order INT NOT NULL,
    estimated_hours INT,
    assigned_to_type ENUM('admin', 'team', 'ai', 'client') NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'skipped') DEFAULT 'pending',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES bd_projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_stage_order (stage_order)
);
```

---

## 8. Technical Implementation Details

### 7.1 Multi-Model AI Configuration

**Environment Variables (.env Setup):**
```env
# AI Model Configuration
OPENAI_API_KEY=sk-proj-***************************
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4096

CLAUDE_API_KEY=sk-ant-***************************
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=4096

GEMINI_API_KEY=AIza***************************
GEMINI_MODEL=gemini-1.5-pro
GEMINI_MAX_TOKENS=8192

# Primary AI Provider (openai, claude, gemini)
PRIMARY_AI_PROVIDER=openai
SECONDARY_AI_PROVIDER=claude

# AI Validation Settings
AI_VALIDATION_ENABLED=true
AI_WORKPLACE_ENABLED=true
AI_WORKPLACE_LOGGING=true
```

**PHP Implementation:**
```php
// File: /public/includes/classes/AIRouter.php

class AIRouter {
    private $primaryProvider;
    private $secondaryProvider;

    public function __construct() {
        $this->primaryProvider = $_ENV['PRIMARY_AI_PROVIDER'];
        $this->secondaryProvider = $_ENV['SECONDARY_AI_PROVIDER'];
    }

    public function validate($documents, $task) {
        // Use primary provider for main validation
        $primaryResult = $this->callAI($this->primaryProvider, $documents, $task);

        // Use secondary for cross-validation
        $secondaryResult = $this->callAI($this->secondaryProvider, $documents, $task);

        return [
            'primary' => $primaryResult,
            'secondary' => $secondaryResult,
            'consensus' => $this->buildConsensus($primaryResult, $secondaryResult)
        ];
    }

    private function callAI($provider, $documents, $task) {
        switch($provider) {
            case 'openai':
                return $this->callOpenAI($documents, $task);
            case 'claude':
                return $this->callClaude($documents, $task);
            case 'gemini':
                return $this->callGemini($documents, $task);
        }
    }
}
```

### 7.2 Study Notes Verification System

**AI-Powered Study Notes Verification:**
```php
// File: /public/includes/classes/StudyNotesVerifier.php

class StudyNotesVerifier {
    private $aiRouter;

    public function verifyStudyNotes($studyNotesPath, $originalRFPPath) {
        $studyNotes = file_get_contents($studyNotesPath);
        $rfpContent = file_get_contents($originalRFPPath);

        $prompt = "
        Analyze the following study notes to verify that the team member
        thoroughly read the RFP document.

        STUDY NOTES:
        {$studyNotes}

        RFP CONTENT (first 10 pages):
        " . substr($rfpContent, 0, 20000) . "

        VERIFICATION CRITERIA:
        1. Coverage: Do notes reference multiple RFP sections?
        2. Depth: Are there detailed observations beyond surface reading?
        3. Accuracy: Do highlighted items match actual RFP requirements?
        4. Evidence: Does reading time align with document complexity?

        Return JSON:
        {
            'verified': true/false,
            'confidence_score': 0-100,
            'coverage_score': 0-100,
            'depth_score': 0-100,
            'notes': 'explanation'
        }
        ";

        $result = $this->aiRouter->query($prompt, 'study_verification');

        return json_decode($result['text'], true);
    }
}
```

### 7.3 File Upload Handling & Validation

**Supported File Formats:**

The Business Dashboard supports an extensive variety of file formats to accommodate all types of RFP/proposal-related documents:

```php
// File: /public/includes/classes/FileUploadHandler.php

class FileUploadHandler {

    // Comprehensive allowed file types
    const ALLOWED_EXTENSIONS = [
        // Documents
        'pdf', 'docx', 'doc', 'docm', 'dotx', 'odt', 'rtf', 'txt', 'md',

        // Spreadsheets
        'xlsx', 'xls', 'xlsm', 'csv', 'ods',

        // Presentations
        'pptx', 'ppt', 'pptm', 'odp',

        // Images
        'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'tif',

        // Archives
        'zip', 'rar', '7z', 'tar', 'gz',

        // Technical files
        'xml', 'json', 'yaml', 'yml', 'html', 'css', 'js'
    ];

    // MIME type mapping for additional security
    const MIME_TYPES = [
        'pdf' => 'application/pdf',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'doc' => 'application/msword',
        'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xls' => 'application/vnd.ms-excel',
        'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'ppt' => 'application/vnd.ms-powerpoint',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'svg' => 'image/svg+xml',
        'zip' => 'application/zip',
        'csv' => 'text/csv',
        'txt' => 'text/plain',
        'md' => 'text/markdown',
        'json' => 'application/json',
        'xml' => 'application/xml',
    ];

    // Maximum file size: 100MB
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

    /**
     * Validate uploaded file
     */
    public function validateFile($file) {
        $errors = [];

        // Check if file was uploaded
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            $errors[] = 'No file uploaded or upload error occurred';
            return ['valid' => false, 'errors' => $errors];
        }

        // Check file size
        if ($file['size'] > self::MAX_FILE_SIZE) {
            $errors[] = 'File size exceeds maximum limit of 100MB';
        }

        // Get file extension
        $fileName = $file['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Check if extension is allowed
        if (!in_array($fileExtension, self::ALLOWED_EXTENSIONS)) {
            $errors[] = "File type '.{$fileExtension}' is not allowed. Supported types: " .
                       implode(', ', self::ALLOWED_EXTENSIONS);
        }

        // Verify MIME type (if mapping exists)
        if (isset(self::MIME_TYPES[$fileExtension])) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);

            $allowedMimes = (array) self::MIME_TYPES[$fileExtension];
            if (!in_array($mimeType, $allowedMimes)) {
                $errors[] = 'File MIME type does not match extension';
            }
        }

        // Check for malicious content (basic scan)
        $this->scanForMaliciousContent($file['tmp_name'], $errors);

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'extension' => $fileExtension,
            'size' => $file['size']
        ];
    }

    /**
     * Upload file to server
     */
    public function uploadFile($file, $projectId, $documentType, $uploadedByType, $uploadedById) {
        // Validate file first
        $validation = $this->validateFile($file);

        if (!$validation['valid']) {
            return [
                'success' => false,
                'errors' => $validation['errors']
            ];
        }

        // Generate safe filename
        $originalName = basename($file['name']);
        $extension = $validation['extension'];
        $safeFileName = $this->generateSafeFileName($originalName, $extension);

        // Create upload directory structure
        $uploadDir = $this->getUploadDirectory($projectId, $documentType);
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filePath = $uploadDir . '/' . $safeFileName;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            return [
                'success' => false,
                'errors' => ['Failed to save file to server']
            ];
        }

        // Save to database
        $db = getDBConnection();
        $stmt = $db->prepare("
            INSERT INTO bd_project_documents
            (project_id, document_type, file_name, file_path, file_size, uploaded_by_type, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $projectId,
            $documentType,
            $originalName,
            $filePath,
            $file['size'],
            $uploadedByType,
            $uploadedById
        ]);

        return [
            'success' => true,
            'document_id' => $db->lastInsertId(),
            'file_path' => $filePath,
            'file_name' => $safeFileName
        ];
    }

    /**
     * Generate safe filename with timestamp and random string
     */
    private function generateSafeFileName($originalName, $extension) {
        $baseName = pathinfo($originalName, PATHINFO_FILENAME);
        $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $baseName);
        $safeName = substr($safeName, 0, 50); // Limit length
        $timestamp = date('Ymd_His');
        $random = bin2hex(random_bytes(4));

        return "{$safeName}_{$timestamp}_{$random}.{$extension}";
    }

    /**
     * Get upload directory path
     */
    private function getUploadDirectory($projectId, $documentType) {
        $baseDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/projects';
        return "{$baseDir}/{$projectId}/{$documentType}";
    }

    /**
     * Basic malicious content scan
     */
    private function scanForMaliciousContent($filePath, &$errors) {
        // Read first 1KB of file
        $handle = fopen($filePath, 'r');
        $content = fread($handle, 1024);
        fclose($handle);

        // Check for suspicious patterns
        $suspiciousPatterns = [
            '/<script[^>]*>.*?<\/script>/is',
            '/<iframe[^>]*>.*?<\/iframe>/is',
            '/<?php/i',
            '/eval\s*\(/i',
            '/base64_decode\s*\(/i',
            '/exec\s*\(/i',
            '/system\s*\(/i',
            '/shell_exec\s*\(/i',
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                $errors[] = 'File contains potentially malicious content';
                break;
            }
        }
    }
}
```

**Frontend Upload Interface:**

```html
<!-- File: /public/admin/includes/file-upload-widget.php -->

<div class="file-upload-widget">
    <h3>📎 Upload Documents</h3>

    <div class="upload-dropzone" id="upload-dropzone">
        <div class="dropzone-content">
            <i data-lucide="upload-cloud" style="width: 48px; height: 48px;"></i>
            <h4>Drag & Drop Files Here</h4>
            <p>or click to browse</p>
            <input type="file" id="file-input" multiple hidden>
        </div>
    </div>

    <div class="supported-formats">
        <strong>Supported Formats:</strong>
        <div class="format-badges">
            <span class="badge">📄 Documents</span>
            <span class="badge">📊 Spreadsheets</span>
            <span class="badge">📑 Presentations</span>
            <span class="badge">🖼️ Images</span>
            <span class="badge">📦 Archives</span>
            <span class="badge">🔧 Technical</span>
        </div>
        <p class="format-details">
            PDF, DOCX, DOC, XLSX, XLS, PPTX, PPT, PNG, JPG, GIF, WEBP, SVG,
            ZIP, RAR, CSV, TXT, MD, XML, JSON, and more...
        </p>
        <p class="size-limit">Maximum file size: 100MB per file</p>
    </div>

    <div class="upload-queue" id="upload-queue" style="display: none;">
        <h4>Upload Queue</h4>
        <div id="queue-items"></div>
    </div>
</div>

<style>
.upload-dropzone {
    border: 2px dashed #667eea;
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    background: #f9fafb;
    cursor: pointer;
    transition: all 0.3s ease;
}

.upload-dropzone:hover,
.upload-dropzone.dragover {
    background: #f3f4f6;
    border-color: #764ba2;
}

.dropzone-content i {
    color: #667eea;
    margin-bottom: 16px;
}

.dropzone-content h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1f2937;
}

.dropzone-content p {
    color: #6b7280;
    font-size: 14px;
}

.supported-formats {
    margin-top: 24px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
}

.format-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0;
}

.format-badges .badge {
    background: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    border: 1px solid #e5e7eb;
}

.format-details {
    font-size: 12px;
    color: #6b7280;
    margin: 8px 0;
}

.size-limit {
    font-size: 12px;
    color: #9ca3af;
    font-style: italic;
}
</style>

<script>
// File upload with drag & drop
const dropzone = document.getElementById('upload-dropzone');
const fileInput = document.getElementById('file-input');

dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
});

async function handleFiles(files) {
    const queueDiv = document.getElementById('upload-queue');
    const queueItems = document.getElementById('queue-items');
    queueDiv.style.display = 'block';

    for (const file of files) {
        // Create queue item
        const item = document.createElement('div');
        item.className = 'queue-item';
        item.innerHTML = `
            <div class="file-info">
                <i data-lucide="file"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${formatFileSize(file.size)})</span>
            </div>
            <div class="upload-progress">
                <div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div>
                <span class="status">Uploading...</span>
            </div>
        `;
        queueItems.appendChild(item);

        // Upload file
        await uploadFile(file, item);
    }
}

async function uploadFile(file, itemElement) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);
    formData.append('document_type', 'attachment');

    try {
        const progressFill = itemElement.querySelector('.progress-fill');
        const status = itemElement.querySelector('.status');

        const response = await fetch('/admin/api/upload-document.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            progressFill.style.width = '100%';
            status.textContent = '✓ Uploaded';
            status.style.color = '#10b981';
        } else {
            status.textContent = '✗ ' + (result.errors?.[0] || 'Upload failed');
            status.style.color = '#ef4444';
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
</script>
```

---

### 7.4 Hostinger-Compatible Implementation

**Cron Job for AI Validation (Background Processing):**
```bash
# Add to Hostinger cron jobs:
# Run every 5 minutes to process AI validation queue

*/5 * * * * /usr/bin/php /home/username/public_html/cron/process-ai-validation.php
```

**Cron Script:**
```php
// File: /public/cron/process-ai-validation.php

require_once '../includes/db-connect.php';
require_once '../includes/classes/AIRouter.php';

// Get pending validation tasks
$stmt = $pdo->query("
    SELECT * FROM bd_ai_validation_queue
    WHERE status = 'pending'
    LIMIT 5
");

foreach ($stmt->fetchAll() as $task) {
    try {
        $aiRouter = new AIRouter();
        $result = $aiRouter->validate(
            $task['documents'],
            $task['validation_type']
        );

        // Save results
        $updateStmt = $pdo->prepare("
            UPDATE bd_ai_validation_queue
            SET status = 'completed',
                results = ?,
                completed_at = NOW()
            WHERE id = ?
        ");
        $updateStmt->execute([
            json_encode($result),
            $task['id']
        ]);

        // Notify admin
        sendAdminNotification($task['project_id'], 'AI validation complete');

    } catch (Exception $e) {
        // Log error
        error_log("AI validation failed: " . $e->getMessage());
    }
}
```

---

## 9. Component Reuse Strategy

### 8.1 Reuse Existing Components

#### **1. Module Cards (Dashboard)**
**Existing**: `/public/admin/includes/module-card.php`

```php
<!-- REUSE for Business Dashboard -->
<div class="module-card" style="border-color: #667eea;">
    <div class="module-header">
        <div class="module-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <i data-lucide="briefcase"></i>
        </div>
        <div>
            <h3 class="module-title">Proposal Projects</h3>
            <p class="module-subtitle">RFP/RFQ Management</p>
        </div>
    </div>
    <div class="module-metrics">
        <div class="metric-item">
            <span class="metric-value">12</span>
            <span class="metric-label">Active Projects</span>
        </div>
        <div class="metric-item">
            <span class="metric-value">79%</span>
            <span class="metric-label">Avg Win Rate</span>
        </div>
        <div class="metric-item">
            <span class="metric-value">$2.4M</span>
            <span class="metric-label">Pipeline Value</span>
        </div>
        <div class="metric-item">
            <span class="metric-value">8</span>
            <span class="metric-label">Team Members</span>
        </div>
    </div>
    <a href="/admin/projects-dashboard.php" class="btn-module-action">View All Projects →</a>
</div>
```

#### **2. Status Badges**
**CSS Extension** (add to admin.css):
```css
.status-badge.status-pending-review {
    background-color: #dbeafe;
    color: #1e40af;
}

.status-badge.status-human-analysis {
    background-color: #fef3c7;
    color: #92400e;
}

.status-badge.status-ai-validation {
    background-color: #e0e7ff;
    color: #4338ca;
}

.status-badge.status-pink-gate {
    background-color: #fce7f3;
    color: #9f1239;
}

.status-badge.status-red-gate {
    background-color: #fee2e2;
    color: #991b1b;
}

.status-badge.status-gold-gate {
    background-color: #fef3c7;
    color: #78350f;
}
```

#### **3. Kanban Board**
**Existing**: `/public/admin/pipeline.php` (recruitment pipeline)

```javascript
// REUSE SortableJS pattern for proposal stages
const stages = ['intake', 'human_analysis', 'ai_validation', 'pink_gate', 'red_gate', 'gold_gate', 'submitted'];

stages.forEach(stage => {
    const column = document.querySelector(`[data-stage="${stage}"]`);
    new Sortable(column, {
        group: 'proposal-pipeline',
        animation: 150,
        onEnd: async function(evt) {
            const projectId = evt.item.dataset.id;
            const newStage = evt.to.dataset.stage;
            await updateProjectStage(projectId, newStage);
        }
    });
});
```

---

## 10. Page-by-Page Implementation

### 9.1 Super Admin Projects Dashboard

**File**: `/admin/projects-dashboard.php`

**Purpose**: Super Admin overview of all proposal projects

**Key Features**:
- Statistics overview (active projects, avg win rate, pipeline value)
- Projects grid with status cards
- Search and filter functionality
- Create new project button

### 9.2 Client Portal Dashboard

**File**: `/client-portal/index.php`

**Purpose**: Client's view of THEIR projects (view-only)

**Key Features**:
- Welcome section with client name
- Active projects grid
- Project cards showing progress, win probability, quality score
- Submit new RFP button
- Empty state for no projects

### 9.3 Team Portal - My Assignments

**File**: `/team-portal/my-assignments.php`

**Purpose**: Team member's view of ASSIGNED projects (work-only, anonymized)

**Key Features**:
- Welcome section with team member name
- Assignments list (anonymized project names)
- Assignment cards showing role, deadline, payment
- Status indicators
- Empty state for no assignments

---

## 11. Implementation Phases

### **Phase 1: Foundation (Week 1-2)** 🏗️

**Goal**: Set up database, authentication, and basic Super Admin portal

**Tasks**:
1. ✅ Create all database tables (run migration script)
2. ✅ Create `PortalAccessControl.php` class
3. ✅ Update sidebar to include "Proposal Management" section
4. ✅ Create `projects-dashboard.php` (Super Admin overview)
5. ✅ Create project status card component
6. ✅ Create basic API endpoints (`projects-api.php`)
7. ✅ Test: Super Admin can view projects dashboard

**Deliverables**:
- Database schema complete
- Super Admin can see projects dashboard
- Can create new projects manually (via database or simple form)

---

### **Phase 2: Super Admin Features (Week 3-4)** 👑

**Goal**: Complete Super Admin portal functionality

**Tasks**:
1. ✅ Create `project-details.php` (full project view)
2. ✅ Create `project-assignments.php` (assign teams)
3. ✅ Create `team-submissions.php` (review deliverables)
4. ✅ Create `client-updates-manager.php` (create client updates)
5. ✅ Create activity feed component
6. ✅ Add document upload/management
7. ✅ Test: Complete project lifecycle from Super Admin side

**Deliverables**:
- Super Admin can manage full project lifecycle
- Can assign team members
- Can review team submissions
- Can create client updates

---

### **Phase 3: AI Integration (Week 5-6)** 🤖

**Goal**: Implement AI validation system

**Tasks**:
1. ✅ Create `AIRouter.php` class (OpenAI/Claude/Gemini)
2. ✅ Create `StudyNotesVerifier.php` class
3. ✅ Create `ai-validation-queue.php` page
4. ✅ Create AI validation API endpoints
5. ✅ Create AI Workplace feature (session management)
6. ✅ Create cron job for background AI processing
7. ✅ Create AI validation results widget
8. ✅ Test: AI validation end-to-end

**Deliverables**:
- AI can validate proposals
- Study notes verification working
- AI Workplace functional
- Background processing via cron

---

### **Phase 4: Client Portal (Week 7-8)** 👥

**Goal**: Build client-facing portal

**Tasks**:
1. ✅ Create `bd_client_users` authentication
2. ✅ Create client portal pages (index, project-view, submit-rfp)
3. ✅ Create client portal header/sidebar
4. ✅ Create client portal CSS (simplified, view-only design)
5. ✅ Create document download functionality
6. ✅ Test: Client can log in and view their projects

**Deliverables**:
- Client portal fully functional
- Clients can submit RFPs
- Clients can view progress
- Clients can download deliverables

---

### **Phase 5: Team Portal (Week 9-10)** 🛠️

**Goal**: Build team-facing portal

**Tasks**:
1. ✅ Create team portal pages (index, my-assignments, assignment-detail)
2. ✅ Create team portal header/sidebar
3. ✅ Create team portal CSS (work-focused design)
4. ✅ Create deliverable submission forms
5. ✅ Create AI Workplace interface (team-side)
6. ✅ Create study notes upload interface
7. ✅ Test: Team member can accept assignments and submit work

**Deliverables**:
- Team portal fully functional
- Team can view anonymized assignments
- Team can submit deliverables
- AI Workplace accessible to team

---

### **Phase 6: Polish & Testing (Week 11-12)** ✨

**Goal**: Refinement and comprehensive testing

**Tasks**:
1. ✅ End-to-end testing (all three portals)
2. ✅ UI/UX refinement
3. ✅ Performance optimization
4. ✅ Security audit
5. ✅ Documentation
6. ✅ User training materials
7. ✅ Deploy to production

**Deliverables**:
- All bugs fixed
- Documentation complete
- System ready for production use

---

## 12. Admin Dashboard Context & Modules

### 11.1 Admin Dashboard Philosophy

The Business Dashboard integrates seamlessly into the existing Aliff Capital Admin Dashboard, which manages:

**BUSINESS**
- Conversions tracking
- Compliance audits
- Support inbox
- Leads pipeline

**CONTENT & MARKETING**
- Insights/blog manager
- Case studies
- Newsletter campaigns

**LINKEDIN CAMPAIGN**
- Campaign dashboard
- Content generator
- Prospect management

**HR & RECRUITMENT**
- Job postings
- Applications management
- Recruitment pipeline
- Interview scheduling

**SYSTEM**
- Admin users management
- Two-factor authentication
- Activity logs

### 11.2 Implementation Priority Matrix

#### 🔥 HIGH PRIORITY (Implemented)
**Direct revenue impact, core business functions**

1. Compliance Audits Dashboard ✅
2. Leads Pipeline Manager ✅
3. Contact Form Submissions ✅
4. Insights/Blog Manager ✅
5. Admin Users Management ✅
6. Analytics Dashboard ✅
7. **Proposal Management (Business Dashboard)** ⬅️ NEW

#### ⚡ MEDIUM PRIORITY
**Important but not critical, enhance operations**

- Newsletter Campaigns
- Newsletter Subscribers
- Case Studies Manager
- Activity Logs
- Job Performance Analytics
- Email Templates Manager
- Site Settings

#### 💡 LOW PRIORITY
**Convenience features, can wait**

- File Manager
- Notification Center
- Import Tools
- Resources Library

### 11.3 Technical Feasibility

**✅ Fully Achievable with PHP/HTML:**
- All list/table views
- CRUD operations
- Form submissions
- File uploads
- PDF generation
- CSV export/import
- Email sending
- Search/filter
- Basic charts (with Chart.js)

**⚠️ Requires JavaScript Libraries:**
- Kanban boards (Dragula.js or SortableJS)
- Rich text editors (TinyMCE or Quill)
- Date pickers (Flatpickr)
- Charts (Chart.js or ApexCharts)
- Real-time updates (AJAX polling)

---

## 🎯 Key Integration Principles

### ✅ **DO**
1. **Reuse existing components** wherever possible
2. **Follow existing code patterns** (PHP structure, AJAX, CSS)
3. **Maintain design consistency** (colors, fonts, spacing)
4. **Use feature flags** for easy enable/disable
5. **Keep existing features untouched** (zero breaking changes)
6. **Document all new features** in existing admin style

### ❌ **DON'T**
1. **Don't rebuild existing components** - extend them instead
2. **Don't introduce new dependencies** unless absolutely necessary
3. **Don't change existing database tables** - add new ones
4. **Don't alter core authentication** - extend it for portals
5. **Don't break existing navigation** - add new section
6. **Don't ignore mobile responsiveness** - maintain consistency

---

## File Structure Overview

```
/public/
├── admin/
│   ├── includes/
│   │   ├── header.php [UPDATED - add portal switcher]
│   │   ├── sidebar.php [UPDATED - add proposal management section]
│   │   ├── project-status-card.php [NEW]
│   │   ├── ai-validation-widget.php [NEW]
│   │   └── portal-switcher.php [NEW]
│   │
│   ├── api/
│   │   ├── projects-api.php [NEW]
│   │   ├── assignments-api.php [NEW]
│   │   ├── ai-validation-api.php [NEW]
│   │   └── ai-workplace/ [NEW DIRECTORY]
│   │
│   ├── projects-dashboard.php [NEW]
│   ├── project-details.php [NEW]
│   ├── projects-active.php [NEW]
│   └── ... (more project pages)
│
├── client-portal/ [NEW DIRECTORY]
│   ├── index.php [NEW]
│   ├── login.php [NEW]
│   ├── project-view.php [NEW]
│   └── submit-rfp.php [NEW]
│
├── team-portal/ [NEW DIRECTORY]
│   ├── index.php [NEW]
│   ├── my-assignments.php [NEW]
│   ├── assignment-detail.php [NEW]
│   └── ai-workplace.php [NEW]
│
├── includes/
│   ├── classes/
│   │   ├── AIRouter.php [NEW]
│   │   ├── StudyNotesVerifier.php [NEW]
│   │   ├── PDFAnnotationParser.php [NEW]
│   │   ├── PortalAccessControl.php [NEW]
│   │   ├── ProjectManager.php [NEW]
│   │   └── FileUploadHandler.php [NEW - handles all file types]
│   └── config.php [UPDATED - add feature flag]
│
└── cron/
    ├── process-ai-validation.php [NEW]
    └── send-client-updates.php [NEW]
```

---

## Success Metrics

**Key Success Metrics**:
- ✅ Zero breaking changes to existing admin dashboard
- ✅ 100% design consistency maintained
- ✅ All three portals fully functional
- ✅ AI validation system operational
- ✅ Complete compartmentalization between portals
- ✅ Sub-200ms page load times maintained

---

## Document Metadata

**Document Created**: 2025-11-02
**Last Updated**: 2025-11-03
**Status**: Design Complete - Ready for Development
**Architecture**: Human-First Workflow + Compartmentalized Three-Portal System
**Owner**: Aliff Capital Product Team
**Estimated Timeline**: 12 weeks (3 months)
**Team Size**: 2-3 developers + 1 designer
**Risk Level**: Low (non-breaking, modular integration)

---

## Appendix: Supported File Formats - Quick Reference

### 📄 Documents (9 formats)
- **PDF**: Portable Document Format
- **DOCX, DOC, DOCM, DOTX**: Microsoft Word formats
- **ODT**: OpenDocument Text
- **RTF**: Rich Text Format
- **TXT**: Plain text
- **MD**: Markdown

### 📊 Spreadsheets (5 formats)
- **XLSX, XLS, XLSM**: Microsoft Excel formats
- **CSV**: Comma-Separated Values
- **ODS**: OpenDocument Spreadsheet

### 📑 Presentations (4 formats)
- **PPTX, PPT, PPTM**: Microsoft PowerPoint formats
- **ODP**: OpenDocument Presentation

### 🖼️ Images (9 formats)
- **PNG**: Portable Network Graphics
- **JPG, JPEG**: Joint Photographic Experts Group
- **GIF**: Graphics Interchange Format
- **WEBP**: Web Picture format
- **SVG**: Scalable Vector Graphics
- **BMP**: Bitmap
- **TIFF, TIF**: Tagged Image File Format

### 📦 Archives (5 formats)
- **ZIP**: ZIP archive
- **RAR**: RAR archive
- **7Z**: 7-Zip archive
- **TAR**: Tape Archive
- **GZ**: GNU Zip

### 🔧 Technical Files (6 formats)
- **XML**: Extensible Markup Language
- **JSON**: JavaScript Object Notation
- **YAML, YML**: YAML Ain't Markup Language
- **HTML**: HyperText Markup Language
- **CSS**: Cascading Style Sheets
- **JS**: JavaScript

### File Upload Specifications
- **Maximum File Size**: 100MB per file
- **Security**: MIME type validation, malicious content scanning
- **Storage**: Organized by project ID and document type
- **Naming**: Auto-generated safe filenames with timestamps
- **Upload Methods**: Drag & drop, browse, API upload
- **Supported By**: All three portals (Client, Team, Super Admin)

**Total Supported Formats**: 38+ file types across 6 categories

---

**Key Differentiator**:

"Other platforms use AI to replace humans. We use AI to perfect human expertise - with complete operational security."

**Let's build this! 🚀**
