---
name: FighterX
description: Reference-led Silat training and performance platform.
colors:
  background: "#08090B"
  surface: "#17191E"
  elevated: "#202126"
  foreground: "#FFFFFF"
  silver: "#E5E5E7"
  muted: "#C5C6CA"
  subtle: "#96989F"
  primary: "#E10600"
  accent: "#FF3845"
  border: "#45464B"
typography:
  display:
    fontFamily: "Teko, sans-serif"
    fontSize: "clamp(58px, 6.1vw, 88px)"
    fontWeight: 700
    lineHeight: 0.83
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Teko, sans-serif"
    fontWeight: 700
    letterSpacing: "0.015em"
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    letterSpacing: "0.13em"
rounded:
  sm: "6px"
  md: "12px"
  feature: "8px 3px 8px 3px"
  phone: "23px"
  pill: "999px"
spacing:
  unit: "4px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "46px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "46px"
---

# Design System: FighterX

## Overview

**Creative North Star: “Cinematic Silat Performance”**

FighterX follows its approved visual reference: a dark, cinematic sports interface built around real Silat Seni and Silat Olahraga cutouts, crimson light, Malay-inspired textile textures, and clear training information. Teko gives display copy and section headlines a sharp performance voice; supplied calligraphy artwork carries the basmala invocation; Inter keeps body copy and controls readable.

Use the supplied visual assets as independent layers, with charcoal panels and restrained outlines to organize the interface. The approved brand line remains **TRAIN SMARTER. FIGHT STRONGER.** The homepage's primary conversion action is **Register Club**.

**Key Characteristics:**

- Near-black and charcoal surfaces with crimson actions and highlights.
- Independent, proportion-preserving Silat imagery.
- Sharp condensed headlines, a brief Arabic invocation, and readable interface text.
- Mobile layouts retain the same hierarchy and give touch controls room.

## Colors

The palette pairs near-black surfaces and cool silver text with a focused crimson accent.

### Primary
- **Fighter Crimson** (`#E10600`): Primary actions and selected or active emphasis.
- **Hot Crimson** (`#FF3845`): Small highlights, icon strokes, and brighter red details.

### Neutral
- **Night** (`#08090B`): Page background and deepest surface.
- **Charcoal** (`#17191E`): Standard panel surface.
- **Raised Charcoal** (`#202126`): Raised or gradient panel areas.
- **White** (`#FFFFFF`): Highest-priority text and control labels.
- **Silver** (`#E5E5E7`): Supporting high-contrast copy.
- **Muted Silver** (`#C5C6CA`): Body and secondary copy.
- **Subtle Gray** (`#96989F`): Low-priority text only where contrast remains readable.
- **Outline Gray** (`#45464B`): Panel borders and dividers.

**The Accent Restraint Rule.** Keep crimson on actions, active states, and small visual accents; do not turn every surface into a red glow.

## Typography

**Display Font:** Teko (sans-serif fallback)  
**Body Font:** Inter (with Arial, sans-serif fallbacks)

**Character:** Teko carries sharp athletic headlines; the supplied Arabic artwork is reserved for the basmala; Inter carries longer copy and controls.
Section headings stand on their own without a duplicate category eyebrow. Motion carries the hierarchy instead of adding more labels.

### Hierarchy
- **Display** (800, responsive 50–76px, 0.88 line-height): Homepage hero statement; italic emphasis is used for the high-impact line.
- **Headline** (700–800, about 23–29px, tight line-height): Section headings and access-page titles.
- **Title** (600–700, about 12–19px): Feature, workflow, and programme labels.
- **Body** (400, 11–15px, about 1.5 line-height): Descriptions, forms, and explanatory copy.
- **Label** (700, 10–12px, tracked): Eyebrows, navigation, and compact control text. Use uppercase selectively.

## Layout

Desktop uses a centered, wide content area with a minimal horizontal header containing the wordmark, Homepage, Guidelines, Sign In, and Register Club. Multi-column feature, workflow, and programme sections provide the relevant product detail without a jump-link menu. At 1100px and below, gutters and columns tighten; at 760px and below, multi-column sections stack, the header actions remain visible, and phone previews move into the document flow. At 380px and below, hero type and feature items shrink further to fit narrow screens.

The CSS uses a 4px spacing base. Preserve clear separation between sections, compact density within information panels, and a readable line length for body copy. Keep primary copy and calls to action clear of athlete faces when art-directing responsive imagery.

## Elevation & Depth

Depth is mostly tonal: near-black page backgrounds, charcoal panels, thin outlines, gradients, and layered photography do the structural work. Shadows are reserved for a few raised elements such as primary buttons, access panels, and the illustrative phone previews; avoid adding ambient glow to every card.

## Shapes

Controls use compact 5–6px corners, content panels use about 12px, and phone frames use a larger 23px radius. Feature icons have a deliberately clipped/skewed silhouette. Use thin neutral outlines to define panels; keep diagonal light cuts and clipped forms as small accents rather than the default shape of every component.

## Components

### Buttons
- **Shape:** Compact 6px corner radius; minimum height 46px for standard actions.
- **Primary:** White bold label on a crimson gradient, with a restrained red shadow; desktop header variant is shorter.
- **Hover / Focus:** Hover lifts by 2px and brightens the fill; keyboard focus uses a visible 3px light-red outline with offset.
- **Secondary:** Transparent dark fill with a light neutral outline; hover shifts to a lighter charcoal surface.

### Inputs / Fields
- **Style:** Dark fill, 1px gray outline, 5px radius, and 45px minimum height.
- **Focus:** Use the shared visible keyboard-focus outline; preserve a clear contrast against the dark surface.
- **Labels:** Keep explicit labels above fields; placeholders are secondary and must not replace labels.

### Cards / Containers
- **Corner Style:** Main programme and access panels use 12px; workflow panels use a lightly clipped 8px form.
- **Background:** Charcoal or a subtle dark gradient.
- **Border:** Thin gray outline; crimson appears as a local edge, icon, or title highlight.
- **Internal Padding:** Compact, responsive padding; access panels reduce padding on mobile.

### Navigation
- **Desktop:** Keep the wordmark, Homepage, Guidelines, Sign In, and Register Club aligned in one header row.
- **Mobile:** Keep the wordmark on the left and a compact hamburger control on the right. Reveal Homepage, Guidelines, Sign In, and Register Club only when the menu opens; avoid a permanent second navigation row.

### Motion
- **Focal sequence:** Reveal the hero headline word by word while the two athlete cutouts enter together, so typography and people share one authored arrival.
- **Continuity:** Section headings reveal by word; feature, workflow, and programme groups stagger by item so the page hierarchy stays clear.
- **Feedback:** Buttons and expandable FAQ rows use short transitions. Respect `prefers-reduced-motion` and keep content visible without JavaScript.
- **Budget:** Trigger each scroll reveal once, animate transforms and opacity only, and avoid continuous ambient loops.

### Phone Preview
The overlapping phone frames are an illustrative product preview, not a claim of live app data. Use dark screens, silver details, small crimson highlights, slim device outlines, and compact example metrics; keep the “ILLUSTRATIVE PREVIEW” label visible when shown.

## Do's and Don'ts

### Do:
- **Do** use the supplied Silat cutouts independently and preserve their proportions with contained, art-directed placement.
- **Do** keep the approved FighterX wordmark artwork intact and preserve the approved brand line.
- **Do** make the Register Club action prominent where the page asks clubs to convert.
- **Do** retain readable contrast, visible keyboard focus, reduced-motion support, and touch-friendly mobile controls.
- **Do** label product mockups and preview-only flows honestly.

### Don't:
- **Don't** use a reference screenshot as a page background; compose from supplied assets instead.
- **Don't** invent or redraw the official logo mark.
- **Don't** describe supplied Malay-inspired textures as historically authentic patterns.
- **Don't** spread crimson glow across every card or panel.
- **Don't** rely on color alone to communicate status.
