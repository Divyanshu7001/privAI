---
name: privAI Design System
description: Modern visual identity adapted from Xenity Health Dashboard and guided by the Quiet Shield principle.
colors:
  primary: "#6e52f6"
  secondary: "#0ea5e9"
  neutral-bg: "#020617"
  neutral-card: "#0f172a"
  neutral-border: "#1e293b"
  text-primary: "#f8fafc"
  text-secondary: "#94a3b8"
  success: "#10b981"
  warning: "#f59e0b"
  danger: "#ef4444"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#5b3fe0"
  card:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
---

# Design System: privAI

## 1. Overview

**Creative North Star: "The Quiet Shield"**

The privAI visual system is a minimalist, developer-grade dark interface designed to evoke absolute security and reassuring utility. The design architecture is directly adapted from the layout structure of clean healthcare analytics systems (specifically drawing inspiration from the structured card grids and spatial division of the Xenity Dashboard) but re-imagined as a highly focused dark utility.

It operates as an unobtrusive assistant. The system remains dark and calm, utilizing vibrant violet and cyan accents for telemetry and state indicators. Primary controls are highly visible, and alert/status states introduce visual prominence only when critical PII data leaks are imminent.

### Key Characteristics:
- **Spatial Order**: Defined sidebar navigation, consistent layout gaps (16px/24px), and clear grid divisions.
- **Vibrant Accent Strategy**: Neutral dark surfaces punctuated by a single deep purple/violet primary color and sky-blue telemetry indicators.
- **Tactile Shapes**: Highly curved panels (16px) with clean borders (1px) that frame information without causing visual clutter.
- **Diagnostic Badges**: Semi-bold status signals that frame state conditions cleanly.

## 2. Colors

The palette is composed of deep slate-gray foundations paired with vibrant violet and cyan accents to represent telemetry data and system configurations.

### Primary
- **Active Violet** (#6e52f6): Used for primary interactive actions, selected navigation items, and critical focus borders.

### Secondary
- **Telemetry Sky** (#0ea5e9): Used for secondary data states, non-critical metrics, and supporting chart lines.

### Neutral
- **Deep Void** (#020617): The main canvas/page background.
- **Surface Card** (#0f172a): Card elements, panels, tables, and sidebar background.
- **Slate Stroke** (#1e293b): Thin layout boundaries, borders, and input boundaries.
- **Ink Primary** (#f8fafc): High-contrast titles, headers, and active buttons text.
- **Ink Muted** (#94a3b8): Labels, helper descriptions, and secondary metadata.

### Named Rules
**The Rarity Rule.** Vibrant accents (Active Violet and Telemetry Sky) must carry less than 10% of any given screen's area. Accent colors represent intent and interaction, not decoration.

**The Tinted State Rule.** All diagnostic alerts (Success, Warning, Danger) must use high-contrast text overlaying a low-opacity background fill (10–15% opacity of the base hue) to maintain readability without overwhelming the canvas.

## 3. Typography

**Display Font:** Plus Jakarta Sans (with system-ui fallback)
**Body Font:** Plus Jakarta Sans (with system-ui fallback)
**Label/Mono Font:** JetBrains Mono (for code snippets, PII values, and numeric statistics)

### Hierarchy
- **Display** (Extra Bold (800), clamp(2rem, 5vw, 3.5rem), 1.1): Used for large hero landing copy only.
- **Headline** (Bold (700), 1.75rem, 1.25): Dashboard titles, statistics welcome banners.
- **Title** (Semi-Bold (600), 1.25rem, 1.5): Container headers, card group labels.
- **Body** (Regular (400), 0.875rem, 1.6): Paragraph text, description text blocks. Max line length is restricted to 65–75ch.
- **Label** (Semi-Bold (600), 0.75rem, 1.4): Table headers, badge texts, buttons, and uppercase captions.

### Named Rules
**The Monospace PII Rule.** Any raw user data value that is monitored (emails, phone numbers, addresses, composer snippets) must be rendered in JetBrains Mono to clearly distinguish user data inputs from UI navigation controls.

## 4. Elevation

The design utilizes a flat, card-on-canvas architectural style. Depth is established through color contrast (Surface Card placed on Deep Void) and light boundaries rather than standard shadows.

### Shadow Vocabulary
- **Ambient Glow** (`box-shadow: 0 4px 20px rgba(110, 82, 246, 0.08)`): A very soft, low-opacity violet glow used only for primary hovered buttons and active alert items.

### Named Rules
**The Flat Canvas Rule.** Containers and cards are flat at rest. Subtle shadows or ambient glows are exclusively reserved for interactive hover states or triggered danger alerts.

## 5. Components

### Buttons
- **Shape:** Rounded corners (12px / `rounded-md`).
- **Primary:** Active Violet (#6e52f6) background, Ink Primary (#f8fafc) text, font weight 600.
- **Hover / Focus:** Focus ring uses Active Violet offset by 2px against Deep Void. Hover state shifts background color to #5b3fe0.
- **Outline / Ghost:** Border uses Slate Stroke (#1e293b), background is transparent, text is Ink Muted (#94a3b8) shifting to Ink Primary (#f8fafc) on hover.

### Cards / Containers
- **Corner Style:** Highly rounded (16px / `rounded-lg`).
- **Background:** Surface Card (#0f172a).
- **Border:** Thin boundary line (1px, Slate Stroke #1e293b).
- **Internal Padding:** Spacing Large (24px).

### Inputs / Fields
- **Style:** Background Surface Card (#0f172a), border 1px (Slate Stroke #1e293b), rounded 12px. Text uses Ink Primary, placeholders use Slate Stroke.
- **Focus:** Active Violet (#6e52f6) border shift with outline off.

### Status Badges
- **Shape:** Soft rounded corners (6px).
- **Success State:** Text `#10b981`, background `#10b981/15` (15% opacity).
- **Warning State:** Text `#f59e0b`, background `#f59e0b/15` (15% opacity).
- **Danger State:** Text `#ef4444`, background `#ef4444/15` (15% opacity).

## 6. Do's and Don'ts

### Do:
- **Do** wrap every monitored PII value in a monospace tag using JetBrains Mono.
- **Do** default to instant or basic crossfade transitions (duration ≤ 150ms) to respect system motion preferences.
- **Do** maintain a strict 4.5:1 text-to-background contrast ratio on all body descriptions and labels.
- **Do** align the sidebar navigation items vertically, mirroring the Xenity dashboard structure.

### Don't:
- **Don't** use overly bright, multi-colored gradients for panels or cards (avoid the 2023 gradient SaaS style).
- **Don't** use colored side-stripe borders (e.g. `border-left-4`) as accents on cards.
- **Don't** use glassmorphism or blur elements on standard cards—keep backgrounds solid.
- **Don't** animate image overlays or logo elements on hover actions.
