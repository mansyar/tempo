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
  const colors = [
    'bg-retro-yellow',
    'bg-retro-pink',
    'bg-retro-blue',
    'bg-retro-green',
  ];
  const bgColor = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index + 0.5 }}
      className={`relative h-full w-full brutal-border ${bgColor} p-8 brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-sm transition-all`}
    >
      <div className="flex flex-col items-center text-center h-full justify-center">
        <div className="mb-6 bg-white p-4 brutal-border brutal-shadow">
          <Icon className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black uppercase mb-3 leading-none">
          {title}
        </h3>
        <p className="text-sm font-bold uppercase opacity-90 leading-tight">
          {desc}
        </p>
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
    <main className="px-4 pb-16 pt-24 flex flex-col items-center">
      {/* Ticker Tape */}
      <div className="fixed top-0 left-0 w-full bg-black text-white py-2 overflow-hidden z-50 brutal-border border-x-0 border-t-0">
        <div className="flex whitespace-nowrap marquee-content animate-[marquee_15s_linear_infinite]">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="mx-8 font-black uppercase tracking-widest">
              Tempo • High-Juice Collaboration • Agile Done Raw • Ephemeral & Secure • 
            </span>
          ))}
        </div>
      </div>

      <section className="relative w-full max-w-4xl text-center py-12 sm:py-20">
        {/* Decorative Badges */}
        <div className="absolute -top-4 -left-8 hidden lg:block brutal-badge rotate-[-12deg] bg-retro-pink p-3 brutal-border brutal-shadow font-black uppercase text-sm">
          No Friction
        </div>
        <div className="absolute top-10 -right-12 hidden lg:block brutal-badge rotate-[12deg] bg-retro-blue p-3 brutal-border brutal-shadow font-black uppercase text-sm">
          Real-Time
        </div>

        <div className="mb-6 inline-block bg-retro-yellow px-4 py-1 brutal-border font-black uppercase tracking-tighter">
          The New Standard
        </div>

        <h1 className="mb-8 text-7xl leading-[0.9] font-black tracking-tighter sm:text-9xl uppercase mix-blend-multiply italic">
          Tempo
        </h1>

        <p className="mb-12 text-xl font-medium sm:text-2xl max-w-2xl mx-auto leading-tight">
          Scrum Tools for Modern Teams. <br />
          <span className="bg-retro-green px-2">High-juice, real-time collaboration</span> without the friction.
        </p>

        <div className="mb-12 max-w-md mx-auto">
          <input
            type="text"
            placeholder="ENTER YOUR NICKNAME"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full brutal-border bg-white px-5 py-5 text-xl font-black uppercase placeholder:text-gray-400 focus:bg-retro-yellow focus:outline-none transition-all brutal-shadow"
          />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
          {/* Tool: Planning Poker */}
          <button
            onClick={handleCreatePokerRoom}
            disabled={!nickname.trim()}
            className="group relative flex flex-col items-center gap-6 brutal-border bg-retro-blue p-8 transition-all brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-sm disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          >
            <div className="bg-white p-5 brutal-border brutal-shadow group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
              <Target className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase leading-none mb-2">
                Planning Poker
              </h3>
              <p className="text-sm font-bold uppercase opacity-80">
                Real-time estimation
              </p>
            </div>
            <div className="w-full bg-black py-4 text-base font-black text-white uppercase group-hover:bg-retro-pink transition-colors">
              🚀 Start Session
            </div>
          </button>

          {/* Tool: Daily Standup (Coming Soon) */}
          <div className="group relative flex flex-col items-center gap-6 brutal-border bg-retro-pink p-8 opacity-40 grayscale">
            <div className="absolute -top-4 -right-4 bg-black text-white px-3 py-1 text-xs font-black uppercase rotate-12 brutal-border">
              Soon
            </div>
            <div className="bg-white p-5 brutal-border">
              <Users className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase leading-none mb-2">
                Daily Standup
              </h3>
              <p className="text-sm font-bold uppercase opacity-80">
                Sync ceremonies
              </p>
            </div>
            <div className="w-full bg-retro-tertiary py-4 text-base font-black text-black uppercase border-t-4 border-black">
              Locked
            </div>
          </div>
        </div>

        <div className="mt-20 brutal-border border-x-0 border-b-0 pt-16">
          <p className="text-sm font-black mb-8 uppercase tracking-widest">
            — Or Join Active Session —
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleJoinRoom();
            }}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <input
              type="text"
              placeholder="PASTE LINK OR SLUG..."
              value={joinSlug}
              onChange={(e) => setJoinSlug(e.target.value)}
              className="flex-grow brutal-border bg-white px-4 py-4 text-sm font-bold uppercase focus:bg-retro-yellow focus:outline-none"
            />
            <button
              type="submit"
              className="brutal-border bg-black px-8 py-4 text-sm font-black text-white uppercase hover:bg-retro-pink transition-all brutal-shadow"
            >
              Join
            </button>
          </form>
        </div>
      </section>

      <section className="mt-20 grid gap-10 sm:grid-cols-3 max-w-6xl w-full px-4 pb-20">
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
