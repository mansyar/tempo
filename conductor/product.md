# Initial Concept

"Pointy" – Real-Time Ephemeral Planning Poker. A high-performance, real-time estimation tool for agile teams with zero-friction workflow, leveraging TanStack Start and Convex.

## Target Audience & Use Case

- **Target:** Remote/Hybrid Agile teams (Scrum Masters, Developers, Product Owners).
- **Context:** Used during Sprint Planning or Backlog Grooming as a dedicated "second screen" or browser tab.
- **Team Size:** Optimized for 3–15 participants per room.

## Core Features

1. **Anonymous Entry:** Zero-friction entry with just a nickname. Sessions persisted locally.
2. **Real-Time Gameplay:** Live syncing of votes, online status, and topics using Convex. Includes dynamic browser tab title synchronization.
3. **The Mask:** Individual vote values remain hidden until the Facilitator triggers the reveal.
4. **Results & Statistics:** Automatic calculation of average, median, mode, and consensus level, with prominent red "Needs Discussion" badges for outliers.
5. **Interactive Feedback:** Fun elements like confetti on unanimous votes and real-time emoji reactions.
6. **Facilitator Controls:** Full control over topic queues (including inline editing), resetting rounds, and revealing votes.
7. **Session Identity Mirroring:** Secure, QR-based sync allowing mobile devices to adopt a desktop identity for a specialized "Controller Mode".
8. **Round Timer & Nudge:** Facilitator-controlled pacing with a 60s round timer and a "Nudge" mechanism to prompt inactive players via haptics.
9. **Session Export:** Export planning results in multiple formats including Markdown Table, Plain Text Summary, and CSV Data.
10. **Advanced Room Settings:** Configurable room logic including Auto-Reveal (reveals once all online players vote) and alternative Estimation Scales (e.g., T-Shirt sizing).

## Non-Functional Goals

- **Performance:** High-performance, "gaming-grade" UI with < 150ms real-time sync latency globally.
- **Ephemeral Data:** Rooms and data automatically cleaned up after 24 hours of inactivity.
- **Accessibility:** Keyboard navigable, accessible contrast ratios, and ARIA labels.

## User Experience (UX) Vision

A "Modern Corporate" aesthetic featuring deep shadows, subtle glassmorphism, and smooth 3D animations (like card flips and mouse-tracking tilt effects). The experience should feel responsive and app-like, even serving as a standalone PWA on mobile devices.
