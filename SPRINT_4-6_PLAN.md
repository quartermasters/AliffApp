# Sprint 4-6: SDL Phase 1 - Triage

**Weeks**: 4-6 of 16
**Duration**: 3 weeks (15 working days)
**Focus**: Solicitation Diagnosis Lab (SDL) - Triage Phase
**Effort**: 90 hours (from Phase 2 budget)

---

## Sprint Goals

Build the **SDL Triage System** - the first phase of the Solicitation Diagnosis Lab that automatically analyzes RFPs, RFIs, and RFQs to extract critical information and assess opportunity viability.

**Key Deliverables**:
1. Document parsing pipeline (PDF, DOCX, TXT)
2. Metadata extraction (agency, deadline, value, NAICS, etc.)
3. Requirements extraction (must-haves, evaluation criteria, tech specs)
4. Compliance checklist generation
5. Complexity scoring algorithm
6. Initial win probability assessment

---

## Why SDL Matters

The **Solicitation Diagnosis Lab (SDL)** is Aliff's **crown jewel** - the proprietary competitive advantage that no competitor can replicate.

**What makes SDL special**:
- **Multi-AI orchestration**: Uses GPT-4, Claude, and Gemini in consensus
- **3-phase analysis**: Triage → Diagnosis → Execution
- **47 data points**: Extracts comprehensive metadata from solicitations
- **Win probability**: Predicts success likelihood before bidding
- **Strategy generation**: Recommends positioning and themes
- **10x faster**: Minutes instead of hours for initial analysis

**Business Impact**:
- Increases win rate from ~30% to **73%** (based on methodology)
- Saves 5-10 hours per proposal analysis
- Enables selective bidding (focus on winnable opportunities)
- Creates defensible competitive moat

---

## SDL Architecture (Full System)

```
┌─────────────────────────────────────────────────────────────┐
│                  SOLICITATION DIAGNOSIS LAB (SDL)            │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐   ┌──────────────────┐   ┌──────────────┐
│ PHASE 1:     │   │ PHASE 2:         │   │ PHASE 3:     │
│ TRIAGE       │──▶│ DIAGNOSIS        │──▶│ EXECUTION    │
│              │   │                  │   │              │
│ Sprint 4-6   │   │ Sprint 7-8       │   │ Sprint 9-10  │
└──────────────┘   └──────────────────┘   └──────────────┘

Phase 1: Triage (THIS SPRINT)
├── Document Parsing
├── Metadata Extraction (47 data points)
├── Requirements Analysis
├── Compliance Checklist
├── Complexity Scoring (0-100)
└── Go/No-Go Recommendation

Phase 2: Strategic Diagnosis (FUTURE)
├── Hidden Priorities Detection
├── Competitive Analysis
├── Win Strategy Development
├── Risk Assessment
└── Pricing Recommendations

Phase 3: Execution Support (FUTURE)
├── Outline Generation
├── Win Themes Development
├── Quality Scoring
└── Human Review Integration
```

---

## Sprint 4-6 Focus: Triage Phase

### What is Triage?

**Triage** is the rapid initial assessment of a solicitation to determine:
1. **Is it real?** (Valid opportunity vs fishing expedition)
2. **Can we win?** (Initial win probability)
3. **Should we bid?** (Go/No-Go recommendation)
4. **What's the complexity?** (Resource estimation)

**Inputs**:
- RFP document (PDF, DOCX, TXT)
- Solicitation URL (optional)
- Client context (optional)

**Outputs**:
- 47 metadata points (agency, deadline, NAICS, etc.)
- Requirements list (must-haves, evaluation criteria)
- Compliance checklist
- Complexity score (0-100)
- Initial win probability (0-100)
- Go/No-Go recommendation
- Estimated hours to respond

---

## Week-by-Week Plan

### **Week 4 (Sprint 4): Document Parsing & Metadata**

#### **Day 1-2: Document Parsing Pipeline**
**Duration**: 16 hours
**Goal**: Parse RFP documents and extract text

**Tasks**:
1. Install document parsing libraries:
   - `pdf-parse` for PDF
   - `mammoth` for DOCX
   - `cheerio` for HTML
2. Create document parser abstraction
3. Implement PDF parsing with text extraction
4. Implement DOCX parsing
5. Handle multi-page documents
6. Extract document structure (headings, sections)
7. Clean and normalize text

**Deliverables**:
- `src/lib/aliff/sdl/parsing/types.ts` - Document schemas
- `src/lib/aliff/sdl/parsing/pdf.ts` - PDF parser
- `src/lib/aliff/sdl/parsing/docx.ts` - DOCX parser
- `src/lib/aliff/sdl/parsing/parser.ts` - Main parser
- `src/lib/aliff/sdl/parsing/index.ts` - Parser API

**Success Criteria**:
- Can parse 100+ page RFP PDFs
- Extracts clean text with structure
- Handles various PDF formats
- Processing time < 10 seconds

---

#### **Day 3-4: Metadata Extraction**
**Duration**: 16 hours
**Goal**: Extract 47 metadata points using multi-AI

**Tasks**:
1. Define 47 metadata fields schema
2. Create extraction prompts for each field type:
   - Administrative (title, agency, solicitation #)
   - Timeline (issue date, deadline, Q&A cutoff)
   - Financial (estimated value, budget, contract type)
   - Technical (NAICS, PSC, security clearance)
   - Submission (format, page limits, instructions)
3. Implement multi-AI extraction with Gemini (fast/cheap)
4. Add validation for each field type
5. Build confidence scoring per field
6. Handle missing/ambiguous information
7. Create metadata summary report

**Deliverables**:
- `src/lib/aliff/sdl/extraction/types.ts` - Metadata schemas
- `src/lib/aliff/sdl/extraction/prompts.ts` - Extraction prompts
- `src/lib/aliff/sdl/extraction/extractor.ts` - AI extraction
- `src/lib/aliff/sdl/extraction/validation.ts` - Field validation
- `src/lib/aliff/sdl/extraction/index.ts` - Extraction API

**47 Metadata Fields**:
```
Administrative (8):
- Solicitation Number
- Title
- Issuing Agency
- Agency Office
- Contracting Officer
- Contract Specialist
- Set-Aside Type
- Procurement Type

Timeline (7):
- Issue Date
- Response Deadline
- Q&A Deadline
- Pre-proposal Conference Date
- Estimated Award Date
- Period of Performance
- Option Periods

Financial (6):
- Estimated Contract Value
- Minimum Value
- Maximum Value
- Budget Availability
- Contract Type
- Payment Terms

Technical (10):
- NAICS Code
- PSC Code
- Security Clearance Required
- Facility Clearance Required
- Place of Performance
- Technical Requirements Summary
- Key Technologies
- Deliverables Count
- Incumbent Information
- Protest History

Submission (8):
- Submission Method
- Page Limit
- Format Requirements
- Required Sections
- Proposal Volumes
- Cost/Price Requirements
- Past Performance Requirements
- Small Business Participation

Evaluation (8):
- Evaluation Criteria
- Evaluation Method
- Price Weight
- Technical Weight
- Past Performance Weight
- Key Personnel Requirements
- Corporate Experience Requirements
- Oral Presentation Required
```

**Success Criteria**:
- Extracts 40+ fields with 80%+ accuracy
- Uses Gemini for speed (< 30 seconds)
- Confidence scores for each field
- Handles missing information gracefully

---

#### **Day 5: Requirements Extraction**
**Duration**: 8 hours
**Goal**: Extract and categorize requirements

**Tasks**:
1. Define requirement types:
   - Must-have (mandatory)
   - Should-have (preferred)
   - Nice-to-have (bonus)
   - Technical specifications
   - Experience/qualifications
2. Create requirement extraction prompts
3. Use GPT-4 for accuracy (complex task)
4. Extract evaluation criteria
5. Categorize requirements by section
6. Build requirements dependency tree

**Deliverables**:
- `src/lib/aliff/sdl/requirements/types.ts` - Requirement schemas
- `src/lib/aliff/sdl/requirements/extractor.ts` - AI extraction
- `src/lib/aliff/sdl/requirements/categorizer.ts` - Categorization
- `src/lib/aliff/sdl/requirements/index.ts` - Requirements API

**Success Criteria**:
- Extracts all mandatory requirements
- Categorizes by must/should/nice-to-have
- Identifies evaluation criteria
- Links requirements to sections

---

### **Week 5 (Sprint 5): Compliance & Complexity**

#### **Day 1-2: Compliance Checklist**
**Duration**: 16 hours
**Goal**: Generate compliance checklist

**Tasks**:
1. Define compliance categories:
   - Administrative (registration, certifications)
   - Technical (specifications, standards)
   - Experience (past performance, corporate experience)
   - Personnel (key personnel, security clearances)
   - Submission (format, content, deadlines)
2. Create checklist generation prompts
3. Use Claude for strategic understanding
4. Map requirements to checklist items
5. Add pass/fail criteria
6. Generate compliance gap analysis

**Deliverables**:
- `src/lib/aliff/sdl/compliance/types.ts` - Compliance schemas
- `src/lib/aliff/sdl/compliance/generator.ts` - Checklist generator
- `src/lib/aliff/sdl/compliance/analyzer.ts` - Gap analysis
- `src/lib/aliff/sdl/compliance/index.ts` - Compliance API

---

#### **Day 3-4: Complexity Scoring**
**Duration**: 16 hours
**Goal**: Calculate complexity score (0-100)

**Tasks**:
1. Define complexity factors:
   - Document length (pages)
   - Requirements count
   - Technical complexity
   - Timeline (days to respond)
   - Estimated hours to complete
   - Number of deliverables
   - Team size required
   - Security requirements
2. Create scoring algorithm with weights
3. Use triple consensus (all 3 AI models)
4. Calibrate against historical data
5. Generate complexity report
6. Estimate effort (hours)

**Deliverables**:
- `src/lib/aliff/sdl/complexity/types.ts` - Complexity schemas
- `src/lib/aliff/sdl/complexity/scorer.ts` - Scoring algorithm
- `src/lib/aliff/sdl/complexity/calibrator.ts` - Historical calibration
- `src/lib/aliff/sdl/complexity/index.ts` - Complexity API

**Complexity Formula**:
```typescript
Complexity Score = (
  documentLength * 0.15 +
  requirementsCount * 0.20 +
  technicalComplexity * 0.25 +
  timelineWeight * 0.15 +
  securityWeight * 0.10 +
  deliverableCount * 0.10 +
  teamSizeWeight * 0.05
) / 100

Where:
- documentLength: 0-100 (100+ pages = 100)
- requirementsCount: 0-100 (100+ requirements = 100)
- technicalComplexity: 0-100 (AI-assessed)
- timelineWeight: 0-100 (< 14 days = 100, > 60 days = 0)
- securityWeight: 0/50/100 (none/facility/TS)
- deliverableCount: 0-100 (10+ deliverables = 100)
- teamSizeWeight: 0-100 (10+ people = 100)
```

---

#### **Day 5: Win Probability (Initial)**
**Duration**: 8 hours
**Goal**: Calculate initial win probability

**Tasks**:
1. Define win probability factors:
   - Our capabilities match (0-100)
   - Incumbent status
   - Relationship with agency
   - Complexity vs our capacity
   - Timeline feasibility
   - Competitive landscape
2. Use triple consensus for accuracy
3. Generate confidence score
4. Provide reasoning
5. Make Go/No-Go recommendation

**Deliverables**:
- `src/lib/aliff/sdl/win-probability/types.ts`
- `src/lib/aliff/sdl/win-probability/calculator.ts`
- `src/lib/aliff/sdl/win-probability/index.ts`

---

### **Week 6 (Sprint 6): Integration & Dashboard**

#### **Day 1-2: SDL Triage Integration**
**Duration**: 16 hours
**Goal**: Tie all components together

**Tasks**:
1. Create main SDL Triage orchestrator
2. Build processing pipeline:
   - Parse document → Extract metadata → Extract requirements →
   - Generate compliance → Score complexity → Calculate win probability
3. Add progress tracking (0-100%)
4. Generate comprehensive report
5. Store results in database
6. Add caching for repeated analysis

**Deliverables**:
- `src/lib/aliff/sdl/triage/types.ts` - Triage schemas
- `src/lib/aliff/sdl/triage/orchestrator.ts` - Main orchestrator
- `src/lib/aliff/sdl/triage/report.ts` - Report generator
- `src/lib/aliff/sdl/triage/index.ts` - Triage API
- `src/lib/aliff/sdl/index.ts` - Main SDL export

---

#### **Day 3-4: SDL Dashboard (React UI)**
**Duration**: 16 hours
**Goal**: Build user interface for SDL

**Tasks**:
1. Create SDL upload page
2. Build progress indicator
3. Display triage report:
   - Metadata summary
   - Requirements list
   - Compliance checklist
   - Complexity gauge
   - Win probability meter
   - Go/No-Go recommendation
4. Add export functionality (PDF, DOCX)
5. Build solicitation library

**Deliverables**:
- `src/app/sdl/page.tsx` - SDL main page
- `src/app/sdl/analyze/page.tsx` - Analysis page
- `src/components/sdl/UploadForm.tsx` - Upload component
- `src/components/sdl/TriageReport.tsx` - Report display
- `src/components/sdl/MetadataCard.tsx` - Metadata display
- `src/components/sdl/ComplexityGauge.tsx` - Visual gauge

---

#### **Day 5: Testing & Documentation**
**Duration**: 8 hours
**Goal**: Validate and document SDL Triage

**Tasks**:
1. Test with real RFP samples
2. Validate metadata accuracy
3. Check complexity scoring
4. Verify win probability
5. Write SDL documentation
6. Create user guide

**Deliverables**:
- `src/lib/aliff/sdl/README.md` - SDL documentation
- Test results report
- User guide

---

## Technical Specifications

### Document Types Supported

- **PDF**: Any PDF with extractable text
- **DOCX**: Microsoft Word documents
- **TXT**: Plain text
- **HTML**: Web-based solicitations

### Performance Targets

| Metric | Target | Max Acceptable |
|--------|--------|----------------|
| Document parsing | 5s | 10s |
| Metadata extraction | 20s | 30s |
| Requirements extraction | 30s | 60s |
| Compliance generation | 15s | 30s |
| Complexity scoring | 10s | 20s |
| **Total triage time** | **80s** | **150s** |

### Accuracy Targets

| Component | Target | Min Acceptable |
|-----------|--------|----------------|
| Metadata extraction | 90% | 80% |
| Requirements identification | 85% | 75% |
| Compliance checklist | 95% | 90% |
| Complexity score (±10 points) | 80% | 70% |
| Win probability (±15 points) | 75% | 65% |

### Cost Targets

| Analysis Type | Cost | Monthly (100 analyses) |
|---------------|------|----------------------|
| Small RFP (< 50 pages) | $0.50 | $50 |
| Medium RFP (50-150 pages) | $1.50 | $150 |
| Large RFP (150+ pages) | $3.00 | $300 |

---

## Integration with Existing Systems

### RAG System (Sprint 1)
- Retrieve methodology for analysis
- Reference past proposals for comparison
- Pull client history

### Security System (Sprint 2)
- Audit all SDL operations
- Filter sensitive information in reports
- Detect strategy leaks in outputs

### Orchestration (Sprint 3)
- Use Gemini for metadata (fast/cheap)
- Use GPT-4 for requirements (accuracy)
- Use triple consensus for win probability (confidence)

---

## Success Criteria

Sprint 4-6 is complete when:

1. ✅ Can parse any PDF/DOCX RFP
2. ✅ Extracts 40+ metadata fields with 80%+ accuracy
3. ✅ Identifies all mandatory requirements
4. ✅ Generates comprehensive compliance checklist
5. ✅ Calculates complexity score (calibrated)
6. ✅ Provides initial win probability
7. ✅ Complete triage in < 2 minutes
8. ✅ Dashboard is functional
9. ✅ Documentation complete
10. ✅ Tested with 10+ real RFPs

---

## Risks & Mitigation

### Risk 1: PDF Parsing Quality
**Impact**: High
**Mitigation**: Test with diverse RFP formats, fallback to OCR

### Risk 2: Metadata Extraction Accuracy
**Impact**: High
**Mitigation**: Use validation, confidence scoring, human review flags

### Risk 3: Cost Overruns
**Impact**: Medium
**Mitigation**: Use Gemini for most tasks, only GPT-4/consensus when needed

### Risk 4: Processing Time
**Impact**: Medium
**Mitigation**: Parallel processing, caching, optimize prompts

---

## Next Sprint Preview

**Sprint 7-8 (Weeks 7-8)**: SDL Phase 2 - Strategic Diagnosis
- Hidden priorities detection
- Competitive analysis
- Win strategy development
- Risk assessment
- Pricing recommendations

---

**Sprint 4-6 Status**: 🟢 Ready to Start
**Next Action**: Begin Day 1 (Document Parsing Pipeline)
**Timeline**: December 11-31, 2025

Let's build the SDL! 🚀
