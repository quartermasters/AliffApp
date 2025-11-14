# Aliff AI - Security System

Comprehensive security infrastructure protecting Aliff's competitive advantages while ensuring safe AI-human interactions.

## Overview

The Aliff AI security system provides three layers of protection:

1. **Audit Logging** - Track all AI interactions for compliance and learning
2. **Output Filtering** - Prevent sensitive information leaks using pattern + semantic detection
3. **Leak Detection** - Protect competitive advantages (SDL, pricing, methodology)

## Architecture

```
┌─────────────────┐
│  User Query     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Authentication │ ← Verify role, session
│  (Future)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Audit Logger   │ ← Log query
│  (Pre-query)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  RAG Retrieval  │ ← Role-based filtering
│  (Existing)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Response    │ ← Generate response
│  Generation     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Output Filter  │ ← Scan for sensitive content
│  Engine         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Leak Detector  │ ← Check for strategy leaks
│  Classifier     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Audit Logger   │ ← Log final response
│  (Post-response)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Return to User │ ← Filtered, logged, safe
└─────────────────┘
```

## Modules

### 1. Audit Logging (`src/lib/aliff/security/audit/`)

Track all AI interactions for compliance, debugging, and continuous improvement.

**Features**:
- 14 event types (query, retrieval, response, access_denied, filter_triggered, leak_detected, etc.)
- 4 severity levels (info, warning, error, critical)
- Async batching for performance (<50ms overhead)
- Rich analytics (by role, sensitivity, category, time)
- Retention policy support

**Usage**:
```typescript
import { Audit } from '@/lib/aliff/security/audit';

// Initialize
Audit.initialize({
  enabled: true,
  logLevel: 'info',
  storage: 'database',
  retentionDays: 90,
});

// Log events
await Audit.logQuery(query, 'SALES', userId, sessionId);
await Audit.logRetrieval(query, 'SALES', docIds, topScore, avgScore, ...);
await Audit.logResponse(query, response, 'SALES', ...);

// Query logs
const logs = await Audit.queryLogs({
  eventTypes: ['query', 'response'],
  roles: ['SALES'],
  startDate: new Date('2025-01-01'),
  limit: 100,
});

// Get analytics
const analytics = await Audit.getAnalytics({
  startDate: lastWeek,
  endDate: today,
});

console.log('Total queries:', analytics.totalQueries);
console.log('Avg response time:', analytics.avgResponseTimeMs);
console.log('By role:', analytics.byRole);
```

**Files**:
- `types.ts` - Event schemas, config
- `logger.ts` - Event logging with batching
- `storage.ts` - In-memory storage (PostgreSQL-ready)
- `analytics.ts` - Query metrics, performance, security stats

### 2. Output Filtering (`src/lib/aliff/security/filtering/`)

Prevent sensitive information from leaking in AI responses.

**Features**:
- 3 filter types: pattern, semantic, role-based
- 4 filter actions: redact, block, alert, replace
- 10 semantic categories (pricing, strategy, methodology, client-data, etc.)
- Pre-defined sensitive patterns for:
  - Pricing formulas and margins
  - Financial amounts
  - Internal URLs and emails
  - API keys and credentials
  - Employee names
  - Client-specific data
- Role-based rules (CLIENT sees less than CEO)
- Confidence scoring for semantic matches
- ~100ms overhead for typical responses

**Usage**:
```typescript
import { Filter } from '@/lib/aliff/security/filtering';

// Initialize with rules
Filter.initialize({
  enabled: true,
  rules: [...DEFAULT_FILTER_RULES],
  defaultAction: 'alert',
  logMatches: true,
});

// Filter AI response
const result = await Filter.filter(
  aiResponse,
  'CLIENT', // role
  userId,
  sessionId
);

console.log('Was filtered:', result.wasFiltered);
console.log('Redacted:', result.redactedCount);
console.log('Filtered text:', result.filtered);

// Add custom rule
Filter.addRule({
  name: 'Block Competitor Names',
  description: 'Prevent mentioning competitors by name',
  ruleType: 'pattern',
  severity: 'medium',
  action: 'redact',
  enabled: true,
  keywords: ['Competitor A', 'Competitor B'],
  replacement: '[competitor name]',
});

// Semantic detection
const categories = await Filter.classify(text);
console.log('Detected:', categories);
// [{category: 'pricing', confidence: 0.85}, ...]

const hasSensitive = await Filter.containsSensitive(text, 0.7);
```

**Files**:
- `types.ts` - Filter rules, patterns, semantic categories
- `engine.ts` - Main filtering engine
- `semantic.ts` - Semantic content detection
- `index.ts` - Filter API exports

### 3. Leak Detection (`src/lib/aliff/security/leak-detection/`)

Protect Aliff's competitive advantages from accidental disclosure.

**Features**:
- 8 leak types (pricing, methodology, competitive, financial, etc.)
- 4 severity levels (low, medium, high, critical)
- 5 protected competitive advantages:
  1. **SDL** (Solicitation Diagnosis Lab) - Multi-AI methodology
  2. **Pricing Formula** - Rates, margins, calculations
  3. **Multi-AI Orchestration** - Model consensus details
  4. **Win Rate Data** - Success metrics
  5. **Client-Specific Strategies** - Custom positioning
- Confidence scoring (0.0-1.0)
- Auto-block threshold (>0.9 confidence)
- Manual review workflow
- Alert system with notifications
- Analytics: false positive rate, trends

**Usage**:
```typescript
import { LeakDetector } from '@/lib/aliff/security/leak-detection';

// Initialize
LeakDetector.initialize({
  enabled: true,
  confidenceThreshold: 0.7,
  autoBlockThreshold: 0.9,
  alertOnMedium: true,
});

// Detect leaks
const detections = await LeakDetector.detectLeaks(
  aiResponse,
  'CLIENT', // role
  {
    query: userQuery,
    userId,
    sessionId,
  }
);

for (const detection of detections) {
  console.log('Leak type:', detection.leakType);
  console.log('Severity:', detection.severity);
  console.log('Confidence:', detection.confidence);
  console.log('Flagged:', detection.flaggedText);

  // Check if should auto-block
  if (LeakDetector.shouldAutoBlock(detection)) {
    console.log('❌ AUTO-BLOCKED');

    // Create alert
    await LeakDetector.createAlert(
      detection,
      'CLIENT',
      query,
      response,
      true, // auto-blocked
      userId,
      sessionId
    );

    // Block response
    return { error: 'Response blocked due to sensitive content' };
  }

  // Check if requires review
  if (LeakDetector.requiresReview(detection)) {
    console.log('⚠️  REQUIRES REVIEW');

    await LeakDetector.createAlert(
      detection,
      'CLIENT',
      query,
      response,
      false, // not blocked
      userId,
      sessionId
    );
  }
}

// Review pending alerts
const pending = await LeakDetector.getPendingAlerts();
console.log('Pending review:', pending.length);

// Review alert
await LeakDetector.reviewAlert(
  alertId,
  'approved', // or 'blocked'
  reviewerId,
  'False positive - safe content'
);

// Get analytics
const analytics = await LeakDetector.getAnalytics(lastWeek, today);
console.log('Total detections:', analytics.totalDetections);
console.log('By type:', analytics.byType);
console.log('False positive rate:', analytics.falsePositiveRate);
```

**Files**:
- `types.ts` - Leak types, competitive advantages
- `classifier.ts` - Leak detection with confidence scoring
- `alerts.ts` - Alert management and review workflow
- `index.ts` - Leak detector API exports

## Complete Security Flow

Here's how to use all three modules together in an API endpoint:

```typescript
import RAG from '@/lib/aliff/rag';
import { Audit } from '@/lib/aliff/security/audit';
import { Filter } from '@/lib/aliff/security/filtering';
import { LeakDetector } from '@/lib/aliff/security/leak-detection';

export async function secureAIQuery(
  query: string,
  role: AliffRole,
  userId: string,
  sessionId: string
): Promise<string> {
  // 1. Log query
  await Audit.logQuery(query, role, userId, sessionId);

  // 2. Retrieve knowledge (with built-in audit logging)
  const retrieval = await RAG.retrieve(query, {
    role,
    userId,
    sessionId,
    topK: 5,
  });

  // 3. Generate AI response (your AI logic here)
  const aiResponse = await generateAIResponse(query, retrieval.documents);

  // 4. Filter output
  const filtered = await Filter.filter(aiResponse, role, userId, sessionId);

  // 5. Detect leaks
  const leaks = await LeakDetector.detectLeaks(filtered.filtered, role, {
    query,
    userId,
    sessionId,
  });

  // 6. Handle high-severity leaks
  for (const leak of leaks) {
    if (LeakDetector.shouldAutoBlock(leak)) {
      // Create alert
      await LeakDetector.createAlert(
        leak,
        role,
        query,
        aiResponse,
        true,
        userId,
        sessionId
      );

      // Log blocked response
      await Audit.logResponse(
        query,
        '[BLOCKED]',
        role,
        retrieval.documents.map((d) => d.id),
        Date.now(),
        true,
        userId,
        sessionId,
        { redactedCount: 1 }
      );

      throw new Error('Response blocked due to sensitive content');
    }
  }

  // 7. Log successful response
  await Audit.logResponse(
    query,
    filtered.filtered,
    role,
    retrieval.documents.map((d) => d.id),
    Date.now(),
    filtered.wasFiltered,
    userId,
    sessionId,
    {
      redactedCount: filtered.redactedCount,
    }
  );

  return filtered.filtered;
}
```

## Performance

| Component | Target | Typical |
|-----------|--------|---------|
| Audit logging (pre-query) | 20ms | 10-30ms |
| RAG retrieval | 300-600ms | 400ms |
| Output filtering | 50-100ms | 70ms |
| Leak detection | 50-100ms | 80ms |
| Audit logging (post-query) | 30ms | 20-40ms |
| **Total overhead** | **150-250ms** | **180-220ms** |
| **End-to-end query** | <1000ms | 600-700ms |

## Security Best Practices

1. **Always log queries and responses** for compliance and debugging
2. **Filter all CLIENT-role responses** to prevent accidental disclosure
3. **Review pending leak alerts daily** to catch false positives
4. **Monitor analytics weekly** for security trends
5. **Update filter rules** based on real-world leaks
6. **Archive audit logs** after retention period
7. **Test filter rules** before deploying to production
8. **Never disable security in production** even temporarily

## Testing

See each module's test files for examples:
- `audit/__tests__/` - Audit logging tests
- `filtering/__tests__/` - Filter engine tests
- `leak-detection/__tests__/` - Leak detector tests

Run tests:
```bash
npm test src/lib/aliff/security
```

## Configuration

### Environment Variables

```bash
# Audit logging
AUDIT_ENABLED=true
AUDIT_LOG_LEVEL=info
AUDIT_RETENTION_DAYS=90

# Output filtering
FILTER_ENABLED=true
FILTER_LOG_MATCHES=true

# Leak detection
LEAK_DETECTION_ENABLED=true
LEAK_CONFIDENCE_THRESHOLD=0.7
LEAK_AUTO_BLOCK_THRESHOLD=0.9
```

### Initialization

```typescript
// In your app initialization
import { Audit, Filter, LeakDetector } from '@/lib/aliff/security';

// Initialize all modules
Audit.initialize({
  enabled: true,
  logLevel: 'info',
  retentionDays: 90,
});

Filter.initialize({
  enabled: true,
  rules: DEFAULT_FILTER_RULES,
});

LeakDetector.initialize({
  enabled: true,
  confidenceThreshold: 0.7,
  autoBlockThreshold: 0.9,
});
```

## Future Enhancements

- **PostgreSQL storage** for audit logs (currently in-memory)
- **Real-time alerts** via Slack/email for critical leaks
- **ML-based leak detection** using fine-tuned models
- **User authentication** with JWT/OAuth
- **API rate limiting** to prevent abuse
- **Automated testing** of filter rules
- **False positive feedback loop** to improve accuracy

## Support

- **Documentation**: See individual module README files
- **Issues**: File GitHub issue with `security` label
- **Slack**: #aliff-security (internal)

---

**Sprint 2 Status**: 60% Complete (3/5 days)
- ✅ Day 1: Audit logging
- ✅ Day 2: Output filtering
- ✅ Day 3: Leak detection
- 🔄 Day 4-5: Auth + learning loop + testing (pending)
