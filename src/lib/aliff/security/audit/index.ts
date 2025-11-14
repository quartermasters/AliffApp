/**
 * Aliff AI - Audit Module
 *
 * Main export for audit logging, storage, and analytics.
 */

// Export types
export * from './types';

// Export logger
export * from './logger';
export { AuditLogger } from './logger';

// Export storage
export * from './storage';
export { AuditStorage } from './storage';

// Export analytics
export * from './analytics';
export { AuditAnalytics } from './analytics';

// Convenience re-exports
import { AuditLogger } from './logger';
import { AuditStorage } from './storage';
import { AuditAnalytics } from './analytics';

/**
 * Main Audit API
 */
export const Audit = {
  // Logger methods
  initialize: AuditLogger.initialize,
  getConfig: AuditLogger.getConfig,
  flushBatch: AuditLogger.flushBatch,

  // Logging methods
  logQuery: AuditLogger.logQuery,
  logRetrieval: AuditLogger.logRetrieval,
  logResponse: AuditLogger.logResponse,
  logAccessDenied: AuditLogger.logAccessDenied,
  logFilterTriggered: AuditLogger.logFilterTriggered,
  logLeakDetected: AuditLogger.logLeakDetected,
  logDocumentEvent: AuditLogger.logDocumentEvent,
  logRoleEvent: AuditLogger.logRoleEvent,
  logAuthEvent: AuditLogger.logAuthEvent,

  // Storage methods
  queryLogs: AuditStorage.queryLogs,
  getAnalytics: AuditStorage.getAnalytics,
  getEventCount: AuditStorage.getEventCount,
  deleteOldLogs: AuditStorage.deleteOldLogs,

  // Analytics methods
  getQueryActivityByRole: AuditAnalytics.getQueryActivityByRole,
  getRetrievalPerformance: AuditAnalytics.getRetrievalPerformance,
  getSecurityEventsSummary: AuditAnalytics.getSecurityEventsSummary,
  getTopKnowledgeCategories: AuditAnalytics.getTopKnowledgeCategories,
  getAccessBySensitivity: AuditAnalytics.getAccessBySensitivity,
  getUserSessionSummary: AuditAnalytics.getUserSessionSummary,
  getDailyActivityTrend: AuditAnalytics.getDailyActivityTrend,
} as const;

export default Audit;
