import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useIdentity } from '../hooks/useIdentity'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/')({ component: App })

function generateSlug() {
  return Math.random().toString(36).substring(2, 10)
}

export function App() {
  const { nickname, setNickname, identityId } = useIdentity()
  const navigate = useNavigate()
  const createRoom = useMutation(api.rooms.create)

  const handleCreateRoom = async () => {
    if (!nickname.trim()) return

    const slug = generateSlug()
    try {
      await createRoom({ slug, facilitatorId: identityId })
      navigate({ to: '/room/$slug', params: { slug } })
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14 flex flex-col items-center justify-center min-h-[70vh]">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14 w-full max-w-2xl text-center">
        <div className="mb-6 flex justify-center space-x-2 text-4xl">
          <span>♠</span>
          <span>♥</span>
          <span>♦</span>
          <span>♣</span>
        </div>

        <h1 className="display-title mb-4 text-4xl leading-tight font-bold tracking-tight text-[var(--text-primary)] sm:text-6xl">
          Planning Poker for Modern Teams
        </h1>
        
        <p className="mb-10 text-base text-[var(--text-secondary)] sm:text-lg max-w-xl mx-auto">
          Real-time estimation. No accounts. No friction. Just point.
        </p>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-4 py-3 text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] transition-all"
            />
          </div>
          
          <button
            onClick={handleCreateRoom}
            disabled={!nickname.trim()}
            className="w-full rounded-lg bg-[var(--accent)] px-6 py-3.5 font-bold text-white transition hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            🚀 Create Room
          </button>
        </div>

        <div className="mt-8 border-t border-[var(--border-subtle)] pt-8">
          <p className="text-sm text-[var(--text-tertiary)] mb-4 uppercase tracking-widest font-semibold">
            — or join an existing room —
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="text"
              placeholder="Paste room link or slug..."
              className="flex-grow rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none transition-all"
            />
            <button className="rounded-lg border border-[var(--border-subtle)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all">
              Join
            </button>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-8 sm:grid-cols-3 max-w-4xl w-full">
        {[
          { icon: '⚡', title: 'Real-time', desc: 'Sync in <150ms' },
          { icon: '🎯', title: 'Fibonacci Scale', desc: '0–21, ?, ☕' },
          { icon: '🔒', title: 'Ephemeral', desc: 'Auto-deletes in 24h' },
        ].map((feature, index) => (
          <div 
            key={feature.title}
            className="flex flex-col items-center text-center rise-in"
            style={{ animationDelay: `${index * 100 + 300}ms` }}
          >
            <span className="text-3xl mb-3">{feature.icon}</span>
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
              {feature.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>
    </main>
  )
}
