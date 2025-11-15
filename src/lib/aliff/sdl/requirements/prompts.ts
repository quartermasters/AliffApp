/**
 * Aliff AI - SDL Requirements Extraction Prompts
 *
 * AI prompts for extracting and categorizing requirements.
 */

/**
 * System prompt for requirements extraction
 */
export const REQUIREMENTS_SYSTEM_PROMPT = `You are an expert requirements analyst specializing in government contracting and RFP analysis.

Your task is to extract, categorize, and prioritize all requirements from solicitation documents.

Guidelines:
- Extract ALL requirements, both explicit and implicit
- Categorize requirements as must-have, should-have, or nice-to-have based on language:
  * MUST-HAVE: "shall", "must", "will", "required", "mandatory"
  * SHOULD-HAVE: "should", "encouraged", "desired", "preferred"
  * NICE-TO-HAVE: "may", "optional", "if applicable", "can"
- Identify requirement category: technical, functional, security, compliance, staffing, deliverable, schedule, administrative
- Extract verification/acceptance criteria when stated
- Note complexity based on technical difficulty and scope
- Be precise and maintain traceability to source sections

Return responses in valid JSON format only.`;

/**
 * Main requirements extraction prompt
 */
export function getRequirementsPrompt(documentContent: string): string {
  return `Extract ALL requirements from this solicitation document.

For each requirement, identify:
1. The requirement text (exact quote or paraphrase)
2. Priority (must-have/should-have/nice-to-have) based on language:
   - MUST-HAVE: "shall", "must", "will", "required", "mandatory"
   - SHOULD-HAVE: "should", "encouraged", "desired", "preferred"
   - NICE-TO-HAVE: "may", "optional", "if applicable"
3. Category (technical/functional/security/compliance/staffing/deliverable/schedule/administrative)
4. Source section or page number
5. Verification method if stated (demonstration/inspection/test/analysis/documentation)
6. Acceptance criteria if stated
7. Key keywords from the requirement
8. Complexity estimate (1-10, where 10 is most complex)

IMPORTANT REQUIREMENT PATTERNS:
- Look for "Statement of Work" (SOW), "Performance Work Statement" (PWS), or "Statement of Objectives" (SOO) sections
- Look for "Technical Requirements", "Functional Requirements", "Deliverables" sections
- Look for numbered requirements (e.g., "3.1.1 The contractor shall...")
- Look for tables of requirements
- Look for security requirements (NIST, FISMA, FedRAMP, etc.)
- Look for staffing requirements (clearances, certifications, key personnel)

DOCUMENT:
${documentContent.substring(0, 20000)}

Return JSON array of requirements in this format:
[
  {
    "id": "REQ-001",
    "text": "The contractor shall provide cloud infrastructure meeting FedRAMP High standards",
    "priority": "must-have",
    "category": "security",
    "source": "Section C.3.1, Page 15",
    "verificationMethod": "documentation",
    "acceptance": "FedRAMP High ATO certificate",
    "keywords": ["cloud", "FedRAMP", "security", "ATO"],
    "complexity": 8,
    "confidence": 0.95
  },
  {
    "id": "REQ-002",
    "text": "The system should support 10,000 concurrent users",
    "priority": "should-have",
    "category": "technical",
    "source": "Section C.2.4",
    "verificationMethod": "test",
    "acceptance": "Load test demonstrating 10k concurrent users",
    "keywords": ["scalability", "performance", "users"],
    "complexity": 6,
    "confidence": 0.90
  }
]

Extract AT LEAST 20 requirements. Include all must-have requirements and representative should-have/nice-to-have requirements.`;
}

/**
 * Evaluation criteria extraction prompt
 */
export function getEvaluationCriteriaPrompt(documentContent: string): string {
  return `Extract the evaluation criteria from this solicitation document.

Evaluation criteria are typically found in:
- "Section M - Evaluation Factors"
- "Evaluation Criteria"
- "Basis for Award"
- "Selection Criteria"

For each criterion, extract:
1. Name of the criterion (e.g., "Technical Approach", "Past Performance", "Price")
2. Detailed description of what will be evaluated
3. Weight/importance (percentage if stated)
4. Subfactors or sub-criteria
5. Source section

IMPORTANT PATTERNS:
- Look for factors like "Technical", "Management", "Past Performance", "Price", "Key Personnel"
- Note if it's LPTA (Lowest Price Technically Acceptable) or best-value
- Extract subfactors under each main factor
- Note relative importance (e.g., "Technical is more important than Price")

DOCUMENT EXCERPT (Section M or equivalent):
${documentContent.substring(0, 15000)}

Return JSON array in this format:
[
  {
    "id": "EVAL-001",
    "name": "Technical Approach",
    "description": "Evaluation of the offeror's understanding of requirements and proposed technical solution",
    "weight": 50,
    "subfactors": [
      "Understanding of Requirements",
      "Technical Solution Architecture",
      "Development Methodology",
      "Quality Assurance Approach"
    ],
    "source": "Section M.1"
  },
  {
    "id": "EVAL-002",
    "name": "Past Performance",
    "description": "Evaluation of relevant past performance on similar contracts",
    "weight": 30,
    "subfactors": [
      "Relevancy of Experience",
      "Quality of Performance",
      "Customer Satisfaction"
    ],
    "source": "Section M.2"
  },
  {
    "id": "EVAL-003",
    "name": "Price",
    "description": "Evaluation of proposed price for reasonableness and realism",
    "weight": 20,
    "subfactors": [],
    "source": "Section M.3"
  }
]`;
}

/**
 * Individual requirement complexity analysis prompt
 */
export function getRequirementComplexityPrompt(requirement: string): string {
  return `Analyze the complexity of this requirement on a scale of 1-10:

REQUIREMENT:
"${requirement}"

Consider:
1. Technical difficulty (1-10)
2. Implementation effort (1-10)
3. Risk level (1-10)
4. Dependencies on other systems/requirements (1-10)
5. Specialized expertise needed (1-10)

COMPLEXITY SCALE:
1-3: Simple, straightforward requirement
4-6: Moderate complexity, standard implementation
7-8: High complexity, specialized skills needed
9-10: Very high complexity, significant technical challenges

Return JSON:
{
  "complexity": 7,
  "reasoning": "Requires FedRAMP High certification which involves extensive documentation, security controls, and third-party assessment. Significant ongoing compliance burden.",
  "factors": {
    "technical": 8,
    "effort": 7,
    "risk": 7,
    "dependencies": 6,
    "expertise": 8
  }
}`;
}

/**
 * Implicit requirements extraction prompt
 */
export function getImplicitRequirementsPrompt(documentContent: string): string {
  return `Identify IMPLICIT requirements from this solicitation - requirements that are strongly implied but not explicitly stated.

Examples of implicit requirements:
- If FedRAMP mentioned → implicit: cloud infrastructure, continuous monitoring, incident response
- If HIPAA mentioned → implicit: data encryption, access controls, audit logging
- If DevOps mentioned → implicit: CI/CD pipeline, automated testing, version control
- If Agile mentioned → implicit: sprint planning, user stories, iterative delivery
- Federal contract → implicit: FAR compliance, small business reporting, labor standards

Look for:
1. Standards/frameworks mentioned (implies all their requirements)
2. Industry best practices referenced
3. Regulatory compliance mentioned
4. Technology platforms specified (implies infrastructure, licensing, support)
5. Certifications required (implies training, maintenance)

DOCUMENT:
${documentContent.substring(0, 15000)}

Return JSON array of implicit requirements:
[
  {
    "id": "IMP-001",
    "text": "Continuous monitoring and vulnerability scanning required for FedRAMP compliance",
    "priority": "must-have",
    "category": "security",
    "derivedFrom": "FedRAMP High requirement in Section C.3.1",
    "keywords": ["monitoring", "scanning", "FedRAMP"],
    "complexity": 7,
    "confidence": 0.85
  }
]`;
}

/**
 * Requirements categorization prompt
 */
export function getCategorizationPrompt(requirements: string[]): string {
  return `Categorize and prioritize these extracted requirements:

REQUIREMENTS:
${requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

For each requirement, determine:
1. Priority: must-have / should-have / nice-to-have
   - Look for modal verbs: "shall", "must", "will" → must-have
   - "should", "encouraged" → should-have
   - "may", "optional" → nice-to-have

2. Category: technical / functional / security / compliance / staffing / deliverable / schedule / administrative

Return JSON array:
[
  {
    "index": 0,
    "priority": "must-have",
    "category": "security",
    "reasoning": "Contains 'shall' and references security standard"
  }
]`;
}
