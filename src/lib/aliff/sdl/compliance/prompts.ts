/**
 * Aliff AI - SDL Compliance Analysis Prompts
 *
 * AI prompts for compliance framework detection and gap analysis.
 */

import type { Requirement } from '../requirements/types';
import type { ComplianceFramework } from './types';

/**
 * System prompt for compliance analysis
 */
export const COMPLIANCE_SYSTEM_PROMPT = `You are an expert compliance analyst specializing in government contracting, cybersecurity frameworks, and regulatory requirements.

Your task is to analyze solicitation requirements for compliance frameworks, identify gaps, and provide actionable remediation guidance.

Guidelines:
- Identify specific compliance frameworks mentioned (FedRAMP, CMMC, NIST 800-53, HIPAA, FAR, DFARS, etc.)
- Map requirements to specific controls and standards
- Assess compliance status: compliant, partial, non-compliant, or unknown
- Identify gaps and provide specific remediation actions
- Estimate effort, cost, and timeframe for achieving compliance
- Prioritize critical compliance gaps (especially security and legal requirements)
- Be precise with control numbers and framework references

Return responses in valid JSON format only.`;

/**
 * Framework detection prompt
 */
export function getFrameworkDetectionPrompt(documentContent: string): string {
  return `Analyze this solicitation document and identify ALL compliance frameworks and standards mentioned.

Look for references to:
- FedRAMP (Federal Risk and Authorization Management Program)
- CMMC (Cybersecurity Maturity Model Certification) - Levels 1, 2, 3
- NIST 800-53 (Security and Privacy Controls)
- FISMA (Federal Information Security Management Act)
- HIPAA (Health Insurance Portability and Accountability Act)
- SOC 2 (Service Organization Control)
- ISO 27001 (Information Security Management)
- DFARS (Defense Federal Acquisition Regulation Supplement)
- FAR (Federal Acquisition Regulation)
- ITAR (International Traffic in Arms Regulations)
- Section 508 (Accessibility)
- Other frameworks or standards

For each framework detected:
1. Framework name and type
2. Specific level/tier if mentioned (e.g., "FedRAMP High", "CMMC Level 2")
3. Confidence in detection (0.0-1.0)
4. Evidence (exact quotes from document)
5. Required controls or compliance areas
6. Estimated complexity (1-10, where 10 is most complex)

DOCUMENT:
${documentContent.substring(0, 15000)}

Return JSON array:
[
  {
    "framework": "FedRAMP",
    "level": "High",
    "confidence": 0.95,
    "evidence": [
      "The system shall maintain FedRAMP High authorization (Section C.3.1)",
      "Contractor must demonstrate compliance with FedRAMP High baseline controls"
    ],
    "requiredControls": [
      "AC-2: Account Management",
      "AU-2: Audit Events",
      "IA-2: Identification and Authentication",
      "SC-7: Boundary Protection",
      "SI-2: Flaw Remediation"
    ],
    "estimatedComplexity": 9
  },
  {
    "framework": "NIST-800-53",
    "level": "Moderate",
    "confidence": 0.90,
    "evidence": [
      "System must implement NIST SP 800-53 Rev 5 moderate baseline"
    ],
    "requiredControls": [
      "All moderate baseline controls (325+ controls)"
    ],
    "estimatedComplexity": 8
  }
]`;
}

/**
 * Compliance gap analysis prompt
 */
export function getGapAnalysisPrompt(
  requirements: Requirement[],
  framework: ComplianceFramework
): string {
  const requirementsText = requirements
    .map((r, i) => `${i + 1}. [${r.priority.toUpperCase()}] ${r.text} (${r.category})`)
    .join('\n');

  return `Analyze these requirements for ${framework} compliance gaps.

REQUIREMENTS:
${requirementsText}

For each requirement, assess:
1. Compliance status (compliant/partial/non-compliant/unknown)
2. Impact level if non-compliant (critical/high/medium/low)
3. Specific gaps or deficiencies
4. Evidence we have (if any)
5. Recommendations to achieve compliance
6. Effort required (low/medium/high)
7. Estimated cost and timeframe

IMPACT LEVELS:
- CRITICAL: Could result in contract rejection, legal issues, or severe security risk
- HIGH: Significant compliance gap, may affect evaluation score
- MEDIUM: Moderate gap, should be addressed
- LOW: Minor gap or nice-to-have

Return JSON array:
[
  {
    "requirementId": "REQ-001",
    "status": "non-compliant",
    "impact": "critical",
    "gaps": [
      "No current FedRAMP authorization",
      "Missing continuous monitoring capability",
      "Incomplete incident response plan"
    ],
    "evidence": [],
    "recommendations": [
      "Engage FedRAMP 3PAO for assessment",
      "Implement continuous monitoring using approved tools",
      "Develop and test incident response procedures per NIST 800-61"
    ],
    "effort": "high",
    "estimatedCost": 250000,
    "timeframe": "9-12 months",
    "notes": "FedRAMP High authorization is a lengthy process requiring significant investment"
  },
  {
    "requirementId": "REQ-002",
    "status": "partial",
    "impact": "medium",
    "gaps": [
      "Access controls implemented but not fully automated",
      "MFA enabled but not enforced for all users"
    ],
    "evidence": [
      "Current IAM system supports MFA"
    ],
    "recommendations": [
      "Implement automated access provisioning/deprovisioning",
      "Enforce MFA for all user accounts without exception",
      "Document access control procedures"
    ],
    "effort": "medium",
    "estimatedCost": 50000,
    "timeframe": "2-3 months"
  }
]`;
}

/**
 * Compliance checklist generation prompt
 */
export function getChecklistPrompt(
  requirements: Requirement[],
  framework: ComplianceFramework
): string {
  return `Generate a comprehensive compliance checklist for ${framework} based on these solicitation requirements.

REQUIREMENTS:
${requirements.map((r, i) => `${i + 1}. ${r.text}`).join('\n')}

Create a structured checklist with:
1. Checklist items organized by ${framework} control families or domains
2. Each item should reference specific ${framework} controls
3. Map solicitation requirements to control items
4. Include verification/validation criteria
5. Note dependencies between items

Return JSON:
{
  "checklist": {
    "name": "${framework} Compliance Checklist",
    "description": "Comprehensive checklist for ${framework} compliance",
    "framework": "${framework}",
    "items": [
      {
        "id": "CHK-001",
        "controlFamily": "Access Control",
        "controlId": "AC-2",
        "description": "Account Management - implement automated account provisioning",
        "requirementIds": ["REQ-001", "REQ-005"],
        "verificationCriteria": [
          "Automated user provisioning system implemented",
          "Account lifecycle documented",
          "Regular access reviews conducted"
        ],
        "status": "unknown",
        "impact": "high",
        "effort": "medium"
      }
    ]
  }
}`;
}

/**
 * Remediation recommendations prompt
 */
export function getRemediationPrompt(gaps: string[]): string {
  return `Provide detailed remediation recommendations for these compliance gaps:

GAPS:
${gaps.map((g, i) => `${i + 1}. ${g}`).join('\n')}

For each gap, provide:
1. Specific remediation actions (step-by-step)
2. Required resources (tools, personnel, expertise)
3. Estimated effort and cost
4. Realistic timeframe
5. Dependencies and risks
6. Alternative approaches if applicable

Return JSON array:
[
  {
    "gap": "No FedRAMP authorization",
    "priority": 10,
    "actions": [
      "1. Select and engage a FedRAMP 3PAO (Third Party Assessment Organization)",
      "2. Complete System Security Plan (SSP) documentation",
      "3. Implement required security controls (325+ for High)",
      "4. Conduct readiness assessment",
      "5. Undergo formal 3PAO assessment",
      "6. Remediate findings",
      "7. Submit authorization package to FedRAMP PMO",
      "8. Achieve ATO (Authority to Operate)"
    ],
    "resources": {
      "tools": ["GRC platform (e.g., Tugboat Logic, Drata)", "Continuous monitoring tools", "Vulnerability scanners"],
      "personnel": ["ISSO (Information System Security Officer)", "Security engineers (2-3 FTE)", "Compliance specialists"],
      "expertise": ["FedRAMP experience", "NIST 800-53 knowledge", "Cloud security"]
    },
    "effort": "high",
    "estimatedCost": 250000,
    "timeframe": "9-12 months",
    "dependencies": ["Cloud infrastructure must be in place", "Security team must be staffed"],
    "risks": ["Long authorization timeline", "Potential findings requiring remediation", "Ongoing compliance burden"],
    "alternatives": ["Leverage FedRAMP marketplace provider", "Use FedRAMP Ready designation initially"]
  }
]`;
}

/**
 * Compliance risk assessment prompt
 */
export function getRiskAssessmentPrompt(
  requirements: Requirement[],
  gapCount: number,
  criticalGapCount: number
): string {
  return `Assess the overall compliance risk for this opportunity.

CONTEXT:
- Total requirements: ${requirements.length}
- Must-have requirements: ${requirements.filter((r) => r.priority === 'must-have').length}
- Total compliance gaps: ${gapCount}
- Critical compliance gaps: ${criticalGapCount}

REQUIREMENTS SUMMARY:
${requirements
  .filter((r) => r.priority === 'must-have')
  .slice(0, 20)
  .map((r) => `- ${r.text}`)
  .join('\n')}

Assess:
1. Overall risk level (low/medium/high/critical)
2. Key risk factors
3. Deal-breaker issues (if any)
4. Mitigation strategies
5. Go/no-go recommendation with rationale

Return JSON:
{
  "riskLevel": "high",
  "riskScore": 75,
  "keyRisks": [
    {
      "risk": "No current FedRAMP authorization",
      "impact": "critical",
      "likelihood": "high",
      "mitigation": "Pursue FedRAMP authorization immediately or partner with authorized provider"
    }
  ],
  "dealBreakers": [
    "FedRAMP High authorization required - we do not currently have this"
  ],
  "mitigations": [
    "Partner with existing FedRAMP High CSP",
    "Begin FedRAMP authorization process now (9-12 months)",
    "Request waiver or phase-in period (unlikely for High)"
  ],
  "recommendation": {
    "decision": "no-go",
    "rationale": "FedRAMP High authorization is required and we lack it. 9-12 month timeline makes this opportunity infeasible.",
    "conditions": "Would reconsider if: (1) we already had FedRAMP Moderate and could upgrade, or (2) response deadline extended 12+ months"
  }
}`;
}

/**
 * Control mapping prompt
 */
export function getControlMappingPrompt(
  requirement: Requirement,
  framework: ComplianceFramework
): string {
  return `Map this requirement to specific ${framework} controls.

REQUIREMENT:
"${requirement.text}"

Category: ${requirement.category}
Priority: ${requirement.priority}

Identify:
1. Specific ${framework} controls that apply
2. Control families/domains
3. Implementation guidance
4. Verification methods

Return JSON:
{
  "controls": [
    {
      "controlId": "AC-2",
      "controlName": "Account Management",
      "family": "Access Control",
      "applicability": "direct",
      "implementationGuidance": "Implement automated account provisioning with approval workflows",
      "verificationMethod": "Demonstrate automated provisioning, review access logs"
    }
  ]
}`;
}
