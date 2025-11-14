# Aliff AI - Solicitation Diagnosis Lab (SDL)

**Complete RFP/Solicitation Triage System**

The SDL is Aliff AI's crown jewel competitive advantage - a comprehensive AI-powered system for analyzing government contract solicitations in under 2 minutes.

## Overview

The SDL provides end-to-end triage of RFPs, RFQs, and other solicitations:

```
📄 Document → 🔍 Parsing → 📊 Metadata → 📋 Requirements → ✅ Compliance → 🎯 Scoring → 📈 Decision
```

**Complete Analysis in < 2 minutes:**
- Parse PDF/DOCX/TXT documents
- Extract 47 metadata fields
- Identify requirements (must/should/nice-to-have)
- Detect compliance frameworks (FedRAMP, CMMC, NIST, etc.)
- Calculate complexity (0-100) and win probability (0-100%)
- Generate go/no-go recommendation with confidence

## Quick Start

```typescript
import { SDL } from '@/lib/aliff/sdl';

// Run complete triage
const result = await SDL.runTriage(pdfBuffer, 'rfp-12345.pdf', {
  model: 'gpt-4',
  organizationProfile: {
    name: 'Acme Corp',
    capabilities: ['cloud', 'AI/ML', 'DevSecOps'],
    certifications: ['ISO 27001'],
    complianceStatus: { fedramp: 'moderate' },
    financialCapacity: 10000000,
  },
});

// Check recommendation
console.log(result.summary.recommendation); // 'pursue', 'monitor', or 'pass'
console.log(result.summary.viability); // 0-100
console.log(result.summary.winProbability); // 0-100%

// Generate executive report
const report = SDL.generateExecutiveReport(result);
console.log(report); // Markdown report
```

## Architecture

### Modules

```
sdl/
├── parsing/          # Document parsing (PDF, DOCX, TXT)
├── extraction/       # Metadata extraction (47 fields)
├── requirements/     # Requirements extraction & categorization
├── compliance/       # Framework detection & gap analysis
├── scoring/          # Complexity & win probability scoring
└── triage/          # Main orchestrator & reporting
```

### Pipeline Stages

#### 1. **Parsing** (0.5-2s)
- Parse PDF, DOCX, TXT documents
- Extract text, structure, metadata
- Validate document integrity

```typescript
const parseResult = await SDL.parseDocument(buffer, 'rfp.pdf');
// Returns: document content, structure, metadata, word count
```

#### 2. **Metadata Extraction** (5-10s)
- Extract **47 metadata fields** across 6 categories
- Use AI (Gemini for speed) with GPT-4 fallback
- Confidence scoring per field

**Categories:**
- **Administrative** (8): solicitation #, title, agency, contracting officer, set-aside, procurement type
- **Timeline** (7): issue date, response deadline, Q&A deadline, award date, performance period, options
- **Financial** (6): estimated value, min/max, budget, contract type, payment terms
- **Technical** (10): NAICS/PSC codes, clearances, location, technologies, deliverables
- **Submission** (8): method, page limit, format, sections, volumes
- **Evaluation** (8): criteria, method, weights, key personnel requirements

```typescript
const metadata = await SDL.extractMetadata(document);
// Returns: 47 fields with confidence scores, missing fields, warnings
```

#### 3. **Requirements Extraction** (10-15s)
- Extract explicit requirements from SOW/PWS
- Derive implicit requirements from standards
- Categorize by priority (must/should/nice-to-have)
- Extract evaluation criteria (Section M)

```typescript
const requirements = await SDL.extractRequirements(document);
// Returns: 20-50 requirements with priority, category, complexity
```

#### 4. **Compliance Analysis** (15-20s)
- Auto-detect compliance frameworks (FedRAMP, CMMC, NIST, HIPAA, etc.)
- Generate framework-specific checklists
- Identify critical gaps
- Calculate remediation cost and timeline

**Supported Frameworks:**
- **FedRAMP** (Low/Moderate/High) - Cloud security
- **CMMC** (Levels 1-3) - DoD cybersecurity
- **NIST 800-53** - Federal security controls
- **HIPAA** - Healthcare data
- **SOC 2**, **ISO 27001**, **DFARS**, **FAR**, **ITAR**, **Section 508**

```typescript
const compliance = await SDL.analyzeCompliance(document, requirements);
// Returns: frameworks, gaps, compliance rate, remediation cost/time
```

#### 5. **Scoring** (10-15s)
- **Complexity Score** (0-100) across 5 dimensions:
  - Technical (30%): requirements, integrations, innovation
  - Compliance (25%): frameworks, gaps, stringency
  - Schedule (20%): timeline pressure, ramp-up
  - Team (15%): skills, clearances, key personnel
  - Cost (10%): investment, infrastructure, risk

- **Win Probability** (0-100%) across 5 factors:
  - Capability (30%): do we have technical capabilities?
  - Experience (25%): relevant past performance?
  - Relationships (15%): agency relationships?
  - Pricing (20%): competitive pricing?
  - Differentiation (10%): unique advantages?

- **Competitive Analysis**: competitors, incumbent advantage, differentiators, win themes

- **Bid Decision**: pWin, ROI, expected value (pWin × profit), strategic value

```typescript
const scoring = await SDL.scoreOpportunity(metadata, requirements, compliance, {
  organizationProfile: { ... }
});
// Returns: complexity, winProbability, competitive analysis, bid decision
```

#### 6. **Triage Orchestration** (40-60s total)
- Coordinate all stages
- Generate executive summary
- Make go/no-go recommendation

```typescript
const triage = await SDL.runTriage(buffer, 'rfp.pdf');
console.log(triage.summary.recommendation); // pursue/monitor/pass
```

## API Reference

### Main Entry Points

```typescript
// Full triage (recommended)
runTriage(buffer: Buffer, filename: string, config?: TriageConfig): Promise<TriageResult>

// Batch triage
runBatchTriage(request: BatchTriageRequest): Promise<BatchTriageResult>
```

### Individual Modules

```typescript
// Parsing
SDL.parseDocument(buffer, filename, options?)
SDL.parseDocumentFile(filePath, options?)

// Metadata
SDL.extractMetadata(document, config?)
SDL.extractMetadataQuick(document, config?) // Fast mode

// Requirements
SDL.extractRequirements(document, config?)
SDL.filterByPriority(requirements, 'must-have')
SDL.searchRequirements(requirements, 'security')

// Compliance
SDL.analyzeCompliance(document, requirements, config?)
SDL.getHighPriorityGaps(gaps, threshold?)
SDL.calculateRemediationCost(gaps)

// Scoring
SDL.scoreOpportunity(metadata, requirements, compliance, config?)
SDL.getComplexityLevel(score)
```

### Report Generation

```typescript
// Executive report (markdown)
SDL.generateExecutiveReport(result): string

// Batch report
SDL.generateBatchReport(batchResult): string

// Concise summary
SDL.generateConciseSummary(result): string

// JSON export
SDL.generateJSONReport(result): string
```

## Configuration

### Triage Config

```typescript
interface TriageConfig {
  // AI settings
  useAI: boolean;
  model?: 'gemini' | 'gpt-4' | 'claude';
  parallelProcessing?: boolean;

  // Processing options
  extractMetadata?: boolean;
  extractRequirements?: boolean;
  analyzeCompliance?: boolean;
  scoreOpportunity?: boolean;

  // Detail level
  detailLevel?: 'quick' | 'standard' | 'comprehensive';

  // Organization profile
  organizationProfile?: {
    name: string;
    capabilities: string[];
    pastPerformance: string[];
    teamSize: number;
    certifications: string[];
    complianceStatus: {
      fedramp?: 'none' | 'low' | 'moderate' | 'high';
      cmmc?: 'none' | 'level-1' | 'level-2' | 'level-3';
    };
    financialCapacity: number;
    strategicPriorities?: string[];
  };

  // Thresholds
  thresholds?: {
    minViability?: number; // 0-100
    minWinProbability?: number;
    maxComplexity?: number;
    minComplianceRate?: number;
  };
}
```

### Detail Level Presets

```typescript
// Quick mode: ~20s, Gemini, basic analysis
{ detailLevel: 'quick' }

// Standard mode: ~60s, GPT-4, full analysis (default)
{ detailLevel: 'standard' }

// Comprehensive mode: ~120s, GPT-4, sequential processing
{ detailLevel: 'comprehensive' }
```

## Example Results

### Executive Summary

```
📊 VIABILITY: 72/100 🟢
🎯 pWIN: 55% ⚠️
⚙️  COMPLEXITY: 68/100 🟠
✅ COMPLIANCE: 45% 🟠

🎬 DECISION: MONITOR 👀

Rationale: Strong technical fit but FedRAMP gap is significant.
Recommend pursuing if we can partner with FedRAMP-authorized entity.
```

### Detailed Output

```typescript
{
  summary: {
    title: "Enterprise Cloud Migration Services",
    agency: "Department of Defense",
    solicitationNumber: "FA8726-25-R-0001",
    estimatedValue: 5000000,
    responseDeadline: "2025-03-15",

    viability: 72,        // Overall opportunity score
    complexity: 68,       // High complexity
    winProbability: 55,   // Moderate pWin
    complianceRate: 45,   // Below threshold

    recommendation: "monitor", // pursue / monitor / pass
    confidence: 0.75,

    keyStrengths: [
      "Strong technical capabilities in cloud and AI/ML",
      "Relevant past performance on 3 similar projects"
    ],
    keyChallenges: [
      "No current FedRAMP authorization",
      "Incumbent has 5-year track record"
    ],
    criticalGaps: [
      "FedRAMP High authorization required - 9-12 month timeline"
    ],

    stats: {
      fieldsExtracted: 42,        // out of 47
      requirementsFound: 35,
      mustHaveRequirements: 18,
      complianceFrameworks: 2,    // FedRAMP, NIST
      criticalComplianceGaps: 2,
      estimatedBidCost: 150000,
      expectedValue: 440000,      // pWin × profit
    }
  }
}
```

## Performance

### Typical Performance

| Stage | Time | AI Calls | Cost |
|-------|------|----------|------|
| Parsing | 1s | 0 | $0 |
| Metadata | 10s | 6 | $0.90 |
| Requirements | 15s | 2 | $0.30 |
| Compliance | 20s | 4 | $0.60 |
| Scoring | 10s | 4 | $0.60 |
| **Total** | **~60s** | **16** | **$2.40** |

### Batch Processing

Process 10 RFPs in parallel: ~120s, ~$24

## Use Cases

### 1. Daily Opportunity Screening
```typescript
// Screen all SAM.gov opportunities
const rfps = await fetchNewRFPs();
const batch = await SDL.runBatchTriage({
  documents: rfps,
  config: { detailLevel: 'quick' }
});

// Focus on high-priority
const highPriority = batch.ranked
  .filter(r => r.summary.recommendation === 'pursue')
  .slice(0, 5);
```

### 2. Deep Dive Analysis
```typescript
// Comprehensive analysis for serious opportunities
const result = await SDL.runTriage(buffer, filename, {
  detailLevel: 'comprehensive',
  organizationProfile: myOrgProfile,
  thresholds: {
    minViability: 70,
    minWinProbability: 50,
    maxComplexity: 80,
  }
});

const report = SDL.generateExecutiveReport(result);
await sendToTeam(report);
```

### 3. Competitive Intelligence
```typescript
const result = await SDL.runTriage(buffer, filename);

console.log(result.scoring.competitive);
// {
//   estimatedCompetitors: 5,
//   incumbentAdvantage: true,
//   incumbentName: "ABC Corporation",
//   winThemes: [
//     "Innovation: Next-gen AI with explainability",
//     "Agility: Faster deployment with DevSecOps"
//   ]
// }
```

## Best Practices

### 1. Configure Organization Profile
Set up your organization profile once and reuse:

```typescript
const orgProfile = {
  name: 'Acme Corp',
  capabilities: ['cloud', 'AI/ML', 'DevSecOps', 'data-analytics'],
  pastPerformance: [
    'DoD cloud migration (2023)',
    'AI chatbot for VA (2024)'
  ],
  certifications: ['ISO 27001', 'CMMC Level 2'],
  complianceStatus: {
    fedramp: 'moderate',
    cmmc: 'level-2'
  },
  financialCapacity: 10000000,
  strategicPriorities: ['federal cloud', 'AI/ML'],
};
```

### 2. Use Appropriate Detail Levels
- **Quick**: Daily screening, high volume
- **Standard**: Normal analysis, balanced speed/accuracy
- **Comprehensive**: Critical opportunities, maximum accuracy

### 3. Set Thresholds
Filter out low-viability opportunities automatically:

```typescript
thresholds: {
  minViability: 60,        // Don't pursue below 60/100
  minWinProbability: 40,   // Need at least 40% pWin
  maxComplexity: 85,       // Too complex above 85
  minComplianceRate: 70,   // Need 70%+ compliance
}
```

### 4. Batch Process Wisely
- Use `quick` mode for batches
- Run during off-peak hours
- Monitor AI costs

## Limitations

### Current Limitations
- PDF parsing may struggle with scanned documents (OCR needed)
- Implicit requirements are inferred (may miss some)
- Win probability requires accurate organization profile
- Cost estimates are rough approximations
- Processing time: 40-120s per document

### Roadmap
- [ ] OCR support for scanned PDFs
- [ ] Historical win/loss learning
- [ ] Real-time SAM.gov integration
- [ ] Mobile dashboard
- [ ] Team collaboration features
- [ ] Custom scoring models

## Error Handling

The SDL gracefully degrades when errors occur:

```typescript
const result = await SDL.runTriage(buffer, filename);

if (result.status === 'failed') {
  console.error('Triage failed:', result.errors);
} else if (result.status === 'partial') {
  console.warn('Partial success:', result.warnings);
  // Some modules failed, but we have partial results
} else {
  // Full success
}
```

## Support

For questions or issues:
- GitHub: https://github.com/anthropics/aliff-ai
- Docs: https://docs.aliff.ai/sdl
- Email: support@aliff.ai

---

**Built with ❤️ by Aliff AI**

*Empowering small businesses to win government contracts*
