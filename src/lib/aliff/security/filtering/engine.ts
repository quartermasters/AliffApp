/**
 * Aliff AI - Output Filtering Engine
 *
 * Filters AI responses to prevent sensitive information leakage.
 * Supports pattern matching, semantic detection, and role-based rules.
 */

import { v4 as uuidv4 } from 'uuid';
import type { AliffRole } from '../../types';
import type {
  FilterRule,
  FilterMatch,
  FilterResult,
  FilterConfig,
  FilterAction,
  DEFAULT_FILTER_RULES,
  DEFAULT_FILTER_CONFIG,
} from './types';
import { detectSemanticContent } from './semantic';
import { AuditLogger } from '../audit';

/**
 * Current filter configuration
 */
let currentConfig: FilterConfig = {
  ...DEFAULT_FILTER_CONFIG,
  rules: [],
};

/**
 * Initialize filter engine with rules
 */
export function initializeFilterEngine(
  config?: Partial<FilterConfig>
): void {
  if (config?.rules) {
    currentConfig.rules = config.rules;
  }

  if (config) {
    currentConfig = {
      ...currentConfig,
      ...config,
    };
  }

  console.log('[Filter] Engine initialized:', {
    enabled: currentConfig.enabled,
    ruleCount: currentConfig.rules.length,
  });
}

/**
 * Get current filter configuration
 */
export function getFilterConfig(): FilterConfig {
  return { ...currentConfig };
}

/**
 * Add a filter rule
 */
export function addFilterRule(
  rule: Omit<FilterRule, 'id' | 'created' | 'updated'>
): FilterRule {
  const fullRule: FilterRule = {
    ...rule,
    id: uuidv4(),
    created: new Date(),
    updated: new Date(),
  };

  currentConfig.rules.push(fullRule);
  return fullRule;
}

/**
 * Remove a filter rule
 */
export function removeFilterRule(ruleId: string): boolean {
  const index = currentConfig.rules.findIndex((r) => r.id === ruleId);
  if (index !== -1) {
    currentConfig.rules.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Update a filter rule
 */
export function updateFilterRule(
  ruleId: string,
  updates: Partial<Omit<FilterRule, 'id' | 'created'>>
): FilterRule | null {
  const rule = currentConfig.rules.find((r) => r.id === ruleId);
  if (rule) {
    Object.assign(rule, updates, { updated: new Date() });
    return rule;
  }
  return null;
}

/**
 * Main filter function - filters text based on role and rules
 */
export async function filterOutput(
  text: string,
  role: AliffRole,
  userId?: string,
  sessionId?: string
): Promise<FilterResult> {
  const startTime = Date.now();

  if (!currentConfig.enabled) {
    return {
      original: text,
      filtered: text,
      wasFiltered: false,
      matches: [],
      redactedCount: 0,
      blockedCount: 0,
      alertCount: 0,
      processingTimeMs: 0,
    };
  }

  let filteredText = text;
  const matches: FilterMatch[] = [];

  // Apply each enabled rule
  for (const rule of currentConfig.rules) {
    if (!rule.enabled) continue;

    // Check if rule applies to this role
    if (rule.blockedRoles && !rule.blockedRoles.includes(role)) {
      continue; // Rule doesn't apply to this role
    }

    if (rule.allowedRoles && rule.allowedRoles.includes(role)) {
      continue; // Role is explicitly allowed to see this content
    }

    // Apply rule based on type
    if (rule.ruleType === 'pattern') {
      const patternMatches = await applyPatternRule(rule, filteredText);
      matches.push(...patternMatches);
    } else if (rule.ruleType === 'semantic') {
      const semanticMatches = await applySemanticRule(rule, filteredText);
      matches.push(...semanticMatches);
    } else if (rule.ruleType === 'role-based') {
      const roleMatches = await applyRoleBasedRule(rule, filteredText, role);
      matches.push(...roleMatches);
    }
  }

  // Apply actions (redact, block, alert, replace)
  let redactedCount = 0;
  let blockedCount = 0;
  let alertCount = 0;

  // Sort matches by start index (descending) to apply replacements correctly
  matches.sort((a, b) => b.startIndex - a.startIndex);

  for (const match of matches) {
    if (match.action === 'redact' || match.action === 'replace') {
      // Replace matched text
      const replacement =
        currentConfig.rules.find((r) => r.id === match.ruleId)?.replacement ||
        '[REDACTED]';

      filteredText =
        filteredText.substring(0, match.startIndex) +
        replacement +
        filteredText.substring(match.endIndex);

      redactedCount++;

      // Log filter trigger
      if (currentConfig.logMatches) {
        await AuditLogger.logFilterTriggered(
          match.ruleId,
          match.ruleName,
          match.ruleType,
          replacement,
          match.matchedText,
          role,
          userId,
          sessionId,
          {
            matchedPattern: match.matchedText,
            confidence: match.confidence,
          }
        );
      }
    } else if (match.action === 'block') {
      blockedCount++;

      // Log filter trigger
      if (currentConfig.logMatches) {
        await AuditLogger.logFilterTriggered(
          match.ruleId,
          match.ruleName,
          match.ruleType,
          '[BLOCKED]',
          match.matchedText,
          role,
          userId,
          sessionId,
          {
            matchedPattern: match.matchedText,
            confidence: match.confidence,
          }
        );
      }

      // Optionally throw error
      if (currentConfig.throwOnBlock) {
        throw new Error(
          `Content blocked by filter rule: ${match.ruleName} (${match.reason})`
        );
      }

      // Block entire response
      filteredText = `[This response was blocked due to sensitive content policy. Reason: ${match.reason}]`;
      break; // Stop processing after block
    } else if (match.action === 'alert') {
      alertCount++;

      // Log alert (but don't change text)
      if (currentConfig.logMatches) {
        await AuditLogger.logFilterTriggered(
          match.ruleId,
          match.ruleName,
          match.ruleType,
          match.matchedText,
          match.matchedText,
          role,
          userId,
          sessionId,
          {
            matchedPattern: match.matchedText,
            confidence: match.confidence,
          }
        );
      }
    }
  }

  const processingTime = Date.now() - startTime;

  return {
    original: text,
    filtered: filteredText,
    wasFiltered: matches.length > 0,
    matches,
    redactedCount,
    blockedCount,
    alertCount,
    processingTimeMs: processingTime,
  };
}

/**
 * Apply pattern-based rule (regex/keywords)
 */
async function applyPatternRule(
  rule: FilterRule,
  text: string
): Promise<FilterMatch[]> {
  const matches: FilterMatch[] = [];

  // Apply regex pattern
  if (rule.pattern) {
    const regex =
      typeof rule.pattern === 'string'
        ? new RegExp(rule.pattern, 'gi')
        : rule.pattern;

    let match;
    // Reset regex state
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        ruleId: rule.id,
        ruleName: rule.name,
        ruleType: 'pattern',
        severity: rule.severity,
        action: rule.action,
        matchedText: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        reason: `Pattern matched: ${rule.description}`,
      });

      // Prevent infinite loop for zero-length matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }
  }

  // Apply keyword matching
  if (rule.keywords) {
    for (const keyword of rule.keywords) {
      const keywordRegex = new RegExp(keyword, 'gi');
      let match;

      while ((match = keywordRegex.exec(text)) !== null) {
        matches.push({
          ruleId: rule.id,
          ruleName: rule.name,
          ruleType: 'pattern',
          severity: rule.severity,
          action: rule.action,
          matchedText: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          reason: `Keyword matched: "${keyword}"`,
        });
      }
    }
  }

  return matches;
}

/**
 * Apply semantic-based rule (AI detection)
 */
async function applySemanticRule(
  rule: FilterRule,
  text: string
): Promise<FilterMatch[]> {
  const matches: FilterMatch[] = [];

  if (!rule.semanticCategories || rule.semanticCategories.length === 0) {
    return matches;
  }

  // Use semantic detection to find sensitive content
  for (const category of rule.semanticCategories) {
    const detections = await detectSemanticContent(text, category);

    for (const detection of detections) {
      // Check confidence threshold
      if (
        rule.confidenceThreshold &&
        detection.confidence < rule.confidenceThreshold
      ) {
        continue;
      }

      matches.push({
        ruleId: rule.id,
        ruleName: rule.name,
        ruleType: 'semantic',
        severity: rule.severity,
        action: rule.action,
        matchedText: detection.text,
        startIndex: detection.startIndex,
        endIndex: detection.endIndex,
        confidence: detection.confidence,
        reason: `Semantic category detected: ${category}`,
      });
    }
  }

  return matches;
}

/**
 * Apply role-based rule
 */
async function applyRoleBasedRule(
  rule: FilterRule,
  text: string,
  role: AliffRole
): Promise<FilterMatch[]> {
  const matches: FilterMatch[] = [];

  // Role-based rules are checked in the main filter function
  // This is a placeholder for custom role-based logic

  return matches;
}

/**
 * Test a rule against sample text
 */
export async function testFilterRule(
  rule: FilterRule,
  text: string,
  role: AliffRole
): Promise<FilterMatch[]> {
  if (!rule.enabled) return [];

  if (rule.ruleType === 'pattern') {
    return applyPatternRule(rule, text);
  } else if (rule.ruleType === 'semantic') {
    return applySemanticRule(rule, text);
  } else if (rule.ruleType === 'role-based') {
    return applyRoleBasedRule(rule, text, role);
  }

  return [];
}

/**
 * Export filter engine API
 */
export const FilterEngine = {
  initialize: initializeFilterEngine,
  getConfig: getFilterConfig,
  addRule: addFilterRule,
  removeRule: removeFilterRule,
  updateRule: updateFilterRule,
  filter: filterOutput,
  testRule: testFilterRule,
} as const;
