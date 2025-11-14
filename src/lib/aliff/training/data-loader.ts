/**
 * Aliff AI - Training Data Loader
 *
 * Loads existing content (Planning docs, services, training data)
 * and converts it to KnowledgeDocuments for the RAG system.
 */

import fs from 'fs';
import path from 'path';
import type {
  KnowledgeDocument,
  AliffRole,
  SensitivityLevel,
  KnowledgeCategory,
} from '../types';

/**
 * Load all markdown files from a directory
 */
export function loadMarkdownFiles(dirPath: string): Array<{
  filename: string;
  content: string;
  path: string;
}> {
  const files: Array<{ filename: string; content: string; path: string }> = [];

  try {
    if (!fs.existsSync(dirPath)) {
      console.warn(`Directory not found: ${dirPath}`);
      return files;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively load from subdirectories
        const subFiles = loadMarkdownFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        files.push({
          filename: entry.name,
          content,
          path: fullPath,
        });
      }
    }

    return files;
  } catch (error) {
    console.error(`Error loading markdown files from ${dirPath}:`, error);
    return files;
  }
}

/**
 * Parse metadata from markdown frontmatter (if exists)
 */
export function parseMarkdownFrontmatter(content: string): {
  frontmatter: Record<string, any>;
  body: string;
} {
  // Check if content starts with ---
  if (!content.startsWith('---')) {
    return { frontmatter: {}, body: content };
  }

  // Find closing ---
  const endIndex = content.indexOf('---', 3);
  if (endIndex === -1) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterStr = content.substring(3, endIndex).trim();
  const body = content.substring(endIndex + 3).trim();

  // Parse YAML-like frontmatter (simple key: value)
  const frontmatter: Record<string, any> = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

/**
 * Extract title from markdown content (first # heading)
 */
export function extractTitle(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return trimmed.substring(2).trim();
    }
  }
  return 'Untitled';
}

/**
 * Determine appropriate roles based on content/filename
 */
export function inferRoles(filename: string, content: string): AliffRole[] {
  const lower = filename.toLowerCase() + ' ' + content.toLowerCase();

  const roles: Set<AliffRole> = new Set();

  // CEO always has access to everything
  roles.add('CEO');

  // Check for role-specific keywords
  if (lower.includes('sales') || lower.includes('lead') || lower.includes('pitch')) {
    roles.add('SALES');
  }

  if (
    lower.includes('diagnosis') ||
    lower.includes('sdl') ||
    lower.includes('ops') ||
    lower.includes('orchestration')
  ) {
    roles.add('OPS');
  }

  if (lower.includes('client') || lower.includes('customer')) {
    roles.add('CLIENT');
  }

  if (lower.includes('training') || lower.includes('onboarding')) {
    roles.add('TRAINER');
  }

  // Strategic/planning docs accessible by most roles
  if (lower.includes('strategic') || lower.includes('planning')) {
    roles.add('SALES');
    roles.add('OPS');
    roles.add('TRAINER');
  }

  // Service definitions accessible by sales and ops
  if (lower.includes('service')) {
    roles.add('SALES');
    roles.add('OPS');
  }

  return Array.from(roles);
}

/**
 * Determine sensitivity level based on content/filename
 */
export function inferSensitivity(
  filename: string,
  content: string
): SensitivityLevel {
  const lower = filename.toLowerCase() + ' ' + content.toLowerCase();

  // Secret: Pricing, margins, competitive advantage
  if (
    lower.includes('pricing formula') ||
    lower.includes('margin') ||
    lower.includes('secret') ||
    lower.includes('competitive moat')
  ) {
    return 'secret';
  }

  // Proprietary: Methodology, diagnosis, patterns
  if (
    lower.includes('methodology') ||
    lower.includes('diagnosis') ||
    lower.includes('sdl') ||
    lower.includes('proprietary') ||
    lower.includes('win strategy')
  ) {
    return 'proprietary';
  }

  // Internal: Planning, decisions, internal processes
  if (
    lower.includes('planning') ||
    lower.includes('internal') ||
    lower.includes('decision') ||
    lower.includes('phase')
  ) {
    return 'internal';
  }

  // Default to internal for safety
  return 'internal';
}

/**
 * Determine category based on content/filename
 */
export function inferCategory(
  filename: string,
  content: string
): KnowledgeCategory {
  const lower = filename.toLowerCase() + ' ' + content.toLowerCase();

  if (lower.includes('strategic') || lower.includes('strat-')) {
    return 'strategic-discussion';
  }

  if (lower.includes('diagnosis') || lower.includes('diag-') || lower.includes('sdl')) {
    return 'diagnosis-case-study';
  }

  if (lower.includes('client') || lower.includes('interaction')) {
    return 'client-interaction';
  }

  if (lower.includes('decision') || lower.includes('dec-')) {
    return 'business-decision';
  }

  if (lower.includes('pattern')) {
    return 'pattern-recognition';
  }

  if (lower.includes('service')) {
    return 'service-definition';
  }

  if (lower.includes('methodology') || lower.includes('process')) {
    return 'methodology';
  }

  return 'technical-documentation';
}

/**
 * Extract tags from content (keywords, topics)
 */
export function extractTags(filename: string, content: string): string[] {
  const tags: Set<string> = new Set();

  const lower = content.toLowerCase();

  // Service types
  if (lower.includes('govcon')) tags.add('govcon');
  if (lower.includes('sled')) tags.add('sled');
  if (lower.includes('writing')) tags.add('writing');
  if (lower.includes('it') || lower.includes('software')) tags.add('it');

  // Topics
  if (lower.includes('proposal')) tags.add('proposal');
  if (lower.includes('diagnosis')) tags.add('diagnosis');
  if (lower.includes('sdl')) tags.add('SDL');
  if (lower.includes('strategic')) tags.add('strategy');
  if (lower.includes('pricing')) tags.add('pricing');
  if (lower.includes('win rate')) tags.add('win-rate');
  if (lower.includes('b2b') || lower.includes('agency')) tags.add('b2b');
  if (lower.includes('orchestration')) tags.add('orchestration');
  if (lower.includes('ai')) tags.add('ai');

  // Add filename-based tags
  const filenameParts = filename
    .replace('.md', '')
    .split(/[-_]/)
    .filter((p) => p.length > 2);
  filenameParts.forEach((part) => tags.add(part.toLowerCase()));

  return Array.from(tags).slice(0, 10); // Limit to 10 tags
}

/**
 * Convert a markdown file to a KnowledgeDocument
 */
export function markdownToKnowledge(
  filename: string,
  content: string,
  sourcePath: string
): Omit<KnowledgeDocument, 'id' | 'embedding'> {
  const { frontmatter, body } = parseMarkdownFrontmatter(content);
  const title = frontmatter.title || extractTitle(body);

  // Infer metadata from content
  const roles = inferRoles(filename, body);
  const sensitivity = inferSensitivity(filename, body);
  const category = inferCategory(filename, body);
  const tags = extractTags(filename, body);

  // Create full content with title
  const fullContent = `# ${title}\n\n${body}`;

  return {
    content: fullContent,
    metadata: {
      roles,
      sensitivity,
      category,
      tags,
      source: sourcePath,
      created: new Date(),
      updated: new Date(),
      version: '1.0',
    },
  };
}

/**
 * Load all Planning documents
 */
export function loadPlanningDocuments(
  projectRoot: string
): Array<Omit<KnowledgeDocument, 'id' | 'embedding'>> {
  const planningDir = path.join(projectRoot, 'Planning');
  const files = loadMarkdownFiles(planningDir);

  return files.map((file) => markdownToKnowledge(file.filename, file.content, file.path));
}

/**
 * Load all Training documents
 */
export function loadTrainingDocuments(
  projectRoot: string
): Array<Omit<KnowledgeDocument, 'id' | 'embedding'>> {
  const trainingDir = path.join(projectRoot, 'Training', 'Raw-Data');
  const files = loadMarkdownFiles(trainingDir);

  return files.map((file) => markdownToKnowledge(file.filename, file.content, file.path));
}

/**
 * Load service definitions from services.ts
 */
export function loadServiceDefinitions(
  servicesData: any[]
): Array<Omit<KnowledgeDocument, 'id' | 'embedding'>> {
  return servicesData.map((service) => {
    // Create comprehensive content from service data
    const content = `# ${service.name}

**Category**: ${service.category.toUpperCase()}
**Headline**: ${service.headline}

## Overview

${service.overview.whatItIs}

**Who Needs It**: ${service.overview.whoNeedsIt}

**Why Strategic**: ${service.overview.whyStrategic}

## Key Challenges

${service.overview.keyChallenges.map((c: string) => `- ${c}`).join('\n')}

## Our Approach

### Phase 1: ${service.approach.phase1.title}
${service.approach.phase1.description}

${service.approach.phase1.details.map((d: string) => `- ${d}`).join('\n')}

### Phase 2: ${service.approach.phase2.title}
${service.approach.phase2.description}

${service.approach.phase2.details.map((d: string) => `- ${d}`).join('\n')}

### Phase 3: ${service.approach.phase3.title}
${service.approach.phase3.description}

${service.approach.phase3.details.map((d: string) => `- ${d}`).join('\n')}

## Deliverables

${service.deliverables.map((d: any) => `- **${d.name}**: ${d.description}`).join('\n')}

## Turnaround & Pricing

- **Turnaround Time**: ${service.turnaroundTime}
- **Revisions**: ${service.revisionsIncluded}
- **Pricing**: ${service.pricing.message}

## Differentiators

**AI-Only Approach**: ${service.differentiators.aiOnly}

**Traditional Approach**: ${service.differentiators.traditional}

**Aliff Approach**: ${service.differentiators.aliff}
`;

    return {
      content,
      metadata: {
        roles: ['SALES', 'OPS', 'CEO'],
        sensitivity: 'internal' as SensitivityLevel,
        category: 'service-definition' as KnowledgeCategory,
        tags: [service.category, 'service', service.slug],
        source: `services.ts:${service.slug}`,
        created: new Date(),
        updated: new Date(),
        version: '1.0',
      },
    };
  });
}

/**
 * Get total count of documents by category
 */
export function summarizeDocuments(
  documents: Array<Omit<KnowledgeDocument, 'id' | 'embedding'>>
) {
  const bySensitivity: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const byRole: Record<string, number> = {};

  for (const doc of documents) {
    // Count by sensitivity
    bySensitivity[doc.metadata.sensitivity] =
      (bySensitivity[doc.metadata.sensitivity] || 0) + 1;

    // Count by category
    byCategory[doc.metadata.category] = (byCategory[doc.metadata.category] || 0) + 1;

    // Count by role
    for (const role of doc.metadata.roles) {
      byRole[role] = (byRole[role] || 0) + 1;
    }
  }

  return {
    total: documents.length,
    bySensitivity,
    byCategory,
    byRole,
  };
}
