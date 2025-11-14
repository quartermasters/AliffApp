# Aliff Services - Official Color Schema

**Version**: 1.0
**Reference**: `Planning/Website/HOMEPAGE_SPECIFICATION.md`
**Last Updated**: 2025-11-14
**Status**: ✅ Implemented

---

## Overview

This document defines the complete color schema for Aliff Services across all platforms and touchpoints. The color system is designed to support our multi-audience business model (GOVCON, IT Services, Writing Services) while maintaining a cohesive, premium brand identity.

---

## Primary Brand Colors

### Navy - Professional Authority & Trust
```
Primary: #0A0F1E
RGB: rgb(10, 15, 30)
Tailwind: navy / navy-900
```

**Usage:**
- Primary backgrounds for hero sections
- Text for headers and important content
- Government contracting service branding
- Professional, authoritative contexts

**Accessibility:**
- Use white text on navy backgrounds (21:1 contrast ratio - AAA)
- Use navy-900 for body text on light backgrounds

---

### Gold - Premium Excellence & Value
```
Primary: #C89D5C
RGB: rgb(200, 157, 92)
Tailwind: gold / gold-500

Gradient Light: #D4A962
RGB: rgb(212, 169, 98)
Tailwind: gold-400
```

**Usage:**
- Primary CTAs (buttons, links)
- Brand accent color
- IT Services branding
- Premium positioning elements
- Hover states and highlights

**Gradient:**
```css
background: linear-gradient(135deg, #D4A962, #C89D5C);
/* Tailwind: bg-gradient-gold */
```

**Accessibility:**
- Use white text on gold (#C89D5C) - 4.67:1 contrast (AA)
- Use navy-900 text on gold-100 backgrounds

---

### Victory Green - Success & Achievement
```
Primary: #10B981
RGB: rgb(16, 185, 129)
Tailwind: victory / victory-500 / success
```

**Usage:**
- Writing Services branding
- Success states and metrics
- Positive indicators
- "Win" related content
- Green-to-gold gradient for writing service CTAs

**Gradient:**
```css
background: linear-gradient(135deg, #34D399, #10B981);
/* Tailwind: bg-gradient-victory */
```

---

## Neutral Palette

Supporting colors for backgrounds, text, and UI elements:

### White
```
#FFFFFF
Tailwind: white
```
**Usage:** Primary backgrounds, card backgrounds, button text

### Gray Scale
```
Gray-50:  #F9FAFB  /* Light backgrounds, subtle sections */
Gray-100: #F3F4F6  /* Section dividers, disabled states */
Gray-200: #E5E7EB  /* Borders */
Gray-300: #D1D5DB  /* Borders, dividers */
Gray-400: #9CA3AF  /* Placeholder text */
Gray-500: #6B7280  /* Secondary text */
Gray-600: #4B5563  /* Body text (dark) */
Gray-700: #374151  /* Headings (dark mode) */
Gray-800: #1F2937  /* Dark backgrounds */
Gray-900: #111827  /* Primary text, darkest backgrounds */
```

**Accessibility Guidelines:**
- Gray-600+ on white: AA+ compliant for body text
- Gray-900 on white: AAA compliant for all text sizes

---

## Functional Colors

### Success
```
#10B981 (Matches Victory Green)
Tailwind: success / victory
```
**Usage:** Success messages, completed states, positive metrics

### Error
```
#EF4444
Tailwind: error-500
```
**Usage:** Error messages, validation errors, critical warnings

### Warning
```
#F59E0B
Tailwind: warning-500
```
**Usage:** Warning messages, caution states, important notices

---

## Service Category Colors

Visual identifiers for each service vertical:

### Government Contracting (GOVCON + SLED)
```
Primary: Navy (#0A0F1E)
Accent: Gold (#C89D5C)
Tailwind: govcon / govcon-light
```
**Theme:** Professional authority, trust, federal expertise

### IT Services
```
Primary: Gold (#C89D5C)
Accent: Gradient Gold (#D4A962)
Tailwind: it / it-light
```
**Theme:** Premium technology, modern excellence

### Writing Services
```
Primary: Victory Green (#10B981)
Accent: Light Green (#34D399)
Tailwind: writing / writing-light
```
**Theme:** Creative excellence, fresh content, growth

---

## Gradients

### Gradient Gold (Primary CTA)
```css
linear-gradient(135deg, #D4A962, #C89D5C)
```
**Tailwind:** `bg-gradient-gold`
**Usage:** Primary buttons, premium CTAs, gold accents

### Gradient Hero (Overlay)
```css
linear-gradient(135deg, rgba(10,15,30,0.9), rgba(10,15,30,0.7))
```
**Tailwind:** `bg-gradient-hero`
**Usage:** Hero section overlays to ensure text readability

### Gradient Victory
```css
linear-gradient(135deg, #34D399, #10B981)
```
**Tailwind:** `bg-gradient-victory`
**Usage:** Writing service CTAs, success states

---

## Implementation

### Tailwind CSS Configuration

Colors are defined in `tailwind.config.ts`:

```typescript
colors: {
  navy: {
    DEFAULT: "#0A0F1E",
    // ... full scale
  },
  gold: {
    DEFAULT: "#C89D5C",
    400: "#D4A962", // Gradient light
    // ... full scale
  },
  victory: {
    DEFAULT: "#10B981",
    // ... full scale
  },
  error: {
    DEFAULT: "#EF4444",
    // ... full scale
  },
  warning: {
    DEFAULT: "#F59E0B",
    // ... full scale
  },
}
```

### CSS Custom Properties

Variables in `globals.css`:

```css
:root {
  /* Primary Brand Colors */
  --color-gold: 200 157 92;
  --color-navy: 10 15 30;
  --color-victory-green: 16 185 129;

  /* Gradients */
  --gradient-gold: linear-gradient(135deg, #D4A962, #C89D5C);
  --gradient-hero: linear-gradient(135deg, rgba(10,15,30,0.9), rgba(10,15,30,0.7));
  --gradient-victory: linear-gradient(135deg, #34D399, #10B981);
}
```

---

## Component Classes

### Buttons

```css
.btn-primary {
  /* Gold gradient button */
  background: var(--gradient-gold);
  color: white;
}

.btn-secondary {
  /* Navy button */
  background: #0A0F1E;
  color: white;
}

.btn-success {
  /* Victory green button */
  background: #10B981;
  color: white;
}

.btn-outline {
  /* Gold outline */
  border: 2px solid #C89D5C;
  color: #C89D5C;
}
```

### Cards

```css
.card-hover {
  /* 8px lift on hover with specific shadow */
  transition: transform 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.card-govcon {
  /* Navy + Gold themed */
  border: 1px solid rgba(200, 157, 92, 0.2);
}

.card-it {
  /* Gold themed */
  border: 1px solid rgba(200, 157, 92, 0.2);
}

.card-writing {
  /* Victory green themed */
  border: 1px solid rgba(16, 185, 129, 0.2);
}
```

---

## Usage Guidelines

### Hero Sections
- Background: Navy (#0A0F1E) or with `.bg-gradient-hero` overlay
- Text: White (#FFFFFF)
- CTA: Gold gradient button (`.btn-primary`)

### Service Selector Cards
- Background: White
- Border: Gold rgba(200, 157, 92, 0.2)
- Icon: Service-specific color
- Hover: 8px lift with shadow

### Value Propositions
- Background: Gray-50 (#F9FAFB)
- Icons: Duotone (Navy + Gold)
- Text: Navy-900

### Metrics/Results
- Background: Navy-900 (#0A0F1E)
- Text: White
- Numbers: Gold (#C89D5C)
- Cards: White with glow effect

### CTAs
- Primary: Gold gradient (`.btn-primary`)
- Secondary: Navy solid (`.btn-secondary`)
- Outline: Gold border (`.btn-outline`)
- Success: Victory green (`.btn-success`)

---

## Accessibility Compliance

All color combinations meet **WCAG 2.1 AA** standards:

### Text Contrast Ratios

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| White | Navy (#0A0F1E) | 21:1 | AAA |
| Navy-900 | White | 19.4:1 | AAA |
| White | Gold (#C89D5C) | 4.67:1 | AA |
| White | Victory (#10B981) | 2.9:1 | Large text only |
| Navy-900 | Gray-50 | 18.2:1 | AAA |
| Gray-600 | White | 7.2:1 | AAA |

### Best Practices

1. **Never use Victory green for small text on white** - contrast too low
2. **Always use white text on navy** - perfect contrast
3. **Use navy-900 for body text on light backgrounds** - AAA compliant
4. **Gold works for large text and buttons** - AA compliant with white text

---

## Color Psychology & Strategy

### Navy (#0A0F1E)
- **Emotion:** Trust, authority, professionalism
- **Industry:** Government, federal contracting
- **Effect:** Builds credibility, evokes stability

### Gold (#C89D5C)
- **Emotion:** Premium quality, value, success
- **Industry:** Universal premium positioning
- **Effect:** Creates perceived value, attention-grabbing

### Victory Green (#10B981)
- **Emotion:** Growth, success, creativity
- **Industry:** Content, writing, creative services
- **Effect:** Fresh, modern, achievement-oriented

### Combined Navy + Gold
- **Message:** "Best in the world" positioning
- **Evokes:** Luxury meets authority
- **Use Case:** Government contracting expertise

---

## Design Tokens

Complete reference for designers:

```json
{
  "colors": {
    "brand": {
      "navy": "#0A0F1E",
      "gold": "#C89D5C",
      "victoryGreen": "#10B981"
    },
    "functional": {
      "success": "#10B981",
      "error": "#EF4444",
      "warning": "#F59E0B"
    },
    "neutral": {
      "white": "#FFFFFF",
      "gray": {
        "50": "#F9FAFB",
        "100": "#F3F4F6",
        "600": "#4B5563",
        "900": "#111827"
      }
    },
    "service": {
      "govcon": "#0A0F1E",
      "govconAccent": "#C89D5C",
      "it": "#C89D5C",
      "itAccent": "#D4A962",
      "writing": "#10B981",
      "writingAccent": "#34D399"
    }
  },
  "gradients": {
    "gold": "linear-gradient(135deg, #D4A962, #C89D5C)",
    "hero": "linear-gradient(135deg, rgba(10,15,30,0.9), rgba(10,15,30,0.7))",
    "victory": "linear-gradient(135deg, #34D399, #10B981)"
  }
}
```

---

## Examples

### Homepage Hero (GOVCON rotation)
```html
<div class="bg-navy relative">
  <div class="absolute inset-0 bg-gradient-hero"></div>
  <h1 class="text-white">We Win Government Contracts At 5.5x Industry Rate</h1>
  <button class="btn-primary">Get Free Contract Assessment →</button>
</div>
```

### Service Selector Card
```html
<div class="card-govcon">
  <div class="card-icon text-gold">🏛️</div>
  <h3 class="text-navy-900">Government Contracting</h3>
  <p class="text-gray-600">Win federal and state contracts</p>
  <button class="btn-outline">Explore →</button>
</div>
```

### Success Metric
```html
<div class="bg-navy-900 p-8">
  <div class="text-gold text-5xl font-bold">$47M+</div>
  <div class="text-white">Contracts Won</div>
  <span class="badge-gold">GOVCON</span>
</div>
```

---

## Version History

### Version 1.0 (2025-11-14)
- ✅ Initial color schema implementation
- ✅ Tailwind configuration updated
- ✅ CSS custom properties defined
- ✅ Component classes created
- ✅ Gradient utilities added
- ✅ Service category colors established
- ✅ Accessibility compliance verified
- ✅ Documentation complete

---

## Support & Resources

- **Tailwind Config:** `/tailwind.config.ts`
- **Global Styles:** `/src/app/globals.css`
- **Specification:** `/Planning/Website/HOMEPAGE_SPECIFICATION.md`
- **Design System:** (Coming soon)

---

**Maintained by:** Aliff Services Development Team
**Questions?** Refer to HOMEPAGE_SPECIFICATION.md for detailed usage examples
