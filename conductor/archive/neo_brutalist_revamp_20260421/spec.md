# Specification: Neo-Brutalist UI Revamp

## Overview

This track focuses on a complete frontend UI revamp of the Tempo application to implement a "Neo-Brutalist" design system. The goal is to replace the current "Modern Corporate" aesthetic (glassmorphism, soft gradients, subtle shadows) with a raw, high-contrast, tactile interface featuring heavy borders, hard shadows, and vibrant retro colors.

## Functional Requirements

### 1. Global Foundations & Styling

- **Typography:** Integrate the "Space Grotesk" font via Google Fonts. All text should utilize this font, with bold uppercase headers being the primary typographic style.
- **Tailwind Configuration:**
  - Define a new "Neo-Brutalist" color palette: Retro Yellow (#f7df1e), Retro Pink (#FF00E5), Retro Blue (#93c5fd - blue-300), and Retro Green (#4ade80 - green-400).
  - Configure custom `box-shadow` utilities: `brutal-shadow` (6px 6px 0px 0px #000).
- **Global CSS:**
  - Implement a `bg-grid` pattern using a radial-gradient (dots every 20px).
  - Define `.brutal-border` as `4px solid #000` with an `8px` border-radius.

### 2. Component Revamp (Neo-Brutalist Style)

- **Borders & Radius:** All primary containers, modals, and buttons must have a solid 4px black border with an 8px radius.
- **Shadows & Active States:** Implement hard 6px black offset shadows. On `:active` or "pressed" states, elements must `translate(4px, 4px)` and reduce shadow to `2px`.
- **Layout Elements:**
  - **Landing Page:** Use `mix-blend-multiply` on high-contrast headers. Implement "floating" badges with `rotate-12` and `-rotate-2` for a raw look.
  - **Room Layout:** Sidebar should be `bg-blue-200`. Active topics in the queue should use `bg-green-400` with the "shadow shift" feedback.
  - **Ticker Tape:** Implement a scrolling marquee header with black background and white tracking-wider text.
  - **Poker Cards:** Redesign cards (w-16 h-24) to use the new font, heavy borders, and snappy transforms. Selected cards shift `translate(4px, 4px)` with a `2px` shadow.

### 3. Motion & Animation (Alive & Snappy)

- **Transition Style:** Use `transition: transform 0.1s, box-shadow 0.1s` for immediate mechanical feedback.
- **Transforms:** Use snappy rotation (`rotate-12`, `-rotate-2`) for decorative elements.
- **Marquee:** Implement a linear infinite animation (`15s`) for the room ticker tape.

## Non-Functional Requirements

- **Accessibility:** Ensure all vibrant background/text combinations meet WCAG 2.1 AA standards (4.5:1 contrast ratio) while maintaining the "unapologetic" aesthetic.
- **Responsive Design:** Borders and shadows must scale down for mobile devices to maintain visual balance without sacrificing the heavy feel.

## Acceptance Criteria

- [ ] Tailwind configuration updated with new colors, borders, and shadow utilities.
- [ ] "Space Grotesk" font is the primary typeface throughout the app.
- [ ] All glassmorphism, gradients, and soft shadows are removed.
- [ ] Dotted/grid background is visible on all main routes.
- [ ] Landing page reflects the @ui-design/design-5-brutalist mockup aesthetic.
- [ ] Scrolling marquee is active on the Landing Page.
- [ ] Room layout and Poker cards are fully revamped with the new style.
- [ ] All interactive elements provide the "shadow shift" feedback on click.
- [ ] Accessibility check confirms WCAG 2.1 AA compliance for core UI elements.

## Out of Scope

- Functional changes to the Poker or Standup logic.
- Backend schema or database modifications.
