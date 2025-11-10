# Homepage Specification - Aliff Services

**Version**: 1.0
**Date**: 2025-11-10
**Status**: Planning Phase

---

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Section-by-Section Breakdown](#section-by-section-breakdown)
4. [Mobile Responsive Behavior](#mobile-responsive-behavior)
5. [Interactions & Animations](#interactions--animations)
6. [Performance Requirements](#performance-requirements)
7. [Implementation Notes](#implementation-notes)

---

## Overview

The homepage serves as the primary entry point for three distinct audiences: government contractors (GOVCON/SLED), businesses seeking IT services, and businesses needing professional writing. The design ensures equal representation and conversion paths for all three segments.

**Key Objectives**:
- Present all 4 service categories equally (GOVCON, SLED, Writing, IT Services)
- Immediate visitor engagement (< 3 seconds to understand value)
- Clear conversion paths for each audience
- Establish trust and authority across all services
- Drive action: chatbot engagement or consultation scheduling

**Success Metrics**:
- Bounce rate < 40%
- Average time on page > 90 seconds
- Chatbot engagement rate > 15%
- Scroll depth > 70%
- Conversion rate (CTA clicks) > 8%

---

## Design Principles

### 1. Multi-Audience First
- No single service dominates
- Rotating hero ensures all services get equal visibility
- Clear self-selection paths

### 2. Supreme Quality
- "Best in the world" design and UX
- Clean, modern, professional aesthetics
- Trust-building at every section

### 3. Fast & Accessible
- < 2 second page load
- WCAG 2.1 AA compliant
- Mobile-first responsive design

### 4. Conversion-Optimized
- Clear CTAs throughout
- Multiple conversion paths
- 24/7 availability emphasized

---

## Section-by-Section Breakdown

### Section 1: Auto-Rotating Hero

**Purpose**: Capture attention and present value propositions for all three service segments.

**Behavior**:
- Auto-rotates every 8 seconds (GOVCON → IT Services → Writing Services → repeat)
- User can manually navigate using dot indicators
- Hover pauses auto-rotation
- Mobile: Swipeable with touch gestures
- Each rotation is a complete, standalone message

**Rotation 1: Government Contracting (0-8 seconds)**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Background: Government building (subtle, professional) │
│                                                         │
│  HEADLINE (Large, Bold):                                │
│  "We Win Government Contracts At 5.5x Industry Rate"    │
│                                                         │
│  SUBHEADLINE (Medium):                                  │
│  $47M+ won | 22% win rate vs 4% average |               │
│  20 years expertise                                     │
│                                                         │
│  [Get Free Contract Assessment →]  (Primary CTA)        │
│                                                         │
│  Dot Navigation: ● ○ ○                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Visual Design**:
- Background: Subtle overlay on government building image (opacity 85%)
- Color scheme: Navy (#0A0F1E) + Gold (#C89D5C)
- Typography: Bold sans-serif (Inter Black 900)
- CTA: Gold button with hover effect

**Copy Details**:
- Headline: 48px desktop, 32px mobile
- Subheadline: 20px desktop, 16px mobile
- Metrics separated by vertical bars (|)

---

**Rotation 2: IT Services (8-16 seconds)**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Background: Modern app/website screens (tech aesthetic)│
│                                                         │
│  HEADLINE (Large, Bold):                                │
│  "World-Class Apps & Websites. Built Right. On Time."   │
│                                                         │
│  SUBHEADLINE (Medium):                                  │
│  50+ apps delivered | 4.9★ rating |                     │
│  100% on-time delivery                                  │
│                                                         │
│  [Start Your Project →]  (Primary CTA)                  │
│                                                         │
│  Dot Navigation: ○ ● ○                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Visual Design**:
- Background: Gradient overlay on tech/app imagery
- Color scheme: Gold (#C89D5C) primary with gradient accents
- Modern, tech-forward aesthetic
- CTA: Gold button with glow effect

---

**Rotation 3: Writing Services (16-24 seconds)**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Background: Content/writing imagery (editorial style)  │
│                                                         │
│  HEADLINE (Large, Bold):                                │
│  "Professional Writing That Converts. Fast."            │
│                                                         │
│  SUBHEADLINE (Medium):                                  │
│  1000+ projects | 48hr turnaround |                     │
│  95% client retention                                   │
│                                                         │
│  [Get Expert Writers →]  (Primary CTA)                  │
│                                                         │
│  Dot Navigation: ○ ○ ●                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Visual Design**:
- Background: Clean, editorial style with content imagery
- Color scheme: Victory Green (#10B981) + Gold accents
- Professional, content-focused aesthetic
- CTA: Green-to-gold gradient button

---

**Hero Technical Specs**:

```javascript
// Animation timing
const ROTATION_INTERVAL = 8000; // 8 seconds
const TRANSITION_DURATION = 600; // 0.6 seconds fade

// Pause on hover
heroContainer.addEventListener('mouseenter', pauseRotation);
heroContainer.addEventListener('mouseleave', resumeRotation);

// Mobile swipe
const swipeThreshold = 50; // pixels
enableTouchSwipe(heroContainer, navigateSlide);

// Accessibility
- Each slide has aria-live="polite"
- Keyboard navigation (arrow keys)
- Skip to content link for screen readers
```

**Performance**:
- Images preloaded (all 3 backgrounds)
- CSS transitions (GPU-accelerated)
- Lazy load below-fold content
- Total hero weight: < 500KB

---

### Section 2: Service Selector Cards (Static)

**Purpose**: Provide immediate self-selection for visitors who know what they need.

**Layout**: 3 equal-width cards (desktop), stacked (mobile)

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  "Or explore all our services"                         │
│                                                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐      │
│  │ 🏛️          │  │ 💻          │  │ ✍️          │      │
│  │            │  │            │  │            │      │
│  │ Government │  │ IT Services│  │ Writing    │      │
│  │ Contracting│  │            │  │ Services   │      │
│  │            │  │            │  │            │      │
│  │ Win federal│  │ Apps &     │  │ Content    │      │
│  │ and state  │  │ websites   │  │ that       │      │
│  │ contracts  │  │ that users │  │ converts   │      │
│  │            │  │ love       │  │            │      │
│  │            │  │            │  │            │      │
│  │ [Explore →]│  │ [Explore →]│  │ [Explore →]│      │
│  │            │  │            │  │            │      │
│  │ GOVCON + SLED│ │ Websites & │  │ 6 Writing  │      │
│  │ 8 services │  │ Mobile Apps│  │ Categories │      │
│  └────────────┘  └────────────┘  └────────────┘      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Card Structure** (Each):
- Icon (64px, animated on hover)
- Service name (24px bold)
- One-line value proposition (16px)
- "Explore →" CTA button
- Service count badge

**Interactions**:
- Hover: Card lifts (8px), subtle shadow
- Icon animates (scale 1.1, rotate 5deg)
- CTA button color change
- Click: Navigate to service page

**Design Specs**:
- Card padding: 40px
- Border radius: 12px
- Background: White with subtle gradient
- Border: 1px solid rgba(gold, 0.2)
- Hover shadow: 0 12px 40px rgba(0,0,0,0.1)

**Mobile Behavior**:
- Stack vertically
- Full width minus 32px margins
- Tap-friendly (min 48px touch targets)
- Spacing: 24px between cards

---

### Section 3: Universal Value Props

**Purpose**: Build trust and communicate core differentiators across all services.

**Headline**: "Why 1,000+ Clients Choose Aliff"

**Layout**: 4 columns (desktop), 2x2 grid (tablet), stack (mobile)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│         Why 1,000+ Clients Choose Aliff                  │
│                                                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │  📅      │  │  🤖      │  │  💎      │  │  ✅      │   │
│  │  20 Years│  │  AI-     │  │Complete  │  │ Results │   │
│  │  Expertise│ │ Powered  │  │Transpare│  │Guarantee│   │
│  │         │  │          │  │  ncy     │  │  d      │   │
│  │ Combined │  │ 24/7     │  │ Upfront  │  │ 95%     │   │
│  │ team exp │  │ operations│ │ pricing, │  │ client  │   │
│  │ across   │  │ AI + human│ │ clear    │  │ retent- │   │
│  │ govt, tech│ │ excellence│ │timelines │  │ ion rate│   │
│  │ & content│  │          │  │          │  │         │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Each Column**:
- Icon (48px)
- Title (20px bold)
- Description (14px, 2-3 lines)
- Consistent vertical spacing

**Visual Treatment**:
- Light background (#F9FAFB)
- Section padding: 80px top/bottom
- Icons: Duotone style (Navy + Gold)

---

### Section 4: How Aliff Works

**Purpose**: Demystify the process and lower barriers to entry.

**Headline**: "Simple Process. Exceptional Results."

**Layout**: 4-step horizontal timeline (desktop), vertical (mobile)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│           Simple Process. Exceptional Results.           │
│                                                          │
│   1          →        2        →      3      →     4     │
│  ┌─────┐          ┌─────┐        ┌─────┐      ┌─────┐  │
│  │ 💬   │          │ 📋   │        │ ⚡   │      │ 🎯   │  │
│  │     │          │     │        │     │      │     │  │
│  │Free │          │Custom│        │Expert│      │Deliver│  │
│  │Assess│         │Proposal│      │Execution│    │& Support│
│  │ment │          │     │        │     │      │     │  │
│  │     │          │     │        │     │      │     │  │
│  │Talk to│         │Pricing,│      │AI + │      │On-time│  │
│  │Aliff │         │timeline│      │human │      │ with  │  │
│  │chatbot│        │& scope │      │hybrid│      │ongoing│  │
│  │24/7  │         │provided│      │team  │      │support│  │
│  └─────┘          └─────┘        └─────┘      └─────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Each Step**:
- Step number (bold, large)
- Icon (56px)
- Title (18px bold)
- Description (14px, 2 lines)
- Arrow connector (animated)

**Animations**:
- On scroll: Steps fade in sequentially (200ms delay each)
- Arrows animate from left to right
- Icons pulse on viewport entry

**Desktop**:
- Horizontal layout with connecting arrows
- Equal spacing (25% width each)

**Mobile**:
- Vertical timeline
- Dotted line connector on left
- Numbers in circles

---

### Section 5: Results By Numbers

**Purpose**: Provide concrete proof of capabilities across all services.

**Headline**: "Proven Results Across Every Service"

**Layout**: 2x3 grid (desktop), 2x3 grid (mobile, smaller)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│           Proven Results Across Every Service            │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ $47M+    │  │  50+     │  │ 1000+    │              │
│  │ Contracts│  │  Apps    │  │ Writing  │              │
│  │ Won      │  │ Delivered│  │ Projects │              │
│  │ (GOVCON) │  │ (IT)     │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  95%     │  │  4.9★    │  │  48hr    │              │
│  │  Client  │  │  Average │  │  Average │              │
│  │ Retention│  │  Rating  │  │Turnaround│              │
│  │          │  │          │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Each Metric Box**:
- Large number (48px, bold, Gold)
- Label (16px, Navy)
- Service category tag (small, 12px)
- Background: White card with shadow

**Animations**:
- CountUp animation on scroll into view
- Numbers increment from 0 to actual value
- 1.5 second duration
- Easing: ease-out

**Visual Design**:
- Dark background (#0A0F1E)
- White text for contrast
- Cards have subtle glow effect
- Section padding: 100px top/bottom

---

### Section 6: Featured Case Studies

**Purpose**: Provide social proof through anonymized success stories.

**Headline**: "Real Results. Real Impact."

**Layout**: 3 cards (carousel on mobile)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│              Real Results. Real Impact.                  │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ 🏛️           │  │ 💻           │  │ ✍️           │     │
│  │             │  │             │  │             │     │
│  │ Federal     │  │ E-commerce  │  │ Content     │     │
│  │ Contract    │  │ Platform    │  │ Marketing   │     │
│  │ Win         │  │ Launch      │  │ Campaign    │     │
│  │             │  │             │  │             │     │
│  │ CHALLENGE:  │  │ CHALLENGE:  │  │ CHALLENGE:  │     │
│  │ New contrac-│  │ Startup     │  │ B2B SaaS    │     │
│  │ tor needed  │  │ needed MVP  │  │ needed SEO  │     │
│  │ first win   │  │ in 8 weeks  │  │ content     │     │
│  │             │  │             │  │             │     │
│  │ SOLUTION:   │  │ SOLUTION:   │  │ SOLUTION:   │     │
│  │ Full proposal│ │ React Native│  │ 32 optimized│     │
│  │ + compliance│  │ e-commerce  │  │ blog posts  │     │
│  │             │  │             │  │             │     │
│  │ RESULT:     │  │ RESULT:     │  │ RESULT:     │     │
│  │ $2.3M award │  │ 5K+ orders  │  │ 340% traffic│     │
│  │ 45-day cycle│  │ first month │  │ increase    │     │
│  │             │  │             │  │             │     │
│  │[Read Story→]│  │[Read Story→]│  │[Read Story→]│     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Each Card**:
- Service icon + category badge
- Title (20px bold)
- Challenge → Solution → Result format
- Specific metrics highlighted
- "Read Story →" CTA
- Client anonymized (e.g., "Federal Agency", "Tech Startup")

**Visual Treatment**:
- Card background: White
- Border-left: 4px colored stripe (service-specific color)
- Padding: 32px
- Hover: Lift effect

**Mobile**:
- Horizontal carousel (swipeable)
- Pagination dots
- One card visible at a time

---

### Section 7: Industries We Serve

**Purpose**: Show breadth of expertise and help visitors see themselves.

**Headline**: "Trusted Across Industries"

**Layout**: Icon grid, 6 industries (3x2 desktop, 2x3 mobile)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│              Trusted Across Industries                   │
│                                                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ 🏛️       │  │ 🏥       │  │ 💻       │                 │
│  │Government│  │Healthcare│  │Technology│                 │
│  │ & Defense│  │         │  │          │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
│                                                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ 💰       │  │ 🎓       │  │ 🛒       │                 │
│  │ Finance  │  │Education │  │ Retail & │                 │
│  │          │  │          │  │E-commerce│                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Each Industry Box**:
- Icon (40px)
- Industry name (16px)
- Hover: Icon color change + scale
- Optional: Click to filter case studies

**Visual Design**:
- Light gray background
- Minimal, clean aesthetic
- Icons: Duotone style
- Section padding: 80px top/bottom

---

### Section 8: Final CTA (Conversion Zone)

**Purpose**: Drive action with dual conversion paths.

**Layout**: Split CTA (Primary + Secondary)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                 Ready to Get Started?                    │
│                                                          │
│         Get instant answers or schedule a call           │
│                                                          │
│   ┌─────────────────────┐    ┌─────────────────────┐   │
│   │                     │    │                     │   │
│   │  [Talk to Aliff →]  │    │  [Schedule Call →]  │   │
│   │                     │    │                     │   │
│   │  💬 Instant answers │    │  📅 Google Meet     │   │
│   │  Available 24/7     │    │  Pick your time     │   │
│   │                     │    │                     │   │
│   └─────────────────────┘    └─────────────────────┘   │
│                                                          │
│              Available 24/7 | Response < 1 hour          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Primary CTA**: "Talk to Aliff"
- Opens chatbot widget (bottom right)
- Gold button, large (56px height)
- Icon: Chat bubble
- Text: "Instant answers • Available 24/7"

**Secondary CTA**: "Schedule Call"
- Links to Google Calendar (embedded Calendly-style picker)
- Opens modal with calendar view
- Books Google Meet automatically
- Navy button, large (56px height)
- Icon: Calendar
- Text: "Pick your time • Google Meet"

**Subtext**: "Available 24/7 | Response < 1 hour"

**Visual Design**:
- Dark background (#0A0F1E)
- White text
- Large, prominent buttons
- Section padding: 120px top/bottom

**Functionality**:

```javascript
// Talk to Aliff button
talkToAliffBtn.addEventListener('click', () => {
  openChatbotWidget();
  trackEvent('CTA_Click', 'Talk_to_Aliff', 'Homepage_Footer');
});

// Schedule Call button
scheduleCallBtn.addEventListener('click', () => {
  openGoogleCalendarModal();
  trackEvent('CTA_Click', 'Schedule_Call', 'Homepage_Footer');
});
```

---

### Sticky Elements

**1. Navigation Bar**

```
┌──────────────────────────────────────────────────────────┐
│ [Logo] Home Services▼ About Case Studies Contact  [CTA] │
└──────────────────────────────────────────────────────────┘
```

**Behavior**:
- Fixed position after scroll past hero (100px)
- Fade in on scroll down
- Background: White with shadow
- Height: 72px
- Z-index: 1000

**Mobile**:
- Hamburger menu
- Full-screen overlay navigation
- Logo + menu icon only

---

**2. Aliff Chatbot Bubble**

```
  ┌──────────┐
  │    💬    │
  │  Aliff   │
  └──────────┘
```

**Behavior**:
- Fixed bottom-right corner
- Position: 24px from bottom, 24px from right
- Size: 64px diameter (desktop), 56px (mobile)
- Animated pulse every 10 seconds
- Badge notification if proactive message
- Click: Opens chatbot interface

**States**:
- Default: Gold background, white icon
- Hover: Scale 1.1, shadow increase
- Active (chat open): Green dot indicator
- Offline: Never (24/7 available)

**Animations**:
- Entrance: Slide up + fade in after 3 seconds on page
- Pulse: Subtle scale animation every 10s
- Notification badge: Bounce animation

---

## Mobile Responsive Behavior

### Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  /* Stack all sections */
  /* Hero text smaller */
  /* Single column layouts */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 2-column grids */
  /* Adjusted spacing */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full multi-column layouts */
  /* Maximum width: 1280px */
}

/* Large Desktop */
@media (min-width: 1440px) {
  /* Maximum width: 1440px */
  /* Increased padding */
}
```

### Mobile-Specific Changes

**Hero**:
- Headline: 32px → 28px
- Subheadline: 16px → 14px
- Vertical padding reduced
- Background images optimized for mobile

**Service Cards**:
- Stack vertically
- Full width minus 32px margin
- Increased tap targets (min 48px)

**Value Props**:
- 2x2 grid → vertical stack
- Icons smaller (40px)

**How It Works**:
- Horizontal timeline → vertical
- Steps stack with left-aligned timeline

**Case Studies**:
- 3 cards → horizontal carousel
- Swipe gestures enabled
- Pagination dots

**Industries**:
- 3x2 grid → 2x3 grid
- Smaller icons and text

---

## Interactions & Animations

### Scroll Animations

**Fade In On Scroll**:
```javascript
// Applied to: Section headlines, cards, metrics
const observerOptions = {
  threshold: 0.2, // Trigger at 20% visibility
  rootMargin: '0px 0px -100px 0px' // Offset
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
    }
  });
}, observerOptions);
```

**Stagger Animations**:
- Service cards: 100ms delay each
- Timeline steps: 200ms delay each
- Metrics: 150ms delay each

### Hover Effects

**Cards**:
```css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}
```

**Buttons**:
```css
.btn-primary {
  transition: background 0.2s ease, transform 0.1s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #D4A962, #C89D5C);
  transform: scale(1.05);
}

.btn-primary:active {
  transform: scale(0.98);
}
```

### Micro-interactions

**Icons**:
- Rotate 5° on hover
- Scale 1.1 on hover
- Color shift

**Metrics Count-Up**:
```javascript
function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16); // 60fps
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      element.textContent = end;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}
```

---

## Performance Requirements

### Page Load Targets

- **First Contentful Paint (FCP)**: < 1.2s
- **Largest Contentful Paint (LCP)**: < 2.0s
- **Time to Interactive (TTI)**: < 3.0s
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Strategies

**Images**:
- WebP format with JPEG fallback
- Responsive images (srcset)
- Lazy loading below fold
- Hero images preloaded
- Total image weight: < 800KB

**JavaScript**:
- Code splitting by route
- Defer non-critical scripts
- Inline critical JS
- Total JS bundle: < 200KB (gzipped)

**CSS**:
- Critical CSS inlined
- Non-critical CSS deferred
- Unused CSS removed
- Total CSS: < 50KB (gzipped)

**Fonts**:
- Subset fonts (Latin only)
- Preload Inter (400, 600, 900)
- Font-display: swap
- WOFF2 format

**Third-Party Scripts**:
- Google Analytics: Async load
- Chatbot widget: Lazy load (after 3s)
- Google Calendar embed: On-demand load

---

## Implementation Notes

### Technology Stack

**Framework**: Next.js 14+ (App Router)
**Styling**: Tailwind CSS
**Animations**: Framer Motion (selective use)
**Forms**: React Hook Form + Zod
**Analytics**: Google Analytics 4 + Custom events

### Component Structure

```
src/
├── app/
│   └── page.tsx (Homepage)
├── components/
│   ├── home/
│   │   ├── HeroRotating.tsx
│   │   ├── ServiceCards.tsx
│   │   ├── ValueProps.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ResultsMetrics.tsx
│   │   ├── CaseStudies.tsx
│   │   ├── Industries.tsx
│   │   └── FinalCTA.tsx
│   ├── shared/
│   │   ├── ChatbotBubble.tsx
│   │   ├── StickyNav.tsx
│   │   └── GoogleCalendarModal.tsx
└── lib/
    └── animations.ts
```

### SEO Optimization

**Meta Tags**:
```html
<title>Aliff Services | Government Contracting, IT Services & Professional Writing</title>
<meta name="description" content="Win government contracts, build world-class apps, and get expert writing. $47M+ won, 50+ apps delivered, 1000+ projects completed. 20 years expertise. 24/7 AI-powered service." />
<meta name="keywords" content="government contracting, GOVCON, SLED, website development, mobile apps, professional writing, copywriting, content writing" />

<!-- Open Graph -->
<meta property="og:title" content="Aliff Services | Win Contracts, Build Apps, Expert Writing" />
<meta property="og:description" content="$47M+ in contracts won | 50+ apps delivered | 1000+ writing projects | 24/7 AI-powered expertise" />
<meta property="og:image" content="/og-image.jpg" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Aliff Services | Government Contracting + IT + Writing" />
```

**Structured Data** (JSON-LD):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aliff Services",
  "description": "Government contracting, IT services, and professional writing",
  "url": "https://aliffservices.com",
  "logo": "https://aliffservices.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-XXX-XXX-XXXX",
    "contactType": "Customer Service",
    "availableLanguage": "English",
    "areaServed": "US"
  },
  "sameAs": [
    "https://linkedin.com/company/aliffservices",
    "https://twitter.com/aliffservices"
  ]
}
```

### Accessibility

**WCAG 2.1 AA Compliance**:
- Color contrast: 4.5:1 minimum (text)
- Color contrast: 3:1 minimum (UI components)
- Keyboard navigation: All interactive elements
- Screen reader: Semantic HTML, ARIA labels
- Focus indicators: Visible on all focusable elements
- Skip links: "Skip to main content"

**ARIA Labels**:
```html
<button aria-label="Talk to Aliff chatbot 24/7">Talk to Aliff</button>
<nav aria-label="Main navigation">...</nav>
<section aria-labelledby="case-studies-heading">...</section>
```

### Analytics Tracking

**Events to Track**:

```javascript
// Hero interactions
trackEvent('Hero_Rotation', rotation_index); // Which hero was visible longest
trackEvent('Hero_Manual_Nav', rotation_index); // User clicked dot navigation
trackEvent('Hero_CTA_Click', service_type); // Which CTA clicked

// Service cards
trackEvent('Service_Card_Click', service_name);

// Process section
trackEvent('Process_Step_View', step_number); // Which steps viewed

// Case studies
trackEvent('Case_Study_Click', service_type);
trackEvent('Case_Study_Carousel_Swipe', direction);

// CTAs
trackEvent('CTA_Talk_to_Aliff', section); // Which section CTA clicked from
trackEvent('CTA_Schedule_Call', section);

// Scroll depth
trackEvent('Scroll_Depth', percentage); // 25%, 50%, 75%, 100%

// Exit intent
trackEvent('Exit_Intent_Trigger'); // Mouse leaves viewport
```

### A/B Testing Opportunities

**Test Variations**:
1. Hero rotation speed (6s vs 8s vs 10s)
2. CTA button copy variations
3. Case study formats (Challenge-Solution-Result vs different)
4. Metrics display (grid vs carousel vs animated counter)
5. Service card order (GOVCON first vs IT first)

---

## Design Assets Needed

### Images
1. **Hero Backgrounds** (3):
   - Government building (professional, US Capitol or similar)
   - Modern app/website screens (tech aesthetic)
   - Content/writing imagery (editorial style)
   - Size: 1920x1080px (desktop), 750x1334px (mobile)
   - Format: WebP + JPEG fallback

2. **Service Icons**:
   - Government building icon
   - Code/laptop icon
   - Pen/writing icon
   - Size: 64px, 128px (2x), 192px (3x)
   - Format: SVG (preferred) or PNG

3. **Value Prop Icons** (4):
   - Calendar/time icon (20 years)
   - Robot/AI icon (AI-powered)
   - Diamond/quality icon (transparency)
   - Checkmark/guarantee icon (results)

4. **Industry Icons** (6):
   - Government building
   - Medical cross
   - Computer/tech
   - Dollar sign/finance
   - Graduation cap
   - Shopping cart

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 600 (Semi-Bold), 900 (Black)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Color Palette
```css
:root {
  /* Brand Colors */
  --gold: #C89D5C;
  --navy: #0A0F1E;
  --victory-green: #10B981;

  /* Neutrals */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-600: #4B5563;
  --gray-900: #111827;

  /* Functional */
  --success: #10B981;
  --error: #EF4444;
  --warning: #F59E0B;

  /* Gradients */
  --gradient-gold: linear-gradient(135deg, #D4A962, #C89D5C);
  --gradient-hero: linear-gradient(135deg, rgba(10,15,30,0.9), rgba(10,15,30,0.7));
}
```

---

## Launch Checklist

### Pre-Launch
- [ ] All images optimized and compressed
- [ ] WebP format with fallbacks implemented
- [ ] Lazy loading configured
- [ ] Hero rotation tested across browsers
- [ ] Mobile responsiveness verified (iPhone, Android)
- [ ] Tablet layout tested (iPad)
- [ ] Accessibility audit completed (WAVE, axe)
- [ ] Color contrast verified
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (NVDA, VoiceOver)
- [ ] Google Analytics configured
- [ ] Event tracking implemented and tested
- [ ] Chatbot integration tested
- [ ] Google Calendar modal tested
- [ ] Performance audit (Lighthouse score > 90)
- [ ] SEO meta tags verified
- [ ] Structured data validated
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] SSL certificate configured
- [ ] 404 page configured
- [ ] Sitemap.xml generated

### Post-Launch
- [ ] Monitor Core Web Vitals (Search Console)
- [ ] Review analytics data (first 48 hours)
- [ ] Check chatbot engagement rate
- [ ] Monitor conversion rates per CTA
- [ ] Review heatmaps (Hotjar/similar)
- [ ] Collect user feedback
- [ ] A/B test planning based on data
- [ ] Iterate based on insights

---

## Version History

**Version 1.0** (2025-11-10)
- Initial homepage specification
- Auto-rotating hero concept finalized
- 8-section structure defined
- Mobile responsiveness planned
- Performance targets set
- Accessibility requirements documented

---

**Next Steps**:
1. Design mockups (Figma)
2. Prototype interactive hero
3. Develop component library
4. Implement homepage
5. QA and testing
6. Launch

**Estimated Timeline**: 4-6 weeks for complete implementation

---

**Document Status**: Planning Complete - Ready for Design Phase
**Last Updated**: 2025-11-10
**Next Review**: After design mockups completed
