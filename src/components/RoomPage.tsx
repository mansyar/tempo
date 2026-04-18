import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useIdentity } from '../hooks/useIdentity';
import JoinModal from './JoinModal';
import { PresenceSidebar } from './PresenceSidebar';
import { TopicSidebar } from './TopicSidebar';
import { BatchAddModal } from './BatchAddModal';
import { ConfirmEstimateModal } from './ConfirmEstimateModal';
import { ActiveTopicHeader } from './ActiveTopicHeader';
import { ClaimBanner } from './ClaimBanner';
import { CardGrid } from './CardGrid';
import { CardDeck } from './CardDeck';
import { EmojiActionBar } from './EmojiActionBar';
import { usePresence } from '../hooks/usePresence';
import { useEmojiReactions } from '../hooks/useEmojiReactions';
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
  const topics = useQuery(api.topics.listByRoom, {
    roomId: room?._id as Id<'rooms'>,
  });

  const joinRoom = useMutation(api.players.join);
  const castVote = useMutation(api.votes.cast);
  const revealVotes = useMutation(api.rooms.reveal);
  const addBatch = useMutation(api.topics.addBatch);
  const nextTopic = useMutation(api.rooms.nextTopic);
  const setFinalEstimate = useMutation(api.topics.setFinalEstimate);

  // Local state to track if we've joined this session
  const [hasJoined, setHasJoined] = useState(() => !!nickname);
  const [isBatchAddOpen, setIsBatchAddOpen] = useState(false);
  const [confirmEstimateState, setConfirmEstimateState] = useState<{
    isOpen: boolean;
    suggested: string;
  }>({ isOpen: false, suggested: '' });

  // Emoji Reactions hook
  const { localReactions, sendReaction } = useEmojiReactions(
    room?._id,
    identityId
  );

  // Auto-join background sync if we have a nickname
  useEffect(() => {
    if (room && identityId && nickname) {
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
  }, [room, identityId, nickname, joinRoom]);

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
        topicId: room.currentTopicId,
        value,
      });
    } catch (error) {
      console.error('Failed to cast vote:', error);
    }
  };

  const handleBatchAdd = async (titlesString: string) => {
    if (!room) return;
    try {
      await addBatch({
        roomId: room._id,
        identityId: identityId!,
        titlesString,
      });
      setIsBatchAddOpen(false);
    } catch (err) {
      console.error('Failed to batch add topics:', err);
    }
  };

  const handleReveal = async () => {
    if (!room) return;
    try {
      play('whoosh');
      await revealVotes({
        roomId: room._id,
        identityId: identityId!,
      });
    } catch (error) {
      console.error('Failed to reveal votes:', error);
    }
  };

  const handleConfirmNext = () => {
    if (!room || !votes) return;
    const stats = calculateStats(votes.map((v) => v.value));
    setConfirmEstimateState({
      isOpen: true,
      suggested: stats.average,
    });
  };

  const handleConfirmFinal = async (estimate: string) => {
    if (!room) return;
    try {
      play('whoosh');
      if (room.currentTopicId) {
        await setFinalEstimate({
          topicId: room.currentTopicId,
          identityId: identityId!,
          estimate,
        });
      }
      await nextTopic({
        roomId: room._id,
        identityId: identityId!,
      });
      setConfirmEstimateState({ isOpen: false, suggested: '' });
    } catch (error) {
      console.error('Failed to advance topic:', error);
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

  // If we don't have a nickname, show the join modal immediately
  if (!nickname && !hasJoined) {
    return <JoinModal roomSlug={slug} onJoin={handleJoin} />;
  }

  const isFacilitator = room.facilitatorId === identityId;
  const myVote = votes?.find((v) => v.identityId === identityId)?.value;
  const activeTopic = topics?.find((t) => t._id === room.currentTopicId);

  // Logic to disable reveal if not everyone has voted
  const onlinePlayers = players?.filter((p) => p.isOnline) || [];
  const currentTopicVotes =
    votes?.filter((v) => v.topicId === activeTopic?._id && v.value !== null) ||
    [];
  const revealDisabled = currentTopicVotes.length < onlinePlayers.length;

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
        </header>

        {activeTopic ? (
          <ActiveTopicHeader
            roomStatus={room.status}
            activeTopic={activeTopic}
            isFacilitator={isFacilitator}
            onReveal={handleReveal}
            onConfirmNext={handleConfirmNext}
            revealDisabled={revealDisabled}
          />
        ) : (
          isFacilitator && (
            <div className="mb-12 island-shell p-8 rounded-3xl bg-[var(--bg-secondary)] border border-dashed border-[var(--border-subtle)] text-center rise-in">
              <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-4">
                No active topic. Ready to start?
              </h2>
              <button
                onClick={() =>
                  nextTopic({ roomId: room._id, identityId: identityId! })
                }
                className="px-8 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg"
              >
                Start Estimation
              </button>
            </div>
          )
        )}

        <div className="grid gap-12 lg:grid-cols-3">
          <section className="lg:col-span-2">
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

          <aside className="space-y-8 flex flex-col min-h-[500px]">
            <div className="island-shell rounded-2xl flex-1 flex flex-col overflow-hidden">
              <TopicSidebar
                roomId={room._id}
                facilitatorId={room.facilitatorId}
                identityId={identityId!}
                onOpenBatchAdd={() => setIsBatchAddOpen(true)}
              />
            </div>
            <div className="island-shell p-6 rounded-2xl shrink-0">
              <PresenceSidebar
                roomId={room._id}
                facilitatorId={room.facilitatorId}
              />
            </div>
          </aside>
        </div>
      </div>

      <CardDeck onSelect={handleVote} selectedVote={myVote} />

      <div className="fixed bottom-24 right-4 z-50 pointer-events-auto sm:right-8 sm:bottom-28">
        <EmojiActionBar onSelect={sendReaction} />
        <div className="flex flex-col gap-1 mt-2 items-end overflow-hidden h-32 pointer-events-none">
          {localReactions.map((r) => (
            <span key={r.id} className="text-2xl animate-bounce">
              {r.emoji}
            </span>
          ))}
        </div>
      </div>

      {isFacilitator && (
        <>
          <BatchAddModal
            roomId={room._id}
            isOpen={isBatchAddOpen}
            onClose={() => setIsBatchAddOpen(false)}
            onSubmit={handleBatchAdd}
          />
          <ConfirmEstimateModal
            isOpen={confirmEstimateState.isOpen}
            onClose={() =>
              setConfirmEstimateState({
                ...confirmEstimateState,
                isOpen: false,
              })
            }
            onConfirm={handleConfirmFinal}
            suggestedEstimate={confirmEstimateState.suggested}
            topicTitle={activeTopic?.title || ''}
          />
        </>
      )}
    </div>
  );
}
