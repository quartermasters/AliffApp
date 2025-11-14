/**
 * Aliff AI - Audit Logging Types
 *
 * Defines event schemas for tracking all AI interactions
 * for compliance, debugging, and continuous learning.
 */

import type { AliffRole, SensitivityLevel, KnowledgeCategory } from '../../types';

/**
 * Types of auditable events
 */
export type AuditEventType =
  | 'query' // User submitted a query
  | 'retrieval' // Knowledge retrieved from vector DB
  | 'response' // AI generated a response
  | 'access_denied' // User tried to access restricted content
  | 'filter_triggered' // Output filter blocked content
  | 'leak_detected' // Potential strategy leak detected
  | 'document_stored' // New knowledge document added
  | 'document_updated' // Existing document modified
  | 'document_deleted' // Document removed
  | 'role_assigned' // User role changed
  | 'role_revoked' // User role removed
  | 'authentication_failed' // Login attempt failed
  | 'session_started' // User session created
  | 'session_ended'; // User session terminated

/**
 * Severity level for audit events
 */
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Core audit event structure
 */
export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  role: AliffRole;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

/**
 * Query event - User submitted a query
 */
export interface QueryEvent extends AuditEvent {
  eventType: 'query';
  metadata: {
    query: string;
    queryLength: number;
    filters?: {
      categories?: KnowledgeCategory[];
      sensitivity?: SensitivityLevel[];
      tags?: string[];
    };
  };
}

/**
 * Retrieval event - Knowledge retrieved from vector DB
 */
export interface RetrievalEvent extends AuditEvent {
  eventType: 'retrieval';
  metadata: {
    query: string;
    documentsRetrieved: number;
    documentIds: string[];
    topScore: number;
    avgScore: number;
    sensitivityLevels: SensitivityLevel[];
    categories: KnowledgeCategory[];
    retrievalTimeMs: number;
    embeddingTimeMs: number;
  };
}

/**
 * Response event - AI generated a response
 */
export interface ResponseEvent extends AuditEvent {
  eventType: 'response';
  metadata: {
    query: string;
    response: string;
    responseLength: number;
    knowledgeUsed: string[]; // Document IDs
    model?: string;
    tokensUsed?: number;
    cost?: number;
    responseTimeMs: number;
    filtered: boolean;
    redactedCount?: number;
  };
}

/**
 * Access denied event - User tried to access restricted content
 */
export interface AccessDeniedEvent extends AuditEvent {
  eventType: 'access_denied';
  severity: 'warning' | 'error';
  metadata: {
    attemptedAction: string;
    requiredRole?: AliffRole;
    requiredSensitivity?: SensitivityLevel;
    documentId?: string;
    reason: string;
  };
}

/**
 * Filter triggered event - Output filter blocked content
 */
export interface FilterEvent extends AuditEvent {
  eventType: 'filter_triggered';
  severity: 'warning';
  metadata: {
    ruleId: string;
    ruleName: string;
    ruleType: 'pattern' | 'semantic' | 'role-based';
    matchedPattern?: string;
    textRedacted: string;
    originalText: string;
    confidence?: number;
  };
}

/**
 * Leak detected event - Potential strategy leak
 */
export interface LeakEvent extends AuditEvent {
  eventType: 'leak_detected';
  severity: 'warning' | 'error' | 'critical';
  metadata: {
    leakType: 'pricing' | 'strategy' | 'methodology' | 'competitive' | 'client-data';
    confidence: number; // 0.0-1.0
    textFlagged: string;
    autoBlocked: boolean;
    alertSent: boolean;
  };
}

/**
 * Document storage event - Knowledge document added/updated/deleted
 */
export interface DocumentEvent extends AuditEvent {
  eventType: 'document_stored' | 'document_updated' | 'document_deleted';
  metadata: {
    documentId: string;
    category: KnowledgeCategory;
    sensitivity: SensitivityLevel;
    roles: AliffRole[];
    source?: string;
    changeType?: 'content' | 'metadata' | 'embedding';
    reason?: string;
  };
}

/**
 * Role management event - User role assigned/revoked
 */
export interface RoleEvent extends AuditEvent {
  eventType: 'role_assigned' | 'role_revoked';
  severity: 'info' | 'warning';
  metadata: {
    targetUserId: string;
    roleChanged: AliffRole;
    adminUserId: string;
    reason?: string;
  };
}

/**
 * Authentication event - Login/session events
 */
export interface AuthEvent extends AuditEvent {
  eventType: 'authentication_failed' | 'session_started' | 'session_ended';
  severity: 'info' | 'warning' | 'error';
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    failureReason?: string;
    sessionDuration?: number; // milliseconds
  };
}

/**
 * Union type of all audit events
 */
export type AnyAuditEvent =
  | QueryEvent
  | RetrievalEvent
  | ResponseEvent
  | AccessDeniedEvent
  | FilterEvent
  | LeakEvent
  | DocumentEvent
  | RoleEvent
  | AuthEvent;

/**
 * Configuration for audit logging
 */
export interface AuditConfig {
  enabled: boolean;
  logLevel: AuditSeverity; // Only log events >= this severity
  storage: 'database' | 'file' | 'cloud';
  retentionDays: number;
  asyncLogging: boolean; // Don't block main thread
  batchSize?: number; // For batch writes
  redactSensitiveData?: boolean; // Redact PII in logs
}

/**
 * Query options for retrieving audit logs
 */
export interface AuditQuery {
  eventTypes?: AuditEventType[];
  roles?: AliffRole[];
  severity?: AuditSeverity[];
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  sessionId?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'timestamp' | 'severity';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Audit analytics result
 */
export interface AuditAnalytics {
  totalEvents: number;
  byEventType: Record<AuditEventType, number>;
  byRole: Record<AliffRole, number>;
  bySeverity: Record<AuditSeverity, number>;
  avgResponseTimeMs?: number;
  totalQueries?: number;
  totalFilterTriggers?: number;
  totalLeaksDetected?: number;
  totalAccessDenied?: number;
  dateRange: {
    start: Date;
    end: Date;
  };
}

/**
 * Default audit configuration
 */
export const DEFAULT_AUDIT_CONFIG: AuditConfig = {
  enabled: true,
  logLevel: 'info',
  storage: 'database',
  retentionDays: 90,
  asyncLogging: true,
  batchSize: 10,
  redactSensitiveData: true,
};
