/**
 * Aliff AI - SDL Compliance Analysis Types
 *
 * Types for compliance checking and gap analysis.
 */

import type { Requirement } from '../requirements/types';

/**
 * Compliance status
 */
export type ComplianceStatus = 'compliant' | 'partial' | 'non-compliant' | 'unknown';

/**
 * Compliance impact level
 */
export type ImpactLevel = 'critical' | 'high' | 'medium' | 'low';

/**
 * Compliance framework types
 */
export type ComplianceFramework =
  | 'FedRAMP'
  | 'FISMA'
  | 'NIST-800-53'
  | 'CMMC'
  | 'HIPAA'
  | 'SOC2'
  | 'ISO27001'
  | 'DFARS'
  | 'FAR'
  | 'ITAR'
  | 'Section508'
  | 'other';

/**
 * Compliance item (individual check)
 */
export interface ComplianceItem {
  id: string;
  requirement: Requirement;
  status: ComplianceStatus;
  impact: ImpactLevel;
  evidence?: string[];
  gaps: string[];
  recommendations: string[];
  effort?: 'low' | 'medium' | 'high'; // Effort to achieve compliance
  cost?: number; // Estimated cost in USD
  timeframe?: string; // e.g., "2 weeks", "3 months"
  notes?: string;
}

/**
 * Compliance checklist
 */
export interface ComplianceChecklist {
  id: string;
  name: string;
  description: string;
  framework?: ComplianceFramework;
  items: ComplianceItem[];
  totalItems: number;
  compliantItems: number;
  partialItems: number;
  nonCompliantItems: number;
  unknownItems: number;
  complianceRate: number; // Percentage (0-100)
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
}

/**
 * Compliance gap
 */
export interface ComplianceGap {
  id: string;
  item: ComplianceItem;
  gapDescription: string;
  impact: ImpactLevel;
  affectedRequirements: string[]; // Requirement IDs
  remediation: {
    actions: string[];
    effort: 'low' | 'medium' | 'high';
    cost?: number;
    timeframe?: string;
    dependencies?: string[];
  };
  priority: number; // 1-10, 10 is highest
}

/**
 * Framework detection result
 */
export interface FrameworkDetection {
  framework: ComplianceFramework;
  confidence: number; // 0.0-1.0
  evidence: string[]; // Text snippets where framework is mentioned
  requiredControls: string[];
  estimatedComplexity: number; // 1-10
}

/**
 * Compliance analysis result
 */
export interface ComplianceAnalysisResult {
  checklists: ComplianceChecklist[];
  detectedFrameworks: FrameworkDetection[];
  gaps: ComplianceGap[];
  overallCompliance: {
    totalRequirements: number;
    compliantCount: number;
    partialCount: number;
    nonCompliantCount: number;
    unknownCount: number;
    complianceRate: number; // Percentage
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  recommendations: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    action: string;
    rationale: string;
    impact: string;
  }[];
  estimatedEffort: {
    totalHours: number;
    totalCost: number;
    timeToCompliance: string; // e.g., "3 months"
  };
  warnings: string[];
  analysisTimeMs: number;
}

/**
 * Compliance analysis configuration
 */
export interface ComplianceConfig {
  useAI: boolean;
  model?: 'gemini' | 'gpt-4' | 'claude';
  autoDetectFrameworks: boolean;
  includeRecommendations: boolean;
  estimateCosts: boolean;
  confidenceThreshold?: number;
}

/**
 * Standard compliance frameworks and their key requirements
 */
export const COMPLIANCE_FRAMEWORKS = {
  FedRAMP: {
    name: 'Federal Risk and Authorization Management Program',
    levels: ['Low', 'Moderate', 'High'],
    keyControls: [
      'Access Control (AC)',
      'Audit and Accountability (AU)',
      'Security Assessment (CA)',
      'Configuration Management (CM)',
      'Contingency Planning (CP)',
      'Identification and Authentication (IA)',
      'Incident Response (IR)',
      'System and Information Integrity (SI)',
      'Risk Assessment (RA)',
    ],
    estimatedComplexity: 9,
  },
  CMMC: {
    name: 'Cybersecurity Maturity Model Certification',
    levels: ['Level 1', 'Level 2', 'Level 3'],
    keyControls: [
      'Access Control',
      'Awareness and Training',
      'Audit and Accountability',
      'Configuration Management',
      'Identification and Authentication',
      'Incident Response',
      'Maintenance',
      'Media Protection',
      'Personnel Security',
      'Physical Protection',
      'Risk Assessment',
      'Security Assessment',
      'System and Communications Protection',
      'System and Information Integrity',
    ],
    estimatedComplexity: 8,
  },
  NIST80053: {
    name: 'NIST Special Publication 800-53',
    levels: ['Low', 'Moderate', 'High'],
    keyControls: [
      'AC - Access Control',
      'AU - Audit and Accountability',
      'AT - Awareness and Training',
      'CM - Configuration Management',
      'CP - Contingency Planning',
      'IA - Identification and Authentication',
      'IR - Incident Response',
      'MA - Maintenance',
      'MP - Media Protection',
      'PS - Personnel Security',
      'PE - Physical and Environmental Protection',
      'PL - Planning',
      'RA - Risk Assessment',
      'CA - Security Assessment and Authorization',
      'SC - System and Communications Protection',
      'SI - System and Information Integrity',
    ],
    estimatedComplexity: 8,
  },
  HIPAA: {
    name: 'Health Insurance Portability and Accountability Act',
    levels: ['Required', 'Addressable'],
    keyControls: [
      'Administrative Safeguards',
      'Physical Safeguards',
      'Technical Safeguards',
      'Organizational Requirements',
      'Privacy Rule',
      'Security Rule',
      'Breach Notification Rule',
    ],
    estimatedComplexity: 7,
  },
  SOC2: {
    name: 'Service Organization Control 2',
    levels: ['Type I', 'Type II'],
    keyControls: [
      'Security',
      'Availability',
      'Processing Integrity',
      'Confidentiality',
      'Privacy',
    ],
    estimatedComplexity: 6,
  },
  FAR: {
    name: 'Federal Acquisition Regulation',
    levels: ['Part 1-53'],
    keyControls: [
      'Contract Formation',
      'Socioeconomic Programs',
      'Contract Administration',
      'Pricing',
      'Subcontracting',
      'Labor Standards',
      'Buy American',
    ],
    estimatedComplexity: 5,
  },
} as const;

/**
 * Common compliance keywords for detection
 */
export const COMPLIANCE_KEYWORDS: Record<ComplianceFramework, string[]> = {
  FedRAMP: ['fedramp', 'fed ramp', 'federal authorization', 'ato', 'conmon'],
  FISMA: ['fisma', 'federal information security'],
  'NIST-800-53': ['nist', '800-53', 'sp 800-53', 'security controls'],
  CMMC: ['cmmc', 'cybersecurity maturity model', 'cmmc level'],
  HIPAA: ['hipaa', 'phi', 'protected health information', 'health information portability'],
  SOC2: ['soc 2', 'soc2', 'service organization control', 'aicpa'],
  ISO27001: ['iso 27001', 'iso27001', 'isms'],
  DFARS: ['dfars', 'defense federal acquisition', '252.204'],
  FAR: ['far', 'federal acquisition regulation', 'far clause'],
  ITAR: ['itar', 'international traffic in arms'],
  Section508: ['section 508', '508 compliance', 'accessibility', 'wcag'],
  other: [],
};
