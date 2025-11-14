/**
 * Aliff AI - SDL Metadata Extraction Prompts
 *
 * AI prompts for extracting 47 metadata fields from solicitations.
 */

import type { SolicitationMetadata } from './types';

/**
 * System prompt for metadata extraction
 */
export const EXTRACTION_SYSTEM_PROMPT = `You are an expert government contracting analyst specializing in analyzing RFPs, RFQs, and other solicitation documents.

Your task is to extract specific metadata fields from solicitation documents with high accuracy and confidence.

Guidelines:
- Extract ONLY information that is explicitly stated in the document
- If a field cannot be found, return null or undefined
- Provide confidence scores (0.0-1.0) based on clarity of the information
- Note the source/location where you found each piece of information
- Be precise with dates, numbers, and codes (NAICS, PSC, etc.)
- Distinguish between "not found" and "not applicable"

Return responses in valid JSON format only.`;

/**
 * Administrative metadata extraction prompt
 */
export function getAdministrativePrompt(documentContent: string): string {
  return `Extract the following administrative metadata from this solicitation document:

FIELDS TO EXTRACT (8):
1. solicitationNumber - The solicitation/contract number (e.g., "FA8726-25-R-0001")
2. title - Full title of the solicitation
3. issuingAgency - The agency issuing the solicitation (e.g., "Department of Defense", "GSA")
4. agencyOffice - Specific office or division within the agency
5. contractingOfficer - Name and contact of the contracting officer
6. contractSpecialist - Name and contact of the contract specialist
7. setAsideType - Type of set-aside (options: "none", "8(a)", "HUBZone", "SDVOSB", "WOSB", "small-business", "total-small-business", "partial-small-business", "other")
8. procurementType - Type of procurement (options: "RFP", "RFQ", "RFI", "IFB", "sources-sought", "other")

DOCUMENT EXCERPT (first 5000 characters):
${documentContent.substring(0, 5000)}

Return JSON in this exact format:
{
  "solicitationNumber": { "value": "...", "confidence": 0.95, "source": "page 1, header" },
  "title": { "value": "...", "confidence": 0.90, "source": "page 1, title section" },
  "issuingAgency": { "value": "...", "confidence": 0.85, "source": "..." },
  "agencyOffice": { "value": "...", "confidence": 0.80, "source": "..." },
  "contractingOfficer": { "value": "...", "confidence": 0.75, "source": "..." },
  "contractSpecialist": { "value": "...", "confidence": 0.70, "source": "..." },
  "setAsideType": { "value": "...", "confidence": 0.90, "source": "..." },
  "procurementType": { "value": "RFP", "confidence": 0.95, "source": "..." }
}

If a field is not found, use: { "value": null, "confidence": 0.0, "source": "not found" }`;
}

/**
 * Timeline metadata extraction prompt
 */
export function getTimelinePrompt(documentContent: string): string {
  return `Extract the following timeline metadata from this solicitation document:

FIELDS TO EXTRACT (7):
1. issueDate - Date the solicitation was issued
2. responseDeadline - Deadline for proposal submission
3. qaDeadline - Deadline for questions/clarifications
4. preProposalConferenceDate - Date of pre-proposal or bidders conference
5. estimatedAwardDate - Estimated date of contract award
6. periodOfPerformance - Duration of the contract (e.g., "12 months", "2 years", "36 months")
7. optionPeriods - Array of option periods (e.g., ["1 year option 1", "1 year option 2"])

IMPORTANT DATE FORMATS:
- Return dates in ISO 8601 format: "YYYY-MM-DD"
- Today's date for reference: ${new Date().toISOString().split('T')[0]}
- Look for phrases like "due by", "no later than", "on or before"

DOCUMENT EXCERPT (searching for dates):
${documentContent.substring(0, 8000)}

Return JSON in this exact format:
{
  "issueDate": { "value": "2025-01-15", "confidence": 0.90, "source": "page 1", "raw": "January 15, 2025" },
  "responseDeadline": { "value": "2025-03-01", "confidence": 0.95, "source": "page 2", "raw": "March 1, 2025 at 2:00 PM EST" },
  "qaDeadline": { "value": "2025-02-15", "confidence": 0.85, "source": "...", "raw": "..." },
  "preProposalConferenceDate": { "value": "2025-02-01", "confidence": 0.80, "source": "...", "raw": "..." },
  "estimatedAwardDate": { "value": "2025-04-01", "confidence": 0.70, "source": "...", "raw": "..." },
  "periodOfPerformance": { "value": "12 months", "confidence": 0.90, "source": "...", "raw": "..." },
  "optionPeriods": { "value": ["1 year option 1", "1 year option 2"], "confidence": 0.85, "source": "...", "raw": "..." }
}

If a field is not found, use: { "value": null, "confidence": 0.0, "source": "not found", "raw": "" }`;
}

/**
 * Financial metadata extraction prompt
 */
export function getFinancialPrompt(documentContent: string): string {
  return `Extract the following financial metadata from this solicitation document:

FIELDS TO EXTRACT (6):
1. estimatedValue - Estimated contract value in USD (number only, no currency symbols)
2. minimumValue - Minimum contract value
3. maximumValue - Maximum contract value (especially for IDIQs)
4. budgetAvailable - Whether budget is available (boolean: true/false)
5. contractType - Type of contract (options: "FFP" (Firm Fixed Price), "T&M" (Time and Materials), "CPFF" (Cost Plus Fixed Fee), "CPAF" (Cost Plus Award Fee), "CPIF" (Cost Plus Incentive Fee), "IDIQ" (Indefinite Delivery Indefinite Quantity), "other")
6. paymentTerms - Payment terms and schedule

IMPORTANT:
- Convert all dollar amounts to numbers (remove "$", "," symbols)
- Look for ranges like "$5M-$10M"
- IDIQ contracts often have min/max values
- Budget availability may be stated as "funds available" or "subject to availability"

DOCUMENT EXCERPT (searching for financial info):
${documentContent.substring(0, 8000)}

Return JSON in this exact format:
{
  "estimatedValue": { "value": 5000000, "confidence": 0.85, "source": "page 3", "raw": "$5,000,000" },
  "minimumValue": { "value": 1000000, "confidence": 0.80, "source": "...", "raw": "..." },
  "maximumValue": { "value": 10000000, "confidence": 0.80, "source": "...", "raw": "..." },
  "budgetAvailable": { "value": true, "confidence": 0.90, "source": "...", "raw": "funds are available" },
  "contractType": { "value": "FFP", "confidence": 0.95, "source": "...", "raw": "Firm Fixed Price" },
  "paymentTerms": { "value": "Net 30", "confidence": 0.75, "source": "...", "raw": "..." }
}

If a field is not found, use: { "value": null, "confidence": 0.0, "source": "not found", "raw": "" }`;
}

/**
 * Technical metadata extraction prompt
 */
export function getTechnicalPrompt(documentContent: string): string {
  return `Extract the following technical metadata from this solicitation document:

FIELDS TO EXTRACT (10):
1. naicsCode - North American Industry Classification System code (6-digit number)
2. pscCode - Product Service Code (4-character alphanumeric)
3. securityClearanceRequired - Required security clearance level (options: "none", "public-trust", "confidential", "secret", "top-secret", "TS-SCI")
4. facilityClearanceRequired - Whether facility clearance is required (boolean)
5. placeOfPerformance - Location where work will be performed
6. technicalRequirementsSummary - Brief summary of technical requirements (max 500 chars)
7. keyTechnologies - Array of key technologies mentioned (e.g., ["cloud computing", "AI/ML", "cybersecurity"])
8. deliverablesCount - Number of deliverables required (integer)
9. incumbentInformation - Information about current/incumbent contractor
10. protestHistory - Whether there's any mention of protests (boolean)

IMPORTANT:
- NAICS codes are always 6 digits (e.g., "541512")
- PSC codes are 4 characters (e.g., "R425", "D302")
- Look for clearance requirements carefully
- Extract up to 10 key technologies

DOCUMENT EXCERPT:
${documentContent.substring(0, 10000)}

Return JSON in this exact format:
{
  "naicsCode": { "value": "541512", "confidence": 0.95, "source": "page 2", "raw": "NAICS: 541512" },
  "pscCode": { "value": "R425", "confidence": 0.90, "source": "...", "raw": "..." },
  "securityClearanceRequired": { "value": "secret", "confidence": 0.85, "source": "...", "raw": "..." },
  "facilityClearanceRequired": { "value": false, "confidence": 0.80, "source": "...", "raw": "..." },
  "placeOfPerformance": { "value": "Arlington, VA", "confidence": 0.90, "source": "...", "raw": "..." },
  "technicalRequirementsSummary": { "value": "Brief summary...", "confidence": 0.75, "source": "...", "raw": "..." },
  "keyTechnologies": { "value": ["cloud", "AI"], "confidence": 0.80, "source": "...", "raw": "..." },
  "deliverablesCount": { "value": 5, "confidence": 0.70, "source": "...", "raw": "5 deliverables" },
  "incumbentInformation": { "value": "ABC Corp", "confidence": 0.60, "source": "...", "raw": "..." },
  "protestHistory": { "value": false, "confidence": 0.70, "source": "...", "raw": "..." }
}

If a field is not found, use: { "value": null, "confidence": 0.0, "source": "not found", "raw": "" }`;
}

/**
 * Submission metadata extraction prompt
 */
export function getSubmissionPrompt(documentContent: string): string {
  return `Extract the following submission metadata from this solicitation document:

FIELDS TO EXTRACT (8):
1. submissionMethod - How to submit proposal (options: "electronic", "physical", "both", "SAM.gov", "email", "portal")
2. pageLimit - Page limit for proposal (integer)
3. formatRequirements - Format requirements (e.g., "PDF only", "Times New Roman 12pt")
4. requiredSections - Array of required proposal sections
5. proposalVolumes - Array of proposal volumes (e.g., ["Technical Volume", "Cost Volume", "Past Performance"])
6. costPriceRequirements - Requirements for cost/price proposals
7. pastPerformanceRequirements - Requirements for past performance
8. smallBusinessParticipation - Small business participation requirements/goals

IMPORTANT:
- Look in "Instructions to Offerors" or "Proposal Submission" sections
- Page limits may be specified per volume
- Extract all required sections/volumes

DOCUMENT EXCERPT:
${documentContent.substring(0, 10000)}

Return JSON in this exact format:
{
  "submissionMethod": { "value": "electronic", "confidence": 0.90, "source": "section L", "raw": "..." },
  "pageLimit": { "value": 25, "confidence": 0.85, "source": "...", "raw": "25 page limit" },
  "formatRequirements": { "value": "PDF, 12pt font", "confidence": 0.80, "source": "...", "raw": "..." },
  "requiredSections": { "value": ["Executive Summary", "Technical Approach"], "confidence": 0.85, "source": "...", "raw": "..." },
  "proposalVolumes": { "value": ["Volume I: Technical", "Volume II: Cost"], "confidence": 0.90, "source": "...", "raw": "..." },
  "costPriceRequirements": { "value": "Detailed CLIN pricing", "confidence": 0.75, "source": "...", "raw": "..." },
  "pastPerformanceRequirements": { "value": "3 relevant projects", "confidence": 0.80, "source": "...", "raw": "..." },
  "smallBusinessParticipation": { "value": "30% small business goal", "confidence": 0.70, "source": "...", "raw": "..." }
}

If a field is not found, use: { "value": null, "confidence": 0.0, "source": "not found", "raw": "" }`;
}

/**
 * Evaluation metadata extraction prompt
 */
export function getEvaluationPrompt(documentContent: string): string {
  return `Extract the following evaluation metadata from this solicitation document:

FIELDS TO EXTRACT (8):
1. evaluationCriteria - Array of evaluation criteria (e.g., ["Technical Approach", "Past Performance", "Price"])
2. evaluationMethod - Evaluation method (options: "LPTA" (Lowest Price Technically Acceptable), "best-value", "trade-off", "competitive-range", "other")
3. priceWeight - Weight/importance of price (percentage 0-100)
4. technicalWeight - Weight/importance of technical (percentage 0-100)
5. pastPerformanceWeight - Weight/importance of past performance (percentage 0-100)
6. keyPersonnelRequired - Whether key personnel are required (boolean)
7. corporateExperienceRequired - Whether corporate experience is required (boolean)
8. oralPresentationRequired - Whether oral presentations are required (boolean)

IMPORTANT:
- Look in "Evaluation Factors" or "Section M" for evaluation criteria
- Weights should add up to 100 (approximately)
- LPTA means price is most important if technically acceptable
- Best-value/trade-off means quality matters more than just price

DOCUMENT EXCERPT:
${documentContent.substring(0, 10000)}

Return JSON in this exact format:
{
  "evaluationCriteria": { "value": ["Technical", "Past Performance", "Price"], "confidence": 0.90, "source": "section M", "raw": "..." },
  "evaluationMethod": { "value": "best-value", "confidence": 0.85, "source": "...", "raw": "..." },
  "priceWeight": { "value": 30, "confidence": 0.80, "source": "...", "raw": "30%" },
  "technicalWeight": { "value": 50, "confidence": 0.80, "source": "...", "raw": "50%" },
  "pastPerformanceWeight": { "value": 20, "confidence": 0.80, "source": "...", "raw": "20%" },
  "keyPersonnelRequired": { "value": true, "confidence": 0.85, "source": "...", "raw": "..." },
  "corporateExperienceRequired": { "value": true, "confidence": 0.85, "source": "...", "raw": "..." },
  "oralPresentationRequired": { "value": false, "confidence": 0.90, "source": "...", "raw": "..." }
}

If a field is not found, use: { "value": null, "confidence": 0.0, "source": "not found", "raw": "" }`;
}

/**
 * Get prompt for specific metadata category
 */
export function getCategoryPrompt(
  category: keyof SolicitationMetadata,
  documentContent: string
): string {
  switch (category) {
    case 'administrative':
      return getAdministrativePrompt(documentContent);
    case 'timeline':
      return getTimelinePrompt(documentContent);
    case 'financial':
      return getFinancialPrompt(documentContent);
    case 'technical':
      return getTechnicalPrompt(documentContent);
    case 'submission':
      return getSubmissionPrompt(documentContent);
    case 'evaluation':
      return getEvaluationPrompt(documentContent);
    default:
      throw new Error(`Unknown category: ${category}`);
  }
}

/**
 * Quick extraction prompt (all fields at once - less accurate but faster)
 */
export function getQuickExtractionPrompt(documentContent: string): string {
  return `Extract ALL solicitation metadata from this document in one pass.

Extract these 47 fields organized in 6 categories:

ADMINISTRATIVE (8 fields): solicitationNumber, title, issuingAgency, agencyOffice, contractingOfficer, contractSpecialist, setAsideType, procurementType

TIMELINE (7 fields): issueDate, responseDeadline, qaDeadline, preProposalConferenceDate, estimatedAwardDate, periodOfPerformance, optionPeriods

FINANCIAL (6 fields): estimatedValue, minimumValue, maximumValue, budgetAvailable, contractType, paymentTerms

TECHNICAL (10 fields): naicsCode, pscCode, securityClearanceRequired, facilityClearanceRequired, placeOfPerformance, technicalRequirementsSummary, keyTechnologies, deliverablesCount, incumbentInformation, protestHistory

SUBMISSION (8 fields): submissionMethod, pageLimit, formatRequirements, requiredSections, proposalVolumes, costPriceRequirements, pastPerformanceRequirements, smallBusinessParticipation

EVALUATION (8 fields): evaluationCriteria, evaluationMethod, priceWeight, technicalWeight, pastPerformanceWeight, keyPersonnelRequired, corporateExperienceRequired, oralPresentationRequired

DOCUMENT:
${documentContent.substring(0, 15000)}

Return complete JSON with all 6 categories. For each field include: value, confidence (0.0-1.0), source, and raw text.`;
}
