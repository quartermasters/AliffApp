/**
 * Aliff AI - Output Filtering Types
 *
 * Defines schemas for filtering sensitive information from AI responses.
 * Prevents accidental disclosure of pricing, strategy, internal data.
 */

import type { AliffRole, SensitivityLevel } from '../../types';

/**
 * Filter rule types
 */
export type FilterRuleType =
  | 'pattern' // Regex or keyword matching
  | 'semantic' // AI-based semantic detection
  | 'role-based'; // Role-specific filtering

/**
 * Filter severity (what to do when rule matches)
 */
export type FilterSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Filter action (what to do when content matches)
 */
export type FilterAction =
  | 'redact' // Replace with [REDACTED]
  | 'block' // Block entire response
  | 'alert' // Alert but allow
  | 'replace'; // Replace with safer alternative

/**
 * Filter rule definition
 */
export interface FilterRule {
  id: string;
  name: string;
  description: string;
  ruleType: FilterRuleType;
  severity: FilterSeverity;
  action: FilterAction;
  enabled: boolean;

  // Pattern matching (for 'pattern' type)
  pattern?: RegExp | string;
  keywords?: string[];

  // Semantic detection (for 'semantic' type)
  semanticCategories?: SemanticCategory[];
  confidenceThreshold?: number; // 0.0-1.0

  // Role-based (for 'role-based' type)
  blockedRoles?: AliffRole[]; // Roles that should be filtered
  allowedRoles?: AliffRole[]; // Roles that can see this content

  // Replacement text (for 'replace' action)
  replacement?: string;

  // Metadata
  created: Date;
  updated: Date;
}

/**
 * Semantic categories for detection
 */
export type SemanticCategory =
  | 'pricing' // Pricing formulas, margins, cost breakdowns
  | 'strategy' // Competitive strategy, win strategies
  | 'methodology' // Proprietary processes (SDL, etc.)
  | 'client-data' // Specific client information
  | 'internal-urls' // Internal system URLs
  | 'employee-names' // Employee names/emails
  | 'financial' // Revenue, profits, budgets
  | 'legal' // Legal strategies, NDAs
  | 'technical' // Technical implementation details
  | 'credentials'; // API keys, passwords, tokens

/**
 * Filter match result
 */
export interface FilterMatch {
  ruleId: string;
  ruleName: string;
  ruleType: FilterRuleType;
  severity: FilterSeverity;
  action: FilterAction;
  matchedText: string;
  startIndex: number;
  endIndex: number;
  confidence?: number; // For semantic matches
  reason: string;
}

/**
 * Filter result
 */
export interface FilterResult {
  original: string;
  filtered: string;
  wasFiltered: boolean;
  matches: FilterMatch[];
  redactedCount: number;
  blockedCount: number;
  alertCount: number;
  processingTimeMs: number;
}

/**
 * Filter configuration
 */
export interface FilterConfig {
  enabled: boolean;
  rules: FilterRule[];
  defaultAction: FilterAction;
  logMatches: boolean;
  throwOnBlock?: boolean; // Throw error if content is blocked
}

/**
 * Sensitive pattern categories
 */
export interface SensitivePatterns {
  // Pricing patterns
  pricing: {
    formulas: RegExp[];
    keywords: string[];
  };

  // Financial data
  financial: {
    amounts: RegExp[];
    margins: RegExp[];
  };

  // Internal identifiers
  internal: {
    urls: RegExp[];
    emails: RegExp[];
    employeeNames: string[];
  };

  // Technical secrets
  technical: {
    apiKeys: RegExp[];
    passwords: RegExp[];
    tokens: RegExp[];
  };

  // Client-specific data
  clientData: {
    patterns: RegExp[];
  };
}

/**
 * Pre-defined sensitive patterns
 */
export const SENSITIVE_PATTERNS: SensitivePatterns = {
  pricing: {
    formulas: [
      /\$?\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:per|\/)\s*(?:hour|day|page|word)/gi,
      /(?:hourly rate|daily rate|word rate).*?\$?\d+/gi,
      /(?:margin|markup).*?\d+%/gi,
      /(?:cost|price|fee).*?\$\d+/gi,
    ],
    keywords: [
      'pricing formula',
      'margin calculation',
      'cost breakdown',
      'hourly rate structure',
      'pricing tiers',
    ],
  },

  financial: {
    amounts: [
      /\$\d{4,}(?:,\d{3})*(?:\.\d{2})?/g, // $1,000+
      /\d{4,}(?:,\d{3})*\s*(?:dollars|USD|revenue|profit)/gi,
    ],
    margins: [
      /\d+%\s*(?:margin|markup|profit)/gi,
      /gross\s*margin.*?\d+%/gi,
    ],
  },

  internal: {
    urls: [
      /https?:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)/gi,
      /https?:\/\/[a-z0-9-]+\.(?:internal|local|dev)/gi,
      /notion\.so\/[a-z0-9-]+/gi, // Internal Notion pages
    ],
    emails: [
      /[a-z0-9._%+-]+@aliffservices\.com/gi,
      /[a-z0-9._%+-]+@(?:internal|admin)\.[a-z]+/gi,
    ],
    employeeNames: [
      // Populated at runtime from employee database
    ],
  },

  technical: {
    apiKeys: [
      /sk-[a-zA-Z0-9]{32,}/g, // OpenAI keys
      /AKIA[0-9A-Z]{16}/g, // AWS access keys
      /AIza[0-9A-Za-z\\-_]{35}/g, // Google API keys
    ],
    passwords: [
      /password\s*[:=]\s*["']?[^\s"']+/gi,
      /api[_-]?key\s*[:=]\s*["']?[^\s"']+/gi,
    ],
    tokens: [
      /bearer\s+[a-zA-Z0-9._-]+/gi,
      /token\s*[:=]\s*["']?[^\s"']+/gi,
    ],
  },

  clientData: {
    patterns: [
      /(?:for|client|regarding)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s+at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*))?/g,
      // Matches "for John Smith at Acme Corp"
    ],
  },
};

/**
 * Default filter rules
 */
export const DEFAULT_FILTER_RULES: Omit<FilterRule, 'id' | 'created' | 'updated'>[] = [
  {
    name: 'Block API Keys',
    description: 'Prevent API keys and tokens from leaking',
    ruleType: 'pattern',
    severity: 'critical',
    action: 'redact',
    enabled: true,
    pattern: /(?:sk-|AKIA|AIza)[a-zA-Z0-9_-]{20,}/g,
    replacement: '[API_KEY_REDACTED]',
  },
  {
    name: 'Block Pricing Formulas',
    description: 'Prevent pricing calculation formulas from CLIENT role',
    ruleType: 'semantic',
    severity: 'high',
    action: 'redact',
    enabled: true,
    semanticCategories: ['pricing'],
    blockedRoles: ['CLIENT'],
    confidenceThreshold: 0.7,
    replacement: '[pricing details available upon request]',
  },
  {
    name: 'Block Strategy Discussion',
    description: 'Prevent competitive strategy leaks to clients',
    ruleType: 'semantic',
    severity: 'high',
    action: 'alert',
    enabled: true,
    semanticCategories: ['strategy'],
    blockedRoles: ['CLIENT'],
    confidenceThreshold: 0.75,
  },
  {
    name: 'Block Internal URLs',
    description: 'Prevent internal system URLs from being exposed',
    ruleType: 'pattern',
    severity: 'medium',
    action: 'redact',
    enabled: true,
    pattern: /https?:\/\/(?:localhost|127\.0\.0\.1|[a-z]+\.(?:internal|local))[^\s]*/gi,
    replacement: '[internal link]',
  },
  {
    name: 'Block Employee Emails',
    description: 'Prevent internal employee emails from being exposed',
    ruleType: 'pattern',
    severity: 'medium',
    action: 'redact',
    enabled: true,
    pattern: /[a-z0-9._%+-]+@aliffservices\.com/gi,
    replacement: 'contact@aliffservices.com',
  },
  {
    name: 'Block Large Financial Amounts',
    description: 'Prevent specific revenue/budget figures from CLIENT',
    ruleType: 'pattern',
    severity: 'medium',
    action: 'alert',
    enabled: true,
    pattern: /\$\d{5,}(?:,\d{3})*(?:\.\d{2})?/g,
    blockedRoles: ['CLIENT'],
  },
  {
    name: 'Block SDL Methodology Details',
    description: 'Prevent proprietary SDL methodology from leaking',
    ruleType: 'semantic',
    severity: 'high',
    action: 'redact',
    enabled: true,
    semanticCategories: ['methodology'],
    blockedRoles: ['CLIENT', 'SALES'],
    confidenceThreshold: 0.8,
    replacement: '[proprietary methodology]',
  },
];

/**
 * Default filter configuration
 */
export const DEFAULT_FILTER_CONFIG: Omit<FilterConfig, 'rules'> = {
  enabled: true,
  defaultAction: 'alert',
  logMatches: true,
  throwOnBlock: false,
};
