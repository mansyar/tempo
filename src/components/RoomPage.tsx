import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useIdentity } from '../hooks/useIdentity';
import JoinModal from './JoinModal';
import { PresenceSidebar } from './PresenceSidebar';
import { ClaimBanner } from './ClaimBanner';
import { usePresence } from '../hooks/usePresence';
import { useState } from 'react';

interface RoomPageProps {
  slug: string;
}

export function RoomPage({ slug }: RoomPageProps) {
  const { identityId } = useIdentity();
  const room = useQuery(api.rooms.getBySlug, { slug });
  const joinRoom = useMutation(api.players.join);

  // Local state to track if we've joined this session
  const [hasJoined, setHasJoined] = useState(false);

  // Presence hook
  usePresence(room?._id, identityId!, hasJoined);

  const handleJoin = async (nickname: string) => {
    if (!room) return;
    try {
      await joinRoom({
        roomId: room._id,
        identityId: identityId!,
        name: nickname,
      });
      setHasJoined(true);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  if (room === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-[var(--text-tertiary)]">
          Loading room...
        </div>
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="mb-4 text-4xl">🏜️</div>
        <h2 className="text-2xl font-bold mb-2">Room not found</h2>
        <p className="text-[var(--text-secondary)]">
          This room might have expired or never existed.
        </p>
        <a
          href="/"
          className="mt-6 text-[var(--accent)] hover:underline font-semibold"
        >
          Return Home
        </a>
      </div>
    );
  }

  // If not joined yet, show the join modal
  if (!hasJoined) {
    return <JoinModal roomSlug={slug} onJoin={handleJoin} />;
  }

  return (
    <div className="page-wrap px-4 py-8">
      <ClaimBanner
        roomId={room._id}
        facilitatorId={room.facilitatorId}
        identityId={identityId!}
      />

      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{slug}</h1>
          <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest font-semibold mt-1">
            Planning Poker Room
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Live
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="text-xs font-semibold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Copy Invite Link
          </button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-4">
        <section className="lg:col-span-3">
          <div className="island-shell min-h-[400px] flex items-center justify-center border-2 border-dashed border-[var(--border-subtle)] rounded-[2rem]">
            <div className="text-center text-[var(--text-tertiary)]">
              <p className="text-lg font-semibold mb-1">Voting Area</p>
              <p className="text-sm italic">
                Coming soon: Feature implementation in progress
              </p>
            </div>
          </div>
        </section>

        <aside>
          <div className="island-shell p-6 rounded-2xl h-full">
            <PresenceSidebar
              roomId={room._id}
              facilitatorId={room.facilitatorId}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
