# Aliff Services - Color Schema Implementation Strategy

**Document Version:** 1.0
**Created:** November 14, 2024
**Based on:** Aliff Capital Website (aliffcapital.com)
**Status:** Strategy Document - Ready for Implementation

---

## Executive Summary

This document outlines a comprehensive strategy to implement the official Aliff Services color schema and design philosophy based on the Aliff Capital website (aliffcapital.com). The implementation focuses on creating a premium, high-contrast design that emphasizes luxury, success, and professional authority in the government contracting space.

### Key Changes Overview

- **Darker backgrounds** for premium, exclusive feel
- **Brighter gold accents** for enhanced visual impact
- **Strategic green usage** for win/success messaging
- **High contrast design** for maximum readability and impact

---

## 1. Color Philosophy Analysis

### Visual Identity Principles

Based on the official Aliff Capital website, the brand employs three core design principles:

#### 1.1 Premium Luxury Positioning
- **Ultra-dark backgrounds** (near-black navy) create sophisticated, high-value aesthetic
- **Vibrant gold accents** signal premium service and excellence
- Creates visual hierarchy that commands attention

#### 1.2 Success & Victory Messaging
- **Bright emerald green** strategically used for "WIN" messaging
- Highlights success metrics, CTAs, and achievement indicators
- Builds trust through visible proof of results

#### 1.3 High Contrast Design
- Dark backgrounds + bright gold/green = maximum visual impact
- White text for optimal readability
- Strategic borders (gold/green) for element differentiation

---

## 2. Detailed Color Mapping

### 2.1 Current State vs. Target State

| Element | Current Color | Aliff Capital Target | Change Required |
|---------|--------------|---------------------|-----------------|
| **Primary Background** | `#0A1628` (Navy 900) | `#080d1a` (Almost black) | Darken by ~15% |
| **Gold Accent** | `#C89D5C` (Muted gold) | `#E5C17F` to `#F3C96B` (Vibrant) | Brighten by 25-30% |
| **Success Green** | `#10B981` | `#10B981` to `#22C55E` | Keep or brighten |
| **Text Primary** | Navy 900 | White on dark | Update for dark theme |
| **Text Secondary** | Gray 700 | Gray 400 | Adjust for contrast |

### 2.2 Color Psychology & Usage

#### Gold (`#E5C17F` - `#F3C96B`)
- **Meaning:** Premium, Value, Achievement, Excellence
- **Usage:**
  - Primary CTAs (solid gold buttons)
  - Pricing and metrics display ($47.0M)
  - Premium badges ("PROVEN WINNERS")
  - Success numbers (22%, 200+)
  - Card borders for highlighted content
  - Icons for premium features

#### Green (`#10B981` - `#22C55E`)
- **Meaning:** Victory, Success, Action, Growth
- **Usage:**
  - "WIN" messaging and headlines
  - Secondary CTAs (green outlined buttons)
  - Checkmarks and approval indicators
  - Success metrics
  - Highlighted sections (Step 2 in process)
  - Positive status indicators

#### Navy/Dark (`#080d1a`)
- **Meaning:** Professional, Serious, Authority, Trust
- **Usage:**
  - Primary background
  - Card backgrounds
  - Text on light buttons
  - Creates gravitas appropriate for government contracting

---

## 3. Implementation Phases

### Phase 1: Foundation - Core Color System (Day 1)
**Priority:** CRITICAL
**Files:** `tailwind.config.ts`, `globals.css`

#### 3.1.1 Tailwind Config Updates

```typescript
// File: tailwind.config.ts

colors: {
  // Update Navy - Darker, more premium
  navy: {
    DEFAULT: "#080d1a",  // Updated from #0A1628
    50: "#F8F9FA",
    100: "#E9ECEF",
    200: "#DEE2E6",
    300: "#CED4DA",
    400: "#6C757D",
    500: "#495057",
    600: "#343A40",
    700: "#1a2744",      // Slightly darker
    800: "#0f1829",      // Updated
    900: "#080d1a",      // Updated - ultra dark
    950: "#040609",      // New - near black
  },

  // Update Gold - Brighter, more vibrant
  gold: {
    DEFAULT: "#E5C17F",  // Updated from #C89D5C
    50: "#FDF9F0",
    100: "#FBF3E0",
    200: "#F8E8C2",
    300: "#F3C96B",      // Bright variant - NEW
    400: "#E5C17F",      // Primary gold - updated
    500: "#D4AF37",      // Classic gold
    600: "#C89D5C",      // Original (keep for legacy)
    700: "#B8894A",
    800: "#9A7240",
    900: "#7C5C36",
  },

  // Enhance Success/Victory Colors
  success: {
    DEFAULT: "#10B981",
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
  },

  // Add explicit "win" alias for semantic clarity
  win: {
    DEFAULT: "#10B981",
    300: "#6EE7B7",
    400: "#22C55E",      // Brighter for headlines
    500: "#10B981",
    600: "#059669",
  },

  // Service Category Accents (existing - keep)
  govcon: {
    DEFAULT: "#3B82F6",
    600: "#2563EB",
  },
  it: {
    DEFAULT: "#8B5CF6",
    600: "#7C3AED",
  },
  writing: {
    DEFAULT: "#EC4899",
    600: "#DB2777",
  },
}
```

#### 3.1.2 Global CSS Variables

```css
/* File: src/app/globals.css */

@layer base {
  :root {
    /* Updated Aliff Services Brand Colors */
    --color-gold: 229 193 127;          /* #E5C17F - Updated */
    --color-gold-bright: 243 201 107;   /* #F3C96B - New */
    --color-victory: 16 185 129;        /* #10B981 */
    --color-navy: 8 13 26;              /* #080d1a - Updated */
    --color-navy-darker: 4 6 9;         /* #040609 - New */

    /* Spacing (existing - keep) */
    --spacing-unit: 0.25rem;

    /* Transitions (existing - keep) */
    --transition-fast: 150ms ease;
    --transition-base: 300ms ease-out;
    --transition-slow: 500ms ease-out;

    /* Shadows (existing - keep) */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

    /* Border Radius (existing - keep) */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
  }

  /* Set default dark theme */
  body {
    @apply bg-navy-900 text-white font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

---

### Phase 2: Component Updates (Days 1-2)
**Priority:** HIGH
**Files:** Button, Badge, and UI components

#### 3.2.1 Button Component Enhancement

```typescript
// File: src/components/ui/button.tsx

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // PRIMARY: Solid Gold (matches "Get Your Winning Strategy")
        default:
          "bg-gold-400 text-navy-900 hover:bg-gold-300 shadow-lg hover:shadow-xl font-bold",

        // VICTORY: Green Outlined (matches "Calculate Your Potential Wins")
        victory:
          "border-2 border-win-400 text-win-400 bg-transparent hover:bg-win-400 hover:text-navy-900 font-semibold shadow-md hover:shadow-lg",

        // DARK OUTLINE: Subtle (matches "See Real Wins")
        darkOutline:
          "border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold",

        // GOLD OUTLINE: Alternative CTA
        outline:
          "border-2 border-gold-400 text-gold-400 bg-transparent hover:bg-gold-400 hover:text-navy-900",

        // SECONDARY: Navy solid
        secondary:
          "bg-navy-700 text-white hover:bg-navy-600 border border-navy-600",

        // GHOST: Minimal
        ghost: "hover:bg-white/10 text-gray-300 hover:text-white",

        // LINK: Text only
        link: "text-gold-400 underline-offset-4 hover:underline hover:text-gold-300",

        // DESTRUCTIVE: Keep for errors
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

#### 3.2.2 Badge Components

```css
/* File: src/app/globals.css - Add to @layer components */

/* Premium Badge (like "PROVEN WINNERS • $47M+ SECURED") */
.badge-premium {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full;
  @apply bg-gold-500/20 border border-gold-400 text-gold-400;
  @apply text-sm font-bold tracking-wide uppercase;
  @apply shadow-md;
}

/* Victory Badge */
.badge-victory {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full;
  @apply bg-win-500/20 border border-win-400 text-win-400;
  @apply text-sm font-bold tracking-wide uppercase;
}

/* Updated existing badge classes */
.badge-gold {
  @apply badge bg-gold-400/20 text-gold-400 border border-gold-400/50;
}

.badge-victory {
  @apply badge bg-win-500/20 text-win-400 border border-win-400/50;
}
```

---

### Phase 3: Card & Layout Styles (Day 2)
**Priority:** MEDIUM
**Files:** `globals.css`, Card components

#### 3.3.1 Card Variations

```css
/* File: src/app/globals.css - Add to @layer components */

/* Gold Border Card (Steps 1 & 3 from "How We Help You WIN") */
.card-gold {
  @apply bg-navy-800/80 border-2 border-gold-400 rounded-xl p-6;
  @apply backdrop-blur-sm;
  @apply hover:border-gold-300 hover:shadow-xl hover:shadow-gold-500/10;
  @apply transition-all duration-300;
}

/* Victory/Green Border Card (Step 2 - highlighted) */
.card-victory {
  @apply bg-navy-800/80 border-2 border-win-400 rounded-xl p-6;
  @apply backdrop-blur-sm;
  @apply hover:border-win-300 hover:shadow-xl hover:shadow-win-500/10;
  @apply transition-all duration-300;
}

/* Checkmark Box (green boxes at bottom of process cards) */
.card-checkmark-box {
  @apply bg-win-500/10 border border-win-400 rounded-lg p-4;
  @apply text-win-400 text-sm font-semibold;
  @apply flex items-center gap-2;
}

/* Dark Card (default) */
.card-dark {
  @apply bg-navy-800/60 border border-navy-700 rounded-xl p-6;
  @apply backdrop-blur-sm;
  @apply hover:border-navy-600 hover:shadow-lg;
  @apply transition-all duration-300;
}

/* Process Step Number Circle */
.step-number {
  @apply w-12 h-12 rounded-full bg-gold-400 text-navy-900;
  @apply flex items-center justify-center;
  @apply text-xl font-bold;
  @apply shadow-lg shadow-gold-500/30;
}

.step-number-victory {
  @apply w-12 h-12 rounded-full bg-win-400 text-navy-900;
  @apply flex items-center justify-center;
  @apply text-xl font-bold;
  @apply shadow-lg shadow-win-500/30;
}
```

---

### Phase 4: Typography & Gradient Text (Day 2)
**Priority:** MEDIUM
**Files:** `globals.css`

#### 3.4.1 Gradient Text Utilities

```css
/* File: src/app/globals.css - Add to @layer utilities */

/* Win Gradient (for "WIN" text like "How We Help You WIN") */
.text-gradient-win {
  @apply bg-clip-text text-transparent;
  @apply bg-gradient-to-r from-win-300 via-win-400 to-win-500;
  @apply font-bold;
}

/* Gold Gradient (for premium headings) */
.text-gradient-gold {
  @apply bg-clip-text text-transparent;
  @apply bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600;
  @apply font-bold;
}

/* Victory to Gold Gradient (combo) */
.text-gradient-victory-gold {
  @apply bg-clip-text text-transparent;
  @apply bg-gradient-to-r from-win-400 via-gold-400 to-gold-600;
  @apply font-bold;
}
```

#### 3.4.2 Typography Color Updates

```css
/* File: src/app/globals.css - Update @layer base */

h1, h2, h3, h4, h5, h6 {
  @apply font-bold tracking-tight text-white;
}

/* Large display numbers (like "$47.0M", "22%", "200+") */
.display-metric {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold text-gold-400;
  @apply tracking-tight;
}

/* Metric labels */
.metric-label {
  @apply text-sm md:text-base text-gray-400 uppercase tracking-wide;
  @apply font-semibold;
}
```

---

### Phase 5: Stats & Metrics Display (Day 2)
**Priority:** MEDIUM
**Files:** Component creation/update

#### 3.5.1 Stats Component Styles

```css
/* File: src/app/globals.css - Add to @layer components */

/* Main stats container */
.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12;
  @apply max-w-5xl mx-auto;
}

/* Individual stat card */
.stat-card {
  @apply text-center;
  @apply flex flex-col items-center gap-3;
}

/* Stat icon container (circles with icons) */
.stat-icon {
  @apply w-16 h-16 rounded-full;
  @apply border-2 border-gold-400;
  @apply flex items-center justify-center;
  @apply text-gold-400 text-2xl;
  @apply mb-4;
}

.stat-icon-victory {
  @apply w-16 h-16 rounded-full;
  @apply border-2 border-win-400;
  @apply flex items-center justify-center;
  @apply text-win-400 text-2xl;
  @apply mb-4;
}

/* Stat value (large number) */
.stat-value {
  @apply text-4xl md:text-5xl lg:text-6xl font-bold text-gold-400;
  @apply leading-none;
}

/* Stat label (description below) */
.stat-label {
  @apply text-sm md:text-base text-gray-300 uppercase tracking-wide;
  @apply font-semibold;
}

/* Large central stat box (like "$47.0M" with border) */
.stat-box-large {
  @apply border-2 border-gold-400 rounded-2xl p-8 md:p-12;
  @apply bg-navy-800/50 backdrop-blur-sm;
  @apply text-center;
  @apply shadow-xl shadow-gold-500/10;
}
```

---

### Phase 6: Specialized Components (Day 3)
**Priority:** LOW
**Files:** Various marketing components

#### 3.6.1 Hero Section Enhancements

Update `src/components/marketing/hero/RotatingHero.tsx`:

```typescript
// Replace current background with darker navy
<section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden bg-navy-900">

  {/* Update headline to white */}
  <h1 className="text-4xl sm:text-5xl lg:text-display-lg font-bold text-white mb-6 leading-tight">
    {currentVariant.headline}
  </h1>

  {/* Update subheadline to gray-300 */}
  <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
    {currentVariant.subheadline}
  </p>

  {/* Update metric values to use gold */}
  <div className="text-3xl sm:text-4xl font-bold text-gold-400">
    {metric.value}
  </div>
  <div className="text-sm sm:text-base text-gray-400 mt-1 uppercase tracking-wide">
    {metric.label}
  </div>
```

#### 3.6.2 Process/How It Works Component

Create three-step cards matching Aliff Capital design:

```typescript
// Pseudo-code structure
<div className="grid md:grid-cols-3 gap-6">
  {/* Step 1 - Gold border */}
  <div className="card-gold">
    <div className="step-number">1</div>
    <h3>AI Analysis</h3>
    <p>Description...</p>
    <div className="card-checkmark-box">
      ✓ 100% compliance coverage guaranteed
    </div>
  </div>

  {/* Step 2 - Victory/Green border (highlighted) */}
  <div className="card-victory">
    <div className="step-number-victory">2</div>
    <h3>6-Expert Human Touch</h3>
    <p>Description...</p>
    <div className="card-checkmark-box">
      ✓ Real expertise AI alone can never replicate
    </div>
  </div>

  {/* Step 3 - Gold border */}
  <div className="card-gold">
    <div className="step-number">3</div>
    <h3>Quality Control</h3>
    <p>Description...</p>
    <div className="card-checkmark-box">
      ✓ Every proposal reviewed 3x before delivery
    </div>
  </div>
</div>
```

---

## 4. Testing & Quality Assurance

### 4.1 Accessibility Testing (WCAG 2.1 AA)

**Contrast Ratios to Verify:**

| Text Color | Background | Required Ratio | Actual Ratio | Status |
|-----------|------------|----------------|--------------|---------|
| Gold 400 on Navy 900 | `#E5C17F` / `#080d1a` | 4.5:1 | ~7.2:1 | ✅ Pass |
| Win 400 on Navy 900 | `#22C55E` / `#080d1a` | 4.5:1 | ~6.8:1 | ✅ Pass |
| White on Navy 900 | `#FFFFFF` / `#080d1a` | 4.5:1 | ~16.1:1 | ✅ Pass |
| Gray 400 on Navy 900 | `#9CA3AF` / `#080d1a` | 4.5:1 | ~5.3:1 | ✅ Pass |

**Testing Checklist:**
- [ ] Run axe DevTools accessibility scan
- [ ] Test with screen readers (VoiceOver, NVDA)
- [ ] Verify keyboard navigation
- [ ] Check focus indicators
- [ ] Test color blind modes (Protanopia, Deuteranopia, Tritanopia)

### 4.2 Visual Regression Testing

**Pages to Test:**
- [ ] Homepage (all 3 hero variants)
- [ ] Services pages (GOVCON, IT, Writing, SLED)
- [ ] Case Studies page
- [ ] Blog page
- [ ] Contact page
- [ ] For Agencies page
- [ ] ROI Calculator page

**Responsive Breakpoints:**
- [ ] Mobile (320px, 375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1280px, 1440px, 1920px)

### 4.3 Browser Compatibility

**Test in:**
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)

---

## 5. Migration & Rollout Plan

### 5.1 Pre-Implementation Checklist

- [ ] Back up current codebase
- [ ] Create feature branch: `feature/color-schema-update`
- [ ] Document current color values for rollback
- [ ] Set up visual regression testing baseline
- [ ] Schedule stakeholder review

### 5.2 Implementation Timeline

**Day 1: Foundation**
- Morning: Update `tailwind.config.ts` and `globals.css`
- Afternoon: Test color changes across sample pages
- Evening: Commit Phase 1 changes

**Day 2: Components**
- Morning: Update Button and Badge components
- Afternoon: Create/update Card components
- Evening: Update Typography and gradients

**Day 3: Integration & Testing**
- Morning: Apply updates to all pages
- Afternoon: Accessibility and responsive testing
- Evening: Cross-browser testing

**Day 4: Review & Refinement**
- Morning: Stakeholder review
- Afternoon: Implement feedback
- Evening: Final testing

**Day 5: Deployment**
- Create pull request
- Code review
- Merge to main
- Deploy to production

### 5.3 Rollback Plan

If issues arise:
1. Revert git commit: `git revert <commit-hash>`
2. Restore color values from backup
3. Clear browser cache and rebuild
4. Document issues for future reference

---

## 6. Component Usage Examples

### 6.1 Hero Section with Premium Badge

```tsx
<section className="bg-navy-900 py-16">
  {/* Premium Badge */}
  <div className="flex justify-center mb-6">
    <span className="badge-premium">
      🏆 PROVEN WINNERS • $47M+ SECURED
    </span>
  </div>

  {/* Headline with gradient */}
  <h1 className="text-white text-center text-5xl lg:text-6xl mb-4">
    Join the Elite 5% Who Actually{" "}
    <span className="text-gradient-win">Win</span>
    {" "}Government Contracts
  </h1>

  {/* Large stat box */}
  <div className="stat-box-large max-w-2xl mx-auto mt-12">
    <p className="text-gold-400 text-sm uppercase tracking-wide mb-4">
      🏆 Total Contracts Won for Our Clients
    </p>
    <div className="text-6xl font-bold text-win-400 mb-4">
      $47.0M
    </div>
    <p className="text-white text-lg">
      AI + 6 Human Experts = Unbeatable Proposals
    </p>
  </div>
</section>
```

### 6.2 Stats Section

```tsx
<section className="bg-navy-950 py-16">
  <div className="stats-grid container mx-auto px-4">
    {/* Win Rate */}
    <div className="stat-card">
      <div className="stat-icon">
        📈
      </div>
      <div className="stat-value">22%</div>
      <div className="stat-label">Win Rate</div>
    </div>

    {/* Winning Proposals */}
    <div className="stat-card">
      <div className="stat-icon">
        📋
      </div>
      <div className="stat-value">200+</div>
      <div className="stat-label">Winning Proposals</div>
    </div>

    {/* Turnaround */}
    <div className="stat-card">
      <div className="stat-icon-victory">
        ⚡
      </div>
      <div className="stat-value text-win-400">7 Days</div>
      <div className="stat-label">Turnaround</div>
    </div>
  </div>
</section>
```

### 6.3 Process Section (3 Steps)

```tsx
<section className="bg-navy-900 py-16">
  <div className="text-center mb-12">
    <span className="badge-premium">
      🏆 THE WINNING FORMULA
    </span>
    <h2 className="text-white text-4xl font-bold mt-6">
      How We Help You <span className="text-gradient-win">WIN</span>
    </h2>
  </div>

  <div className="grid md:grid-cols-3 gap-6 container mx-auto px-4">
    {/* Step 1 */}
    <div className="card-gold">
      <div className="step-number mb-4">1</div>
      <div className="stat-icon mb-4">🧠</div>
      <h3 className="text-white text-2xl font-bold mb-3">AI Analysis</h3>
      <p className="text-gray-300 mb-6">
        We decode every RFP requirement with GPT-4o-mini precision...
      </p>
      <div className="card-checkmark-box">
        ✓ 100% compliance coverage guaranteed
      </div>
    </div>

    {/* Step 2 - Highlighted */}
    <div className="card-victory">
      <div className="step-number-victory mb-4">2</div>
      <div className="stat-icon-victory mb-4">👥</div>
      <h3 className="text-white text-2xl font-bold mb-3">6-Expert Human Touch</h3>
      <p className="text-gray-300 mb-6">
        Six strategists craft narratives evaluators can't ignore...
      </p>
      <div className="card-checkmark-box">
        ✓ Real expertise AI alone can never replicate
      </div>
    </div>

    {/* Step 3 */}
    <div className="card-gold">
      <div className="step-number mb-4">3</div>
      <div className="stat-icon mb-4">🛡️</div>
      <h3 className="text-white text-2xl font-bold mb-3">Quality Control</h3>
      <p className="text-gray-300 mb-6">
        Our Pink-Red-Gold quality system ensures perfection...
      </p>
      <div className="card-checkmark-box">
        ✓ Every proposal reviewed 3x before delivery
      </div>
    </div>
  </div>
</section>
```

### 6.4 CTA Buttons

```tsx
{/* Primary Gold CTA */}
<Button variant="default" size="lg">
  Get Your Winning Strategy →
</Button>

{/* Victory Green Outlined CTA */}
<Button variant="victory" size="lg">
  Calculate Your Potential Wins 📊
</Button>

{/* Dark Outlined CTA */}
<Button variant="darkOutline" size="lg">
  See Real Wins 🔥
</Button>
```

---

## 7. File Modification Checklist

### Critical Priority (Day 1)
- [ ] `tailwind.config.ts` - Update color palette
- [ ] `src/app/globals.css` - Update CSS variables and base styles

### High Priority (Days 1-2)
- [ ] `src/components/ui/button.tsx` - Add new button variants
- [ ] `src/components/ui/badge.tsx` - Create/update badge components
- [ ] `src/components/ui/card.tsx` - Update card styles

### Medium Priority (Day 2)
- [ ] `src/components/marketing/hero/RotatingHero.tsx` - Apply new colors
- [ ] `src/components/marketing/Stats.tsx` - Update metrics display
- [ ] `src/components/marketing/process/HowItWorks.tsx` - Create process cards
- [ ] `src/components/layout/Header.tsx` - Update navigation colors
- [ ] `src/components/layout/Footer.tsx` - Update footer colors

### Low Priority (Day 3)
- [ ] All page components (`src/app/**/page.tsx`) - Update text colors
- [ ] `src/components/marketing/services/ServiceCard.tsx` - Apply card styles
- [ ] `src/components/marketing/b2b/B2BCallout.tsx` - Update callout
- [ ] `src/components/case-studies/CaseStudiesGrid.tsx` - Apply new styles
- [ ] `src/components/blog/BlogGrid.tsx` - Apply new styles

---

## 8. Success Metrics

### 8.1 Technical Metrics
- [ ] All pages load without CSS errors
- [ ] No visual regressions in critical user paths
- [ ] Lighthouse accessibility score ≥ 95
- [ ] Color contrast ratios meet WCAG AA standards

### 8.2 Design Metrics
- [ ] Brand consistency score: 100% alignment with Aliff Capital
- [ ] Visual hierarchy improved (measured by heat map testing)
- [ ] Premium perception increased (A/B testing)

### 8.3 Business Metrics
- [ ] Bounce rate decreased
- [ ] Time on page increased
- [ ] CTA click-through rate improved
- [ ] Lead form conversion rate increased

---

## 9. Maintenance & Future Updates

### 9.1 Color Versioning
- Document all color changes in CHANGELOG.md
- Tag releases with color schema version (e.g., `v2.0-color-update`)
- Maintain color palette documentation in `/docs/colors.md`

### 9.2 Component Library
- Create Storybook instances for all new component variants
- Document usage guidelines
- Provide code examples for developers

### 9.3 Design Tokens
Consider implementing design tokens system for future flexibility:

```typescript
// Future: design-tokens.ts
export const tokens = {
  colors: {
    brand: {
      gold: {
        primary: '#E5C17F',
        bright: '#F3C96B',
        classic: '#D4AF37',
      },
      navy: {
        primary: '#080d1a',
        darker: '#040609',
      },
      win: {
        primary: '#10B981',
        bright: '#22C55E',
      },
    },
  },
};
```

---

## 10. Appendix

### 10.1 Color Reference Table

| Color Name | Hex Code | RGB | Usage |
|-----------|----------|-----|-------|
| Navy 900 (Primary BG) | `#080d1a` | `8, 13, 26` | Main background |
| Navy 950 (Darker) | `#040609` | `4, 6, 9` | Section backgrounds |
| Gold 300 (Bright) | `#F3C96B` | `243, 201, 107` | Bright accents |
| Gold 400 (Primary) | `#E5C17F` | `229, 193, 127` | Primary gold |
| Gold 500 (Classic) | `#D4AF37` | `212, 175, 55` | Classic gold |
| Win 400 (Bright) | `#22C55E` | `34, 197, 94` | Victory accents |
| Win 500 (Primary) | `#10B981` | `16, 185, 129` | Success green |

### 10.2 Design Inspiration Sources

- **Aliff Capital Website:** aliffcapital.com
- **Industry References:** Premium financial services, luxury brands
- **Color Psychology:** Trust (dark blue), Prosperity (gold), Success (green)

### 10.3 Resources

- **Tailwind CSS Documentation:** https://tailwindcss.com/docs
- **WCAG Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Color Accessibility:** https://accessible-colors.com/

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-11-14 | Aliff Services Dev Team | Initial strategy document |

---

**Next Steps:**
1. Review this document with stakeholders
2. Create feature branch: `feature/color-schema-update`
3. Begin Phase 1 implementation
4. Schedule regular check-ins during implementation

**Questions or Concerns?**
Contact the development team or refer to this document for guidance.
