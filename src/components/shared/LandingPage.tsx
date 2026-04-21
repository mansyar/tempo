import { useNavigate } from '@tanstack/react-router';
import { useIdentity } from '../../hooks/useIdentity';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Zap, Target, Lock, Users, type LucideIcon } from 'lucide-react';

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

  const handleCreatePokerRoom = async () => {
    if (!nickname.trim()) return;

    try {
      const { slug } = await createRoom({
        facilitatorId: identityId!,
        toolType: 'poker',
      });
      navigate({ to: '/poker/$slug', params: { slug } });
    } catch (error) {
      console.error('Failed to create poker room:', error);
    }
  };

  const handleJoinRoom = () => {
    if (!joinSlug.trim()) return;

    // Extract slug from URL if pasted
    let slug = joinSlug.trim();
    const roomPath = slug.includes('/poker/') ? '/poker/' : '/room/';
    if (slug.includes(roomPath)) {
      const parts = slug.split(roomPath);
      slug = parts[parts.length - 1].split('/')[0];
    }

    navigate({ to: '/poker/$slug', params: { slug } });
  };

  return (
    <main className="page-wrap px-4 pb-16 pt-14 flex flex-col items-center justify-center min-h-[85vh]">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-10 sm:py-16 w-full max-w-4xl text-center shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />

        <div className="mb-8 flex justify-center text-5xl opacity-80 text-[var(--accent)]">
          ◈
        </div>

        <h1 className="display-title mb-6 text-5xl leading-tight font-black tracking-tight text-[var(--text-primary)] sm:text-7xl">
          Tempo
        </h1>

        <p className="mb-12 text-lg text-[var(--text-secondary)] sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Scrum Tools for Modern Teams. High-juice, real-time collaboration
          without the friction.
        </p>

        <div className="mb-10 max-w-md mx-auto">
          <div className="relative group">
            <input
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-5 py-4 text-lg text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none transition-all group-hover:border-[var(--text-tertiary)]"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          {/* Tool: Planning Poker */}
          <button
            onClick={handleCreatePokerRoom}
            disabled={!nickname.trim()}
            className="group relative flex flex-col items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] p-6 transition-all hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="rounded-full bg-[var(--bg-primary)] p-4 text-[var(--accent)] shadow-inner transition-transform group-hover:scale-110">
              <Target className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Planning Poker
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Real-time estimation
              </p>
            </div>
            <div className="mt-2 w-full rounded-lg bg-[var(--accent)] py-3 text-sm font-black text-white transition-colors group-hover:bg-[var(--accent-hover)]">
              🚀 Create Poker Room
            </div>
          </button>

          {/* Tool: Daily Standup (Coming Soon) */}
          <div className="group relative flex flex-col items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] p-6 opacity-60 grayscale transition-all">
            <div className="absolute top-4 right-4 rounded-full bg-[var(--bg-primary)] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] border border-[var(--border-subtle)]">
              Coming Soon
            </div>
            <div className="rounded-full bg-[var(--bg-primary)] p-4 text-[var(--text-tertiary)] shadow-inner">
              <Users className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Daily Standup
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Sync your ceremony
              </p>
            </div>
            <div className="mt-2 w-full rounded-lg bg-[var(--bg-secondary)] py-3 text-sm font-black text-[var(--text-tertiary)] border border-[var(--border-subtle)]">
              🔒 Unavailable
            </div>
          </div>
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
