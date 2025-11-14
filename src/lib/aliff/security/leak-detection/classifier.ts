/**
 * Aliff AI - Leak Detection Classifier
 *
 * Analyzes text to detect potential competitive intelligence leaks.
 * Combines pattern matching, semantic analysis, and context awareness.
 */

import { v4 as uuidv4 } from 'uuid';
import type { AliffRole } from '../../types';
import type {
  LeakType,
  LeakSeverity,
  LeakDetection,
  LeakDetectionConfig,
  CompetitiveAdvantage,
} from './types';
import { DEFAULT_LEAK_CONFIG, PROTECTED_ADVANTAGES } from './types';
import { SemanticDetector } from '../filtering/semantic';

/**
 * Current leak detection configuration
 */
let currentConfig: LeakDetectionConfig = {
  ...DEFAULT_LEAK_CONFIG,
  protectedAdvantages: [],
};

/**
 * Initialize leak detection with competitive advantages
 */
export function initializeLeakDetector(
  config?: Partial<LeakDetectionConfig>
): void {
  // Add protected advantages with IDs
  const advantagesWithIds: CompetitiveAdvantage[] = PROTECTED_ADVANTAGES.map(
    (adv) => ({
      ...adv,
      id: uuidv4(),
    })
  );

  currentConfig = {
    ...DEFAULT_LEAK_CONFIG,
    protectedAdvantages: advantagesWithIds,
    ...config,
  };

  console.log('[LeakDetector] Initialized:', {
    enabled: currentConfig.enabled,
    protectedCount: currentConfig.protectedAdvantages.length,
    confidenceThreshold: currentConfig.confidenceThreshold,
  });
}

/**
 * Get current leak detection configuration
 */
export function getLeakConfig(): LeakDetectionConfig {
  return { ...currentConfig };
}

/**
 * Detect potential strategy leaks in text
 */
export async function detectLeaks(
  text: string,
  role: AliffRole,
  context?: {
    query?: string;
    userId?: string;
    sessionId?: string;
  }
): Promise<LeakDetection[]> {
  if (!currentConfig.enabled) {
    return [];
  }

  const detections: LeakDetection[] = [];

  // Check each protected competitive advantage
  for (const advantage of currentConfig.protectedAdvantages) {
    // Skip if role is explicitly allowed to discuss this
    if (advantage.allowedRoles.includes(role)) {
      continue;
    }

    // Check patterns
    for (const pattern of advantage.patterns) {
      const regex = pattern;
      regex.lastIndex = 0;

      let match;
      while ((match = regex.exec(text)) !== null) {
        const contextStart = Math.max(0, match.index - 100);
        const contextEnd = Math.min(text.length, match.index + match[0].length + 100);
        const contextText = text.substring(contextStart, contextEnd);

        // Calculate confidence based on multiple factors
        const confidence = calculateConfidence(
          match[0],
          contextText,
          advantage,
          role
        );

        if (confidence >= currentConfig.confidenceThreshold) {
          const severity = calculateSeverity(confidence, advantage, role);

          detections.push({
            id: uuidv4(),
            leakType: mapCategoryToLeakType(advantage.category),
            severity,
            confidence,
            flaggedText: match[0],
            context: contextText,
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            reason: `Potential ${advantage.name} leak detected (role: ${role})`,
            indicators: [`Pattern match: ${pattern.source}`, `Advantage: ${advantage.name}`],
            timestamp: new Date(),
          });
        }

        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    }

    // Check keywords
    for (const keyword of advantage.keywords) {
      const keywordRegex = new RegExp(keyword, 'gi');
      let match;

      while ((match = keywordRegex.exec(text)) !== null) {
        const contextStart = Math.max(0, match.index - 100);
        const contextEnd = Math.min(text.length, match.index + keyword.length + 100);
        const contextText = text.substring(contextStart, contextEnd);

        const confidence = calculateConfidence(
          keyword,
          contextText,
          advantage,
          role
        );

        if (confidence >= currentConfig.confidenceThreshold) {
          const severity = calculateSeverity(confidence, advantage, role);

          detections.push({
            id: uuidv4(),
            leakType: mapCategoryToLeakType(advantage.category),
            severity,
            confidence,
            flaggedText: match[0],
            context: contextText,
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            reason: `Potential ${advantage.name} leak detected (keyword: "${keyword}")`,
            indicators: [`Keyword match: ${keyword}`, `Advantage: ${advantage.name}`],
            timestamp: new Date(),
          });
        }
      }
    }
  }

  // Use semantic detector for additional leak types
  const semanticDetections = await detectSemanticLeaks(text, role);
  detections.push(...semanticDetections);

  // Merge overlapping detections
  return mergeDetections(detections);
}

/**
 * Detect leaks using semantic analysis
 */
async function detectSemanticLeaks(
  text: string,
  role: AliffRole
): Promise<LeakDetection[]> {
  const detections: LeakDetection[] = [];

  // Detect pricing leaks
  const pricingMatches = await SemanticDetector.detectContent(text, 'pricing');
  for (const match of pricingMatches) {
    if (role === 'CLIENT' && match.confidence >= 0.7) {
      detections.push({
        id: uuidv4(),
        leakType: 'pricing',
        severity: match.confidence > 0.9 ? 'critical' : 'high',
        confidence: match.confidence,
        flaggedText: match.text,
        context: text.substring(
          Math.max(0, match.startIndex - 50),
          Math.min(text.length, match.endIndex + 50)
        ),
        startIndex: match.startIndex,
        endIndex: match.endIndex,
        reason: 'Pricing information detected in CLIENT response',
        indicators: ['Semantic: pricing category', `Confidence: ${match.confidence.toFixed(2)}`],
        timestamp: new Date(),
      });
    }
  }

  // Detect methodology leaks
  const methodologyMatches = await SemanticDetector.detectContent(
    text,
    'technical'
  );
  for (const match of methodologyMatches) {
    if ((role === 'CLIENT' || role === 'SALES') && match.confidence >= 0.75) {
      detections.push({
        id: uuidv4(),
        leakType: 'methodology',
        severity: match.confidence > 0.9 ? 'critical' : 'high',
        confidence: match.confidence,
        flaggedText: match.text,
        context: text.substring(
          Math.max(0, match.startIndex - 50),
          Math.min(text.length, match.endIndex + 50)
        ),
        startIndex: match.startIndex,
        endIndex: match.endIndex,
        reason: 'Methodology details detected in restricted role response',
        indicators: ['Semantic: technical category', `Role: ${role}`],
        timestamp: new Date(),
      });
    }
  }

  return detections;
}

/**
 * Calculate confidence score for a potential leak
 */
function calculateConfidence(
  matchedText: string,
  context: string,
  advantage: CompetitiveAdvantage,
  role: AliffRole
): number {
  let confidence = 0.5; // Base confidence

  // Increase confidence for longer matches
  if (matchedText.length > 20) {
    confidence += 0.15;
  }

  // Increase confidence if multiple keywords present in context
  const keywordCount = advantage.keywords.filter((kw) =>
    context.toLowerCase().includes(kw.toLowerCase())
  ).length;

  confidence += Math.min(0.3, keywordCount * 0.1);

  // Increase confidence for CLIENT role (higher risk)
  if (role === 'CLIENT') {
    confidence += 0.1;
  }

  // Increase confidence for 'secret' sensitivity
  if (advantage.sensitivity === 'secret') {
    confidence += 0.1;
  }

  // Cap at 0.95
  return Math.min(0.95, confidence);
}

/**
 * Calculate severity based on confidence and context
 */
function calculateSeverity(
  confidence: number,
  advantage: CompetitiveAdvantage,
  role: AliffRole
): LeakSeverity {
  // Critical: High confidence + secret sensitivity + CLIENT role
  if (
    confidence >= 0.9 &&
    advantage.sensitivity === 'secret' &&
    role === 'CLIENT'
  ) {
    return 'critical';
  }

  // High: High confidence or CLIENT role with proprietary
  if (
    confidence >= 0.85 ||
    (confidence >= 0.75 && role === 'CLIENT' && advantage.sensitivity === 'proprietary')
  ) {
    return 'high';
  }

  // Medium: Moderate confidence
  if (confidence >= 0.7) {
    return 'medium';
  }

  // Low: Below threshold
  return 'low';
}

/**
 * Map competitive advantage category to leak type
 */
function mapCategoryToLeakType(
  category: 'SDL' | 'multi-AI' | 'pricing' | 'methodology' | 'other'
): LeakType {
  switch (category) {
    case 'SDL':
      return 'methodology';
    case 'multi-AI':
      return 'technical';
    case 'pricing':
      return 'pricing';
    case 'methodology':
      return 'methodology';
    default:
      return 'competitive';
  }
}

/**
 * Merge overlapping or duplicate detections
 */
function mergeDetections(detections: LeakDetection[]): LeakDetection[] {
  if (detections.length === 0) return [];

  // Sort by start index
  detections.sort((a, b) => a.startIndex - b.startIndex);

  const merged: LeakDetection[] = [];
  let current = detections[0];

  for (let i = 1; i < detections.length; i++) {
    const next = detections[i];

    // Check if overlapping (within 50 chars)
    if (next.startIndex <= current.endIndex + 50) {
      // Merge: keep higher confidence detection
      if (next.confidence > current.confidence) {
        current = next;
      }
    } else {
      merged.push(current);
      current = next;
    }
  }

  merged.push(current);
  return merged;
}

/**
 * Check if text should be auto-blocked
 */
export function shouldAutoBlock(detection: LeakDetection): boolean {
  return (
    detection.confidence >= currentConfig.autoBlockThreshold &&
    (detection.severity === 'critical' || detection.severity === 'high')
  );
}

/**
 * Check if detection requires manual review
 */
export function requiresReview(detection: LeakDetection): boolean {
  return (
    detection.confidence >= 0.7 &&
    detection.confidence < currentConfig.autoBlockThreshold &&
    (detection.severity === 'high' || detection.severity === 'medium')
  );
}

/**
 * Export leak classifier API
 */
export const LeakClassifier = {
  initialize: initializeLeakDetector,
  getConfig: getLeakConfig,
  detectLeaks,
  shouldAutoBlock,
  requiresReview,
} as const;
