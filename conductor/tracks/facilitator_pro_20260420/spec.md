# Specification: Facilitator Pro & Session Continuity

## Overview

This track elevates Pointy from a real-time prototype to a professional-grade power tool by bridging the gap between high-fidelity dashboards and mobile-first haptic controllers. It introduces a secure, token-based **Identity Sync** protocol, a facilitator-controlled **Round Timer**, and a **Markdown/CSV Session Exporter** for project continuity.

## Functional Requirements

1.  **Identity Sync / Mobile Controller (All-Player Support):**
    - **Token-based Sync:** Update the `InviteModal` with a "Sync Mobile" tab that generates a short-lived (2-min), single-use token embedded in a QR code.
    - **Session Mirroring:** Scanning the QR code allows the mobile device to adopt the desktop user's `identityId` without re-entering a nickname.
    - **Mobile Controller UI:** When a synced identity is detected on a mobile device, automatically switch the UI to a "Controller Mode" optimized for haptic voting and facilitation (large buttons, minimal clutter).
2.  **Facilitator "Nudge" & Round Timer:**
    - **Auto-start Timer:** Implement a 60-second round timer that automatically starts as soon as the first vote is cast in a round. The facilitator can manually reset or extend it.
    - **"Nudge" Mechanism:** Allow the Facilitator to click a "Nudge" button next to any player in the presence sidebar who hasn't voted yet.
    - **Targeted Feedback:** The nudged player's device will trigger a short haptic pulse and a subtle "Your team is waiting for your vote!" toast.
3.  **Session Export (Project Continuity):**
    - **Multi-format Export:** Implement a "Export Session Summary" button in the Topic Sidebar's history section.
    - **Supported Formats:** Generate a clean Markdown Table, a bulleted Summary List, and a CSV file containing all completed topics, their final estimates, and consensus status.
4.  **Advanced Room Settings:**
    - **Auto-Reveal Toggle:** Optional setting to automatically reveal votes once all online players have submitted their estimates.
    - **T-Shirt Sizing Scale:** Allow the Facilitator to switch the room's scale between the standard Fibonacci and T-Shirt Sizing (S, M, L, XL, ?).

## Non-Functional Requirements

- **Security:** Sync tokens must be single-use and expire within 2 minutes to prevent session hijacking.
- **Latency:** Timer sync across all clients must maintain < 200ms drift.
- **A11y:** Exported files must follow standard formatting for easy consumption by external tools.

## Acceptance Criteria

- [ ] Users can sync their desktop identity to their mobile device via a QR code.
- [ ] Mobile UI switches to "Controller Mode" for synced sessions.
- [ ] Round timer starts automatically on the first vote and is visible to all.
- [ ] Facilitators can nudge players, triggering a haptic response on the player's device.
- [ ] Session summaries can be exported as Markdown and CSV.
- [ ] Room settings allow switching to T-Shirt sizing and toggling Auto-Reveal.

## Out of Scope

- Integrating directly with Jira/GitHub APIs (focus is on file-based export).
- Customizing the timer duration per room (fixed at 60s for now).
