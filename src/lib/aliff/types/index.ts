/**
 * Aliff AI System - Core Type Definitions
 *
 * This file defines the core types used across the entire Aliff AI system.
 * All 5 roles (SALES, OPS, CLIENT, TRAINER, CEO) use these types.
 */

// ============================================================================
// ROLE DEFINITIONS
// ============================================================================

/**
 * The five roles of Aliff AI
 * Each role has different knowledge access and decision authority
 */
export type AliffRole = 'SALES' | 'OPS' | 'CLIENT' | 'TRAINER' | 'CEO';

/**
 * Sensitivity levels for knowledge and data
 * Determines which roles can access the information
 */
export type SensitivityLevel = 'public' | 'internal' | 'proprietary' | 'secret';

/**
 * Categories of knowledge in the training system
 */
export type KnowledgeCategory =
  | 'strategic-discussion'
  | 'diagnosis-case-study'
  | 'client-interaction'
  | 'business-decision'
  | 'pattern-recognition'
  | 'service-definition'
  | 'methodology'
  | 'technical-documentation';

// ============================================================================
// KNOWLEDGE BASE TYPES
// ============================================================================

/**
 * Metadata attached to each knowledge document
 * Used for role-based access control and filtering
 */
export interface KnowledgeMetadata {
  /** Which Aliff roles can access this knowledge */
  roles: AliffRole[];

  /** Sensitivity level - determines access restrictions */
  sensitivity: SensitivityLevel;

  /** Category of knowledge */
  category: KnowledgeCategory;

  /** Tags for additional filtering and search */
  tags: string[];

  /** Source file or origin of the knowledge */
  source: string;

  /** When this knowledge was created */
  created: Date;

  /** When this knowledge was last updated */
  updated: Date;

  /** Version identifier for tracking updates */
  version: string;

  /** Optional client ID if this knowledge is client-specific */
  clientId?: string;

  /** Optional project ID if this knowledge is project-specific */
  projectId?: string;
}

/**
 * A knowledge document stored in the vector database
 */
export interface KnowledgeDocument {
  /** Unique identifier */
  id: string;

  /** The actual content/text of the document */
  content: string;

  /** Metadata for access control and filtering */
  metadata: KnowledgeMetadata;

  /** Vector embedding (optional, may be generated separately) */
  embedding?: number[];

  /** Relevance score (populated during retrieval) */
  score?: number;
}

/**
 * Options for retrieving knowledge from the RAG system
 */
export interface RetrievalOptions {
  /** Aliff role making the query (for access control) */
  role: AliffRole;

  /** User ID (for audit logging) */
  userId?: string;

  /** Session ID (for audit logging) */
  sessionId?: string;

  /** Number of results to return (default: 5) */
  topK?: number;

  /** Minimum similarity threshold (0-1, default: 0.7) */
  similarityThreshold?: number;

  /** Filter by specific categories */
  categories?: KnowledgeCategory[];

  /** Filter by tags */
  tags?: string[];

  /** Filter by client ID (for client-specific queries) */
  clientId?: string;

  /** Filter by project ID (for project-specific queries) */
  projectId?: string;

  /** Maximum sensitivity level to include (default: based on role) */
  maxSensitivity?: SensitivityLevel;
}

/**
 * Result from a knowledge retrieval query
 */
export interface RetrievalResult {
  /** The retrieved documents */
  documents: KnowledgeDocument[];

  /** Total number of documents found (before topK limit) */
  total: number;

  /** Query metadata */
  query: {
    text: string;
    role: AliffRole;
    timestamp: Date;
  };

  /** Performance metrics */
  metrics: {
    retrievalTimeMs: number;
    embeddingTimeMs: number;
    filteringTimeMs: number;
  };
}

// ============================================================================
// ROLE ACCESS MATRIX
// ============================================================================

/**
 * Defines which roles can access which sensitivity levels
 */
export const ROLE_ACCESS_MATRIX: Record<AliffRole, SensitivityLevel[]> = {
  SALES: ['public', 'internal'], // Limited access
  OPS: ['public', 'internal', 'proprietary'], // Full operational access
  CLIENT: ['public'], // Most restricted
  TRAINER: ['public', 'internal'], // Training materials only
  CEO: ['public', 'internal', 'proprietary', 'secret'], // Full access
};

/**
 * Check if a role can access a given sensitivity level
 */
export function canAccessSensitivity(
  role: AliffRole,
  sensitivity: SensitivityLevel
): boolean {
  return ROLE_ACCESS_MATRIX[role].includes(sensitivity);
}

/**
 * Get maximum sensitivity level a role can access
 */
export function getMaxSensitivity(role: AliffRole): SensitivityLevel {
  const levels = ROLE_ACCESS_MATRIX[role];
  const order: SensitivityLevel[] = ['public', 'internal', 'proprietary', 'secret'];

  for (let i = order.length - 1; i >= 0; i--) {
    if (levels.includes(order[i])) {
      return order[i];
    }
  }

  return 'public';
}

// ============================================================================
// EMBEDDING TYPES
// ============================================================================

/**
 * Configuration for embedding generation
 */
export interface EmbeddingConfig {
  /** Model to use for embeddings */
  model: 'text-embedding-3-small' | 'text-embedding-3-large';

  /** Dimensions of the embedding vector */
  dimensions: number;

  /** Batch size for processing multiple documents */
  batchSize: number;
}

/**
 * Default embedding configuration
 */
export const DEFAULT_EMBEDDING_CONFIG: EmbeddingConfig = {
  model: 'text-embedding-3-small',
  dimensions: 1536,
  batchSize: 100,
};

// ============================================================================
// VECTOR DATABASE TYPES
// ============================================================================

/**
 * Configuration for vector database connection
 */
export interface VectorDBConfig {
  /** Type of vector database */
  provider: 'pinecone' | 'weaviate' | 'chroma' | 'qdrant';

  /** API key or connection credentials */
  apiKey: string;

  /** Environment or host */
  environment: string;

  /** Index or collection name */
  indexName: string;

  /** Namespace for multi-tenant isolation */
  namespace?: string;
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

/**
 * Audit log entry for knowledge access
 */
export interface AuditLogEntry {
  /** Unique log ID */
  id: string;

  /** Timestamp of the access */
  timestamp: Date;

  /** Role that accessed the knowledge */
  role: AliffRole;

  /** Query that was made */
  query: string;

  /** Documents that were retrieved */
  documentIds: string[];

  /** User or system that made the request */
  requestor: string;

  /** IP address or source */
  source?: string;

  /** Whether access was granted or denied */
  accessGranted: boolean;

  /** Reason for denial (if applicable) */
  denialReason?: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Custom error for access control violations
 */
export class AccessDeniedError extends Error {
  constructor(
    public role: AliffRole,
    public sensitivity: SensitivityLevel,
    message?: string
  ) {
    super(
      message ||
        `Role ${role} cannot access ${sensitivity} level information`
    );
    this.name = 'AccessDeniedError';
  }
}

/**
 * Custom error for knowledge retrieval failures
 */
export class RetrievalError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'RetrievalError';
  }
}
