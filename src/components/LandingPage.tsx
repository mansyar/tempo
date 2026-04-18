import { useNavigate } from '@tanstack/react-router';
import { useIdentity } from '../hooks/useIdentity';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Zap, Target, Lock, type LucideIcon } from 'lucide-react';

function generateSlug() {
  return Math.random().toString(36).substring(2, 10);
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  index: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ['17.5deg', '-17.5deg']
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ['-17.5deg', '17.5deg']
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index + 0.5 }}
      className="relative h-48 w-full rounded-2xl bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 shadow-xl backdrop-blur-md"
    >
      <div
        style={{
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
        }}
        className="flex flex-col items-center text-center h-full justify-center"
      >
        <div className="mb-4 rounded-full bg-[var(--bg-primary)] p-3 text-[var(--accent)] shadow-inner">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const { nickname, setNickname, identityId } = useIdentity();
  const [joinSlug, setJoinSlug] = useState('');
  const navigate = useNavigate();
  const createRoom = useMutation(api.rooms.create);

  const handleCreateRoom = async () => {
    if (!nickname.trim()) return;

    const slug = generateSlug();
    try {
      await createRoom({ slug, facilitatorId: identityId! });
      navigate({ to: '/room/$slug', params: { slug } });
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleJoinRoom = () => {
    if (!joinSlug.trim()) return;

    // Extract slug from URL if pasted
    let slug = joinSlug.trim();
    if (slug.includes('/room/')) {
      const parts = slug.split('/room/');
      slug = parts[parts.length - 1].split('/')[0];
    }

    navigate({ to: '/room/$slug', params: { slug } });
  };

  return (
    <main className="page-wrap px-4 pb-16 pt-14 flex flex-col items-center justify-center min-h-[85vh]">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-10 sm:py-16 w-full max-w-3xl text-center shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />

        <div className="mb-8 flex justify-center space-x-3 text-4xl opacity-80">
          <span className="text-[var(--accent)]">♠</span>
          <span className="text-[var(--danger)]">♥</span>
          <span className="text-[var(--accent)]">♦</span>
          <span className="text-[var(--danger)]">♣</span>
        </div>

        <h1 className="display-title mb-6 text-5xl leading-tight font-black tracking-tight text-[var(--text-primary)] sm:text-7xl">
          Pointy Poker
        </h1>

        <p className="mb-12 text-lg text-[var(--text-secondary)] sm:text-xl max-w-2xl mx-auto leading-relaxed">
          The high-juice planning poker tool for elite product teams. Real-time
          estimation without the friction.
        </p>

        <div className="flex flex-col gap-6 max-w-md mx-auto">
          <div className="relative group">
            <input
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-5 py-4 text-lg text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none transition-all group-hover:border-[var(--text-tertiary)]"
            />
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={!nickname.trim()}
            className="w-full rounded-xl bg-[var(--accent)] px-8 py-5 text-xl font-black text-white shadow-[0_0_20px_rgba(129,140,248,0.3)] transition-all hover:bg-[var(--accent-hover)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(129,140,248,0.5)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
          >
            🚀 Create Master Room
          </button>
        </div>

        <div className="mt-12 border-t border-[var(--border-subtle)] pt-10">
          <p className="text-xs text-[var(--text-tertiary)] mb-6 uppercase tracking-[0.2em] font-black">
            — Or Join Active Session —
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleJoinRoom();
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="text"
              placeholder="Paste room link or slug..."
              value={joinSlug}
              onChange={(e) => setJoinSlug(e.target.value)}
              className="flex-grow rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="rounded-lg border border-[var(--border-subtle)] px-6 py-3 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all"
            >
              Join
            </button>
          </form>
        </div>
      </section>

      <section className="mt-20 grid gap-8 sm:grid-cols-3 max-w-5xl w-full">
        <FeatureCard
          icon={Zap}
          title="Real-time"
          desc="Sub-100ms synchronization across all clients worldwide."
          index={0}
        />
        <FeatureCard
          icon={Target}
          title="Fibonacci Scale"
          desc="Standard 0–21, ?, and ☕ scales for flexible estimation."
          index={1}
        />
        <FeatureCard
          icon={Lock}
          title="Ephemeral"
          desc="Privacy first. Room data is purged automatically after 24h."
          index={2}
        />
      </section>
    </main>
  );
}
