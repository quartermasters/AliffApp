/**
 * Aliff AI - Semantic Content Detection
 *
 * Uses pattern matching and heuristics to detect sensitive content categories.
 * In production, this would use ML models for more accurate detection.
 */

import type { SemanticCategory } from './types';

/**
 * Semantic detection result
 */
export interface SemanticDetection {
  text: string;
  startIndex: number;
  endIndex: number;
  confidence: number; // 0.0-1.0
  category: SemanticCategory;
}

/**
 * Semantic patterns for each category
 */
const SEMANTIC_PATTERNS: Record<SemanticCategory, Array<RegExp | string>> = {
  pricing: [
    /(?:hourly|daily|per-page|per-word)\s*(?:rate|price|cost|fee).*?\$?\d+/gi,
    /pricing\s*(?:formula|model|structure|tier)/gi,
    /(?:margin|markup|cost)\s*(?:calculation|formula|breakdown)/gi,
    /\d+%\s*(?:margin|markup)/gi,
    'pricing strategy',
    'cost breakdown',
    'rate card',
  ],

  strategy: [
    /(?:competitive|win)\s*(?:strategy|advantage|moat)/gi,
    /(?:market|strategic)\s*(?:positioning|differentiation)/gi,
    /(?:go-to-market|GTM)\s*strategy/gi,
    /(?:beat|outperform)\s*(?:competitor|competition)/gi,
    'competitive edge',
    'strategic advantage',
    'win strategy',
    'market dominance',
  ],

  methodology: [
    /SDL\s*(?:process|methodology|framework)/gi,
    /(?:proprietary|custom)\s*(?:methodology|process|approach|framework)/gi,
    /(?:diagnosis|triage|analysis)\s*(?:methodology|framework)/gi,
    /multi-AI\s*orchestration/gi,
    'proprietary process',
    'methodology details',
    'internal framework',
  ],

  'client-data': [
    /client\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g,
    /(?:for|regarding|with)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
    /customer\s+(?:data|information|details)/gi,
    /(?:confidential|sensitive)\s*(?:client|customer)\s*(?:data|info)/gi,
  ],

  'internal-urls': [
    /https?:\/\/(?:localhost|127\.0\.0\.1)/gi,
    /https?:\/\/[a-z0-9-]+\.(?:internal|local|dev)/gi,
    /notion\.so\/[a-z0-9-]+/gi,
    /slack\.com\/archives/gi,
  ],

  'employee-names': [
    /(?:employee|staff|team member)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
    /[a-z0-9._%+-]+@aliffservices\.com/gi,
  ],

  financial: [
    /\$\d{5,}(?:,\d{3})*(?:\.\d{2})?/g, // Large amounts
    /(?:revenue|profit|budget|earnings).*?\$\d+/gi,
    /annual\s*(?:revenue|profit|budget)/gi,
    /gross\s*margin/gi,
  ],

  legal: [
    /(?:NDA|non-disclosure|confidentiality)\s*agreement/gi,
    /(?:legal|litigation)\s*strategy/gi,
    /(?:contract|agreement)\s*terms/gi,
    /(?:intellectual property|IP)\s*strategy/gi,
  ],

  technical: [
    /(?:API|access)\s*key.*?[a-zA-Z0-9_-]{20,}/gi,
    /password.*?[:=]/gi,
    /token.*?[:=]/gi,
    /(?:database|DB)\s*(?:connection|credentials)/gi,
    /(?:implementation|architecture)\s*details/gi,
  ],

  credentials: [
    /sk-[a-zA-Z0-9]{32,}/g, // OpenAI
    /AKIA[0-9A-Z]{16}/g, // AWS
    /AIza[0-9A-Za-z\\-_]{35}/g, // Google
    /ghp_[a-zA-Z0-9]{36}/g, // GitHub
    /password\s*[:=]\s*["']?[^\s"']+/gi,
  ],
};

/**
 * Detect semantic content in text
 */
export async function detectSemanticContent(
  text: string,
  category: SemanticCategory
): Promise<SemanticDetection[]> {
  const detections: SemanticDetection[] = [];
  const patterns = SEMANTIC_PATTERNS[category];

  if (!patterns) {
    return detections;
  }

  for (const pattern of patterns) {
    if (typeof pattern === 'string') {
      // Simple keyword search
      const keyword = pattern.toLowerCase();
      const lowerText = text.toLowerCase();

      let index = lowerText.indexOf(keyword);
      while (index !== -1) {
        // Extract context around keyword (±50 chars)
        const contextStart = Math.max(0, index - 50);
        const contextEnd = Math.min(text.length, index + keyword.length + 50);
        const contextText = text.substring(contextStart, contextEnd);

        detections.push({
          text: contextText,
          startIndex: contextStart,
          endIndex: contextEnd,
          confidence: 0.7, // Moderate confidence for keyword matching
          category,
        });

        index = lowerText.indexOf(keyword, index + 1);
      }
    } else {
      // Regex pattern
      const regex = pattern;
      regex.lastIndex = 0; // Reset regex

      let match;
      while ((match = regex.exec(text)) !== null) {
        // Calculate confidence based on pattern specificity
        let confidence = 0.8; // Base confidence for regex

        // Higher confidence for longer matches
        if (match[0].length > 20) {
          confidence = Math.min(0.95, confidence + 0.1);
        }

        // Higher confidence for certain categories
        if (category === 'credentials' || category === 'technical') {
          confidence = 0.95;
        }

        detections.push({
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence,
          category,
        });

        // Prevent infinite loop
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    }
  }

  // Merge overlapping detections
  return mergeOverlappingDetections(detections);
}

/**
 * Merge overlapping detections to avoid duplicate redactions
 */
function mergeOverlappingDetections(
  detections: SemanticDetection[]
): SemanticDetection[] {
  if (detections.length === 0) return [];

  // Sort by start index
  detections.sort((a, b) => a.startIndex - b.startIndex);

  const merged: SemanticDetection[] = [];
  let current = detections[0];

  for (let i = 1; i < detections.length; i++) {
    const next = detections[i];

    // Check if overlapping
    if (next.startIndex <= current.endIndex) {
      // Merge: extend current to cover both
      current = {
        text: current.text + ' ' + next.text,
        startIndex: current.startIndex,
        endIndex: Math.max(current.endIndex, next.endIndex),
        confidence: Math.max(current.confidence, next.confidence),
        category: current.category,
      };
    } else {
      // No overlap: add current and move to next
      merged.push(current);
      current = next;
    }
  }

  // Add final detection
  merged.push(current);

  return merged;
}

/**
 * Classify text into semantic categories
 * Returns all categories detected with confidence scores
 */
export async function classifyText(
  text: string
): Promise<Array<{ category: SemanticCategory; confidence: number }>> {
  const categories: Array<{ category: SemanticCategory; confidence: number }> = [];

  for (const category of Object.keys(SEMANTIC_PATTERNS) as SemanticCategory[]) {
    const detections = await detectSemanticContent(text, category);

    if (detections.length > 0) {
      // Use highest confidence from all detections
      const maxConfidence = Math.max(...detections.map((d) => d.confidence));

      categories.push({
        category,
        confidence: maxConfidence,
      });
    }
  }

  // Sort by confidence (descending)
  return categories.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Check if text contains any sensitive content
 */
export async function containsSensitiveContent(
  text: string,
  minConfidence: number = 0.7
): Promise<boolean> {
  const classifications = await classifyText(text);

  return classifications.some((c) => c.confidence >= minConfidence);
}

/**
 * Export semantic detection API
 */
export const SemanticDetector = {
  detectContent: detectSemanticContent,
  classify: classifyText,
  containsSensitive: containsSensitiveContent,
} as const;
