# Design System

> **Single source of truth** for ScoreKit's visual language, theming architecture, and multi-brand support.

---

## Principles

1. **Token-first** — All visual properties defined as CSS custom properties
2. **Theme-able** — Switch entire visual identity by changing one import
3. **Brand-ready** — Logo slots, color overrides, and typography per client
4. **Premium defaults** — High-end consultancy aesthetic out of the box
5. **Consistent** — Components use tokens, never hardcoded values

---

## Architecture

```text
apps/web/src/
├── styles/
│   ├── tokens/
│   │   ├── base.css           # Shared tokens (spacing, radius, shadows)
│   │   ├── typography.css     # Font stacks, sizes, weights
│   │   └── animations.css     # Transitions, motion
│   ├── themes/
│   │   ├── default.css        # ScoreKit default theme
│   │   ├── accelerator.css    # AI Product Accelerator brand
│   │   └── [client].css       # Future client themes
│   └── globals.css            # Entry point, imports active theme
├── components/
│   ├── ui/                    # Primitive components (Button, Card, Input)
│   └── brand/
│       ├── BrandHeader.tsx    # Logo + navigation slot
│       └── BrandFooter.tsx    # Footer with brand attribution
└── app/
    └── layout.tsx             # Applies theme class to <html>
```

---

## Token Categories

### 1. Color Tokens

```css
:root {
  /* Brand colors */
  --color-primary: #0D4F4F;           /* Main brand color */
  --color-primary-hover: #0A3D3D;     /* Darker for hover states */
  --color-accent: #B45309;            /* CTA, highlights (use sparingly) */
  --color-accent-hover: #92400E;

  /* Neutrals (warm palette) */
  --color-background: #FAF9F7;        /* Page background */
  --color-surface: #FFFFFF;           /* Cards, elevated surfaces */
  --color-surface-elevated: #FFFFFF;  /* Modals, dropdowns */
  --color-border: #E7E5E4;            /* Subtle borders */
  --color-border-strong: #D6D3D1;     /* Emphasized borders */

  /* Text */
  --color-text-primary: #1C1917;      /* Headlines, primary text */
  --color-text-secondary: #57534E;    /* Body text, descriptions */
  --color-text-muted: #A8A29E;        /* Captions, placeholders */
  --color-text-inverse: #FAFAF9;      /* Text on dark backgrounds */

  /* Semantic */
  --color-success: #15803D;
  --color-warning: #B45309;
  --color-error: #DC2626;
  --color-info: #0369A1;

  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #1C1917 0%, #292524 100%);
  --gradient-subtle: linear-gradient(180deg, var(--color-background) 0%, #F5F5F4 100%);
}
```

### 2. Typography Tokens

```css
:root {
  /* Font families */
  --font-heading: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Font sizes (fluid scale) */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */

  /* Font weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Letter spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}
```

### 3. Spacing Tokens

```css
:root {
  /* Spacing scale (4px base) */
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */

  /* Container widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-prose: 65ch;  /* Optimal reading width */
}
```

### 4. Shape Tokens

```css
:root {
  /* Border radius */
  --radius-sm: 0.25rem;    /* 4px - subtle rounding */
  --radius-md: 0.5rem;     /* 8px - buttons, inputs */
  --radius-lg: 0.75rem;    /* 12px - cards */
  --radius-xl: 1rem;       /* 16px - modals, large cards */
  --radius-2xl: 1.5rem;    /* 24px - hero sections */
  --radius-full: 9999px;   /* Pills, avatars */

  /* Shadows (subtle, not drop-shadow heavy) */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05);

  /* Borders */
  --border-width: 1px;
  --border-style: solid;
}
```

### 5. Motion Tokens

```css
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;

  /* Easings */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## Theme Structure

Each theme overrides the base tokens. Themes are mutually exclusive.

### Theme File Template

```css
/* themes/[theme-name].css */

/* Import base tokens */
@import '../tokens/base.css';
@import '../tokens/typography.css';
@import '../tokens/animations.css';

:root {
  /* Brand identity */
  --brand-name: 'Theme Name';
  --brand-logo: url('/logos/theme-logo.svg');
  --brand-logo-height: 32px;

  /* Override colors */
  --color-primary: #...;
  --color-accent: #...;

  /* Override typography (optional) */
  --font-heading: 'Custom Font', serif;
}
```

### Current Themes

| Theme | Use Case | Primary Color | Font Stack |
|-------|----------|---------------|------------|
| `default` | ScoreKit branding | Deep teal `#0D4F4F` | Fraunces + Inter |
| `accelerator` | AI Product Accelerator | TBD (from brand guide) | TBD |

---

## Brand Slots

### Logo Placement

```tsx
// components/brand/BrandHeader.tsx

export function BrandHeader() {
  return (
    <header className="brand-header">
      <img 
        src="var(--brand-logo)" 
        alt="var(--brand-name)"
        style={{ height: 'var(--brand-logo-height)' }}
      />
    </header>
  );
}
```

**Logo requirements**:
- SVG preferred (scalable, themeable)
- Horizontal lockup, max height 40px
- Provide light and dark variants

### Footer Attribution

```tsx
// components/brand/BrandFooter.tsx

export function BrandFooter() {
  return (
    <footer className="brand-footer">
      <p>Powered by ScoreKit</p>  {/* Optional, depends on white-label tier */}
    </footer>
  );
}
```

---

## Component Patterns

### Using Tokens in Components

**✅ Correct** — Use CSS variables:
```tsx
<button className="bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
  Submit
</button>
```

**✅ Better** — Use Tailwind with extended theme:
```tsx
<button className="bg-primary text-inverse">
  Submit
</button>
```

**❌ Wrong** — Hardcoded values:
```tsx
<button className="bg-indigo-600 text-white">
  Submit
</button>
```

### Tailwind Integration

Extend Tailwind to use our tokens:

```css
/* globals.css */
@theme {
  --color-primary: var(--color-primary);
  --color-accent: var(--color-accent);
  --color-background: var(--color-background);
  --color-surface: var(--color-surface);
  --color-text-primary: var(--color-text-primary);
  --color-text-secondary: var(--color-text-secondary);
  /* ... */
}
```

Now you can use `bg-primary`, `text-secondary`, etc.

---

## Visual Refinements

### Texture & Depth

**Background noise** — Adds tactile quality:
```css
.textured-bg {
  background-color: var(--color-background);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-blend-mode: overlay;
  background-size: 200px 200px;
}
```

**Subtle gradients** — Warm to neutral:
```css
.hero-gradient {
  background: var(--gradient-hero);
}
```

**Border instead of shadow** — More refined:
```css
.card {
  background: var(--color-surface);
  border: var(--border-width) var(--border-style) var(--color-border);
  border-radius: var(--radius-lg);
}
```

### Typography Hierarchy

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| H1 (hero) | Heading | 48px | Bold | Primary |
| H2 (section) | Heading | 30px | Semibold | Primary |
| H3 (card) | Heading | 20px | Semibold | Primary |
| Body | Body | 16px | Normal | Secondary |
| Caption | Body | 14px | Normal | Muted |
| Label | Body | 14px | Medium | Secondary |
| Button | Body | 16px | Semibold | Inverse |

---

## Switching Themes

### Build-time (current approach)

Change import in `globals.css`:
```css
/* Use default theme */
@import './themes/default.css';

/* Or use accelerator theme */
/* @import './themes/accelerator.css'; */
```

### Runtime (future enhancement)

Use data attribute on `<html>`:
```tsx
// layout.tsx
<html data-theme={theme}>
```

```css
/* Theme-specific overrides */
[data-theme="accelerator"] {
  --color-primary: #...;
}
```

### URL-based (for demos)

```tsx
// Read from query param
const theme = searchParams.get('theme') || 'default';
```

---

## Adding a New Theme

1. **Create theme file**: `styles/themes/[client].css`
2. **Copy from template**: Start with `default.css`
3. **Override tokens**: Update colors, fonts, logo
4. **Add logo**: Place in `public/logos/[client].svg`
5. **Test**: Switch import in `globals.css`
6. **Document**: Add to theme table above

---

## Checklist for New Brands

- [ ] Primary color (hex)
- [ ] Accent color (hex, optional)
- [ ] Logo (SVG, horizontal, light + dark variants)
- [ ] Heading font (Google Fonts or custom)
- [ ] Body font (Google Fonts or custom)
- [ ] Any specific UI preferences

---

## Related Documents

- [BRAND-GUIDELINES.md](./BRAND-GUIDELINES.md) — Logo usage, voice
- [COPY-VOICE.md](./COPY-VOICE.md) — Writing style
- [CONTENT-STRUCTURE.md](../01-product/CONTENT-STRUCTURE.md) — Template content system

---

## Revision History

| Date | Change |
|------|--------|
| 2025-12-16 | Initial design system architecture |
