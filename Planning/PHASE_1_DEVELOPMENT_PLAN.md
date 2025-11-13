# Marketing Website - Phase 1 Development Plan

**Project:** Aliff Services Marketing Website MVP
**Timeline:** TBD
**Status:** Planning → Development

---

## Phase 1 Scope: Launch-Ready MVP

**Goal:** Deploy production-ready marketing website that:
- Serves all 3 audiences (GOVCON contractors, B2B agencies, IT/Writing clients)
- Prioritizes B2B (70-90% revenue driver)
- Achieves world-class performance (< 2s load, Lighthouse > 90)
- Implements core pages for lead generation and conversion

---

## Technology Stack (Existing)

**Core Framework:**
- ✅ Next.js 14 (App Router)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Shadcn UI components

**Additional Requirements:**
- Framer Motion (animations for rotating hero, smooth transitions)
- React Hook Form (contact forms)
- Zod (form validation)
- Next.js Image optimization
- Vercel Analytics (performance monitoring)

---

## Design System Foundation

### Color Palette (To Finalize)

**Proposed Direction:**
```css
/* Primary - Professional Authority */
--navy-900: #0A1628;  /* Deep navy for headers */
--navy-800: #1a2744;
--navy-700: #2a3f5f;

/* Accent - Innovation Signal */
--teal-600: #0891B2;  /* Energetic accent */
--teal-500: #06B6D4;
--teal-400: #22D3EE;

/* Neutrals - Modern Clean */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-900: #111827;

/* Success - Metrics/Wins */
--green-600: #059669;
--green-500: #10B981;

/* Service Category Accents (Subtle) */
--govcon-accent: #3B82F6;  /* Blue */
--it-accent: #8B5CF6;      /* Purple */
--writing-accent: #EC4899;  /* Pink */
```

### Typography

**Font Stack:**
```css
/* Headings */
--font-heading: 'Inter', system-ui, sans-serif;
font-weight: 700 (bold headlines), 600 (subheads)

/* Body */
--font-body: 'Inter', system-ui, sans-serif;
font-weight: 400 (regular), 500 (emphasis)

/* Monospace (for code/technical) */
--font-mono: 'JetBrains Mono', monospace;
```

**Type Scale:**
- H1: 3.5rem (56px) desktop, 2.5rem (40px) mobile
- H2: 2.5rem (40px) desktop, 2rem (32px) mobile
- H3: 2rem (32px) desktop, 1.5rem (24px) mobile
- H4: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### Spacing System

**Consistent Scale:**
- 4px base unit
- Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px

---

## Component Library (Build First)

### Priority Components

**1. Layout Components**
- [ ] Header/Navigation (with dropdown menus)
- [ ] Footer
- [ ] Container/Section wrappers
- [ ] Grid system

**2. Hero Components**
- [ ] RotatingHero (3 variations: GOVCON, IT, Writing)
- [ ] HeroCard (service selector cards)
- [ ] CTAButton (primary, secondary, ghost variants)

**3. Content Components**
- [ ] ServiceCard (for service grid)
- [ ] FeatureList (bullet points with icons)
- [ ] MetricDisplay (win rates, timelines)
- [ ] TestimonialCard
- [ ] ProcessStep (how it works)

**4. Interactive Components**
- [ ] AnimatedCounter (for metrics)
- [ ] Accordion (FAQs)
- [ ] Tabs (service category switching)
- [ ] Modal/Dialog

**5. Form Components**
- [ ] Input (text, email, textarea)
- [ ] Select/Dropdown
- [ ] Checkbox
- [ ] ContactForm (full form assembly)

**6. Navigation Components**
- [ ] MegaMenu (services dropdown)
- [ ] MobileMenu (hamburger navigation)
- [ ] Breadcrumbs

---

## Page Development Order

### Week 1: Foundation

**1. Design System Setup**
- [ ] Finalize color palette with user approval
- [ ] Configure Tailwind with custom colors
- [ ] Set up typography system
- [ ] Create base component library
- [ ] Build layout components (Header, Footer, Container)

**2. Homepage - Structure**
- [ ] Create /app/page.tsx with new structure
- [ ] Build RotatingHero component (3 variations)
- [ ] Implement service selector cards
- [ ] Add B2B callout section

### Week 2: Homepage Completion

**3. Homepage - Content Sections**
- [ ] How It Works section
- [ ] Trust signals (metrics, client logos if available)
- [ ] Case study preview
- [ ] Final CTA section
- [ ] Performance optimization (lazy loading, image optimization)

**4. Navigation System**
- [ ] Build MegaMenu for Services dropdown
- [ ] Mobile navigation
- [ ] Service category routing

### Week 3: Priority Pages

**5. For Agencies Page (Priority - B2B Revenue)**
- [ ] Hero section with agency-specific value prop
- [ ] Volume pricing visualization (without revealing exact %)
- [ ] White-label features explanation
- [ ] ROI messaging (defer calculator to Phase 3)
- [ ] Case study format (anonymized)
- [ ] Agency-specific CTAs

**6. Service Landing Pages (4 pages)**
- [ ] GOVCON Services landing page
- [ ] SLED Services landing page
- [ ] Writing Services landing page
- [ ] IT Services landing page
- Each includes: Overview, 3-phase process, key benefits, CTA

### Week 4: Essential Pages

**7. Contact Page**
- [ ] Contact form with lead qualification
- [ ] Route to appropriate service (GOVCON/Agency/IT/Writing)
- [ ] Office/contact information (if applicable)
- [ ] Alternative contact methods

**8. About Page**
- [ ] Company story (without revealing confidential strategy)
- [ ] Team credentials (former COs, 20+ years expertise)
- [ ] Mission/values
- [ ] Trust signals

**9. Polish & Launch Prep**
- [ ] SEO optimization (meta tags, schema markup)
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile testing across devices
- [ ] Cross-browser testing
- [ ] Analytics integration

---

## Detailed Page Specifications

### 1. Homepage (New Implementation)

**URL:** `/`

**Sections (8 total):**

**Section 1: Rotating Hero**
```
Component: RotatingHero
Rotation: 8 seconds per variant
Variants:
  1. GOVCON: "Win 22% of Federal Contracts. Not 4%."
  2. IT Services: "Enterprise Architecture. Startup Speed."
  3. Writing: "Strategic Content. Authentic Voice. Not AI Slop."
Auto-rotates, can also be manually navigated
```

**Section 2: Service Selector Cards**
```
Component: ServiceGrid
4 Cards:
  - GOVCON Services (8 services)
  - SLED Services (8 services)
  - Writing Services (6 categories)
  - IT Services (2 core)
Hover effects, click to service landing page
```

**Section 3: B2B Callout Banner**
```
Component: B2BCallout
Headline: "Are You a GOVCON Agency?"
Subhead: "Scale delivery without adding headcount"
4 Value Props:
  - White-label our services
  - 15-25% volume discounts
  - Superior quality, lower rates
  - Pay per project, no fees
CTA: "View Agency Solutions" → /for-agencies
Trust: "Trusted by several leading GOVCON agencies"
```

**Section 4: How It Works**
```
Component: ProcessSteps
3 Phases:
  1. Strategic Intelligence: "We diagnose the real problem"
  2. AI-Powered Execution: "AI handles 80-90% of work"
  3. Expert Refinement: "Humans ensure strategic excellence"
Visual: Icons or illustrations for each phase
```

**Section 5: Why Different**
```
Component: CompetitiveDifferentiation
3 Columns:
  - "AI-Only Competitors": Generic output, no strategy
  - "Traditional Firms": Expensive, slow, all-human
  - "Aliff Services": Strategic thinking + AI efficiency
Messaging: "Beat AI commodity competitors"
```

**Section 6: Metrics Section**
```
Component: MetricsDisplay
Animated counters on scroll:
  - 22% win rate (vs 4% industry average)
  - 5-7 day turnaround
  - 20+ years combined expertise
  - [Other relevant metrics]
```

**Section 7: Case Study Preview**
```
Component: CaseStudyPreview
2-3 anonymized case studies
Format: Challenge → Solution → Result
Metrics-driven, no generic testimonials
CTA: "View More Case Studies"
```

**Section 8: Final CTA**
```
Component: FinalCTA
Headline: "Ready to Win More?"
Subhead: "Get strategic analysis of your next solicitation"
Primary CTA: "Get Started"
Secondary CTA: "Schedule Consultation"
```

**Technical Requirements:**
- Rotating hero uses Framer Motion for smooth transitions
- Lazy load content below fold
- Optimize all images (Next.js Image)
- Target: < 2s load time, > 90 Lighthouse

---

### 2. For Agencies Page

**URL:** `/for-agencies`

**Sections:**

**Hero:**
- Headline: "Your Agency Wins More. Delivers Faster. Without Adding Headcount."
- Subhead: "White-label our services. Keep client relationships. Scale unlimited."
- CTA: "Schedule Agency Demo"

**Problem/Solution:**
- Agency pain points (hiring lag, capacity constraints, margin pressure)
- How Aliff solves (elastic capacity, volume discounts, quality maintained)

**Volume Pricing (Visual Only):**
- "Volume discounts available" (NO specific percentages publicly)
- "Pay per project, no platform fees"
- CTA to discuss custom pricing

**White-Label Features:**
- Your branding, your client relationship
- Seamless delivery as if your team produced
- No Aliff visibility to end clients

**Agency Dashboard Preview:**
- Multi-client management
- Project tracking
- Usage analytics
- (Defer actual dashboard to platform development)

**ROI Messaging:**
- "Deliver 10 proposals simultaneously without hiring"
- "Maintain margins while offering competitive pricing"
- Cost comparison: Aliff vs Hiring vs Freelancers

**Case Studies (Anonymized):**
- "Large DC-area Agency" increased capacity 3x
- "Mid-sized GOVCON Firm" expanded service offerings
- (Real examples when available, placeholder until then)

**FAQ Section:**
- How white-labeling works
- Onboarding process
- Quality guarantees
- Volume tiers
- Payment terms (Net-30 with card on file - NOT stated publicly)

**CTA:**
- "Schedule Agency Partnership Discussion"

---

### 3. Service Landing Pages (4 Pages)

**URLs:**
- `/services/govcon`
- `/services/sled`
- `/services/writing`
- `/services/it`

**Template Structure (Reusable):**

**Hero:**
- Service-specific headline
- Key value prop
- Primary CTA: "Get Started" or "View Services"

**Service List:**
- GOVCON/SLED: 8 services listed with brief descriptions
- Writing: 6 categories
- IT: 2 core services
- Each links to individual service page (Phase 2)

**Three-Phase Process:**
- Strategic Intelligence → AI Execution → Expert Refinement
- Customized explanation per service category

**Differentiators:**
- Why Aliff vs. competitors for this specific service
- "Beat AI commodity [proposals/code/content]"

**Pricing CTA:**
- "Get Custom Quote" (no pricing displayed)
- Route to contact form pre-filled with service category

**Case Studies:**
- Service-specific examples
- Metrics-driven results

---

### 4. Contact Page

**URL:** `/contact`

**Form Fields:**
```
Name: [text]
Email: [email]
Company: [text]
I am interested in:
  - GOVCON Services
  - SLED Services
  - IT Services
  - Writing Services
  - Agency Partnership (B2B)
  - Other
Message: [textarea]
[Submit Button]
```

**Lead Qualification:**
- Form submission routes to appropriate workflow
- Agency inquiries flagged for B2B team
- Contractor inquiries routed to service-specific follow-up

**Alternative Contact:**
- Email: contact@aliffservices.com (or similar)
- Office location (if applicable)
- Business hours

**Response Expectation:**
- "We'll respond within 24 hours"

---

### 5. About Page

**URL:** `/about`

**Sections:**

**Company Story:**
- Mission: "Beat AI commoditization with strategic thinking"
- Problem: Generic AI outputs flooding market
- Solution: Human strategy + AI execution
- (WITHOUT revealing proprietary SDL methodology or training data strategy)

**Team Credentials:**
- Former contracting officers (20+ years)
- Senior capture managers
- Domain experts
- (No cheesy headshots unless professional photos available)
- Emphasis: "Expertise that AI cannot replicate"

**Approach:**
- Strategic differentiation philosophy
- Quality standards
- Commitment to "best in the world" (not #2)

**Trust Signals:**
- Years combined experience
- Success metrics
- Client satisfaction
- (Compliance/security badges if applicable)

**CTA:**
- "Work With Us"
- "Join Our Team" (link to careers if Phase 4 ready)

---

## Performance Requirements

**Target Metrics:**
- First Contentful Paint: < 1.2s
- Largest Contentful Paint: < 2.0s
- Time to Interactive: < 2.5s
- Cumulative Layout Shift: < 0.1
- Lighthouse Performance: > 90
- Lighthouse Accessibility: > 95
- Lighthouse Best Practices: > 95
- Lighthouse SEO: > 95

**Optimization Strategies:**
- Next.js Image component for all images
- Lazy loading below-the-fold content
- Code splitting by route
- Font optimization (preload, font-display: swap)
- Minimize JavaScript bundle size
- Tailwind purge unused CSS
- No blocking third-party scripts

---

## SEO Strategy

**On-Page SEO:**
- Semantic HTML structure
- Proper heading hierarchy (H1 → H2 → H3)
- Meta titles optimized per page
- Meta descriptions compelling and keyword-rich
- Open Graph tags for social sharing
- Schema.org markup for services

**Technical SEO:**
- sitemap.xml generated
- robots.txt configured
- Canonical URLs
- Clean URL structure
- Fast page speed (ranking factor)

**Content SEO:**
- Keyword research for GOVCON, SLED, IT, Writing services
- Service pages optimized for search intent
- Internal linking strategy
- Alt text for all images

---

## Responsive Design

**Breakpoints:**
```css
/* Mobile first approach */
xs: 320px   (base)
sm: 640px   (large phones)
md: 768px   (tablets)
lg: 1024px  (laptops)
xl: 1280px  (desktops)
2xl: 1536px (large screens)
```

**Testing Devices:**
- iPhone SE (320px)
- iPhone 12/13/14 (390px)
- iPad (768px)
- iPad Pro (1024px)
- MacBook (1440px)
- Desktop (1920px)

---

## Accessibility (WCAG 2.1 AA)

**Requirements:**
- Keyboard navigation throughout
- Focus indicators visible
- Color contrast ratios meet AA standards (4.5:1 text, 3:1 UI)
- Alt text for all images
- ARIA labels where needed
- Screen reader friendly
- No autoplay videos with sound
- Forms with proper labels and error messages

---

## Analytics & Tracking

**Events to Track:**
- Page views per section
- CTA clicks (primary vs secondary)
- Service selector card clicks
- For Agencies page visits (critical B2B metric)
- Contact form submissions by service type
- Agency inquiry submissions
- Rotating hero interaction (manual navigation)
- Case study views
- External link clicks

---

## Development Workflow

**Branch Strategy:**
```
main (production)
  └── develop (integration)
      └── feature/homepage-hero
      └── feature/navigation
      └── feature/for-agencies-page
      etc.
```

**Development Process:**
1. Design system components built first
2. Page components built using design system
3. Content integration
4. Performance optimization
5. Testing (functionality, performance, accessibility)
6. Review and iterate
7. Merge to develop
8. Deploy to staging
9. Final review
10. Deploy to production

---

## Testing Checklist

**Functionality Testing:**
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] Service selector cards route properly
- [ ] Rotating hero transitions smoothly
- [ ] CTAs trigger expected actions
- [ ] Mobile menu functions
- [ ] Dropdowns work on hover and click

**Performance Testing:**
- [ ] Lighthouse audit passes all targets
- [ ] WebPageTest analysis
- [ ] Real device testing (mobile, tablet, desktop)
- [ ] Network throttling test (3G, 4G)

**Accessibility Testing:**
- [ ] Keyboard navigation complete
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Color contrast validation
- [ ] WAVE accessibility checker
- [ ] axe DevTools audit

**Cross-Browser Testing:**
- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Safari (Mac and iOS)
- [ ] Edge
- [ ] Samsung Internet (Android)

**Content Review:**
- [ ] Copy proofread (no typos)
- [ ] Messaging consistent with brand voice
- [ ] No prohibited language ("cheap offshore", specific agency names, etc.)
- [ ] All CTAs clear and compelling
- [ ] Metrics accurate

---

## Launch Checklist

**Pre-Launch:**
- [ ] All Phase 1 pages complete
- [ ] Performance targets met
- [ ] Accessibility compliance verified
- [ ] SEO elements in place
- [ ] Analytics configured
- [ ] Forms tested and working
- [ ] Mobile responsive across devices
- [ ] Cross-browser compatibility confirmed
- [ ] Staging environment tested
- [ ] Content final review
- [ ] Legal pages in place (Privacy, Terms)

**Launch:**
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Deploy to production
- [ ] Smoke test production
- [ ] Monitor analytics for issues
- [ ] Monitor performance
- [ ] Monitor error logs

**Post-Launch:**
- [ ] Announce launch
- [ ] Submit sitemap to search engines
- [ ] Monitor conversion rates
- [ ] Collect user feedback
- [ ] Plan Phase 2 enhancements

---

## Phase 2 Preview (Future)

**Not in MVP, but planned:**
- Individual service pages (8 GOVCON, 8 SLED, 6 Writing, 2 IT = 24 pages)
- SDL public-facing page
- ROI calculator for agencies
- Blog/resources section
- Interactive elements (chatbot)
- Case studies database
- Careers/talent acquisition pages
- ATS integration

---

## Success Metrics

**Launch Targets:**
- Site live and functional
- < 2s average page load
- > 90 Lighthouse score
- Zero critical accessibility issues
- Forms capturing leads successfully
- Analytics tracking correctly

**Post-Launch Targets (30 days):**
- Conversion rate baseline established
- Traffic sources identified
- Most popular services identified
- Agency inquiry rate (B2B priority)
- Contact form completion rate
- Bounce rate < 60%
- Average session duration > 2 minutes

---

## Current Status: READY TO BUILD

**Next Immediate Steps:**
1. **Finalize design decisions** (color palette approval)
2. **Set up component library structure**
3. **Build RotatingHero component** (most complex, sets pattern)
4. **Implement new homepage**
5. **Iterate through remaining pages**

**Timeline Estimate:**
- Design System + Components: 3-5 days
- Homepage: 3-4 days
- For Agencies Page: 2-3 days
- Service Landing Pages: 2-3 days
- Contact + About: 2-3 days
- Polish + Testing: 3-4 days
- **Total: ~3-4 weeks for Phase 1 MVP**

---

**Ready to start building. Awaiting final design approval to proceed.**
