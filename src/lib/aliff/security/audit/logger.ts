/**
 * Aliff AI - Audit Logger
 *
 * Implements audit logging for all AI interactions.
 * Provides both sync and async logging with batching support.
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  AuditEvent,
  AuditEventType,
  AuditSeverity,
  AuditConfig,
  AnyAuditEvent,
  QueryEvent,
  RetrievalEvent,
  ResponseEvent,
  AccessDeniedEvent,
  FilterEvent,
  LeakEvent,
  DocumentEvent,
  RoleEvent,
  AuthEvent,
} from './types';
import { DEFAULT_AUDIT_CONFIG } from './types';
import type { AliffRole } from '../../types';
import type { LeakType } from '../leak-detection/types';
import { storeAuditEvents, storeAuditEvent } from './storage';

/**
 * In-memory batch for async logging
 */
let auditBatch: AnyAuditEvent[] = [];
let batchTimer: NodeJS.Timeout | null = null;

/**
 * Current audit configuration
 */
let currentConfig: AuditConfig = DEFAULT_AUDIT_CONFIG;

/**
 * Initialize audit logger with custom config
 */
export function initializeAuditLogger(config?: Partial<AuditConfig>): void {
  currentConfig = {
    ...DEFAULT_AUDIT_CONFIG,
    ...config,
  };

  console.log('[Audit] Logger initialized:', {
    enabled: currentConfig.enabled,
    storage: currentConfig.storage,
    asyncLogging: currentConfig.asyncLogging,
  });
}

/**
 * Get current audit configuration
 */
export function getAuditConfig(): AuditConfig {
  return { ...currentConfig };
}

/**
 * Base function to create audit event
 */
function createBaseEvent(
  eventType: AuditEventType,
  severity: AuditSeverity,
  role: AliffRole,
  userId?: string,
  sessionId?: string
): AuditEvent {
  return {
    id: uuidv4(),
    eventType,
    severity,
    role,
    userId,
    sessionId,
    timestamp: new Date(),
    metadata: {},
  };
}

/**
 * Check if event should be logged based on severity
 */
function shouldLog(severity: AuditSeverity): boolean {
  if (!currentConfig.enabled) return false;

  const severityLevels = {
    info: 0,
    warning: 1,
    error: 2,
    critical: 3,
  };

  return severityLevels[severity] >= severityLevels[currentConfig.logLevel];
}

/**
 * Write event to storage (async or sync)
 */
async function writeEvent(event: AnyAuditEvent): Promise<void> {
  if (currentConfig.asyncLogging) {
    // Add to batch
    auditBatch.push(event);

    // Flush if batch is full
    if (auditBatch.length >= (currentConfig.batchSize || 10)) {
      await flushBatch();
    } else {
      // Set timer to flush batch after 5 seconds
      if (!batchTimer) {
        batchTimer = setTimeout(() => {
          flushBatch();
        }, 5000);
      }
    }
  } else {
    // Synchronous write
    await storeAuditEvent(event);
  }
}

/**
 * Flush audit batch to storage
 */
export async function flushBatch(): Promise<void> {
  if (auditBatch.length === 0) return;

  const eventsToWrite = [...auditBatch];
  auditBatch = [];

  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }

  try {
    await storeAuditEvents(eventsToWrite);
  } catch (error) {
    console.error('[Audit] Failed to write batch:', error);
    // Re-add failed events to batch for retry
    auditBatch.push(...eventsToWrite);
  }
}

/**
 * Log a query event
 */
export async function logQuery(
  query: string,
  role: AliffRole,
  userId?: string,
  sessionId?: string,
  filters?: any
): Promise<void> {
  if (!shouldLog('info')) return;

  const event: QueryEvent = {
    ...createBaseEvent('query', 'info', role, userId, sessionId),
    eventType: 'query',
    metadata: {
      query,
      queryLength: query.length,
      filters,
    },
  };

  await writeEvent(event);
}

/**
 * Log a retrieval event
 */
export async function logRetrieval(
  query: string,
  role: AliffRole,
  documentIds: string[],
  topScore: number,
  avgScore: number,
  sensitivityLevels: any[],
  categories: any[],
  retrievalTimeMs: number,
  embeddingTimeMs: number,
  userId?: string,
  sessionId?: string
): Promise<void> {
  if (!shouldLog('info')) return;

  const event: RetrievalEvent = {
    ...createBaseEvent('retrieval', 'info', role, userId, sessionId),
    eventType: 'retrieval',
    metadata: {
      query,
      documentsRetrieved: documentIds.length,
      documentIds,
      topScore,
      avgScore,
      sensitivityLevels,
      categories,
      retrievalTimeMs,
      embeddingTimeMs,
    },
  };

  await writeEvent(event);
}

/**
 * Log a response event
 */
export async function logResponse(
  query: string,
  response: string,
  role: AliffRole,
  knowledgeUsed: string[],
  responseTimeMs: number,
  filtered: boolean,
  userId?: string,
  sessionId?: string,
  options?: {
    model?: string;
    tokensUsed?: number;
    cost?: number;
    redactedCount?: number;
  }
): Promise<void> {
  if (!shouldLog('info')) return;

  const event: ResponseEvent = {
    ...createBaseEvent('response', 'info', role, userId, sessionId),
    eventType: 'response',
    metadata: {
      query,
      response: currentConfig.redactSensitiveData
        ? response.substring(0, 200) + '...'
        : response,
      responseLength: response.length,
      knowledgeUsed,
      responseTimeMs,
      filtered,
      ...options,
    },
  };

  await writeEvent(event);
}

/**
 * Log an access denied event
 */
export async function logAccessDenied(
  attemptedAction: string,
  role: AliffRole,
  reason: string,
  userId?: string,
  sessionId?: string,
  options?: {
    requiredRole?: AliffRole;
    requiredSensitivity?: any;
    documentId?: string;
  }
): Promise<void> {
  if (!shouldLog('warning')) return;

  const event: AccessDeniedEvent = {
    ...createBaseEvent('access_denied', 'warning', role, userId, sessionId),
    eventType: 'access_denied',
    severity: 'warning',
    metadata: {
      attemptedAction,
      reason,
      ...options,
    },
  } as AccessDeniedEvent;

  await writeEvent(event);
}

/**
 * Log a filter triggered event
 */
export async function logFilterTriggered(
  ruleId: string,
  ruleName: string,
  ruleType: 'pattern' | 'semantic' | 'role-based',
  textRedacted: string,
  originalText: string,
  role: AliffRole,
  userId?: string,
  sessionId?: string,
  options?: {
    matchedPattern?: string;
    confidence?: number;
  }
): Promise<void> {
  if (!shouldLog('warning')) return;

  const event: FilterEvent = {
    ...createBaseEvent('filter_triggered', 'warning', role, userId, sessionId),
    eventType: 'filter_triggered',
    severity: 'warning',
    metadata: {
      ruleId,
      ruleName,
      ruleType,
      textRedacted,
      originalText: currentConfig.redactSensitiveData
        ? originalText.substring(0, 100) + '...'
        : originalText,
      ...options,
    },
  } as FilterEvent;

  await writeEvent(event);
}

/**
 * Log a leak detected event
 */
export async function logLeakDetected(
  leakType: LeakType,
  confidence: number,
  textFlagged: string,
  autoBlocked: boolean,
  role: AliffRole,
  userId?: string,
  sessionId?: string,
  options?: {
    alertSent?: boolean;
  }
): Promise<void> {
  const severity: 'warning' | 'error' | 'critical' =
    confidence > 0.9 ? 'critical' : confidence > 0.7 ? 'error' : 'warning';

  if (!shouldLog(severity)) return;

  const event: LeakEvent = {
    ...createBaseEvent('leak_detected', severity, role, userId, sessionId),
    eventType: 'leak_detected',
    severity,
    metadata: {
      leakType,
      confidence,
      textFlagged: currentConfig.redactSensitiveData
        ? textFlagged.substring(0, 100) + '...'
        : textFlagged,
      autoBlocked,
      alertSent: options?.alertSent || false,
    },
  } as LeakEvent;

  await writeEvent(event);
}

/**
 * Log a document event
 */
export async function logDocumentEvent(
  eventType: 'document_stored' | 'document_updated' | 'document_deleted',
  documentId: string,
  category: any,
  sensitivity: any,
  roles: AliffRole[],
  performedByRole: AliffRole,
  userId?: string,
  sessionId?: string,
  options?: {
    source?: string;
    changeType?: 'content' | 'metadata' | 'embedding';
    reason?: string;
  }
): Promise<void> {
  if (!shouldLog('info')) return;

  const event: DocumentEvent = {
    ...createBaseEvent(eventType, 'info', performedByRole, userId, sessionId),
    eventType,
    metadata: {
      documentId,
      category,
      sensitivity,
      roles,
      ...options,
    },
  };

  await writeEvent(event);
}

/**
 * Log a role management event
 */
export async function logRoleEvent(
  eventType: 'role_assigned' | 'role_revoked',
  targetUserId: string,
  roleChanged: AliffRole,
  adminRole: AliffRole,
  adminUserId: string,
  sessionId?: string,
  reason?: string
): Promise<void> {
  if (!shouldLog('warning')) return;

  const event: RoleEvent = {
    ...createBaseEvent(eventType, 'warning', adminRole, adminUserId, sessionId),
    eventType,
    severity: 'warning',
    metadata: {
      targetUserId,
      roleChanged,
      adminUserId,
      reason,
    },
  } as RoleEvent;

  await writeEvent(event);
}

/**
 * Log an authentication event
 */
export async function logAuthEvent(
  eventType: 'authentication_failed' | 'session_started' | 'session_ended',
  role: AliffRole,
  userId?: string,
  sessionId?: string,
  options?: {
    ipAddress?: string;
    userAgent?: string;
    failureReason?: string;
    sessionDuration?: number;
  }
): Promise<void> {
  const severity: 'info' | 'warning' | 'error' =
    eventType === 'authentication_failed' ? 'warning' : 'info';

  if (!shouldLog(severity)) return;

  const event: AuthEvent = {
    ...createBaseEvent(eventType, severity, role, userId, sessionId),
    eventType,
    severity,
    metadata: {
      ...options,
    },
  } as AuthEvent;

  await writeEvent(event);
}

/**
 * Export all logging functions
 */
export const AuditLogger = {
  initialize: initializeAuditLogger,
  getConfig: getAuditConfig,
  flushBatch,
  logQuery,
  logRetrieval,
  logResponse,
  logAccessDenied,
  logFilterTriggered,
  logLeakDetected,
  logDocumentEvent,
  logRoleEvent,
  logAuthEvent,
} as const;
