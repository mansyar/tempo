# ◈ Tempo

**Tempo** is a suite of modern, lightweight scrum tools designed for high-performance teams. Built with speed and sensory feedback in mind, it provides a seamless experience for common agile ceremonies.

## 🚀 Active Tools

- **Planning Poker**: Real-time collaborative estimation tool.
  - Multi-scale support (Fibonacci, T-Shirt).
  - Mobile Controller mode via QR sync.
  - Sensory juice (sound, haptics, confetti).
  - Automated 24h data cleanup.
- **Daily Standup**: (Coming Soon) Streamlined status updates.

## 🛠 Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React + Vite)
- **Database/Backend**: [Convex](https://convex.dev/) (Real-time sync)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Styling**: Vanilla CSS with Design Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🏁 Getting Started

### Development

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    pnpm install
    ```
3.  **Start Convex**:
    ```bash
    npx convex dev
    ```
4.  **Start development server**:
    ```bash
    pnpm dev
    ```

### Production Build

```bash
pnpm build
pnpm start
```

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) with JSDOM and Convex Test.

```bash
pnpm test
```

## 🧹 Maintenance

Tempo is designed for ephemeral collaboration.

- Room data is automatically purged after 24 hours of inactivity.
- No permanent user tracking (Local Identity only).

---

Built with ❤️ by the Tempo Team.
