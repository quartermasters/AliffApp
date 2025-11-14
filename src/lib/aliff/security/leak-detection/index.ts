/**
 * Aliff AI - Leak Detection Module
 *
 * Main export for strategy leak detection, classification, and alerts.
 */

// Export types
export * from './types';

// Export classifier
export * from './classifier';
export { LeakClassifier } from './classifier';

// Export alerts
export * from './alerts';
export { LeakAlerts } from './alerts';

// Convenience re-exports
import { LeakClassifier } from './classifier';
import { LeakAlerts } from './alerts';

/**
 * Main Leak Detection API
 */
export const LeakDetector = {
  // Classifier methods
  initialize: LeakClassifier.initialize,
  getConfig: LeakClassifier.getConfig,
  detectLeaks: LeakClassifier.detectLeaks,
  shouldAutoBlock: LeakClassifier.shouldAutoBlock,
  requiresReview: LeakClassifier.requiresReview,

  // Alert methods
  createAlert: LeakAlerts.create,
  getPendingAlerts: LeakAlerts.getPending,
  getAlertsByRole: LeakAlerts.getByRole,
  getAlertsBySeverity: LeakAlerts.getBySeverity,
  reviewAlert: LeakAlerts.review,
  getAnalytics: LeakAlerts.getAnalytics,
  getAlertTrend: LeakAlerts.getTrend,
} as const;

export default LeakDetector;
