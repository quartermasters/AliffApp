/**
 * Aliff AI - Audit Storage
 *
 * Stores audit events in database with efficient querying.
 * Supports PostgreSQL with time-based partitioning for scale.
 */

import type {
  AnyAuditEvent,
  AuditQuery,
  AuditAnalytics,
} from './types';

/**
 * In-memory storage for development/testing
 * In production, this would use PostgreSQL
 */
const auditStore: AnyAuditEvent[] = [];

/**
 * Store a single audit event
 */
export async function storeAuditEvent(event: AnyAuditEvent): Promise<void> {
  try {
    // In production: INSERT INTO audit_logs
    auditStore.push(event);

    // For now, just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audit]', {
        type: event.eventType,
        role: event.role,
        severity: event.severity,
        timestamp: event.timestamp.toISOString(),
      });
    }
  } catch (error) {
    console.error('[Audit] Failed to store event:', error);
    throw error;
  }
}

/**
 * Store multiple audit events (batch)
 */
export async function storeAuditEvents(
  events: AnyAuditEvent[]
): Promise<void> {
  try {
    // In production: Batch INSERT INTO audit_logs
    auditStore.push(...events);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Audit] Batch stored:', events.length, 'events');
    }
  } catch (error) {
    console.error('[Audit] Failed to store batch:', error);
    throw error;
  }
}

/**
 * Query audit logs
 */
export async function queryAuditLogs(
  query: AuditQuery
): Promise<AnyAuditEvent[]> {
  try {
    let results = [...auditStore];

    // Filter by event types
    if (query.eventTypes && query.eventTypes.length > 0) {
      results = results.filter((e) =>
        query.eventTypes!.includes(e.eventType)
      );
    }

    // Filter by roles
    if (query.roles && query.roles.length > 0) {
      results = results.filter((e) => query.roles!.includes(e.role));
    }

    // Filter by severity
    if (query.severity && query.severity.length > 0) {
      results = results.filter((e) => query.severity!.includes(e.severity));
    }

    // Filter by date range
    if (query.startDate) {
      results = results.filter(
        (e) => e.timestamp >= query.startDate!
      );
    }

    if (query.endDate) {
      results = results.filter((e) => e.timestamp <= query.endDate!);
    }

    // Filter by userId
    if (query.userId) {
      results = results.filter((e) => e.userId === query.userId);
    }

    // Filter by sessionId
    if (query.sessionId) {
      results = results.filter((e) => e.sessionId === query.sessionId);
    }

    // Sort
    const orderBy = query.orderBy || 'timestamp';
    const orderDirection = query.orderDirection || 'desc';

    results.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (orderBy === 'timestamp') {
        aVal = a.timestamp.getTime();
        bVal = b.timestamp.getTime();
      } else if (orderBy === 'severity') {
        const severityOrder = { info: 0, warning: 1, error: 2, critical: 3 };
        aVal = severityOrder[a.severity];
        bVal = severityOrder[b.severity];
      } else {
        return 0;
      }

      if (orderDirection === 'asc') {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });

    // Pagination
    const offset = query.offset || 0;
    const limit = query.limit || 100;

    return results.slice(offset, offset + limit);
  } catch (error) {
    console.error('[Audit] Failed to query logs:', error);
    throw error;
  }
}

/**
 * Get audit analytics
 */
export async function getAuditAnalytics(
  query: AuditQuery
): Promise<AuditAnalytics> {
  try {
    const events = await queryAuditLogs({ ...query, limit: 10000 });

    // Count by event type
    const byEventType: any = {};
    events.forEach((e) => {
      byEventType[e.eventType] = (byEventType[e.eventType] || 0) + 1;
    });

    // Count by role
    const byRole: any = {};
    events.forEach((e) => {
      byRole[e.role] = (byRole[e.role] || 0) + 1;
    });

    // Count by severity
    const bySeverity: any = {};
    events.forEach((e) => {
      bySeverity[e.severity] = (bySeverity[e.severity] || 0) + 1;
    });

    // Calculate average response time
    const responseEvents = events.filter((e) => e.eventType === 'response');
    let avgResponseTimeMs: number | undefined;

    if (responseEvents.length > 0) {
      const totalResponseTime = responseEvents.reduce((sum, e: any) => {
        return sum + (e.metadata.responseTimeMs || 0);
      }, 0);
      avgResponseTimeMs = totalResponseTime / responseEvents.length;
    }

    // Count specific event types
    const totalQueries = byEventType['query'] || 0;
    const totalFilterTriggers = byEventType['filter_triggered'] || 0;
    const totalLeaksDetected = byEventType['leak_detected'] || 0;
    const totalAccessDenied = byEventType['access_denied'] || 0;

    // Date range
    const timestamps = events.map((e) => e.timestamp.getTime());
    const dateRange = {
      start: timestamps.length > 0 ? new Date(Math.min(...timestamps)) : new Date(),
      end: timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date(),
    };

    return {
      totalEvents: events.length,
      byEventType,
      byRole,
      bySeverity,
      avgResponseTimeMs,
      totalQueries,
      totalFilterTriggers,
      totalLeaksDetected,
      totalAccessDenied,
      dateRange,
    };
  } catch (error) {
    console.error('[Audit] Failed to get analytics:', error);
    throw error;
  }
}

/**
 * Delete old audit logs (for retention policy)
 */
export async function deleteOldLogs(retentionDays: number): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const beforeCount = auditStore.length;

    // Remove old events
    for (let i = auditStore.length - 1; i >= 0; i--) {
      if (auditStore[i].timestamp < cutoffDate) {
        auditStore.splice(i, 1);
      }
    }

    const deleted = beforeCount - auditStore.length;

    if (deleted > 0) {
      console.log(`[Audit] Deleted ${deleted} old logs (older than ${retentionDays} days)`);
    }

    return deleted;
  } catch (error) {
    console.error('[Audit] Failed to delete old logs:', error);
    throw error;
  }
}

/**
 * Get total event count (for stats)
 */
export async function getEventCount(): Promise<number> {
  return auditStore.length;
}

/**
 * Clear all audit logs (for testing only)
 */
export async function clearAllLogs(): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearAllLogs can only be used in test environment');
  }

  auditStore.length = 0;
  console.log('[Audit] All logs cleared');
}

/**
 * Export storage API
 */
export const AuditStorage = {
  storeEvent: storeAuditEvent,
  storeBatch: storeAuditEvents,
  queryLogs: queryAuditLogs,
  getAnalytics: getAuditAnalytics,
  deleteOldLogs,
  getEventCount,
  clearAllLogs,
} as const;
