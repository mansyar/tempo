# Design System: Tempo

> **Visual Direction:** "Modern Corporate" — Linear/Vercel-inspired  
> **Scope:** All Tempo modules (Planning Poker, Daily Standup, future tools)  
> **Last Updated:** 2026-04-21

---

## 1. Color Palette

### Dark Mode (Default)

| Token                 | Value                                       | Usage                             |
| --------------------- | ------------------------------------------- | --------------------------------- |
| `--bg-primary`        | `#0A0A0B`                                   | Page background                   |
| `--bg-secondary`      | `#141416`                                   | Cards, panels, sidebars           |
| `--bg-tertiary`       | `#1C1C21`                                   | Inputs, hover states              |
| `--bg-glass`          | `rgba(255,255,255,0.05)`                    | Glassmorphism surfaces            |
| `--border-subtle`     | `rgba(255,255,255,0.08)`                    | Card edges, dividers              |
| `--border-focus`      | `rgba(99,102,241,0.5)`                      | Focus rings (a11y)                |
| `--text-primary`      | `#FAFAFA`                                   | Headings, primary content         |
| `--text-secondary`    | `#A1A1AA`                                   | Labels, descriptions              |
| `--text-tertiary`     | `#52525B`                                   | Placeholders, disabled            |
| `--accent`            | `#818CF8`                                   | Primary buttons, active card glow |
| `--accent-hover`      | `#6366F1`                                   | Button hover                      |
| `--success`           | `#34D399`                                   | Unanimous indicator, online dot   |
| `--warning`           | `#FBBF24`                                   | Near-consensus indicator          |
| `--danger`            | `#F87171`                                   | Split vote indicator, outlier     |
| `--surface-card`      | `#1E1E24`                                   | Poker card face                   |
| `--surface-card-back` | `linear-gradient(135deg, #6366F1, #8B5CF6)` | Card back pattern                 |

### Light Mode

| Token              | Value                   | Usage                             |
| ------------------ | ----------------------- | --------------------------------- |
| `--bg-primary`     | `#FAFAFA`               | Page background                   |
| `--bg-secondary`   | `#FFFFFF`               | Cards, panels, sidebars           |
| `--bg-tertiary`    | `#F4F4F5`               | Inputs, hover states              |
| `--bg-glass`       | `rgba(255,255,255,0.7)` | Glassmorphism surfaces            |
| `--border-subtle`  | `rgba(0,0,0,0.08)`      | Card edges, dividers              |
| `--border-focus`   | `rgba(99,102,241,0.5)`  | Focus rings (a11y)                |
| `--text-primary`   | `#09090B`               | Headings, primary content         |
| `--text-secondary` | `#71717A`               | Labels, descriptions              |
| `--text-tertiary`  | `#A1A1AA`               | Placeholders, disabled            |
| `--accent`         | `#6366F1`               | Primary buttons, active card glow |
| `--accent-hover`   | `#4F46E5`               | Button hover                      |

## 2. Typography

| Element             | Font           | Weight | Size            | Line Height |
| ------------------- | -------------- | ------ | --------------- | ----------- |
| **H1** (Hero)       | Inter          | 700    | 48px / 3rem     | 1.1         |
| **H2** (Section)    | Inter          | 600    | 30px / 1.875rem | 1.2         |
| **H3** (Card Label) | Inter          | 600    | 20px / 1.25rem  | 1.3         |
| **Body**            | Inter          | 400    | 16px / 1rem     | 1.5         |
| **Body Small**      | Inter          | 400    | 14px / 0.875rem | 1.5         |
| **Caption**         | Inter          | 500    | 12px / 0.75rem  | 1.4         |
| **Card Value**      | JetBrains Mono | 700    | 32px / 2rem     | 1.0         |
| **Button**          | Inter          | 500    | 14px / 0.875rem | 1.0         |

> Load via Google Fonts: `Inter:wght@400;500;600;700` and `JetBrains+Mono:wght@700`

## 3. Spacing Scale

Based on a 4px grid:

| Token  | Value |
| ------ | ----- |
| `xs`   | 4px   |
| `sm`   | 8px   |
| `md`   | 12px  |
| `base` | 16px  |
| `lg`   | 24px  |
| `xl`   | 32px  |
| `2xl`  | 48px  |
| `3xl`  | 64px  |
| `4xl`  | 96px  |

## 4. Border Radius

| Token          | Value  | Usage                |
| -------------- | ------ | -------------------- |
| `rounded-sm`   | 6px    | Buttons, inputs      |
| `rounded-md`   | 8px    | Cards, panels        |
| `rounded-lg`   | 12px   | Modals, overlays     |
| `rounded-xl`   | 16px   | Hero sections        |
| `rounded-full` | 9999px | Avatars, dots, pills |

## 5. Shadows & Effects

```css
/* Elevation layers */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3); /* Active card */
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.3);

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-blur: backdrop-filter: blur(12px);
--glass-border: 1px solid rgba(255, 255, 255, 0.08);
```

## 6. Animation Tokens

| Animation           | Property               | Value                                                            |
| ------------------- | ---------------------- | ---------------------------------------------------------------- |
| **Card Hover Tilt** | `transform`            | `perspective(800px) rotateX(var(--tiltX)) rotateY(var(--tiltY))` |
| **Card Select**     | `scale`                | `1.05` with `box-shadow: var(--shadow-glow)`                     |
| **Card Reveal**     | `rotateY`              | `0deg → 180deg`, spring: `stiffness: 260, damping: 20`           |
| **Reveal Stagger**  | `delay`                | `index * 80ms`                                                   |
| **Emoji Float**     | `translateY`           | `-100vh` over `3s`, fade out at top                              |
| **Confetti**        | duration               | `2s`, gravity-based particle scatter                             |
| **Page Transition** | `opacity + translateY` | `0→1`, `8px→0`, `200ms ease-out`                                 |
| **Reduced Motion**  | All above              | Replace with `opacity: 0→1, 150ms`                               |

## 7. Component Inventory

### 7.1 Shared Components (All Tools)

| Component             | Variant(s)                                | Notes                      |
| --------------------- | ----------------------------------------- | -------------------------- |
| `Button`              | primary, secondary, ghost, danger         | Sizes: sm, md, lg          |
| `Avatar`              | online, offline, voted, waiting, speaking | Colored ring indicator     |
| `PresenceSidebar`     | —                                         | Player list with status    |
| `ReactionOverlay`     | —                                         | Floating emoji layer       |
| `ThemeToggle`         | sun/moon icon                             | Animated icon swap         |
| `NicknameInput`       | —                                         | Landing + Join modal       |
| `FacilitatorControls` | —                                         | Tool-specific control bar  |
| `Toast`               | info, success, warning                    | Auto-dismiss notifications |
| `ToolCard`            | poker, standup                            | Landing hub tool selector  |

### 7.2 Planning Poker Components

| Component            | Variant(s)                           | Notes                      |
| -------------------- | ------------------------------------ | -------------------------- |
| `Card` (Poker)       | faceDown, faceUp, selected, disabled | 3D flip animation          |
| `CardDeck`           | horizontal (desktop), fan (mobile)   | Contains Card children     |
| `TopicItem`          | pending, active, completed           | Drag handle, inline edit   |
| `TopicQueue`         | sidebar panel                        | Collapsible on mobile      |
| `StatsPanel`         | overlay / modal                      | Bar chart, consensus badge |
| `PokerTable`         | voting, revealed                     | Central game area          |
| `ConsensusIndicator` | unanimous, near, split               | Color-coded badge          |
| `Confetti`           | —                                    | Canvas/particle overlay    |

### 7.3 Daily Standup Components

| Component           | Variant(s)               | Notes                                      |
| ------------------- | ------------------------ | ------------------------------------------ |
| `SpeakerTimer`      | active, paused, overtime | Circular progress ring with countdown      |
| `SpeakerQueue`      | —                        | Ordered list with status indicators        |
| `ParkingLot`        | —                        | Quick-capture item list                    |
| `StandupSummary`    | —                        | Post-standup results with per-person times |
| `TimerProgressRing` | green, yellow, red       | SVG ring that depletes as time runs out    |
| `StandupConfig`     | —                        | Setup screen with timer/order settings     |

---

## 8. Screen Wireframes (ASCII)

### 8.1 Landing Page (Tool Hub) — `/`

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ◈ Tempo                                            [☀/🌙]  [GitHub]  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                Scrum Tools for Modern Teams                               │
│                                                                          │
│           Real-time ceremonies. No accounts.                             │
│           No friction. Just go.                                          │
│                                                                          │
│           ┌──────────────────────────────────────┐                       │
│           │  Your nickname                       │                       │
│           └──────────────────────────────────────┘                       │
│                                                                          │
│  CHOOSE A TOOL:                                                          │
│                                                                          │
│  ┌────────────────────────────┐     ┌────────────────────────────┐       │
│  │   ♠  Planning Poker       │     │   ⏱  Daily Standup        │       │
│  │                           │     │                           │       │
│  │   Estimate stories as a   │     │   Timebox your daily      │       │
│  │   team with Fibonacci     │     │   sync with per-person    │       │
│  │   cards and live stats    │     │   timers and speaker      │       │
│  │                           │     │   queues                  │       │
│  │   [🚀 Create Room]       │     │   [🚀 Create Room]       │       │
│  └────────────────────────────┘     └────────────────────────────┘       │
│                                                                          │
│           ─── or join an existing room ───                               │
│                                                                          │
│           ┌──────────────────────────────────────┐                       │
│           │  Paste room link or code...          │                       │
│           └──────────────────────────────────────┘                       │
│           ┌──────────────────────────────────────┐                       │
│           │     →  Join Room                     │                       │
│           └──────────────────────────────────────┘                       │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│    ⚡ Real-time        🔒 Ephemeral             ♿ Accessible            │
│    Sync in <150ms      Auto-deletes in 24h      WCAG 2.1 AA             │
│                                                                          │
│    📱 PWA Ready        🎨 Dark/Light                                    │
│    Install as app      System-aware toggle                               │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│  Built with TanStack Start + Convex                    © 2026 Tempo    │
└──────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Room — Desktop Table View (`/room/:slug`, ≥1024px)

#### State: Voting (cards face-down)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  ◈ Tempo ▸ Poker    clumsy-tiger-22   [📋 Copy Link]       [⚙ Settings] [☀/🌙]    │
├──────────────────────────────────────────┬───────────────────────────────────────────┤
│                                          │  📋 TOPIC QUEUE              [+ Add]     │
│   Current Topic:                         │  ─────────────────────────────────────    │
│   ┌────────────────────────────────────┐ │                                           │
│   │  ▶ Add password reset flow     [3] │ │  ▶ Add password reset flow    ← active   │
│   └────────────────────────────────────┘ │  ○ Fix mobile nav bug          pending    │
│                                          │  ○ Implement search API        pending    │
│        🧑 Alice            🧑 Bob       │  ○ Update user dashboard       pending    │
│        ┌─────┐             ┌─────┐      │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─             │
│        │░░░░░│  ✓ Voted    │░░░░░│  ✓   │  ✓ Setup project scaffolding   5  done    │
│        │░░░░░│             │░░░░░│      │  ✓ Design database schema      3  done    │
│        │░░░░░│             │░░░░░│      │                                           │
│        └─────┘             └─────┘      │                                           │
│                                          │                                           │
│  🧑 Charlie      ╔═══════════╗   🧑 Eve │                                           │
│  ┌─────┐         ║  POKER    ║  ┌─────┐ │                                           │
│  │░░░░░│  ✓      ║  TABLE    ║  │     │ │  👥 PLAYERS (4 online)                    │
│  │░░░░░│         ║           ║  │ ... │ │  ─────────────────────────────────────     │
│  │░░░░░│         ╚═══════════╝  │     │ │  🟢 Alice (Facilitator) ✓ Voted           │
│  └─────┘                        └─────┘ │  🟢 Bob                 ✓ Voted           │
│                                          │  🟢 Charlie             ✓ Voted           │
│        🧑 Dave             🧑 Frank     │  🟢 Eve                 ⏳ Waiting         │
│        ┌─────┐             ┌─────┐      │  ⚫ Dave                 — Offline         │
│        │░░░░░│  ✓          │░░░░░│  ✓   │                                           │
│        │░░░░░│             │░░░░░│      │                                           │
│        │░░░░░│             │░░░░░│      │  [❤️] [👏] [🔥] [😂] [🎉]  ← Reactions   │
│        └─────┘             └─────┘      │                                           │
│                                          │                                           │
│  ┌────────────────────────────────────┐  │                                           │
│  │  [🎴 Reveal Votes]  [🔄 Reset]    │  │  ← Facilitator-only controls              │
│  │  [⏭ Next Topic]                   │  │                                           │
│  └────────────────────────────────────┘  │                                           │
│                                          │                                           │
│  YOUR VOTE:                              │                                           │
│  ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐                               │
│  │ 0 ││ 1 ││ 2 ││ 3 ││ 5 ││ 8 ││13 ││21 ││ ? ││ ☕││                               │
│  └───┘└───┘└───┘└───┘└───┘└───┘└───┘└───┘└───┘└───┘                               │
│                 ▲ selected (glow)                     │                               │
└──────────────────────────────────────────┴───────────────────────────────────────────┘
```

#### State: Revealed (cards face-up + stats)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  ◈ Tempo ▸ Poker    clumsy-tiger-22   [📋 Copy Link]       [⚙ Settings] [☀/🌙]    │
├──────────────────────────────────────────┬───────────────────────────────────────────┤
│                                          │  📊 RESULTS                               │
│   Current Topic:                         │  ─────────────────────────────────────    │
│   ┌────────────────────────────────────┐ │                                           │
│   │  ▶ Add password reset flow         │ │  Consensus: 🟡 Near Consensus            │
│   └────────────────────────────────────┘ │                                           │
│                                          │  Average: 4.6   Median: 5   Mode: 5      │
│        🧑 Alice            🧑 Bob       │                                           │
│        ┌─────┐             ┌─────┐      │  Distribution:                            │
│        │     │             │     │      │  ┌─────────────────────────────────┐       │
│        │  5  │             │  5  │      │  │ 3  ▓▓▓░░░░░░░░░░░░░ 1 vote    │       │
│        │     │             │     │      │  │ 5  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 3 votes   │       │
│        └─────┘             └─────┘      │  │ 8  ▓▓▓▓▓▓▓░░░░░░░░ 1 vote ⚠ │       │
│                                          │  └─────────────────────────────────┘       │
│  🧑 Charlie                      🧑 Eve │                                           │
│  ┌─────┐                        ┌─────┐ │  ⚠ Outlier: Eve (8)                       │
│  │     │                        │     │ │     "Furthest from median (5)"             │
│  │  5  │                        │  8  │ │                                           │
│  │     │  ← highlight outlier → │  ⚠  │ │  ┌─────────────────────────────┐           │
│  └─────┘                        └─────┘ │  │ Set final estimate: [5 ▼]  │           │
│                                          │  └─────────────────────────────┘           │
│        🧑 Frank                          │                                           │
│        ┌─────┐                           │  📋 TOPIC QUEUE              [+ Add]     │
│        │     │                           │  ─────────────────────────────────────    │
│        │  3  │                           │  ▶ Add password reset flow    ← active    │
│        │     │                           │  ○ Fix mobile nav bug          pending    │
│        └─────┘                           │  ○ Implement search API        pending    │
│                                          │                                           │
│  ┌────────────────────────────────────┐  │  👥 PLAYERS (5 online)                    │
│  │  [🔄 Reset]  [⏭ Next Topic]      │  │  🟢 Alice ★  🟢 Bob  🟢 Charlie          │
│  └────────────────────────────────────┘  │  🟢 Eve      🟢 Frank                    │
│                                          │                                           │
└──────────────────────────────────────────┴───────────────────────────────────────────┘
```

### 8.3 Room — Mobile Card Deck Controller (`/room/:slug`, <1024px)

#### State: Voting

```
┌──────────────────────────────┐
│  ◈ Tempo         [⚙] [☀/🌙] │
├──────────────────────────────┤
│                              │
│  Room: clumsy-tiger-22  [📋] │
│                              │
│  ┌──────────────────────────┐│
│  │  ▶ Add password reset    ││
│  │    flow                  ││
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │  👥 5 online   3/5 voted ││
│  │  🟢🟢🟢⏳⏳             ││
│  └──────────────────────────┘│
│                              │
│                              │
│           YOUR VOTE          │
│                              │
│  ┌──────────────────────────┐│
│  │                          ││
│  │     You voted: 5         ││
│  │     Tap to change        ││
│  │                          ││
│  └──────────────────────────┘│
│                              │
│  ┌───┐┌───┐┌───┐┌───┐┌───┐ │
│  │ 0 ││ 1 ││ 2 ││ 3 ││ 5 │ │
│  └───┘└───┘└───┘└───┘└───┘ │
│  ┌───┐┌───┐┌───┐┌───┐┌───┐ │
│  │ 8 ││13 ││21 ││ ? ││ ☕ │ │
│  └───┘└───┘└───┘└───┘└───┘ │
│           ▲ glow = selected │
│                              │
│  [❤️] [👏] [🔥] [😂] [🎉]  │
│                              │
│  ┌────────────┐┌──────────┐ │
│  │ 🎴 Reveal  ││ ⏭ Next  │ │  ← Facilitator only
│  └────────────┘└──────────┘ │
└──────────────────────────────┘
```

#### State: Revealed

```
┌──────────────────────────────┐
│  ◈ Tempo         [⚙] [☀/🌙] │
├──────────────────────────────┤
│                              │
│  ▶ Add password reset flow   │
│                              │
│  ┌──────────────────────────┐│
│  │  🟡 Near Consensus       ││
│  │  Avg: 4.6  Med: 5        ││
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │  Alice ★    [5]          ││
│  │  Bob        [5]          ││
│  │  Charlie    [5]          ││
│  │  Eve        [8]  ⚠       ││
│  │  Frank      [3]          ││
│  └──────────────────────────┘│
│                              │
│  Distribution:               │
│  3  ▓▓▓░░░░░░░░░  1         │
│  5  ▓▓▓▓▓▓▓▓▓▓▓  3         │
│  8  ▓▓▓▓▓▓░░░░░  1  ⚠      │
│                              │
│  ┌──────────────────────────┐│
│  │  Final estimate: [5 ▼]  ││
│  └──────────────────────────┘│
│                              │
│  ┌────────────┐┌──────────┐ │
│  │ 🔄 Reset   ││ ⏭ Next  │ │
│  └────────────┘└──────────┘ │
└──────────────────────────────┘
```

### 8.4 Settings Panel (Slide-over / Modal)

```
┌──────────────────────────────┐
│  ⚙ Settings             [✕] │
├──────────────────────────────┤
│                              │
│  APPEARANCE                  │
│  ─────────────────────────── │
│  Theme           [🌙 Dark ▼]│
│                              │
│  FEEDBACK                    │
│  ─────────────────────────── │
│  Sound & Haptic   [████ ON ] │
│                              │
│  IDENTITY                    │
│  ─────────────────────────── │
│  Your Nickname               │
│  ┌──────────────────────────┐│
│  │  Alice                   ││
│  └──────────────────────────┘│
│  [Save]                      │
│                              │
│  ROOM INFO                   │
│  ─────────────────────────── │
│  Room Slug:  clumsy-tiger-22 │
│  Players:    5 online        │
│  Created:    2h ago          │
│  Expires:    ~22h            │
│                              │
│  ─────────────────────────── │
│  [🚪 Leave Room]            │
│                              │
└──────────────────────────────┘
```

### 8.5 Nickname Entry Modal (Join Flow)

```
┌──────────────────────────────────────────┐
│                                          │
│     ┌──────────────────────────────┐     │
│     │                              │     │
│     │   ◈ Welcome to Tempo        │     │
│     │                              │     │
│     │   Room: clumsy-tiger-22      │     │
│     │   4 players in room          │     │
│     │                              │     │
│     │   Enter your nickname:       │     │
│     │   ┌────────────────────────┐ │     │
│     │   │  e.g., Alice           │ │     │
│     │   └────────────────────────┘ │     │
│     │                              │     │
│     │   ┌────────────────────────┐ │     │
│     │   │    🎯 Join Room        │ │     │
│     │   └────────────────────────┘ │     │
│     │                              │     │
│     └──────────────────────────────┘     │
│          ▲ glassmorphism card            │
│          backdrop-blur over              │
│          dimmed table view               │
└──────────────────────────────────────────┘
```

### 8.6 Confetti & Emoji Overlay (Visual Layer)

```
┌──────────────────────────────────────────┐
│  🎊     🎊         🎊                   │
│      🎊      🎊         🎊    🎊        │
│  ❤️──────→           ❤️──────→          │
│                                          │
│        ┌─────┐ ┌─────┐ ┌─────┐          │
│        │  5  │ │  5  │ │  5  │          │
│        └─────┘ └─────┘ └─────┘          │
│                                          │
│            🟢 Unanimous!                 │
│            Everyone agreed: 5            │
│                                          │
│     🔥──────→                            │
│          👏──────→         🎉──────→     │
│                                          │
│  (Confetti particles fall from top,      │
│   emoji reactions float left→right       │
│   and fade out after 3s)                 │
│                                          │
└──────────────────────────────────────────┘
```

---

## 9. Interaction States

### Poker Card States

```
  UNSELECTED      HOVER (3D)      SELECTED         REVEALED
  ┌─────────┐    ┌─────────┐    ┌─────────┐     ┌─────────┐
  │ ░░░░░░░ │    │╲░░░░░░░ │    │ ┌─────┐ │     │         │
  │ ░░░ ♠ ░ │    │ ╲░░♠░░░ │    │ │     │ │     │    5    │
  │ ░░░░░░░ │    │  ╲░░░░░ │    │ │  5  │ │     │         │
  │ ░░░░░░░ │    │   ╲░░░░ │    │ │     │ │     │   ♠ ♠   │
  │ ░░░░░░░ │    │    ╲░░░ │    │ └─────┘ │     │         │
  └─────────┘    └─────────┘    └─────────┘     └─────────┘
   bg: gradient    perspective     glow border    flip anim
   no glow         tilt effect     scale: 1.05    spring Y
```

### Player Avatar States

```
  ONLINE+WAITING   ONLINE+VOTED     OFFLINE        FACILITATOR
  ┌───┐            ┌───┐            ┌───┐          ┌───┐
  │ 🧑 │ 🟢         │ 🧑 │ 🟢 ✓       │ 🧑 │ ⚫        │ 🧑 │ 🟢 ★
  └───┘            └───┘            └───┘          └───┘
   ⏳ Waiting       ✓ Voted          — Offline      ★ Facilitator
   pulsing ring    solid ring        dimmed         gold ring
```

### Button States

```
  DEFAULT          HOVER            ACTIVE           DISABLED
  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │  Reveal    │  │  Reveal    │  │  Reveal    │  │  Reveal    │
  └────────────┘  └────────────┘  └────────────┘  └────────────┘
  bg: accent      bg: accent-hov   scale: 0.98     opacity: 0.5
                  shadow: glow     shadow: inset    cursor: not
```

---

## 10. Responsive Breakpoints

| Breakpoint | Width      | Layout                       |
| ---------- | ---------- | ---------------------------- |
| `mobile`   | < 640px    | Single column, card grid 2x5 |
| `tablet`   | 640–1023px | Single column, card row      |
| `desktop`  | ≥ 1024px   | Table view + sidebar         |
| `wide`     | ≥ 1440px   | Expanded table, larger cards |

## 11. Z-Index Layer Map

| Layer       | Z-Index | Content                 |
| ----------- | ------- | ----------------------- |
| Base        | 0       | Table, cards, sidebar   |
| Floating UI | 10      | Tooltips, dropdowns     |
| Overlay     | 20      | Stats panel, emoji rain |
| Modal       | 30      | Settings, join modal    |
| Confetti    | 40      | Particle effects        |
| Toast       | 50      | Notifications           |
