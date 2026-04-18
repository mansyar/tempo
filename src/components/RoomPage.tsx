import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useIdentity } from '../hooks/useIdentity';
import JoinModal from './JoinModal';
import { PresenceSidebar } from './PresenceSidebar';
import { ClaimBanner } from './ClaimBanner';
import { CardGrid } from './CardGrid';
import { CardDeck } from './CardDeck';
import { usePresence } from '../hooks/usePresence';
import { useSound } from '../hooks/useSound';
import { useJuice } from './JuiceToggle';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { calculateStats, isUnanimous } from '../utils/stats';

import type { Id } from '../../convex/_generated/dataModel';

interface RoomPageProps {
  slug: string;
}

export function RoomPage({ slug }: RoomPageProps) {
  const { identityId, nickname } = useIdentity();
  const { play } = useSound();
  const { enabled: juiceEnabled } = useJuice();
  const room = useQuery(api.rooms.getBySlug, { slug });
  const players = useQuery(api.players.listByRoom, {
    roomId: room?._id as Id<'rooms'>,
  });
  const votes = useQuery(api.votes.listByRoom, {
    roomId: room?._id as Id<'rooms'>,
    identityId: identityId!,
  });

  const joinRoom = useMutation(api.players.join);
  const castVote = useMutation(api.votes.cast);
  const revealVotes = useMutation(api.rooms.reveal);
  const resetRound = useMutation(api.rooms.reset);

  // Local state to track if we've joined this session
  const [hasJoined, setHasJoined] = useState(false);

  // Auto-join if we have a nickname and haven't joined yet
  useEffect(() => {
    if (room && identityId && nickname && !hasJoined) {
      joinRoom({
        roomId: room._id,
        identityId: identityId,
        name: nickname,
      })
        .then(() => {
          setHasJoined(true);
        })
        .catch((error) => {
          console.error('Failed to auto-join room:', error);
        });
    }
  }, [room, identityId, nickname, hasJoined, joinRoom]);

  // Presence hook
  usePresence(room?._id, identityId!, hasJoined);

  // Celebration Effect
  useEffect(() => {
    if (room?.status === 'revealed' && votes) {
      const voteValues = votes.map((v) => v.value);
      if (isUnanimous(voteValues)) {
        play('confetti');
        if (juiceEnabled) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#a855f7', '#ec4899'],
          });
        }
      }
    }
  }, [room?.status, votes, play, juiceEnabled]);

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

  const handleVote = async (value: string | number) => {
    if (!room) return;
    try {
      play('pop');
      await castVote({
        roomId: room._id,
        identityId: identityId!,
        value,
      });
    } catch (error) {
      console.error('Failed to cast vote:', error);
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

  const isFacilitator = room.facilitatorId === identityId;
  const myVote = votes?.find((v) => v.identityId === identityId)?.value;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 page-wrap px-4 py-8">
        <ClaimBanner
          roomId={room._id}
          facilitatorId={room.facilitatorId}
          identityId={identityId!}
        />

        <header className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{slug}</h1>
            <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest font-semibold mt-1">
              Planning Poker Room
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isFacilitator && (
              <div className="flex items-center gap-2 pr-4 border-r border-[var(--border-subtle)]">
                {room.status === 'voting' ? (
                  <button
                    onClick={() => {
                      play('whoosh');
                      revealVotes({
                        roomId: room._id,
                        identityId: identityId!,
                      });
                    }}
                    className="px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg"
                  >
                    Reveal Votes
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      play('whoosh');
                      resetRound({ roomId: room._id, identityId: identityId! });
                    }}
                    className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-bold rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all"
                  >
                    Reset Round
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Live
              </span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                className="text-xs font-semibold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Copy Invite
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-12 lg:grid-cols-4">
          <section className="lg:col-span-3">
            {room.status === 'revealed' && votes && (
              <div className="mb-12 flex justify-center gap-8 sm:gap-12 animate-in fade-in slide-in-from-top-4 duration-500">
                {(() => {
                  const stats = calculateStats(votes.map((v) => v.value));
                  return (
                    <>
                      <div className="flex flex-col items-center">
                        <span className="text-[var(--text-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">
                          Average
                        </span>
                        <span className="text-3xl font-black text-[var(--accent)]">
                          {stats.average}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[var(--text-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">
                          Median
                        </span>
                        <span className="text-3xl font-black text-[var(--text-primary)]">
                          {stats.median}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[var(--text-tertiary)] text-[10px] uppercase font-bold tracking-widest mb-1">
                          Mode
                        </span>
                        <span className="text-3xl font-black text-[var(--text-primary)]">
                          {stats.mode.join(', ') || '-'}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {players && votes ? (
              <CardGrid
                players={players}
                votes={votes}
                revealed={room.status === 'revealed'}
              />
            ) : (
              <div className="h-64 flex items-center justify-center italic text-[var(--text-tertiary)]">
                Loading voting area...
              </div>
            )}
          </section>

          <aside>
            <div className="island-shell p-6 rounded-2xl">
              <PresenceSidebar
                roomId={room._id}
                facilitatorId={room.facilitatorId}
              />
            </div>
          </aside>
        </div>
      </div>

      <CardDeck onSelect={handleVote} selectedVote={myVote} />
    </div>
  );
}
