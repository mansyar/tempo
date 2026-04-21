import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useIdentity } from '../../hooks/useIdentity';
import { JoinModal } from '../shared/JoinModal';
import { MobileController } from './MobileController';
import { RoomSettingsModal } from './RoomSettingsModal';
import { PresenceSidebar } from '../shared/PresenceSidebar';
import { TopicSidebar } from './TopicSidebar';
import { ConfirmEstimateModal } from './ConfirmEstimateModal';
import SectionErrorBoundary from '../shared/SectionErrorBoundary';
import { ActiveTopicHeader } from './ActiveTopicHeader';
import { ClaimBanner } from '../shared/ClaimBanner';
import { CardGrid } from './CardGrid';
import { CardDeck } from './CardDeck';
import { EmojiActionBar } from '../shared/EmojiActionBar';
import { EmojiBurst } from '../shared/EmojiBurst';
import { announce } from '../shared/AriaLiveAnnouncer';
import { useEmojiReactions } from '../../hooks/useEmojiReactions';
import { usePresence } from '../../hooks/usePresence';
import { useSound } from '../../hooks/useSound';
import { useJuice } from '../shared/JuiceToggle';
import { useState, useEffect, lazy, Suspense } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { calculateStats, isUnanimous } from '../../utils/stats';

import type { Id } from '../../../convex/_generated/dataModel';

// Lazy load heavy components
const BatchAddModal = lazy(() =>
  import('./BatchAddModal').then((m) => ({ default: m.BatchAddModal }))
);
const StatsPanel = lazy(() =>
  import('./StatsPanel').then((m) => ({ default: m.StatsPanel }))
);
const InviteModal = lazy(() =>
  import('../shared/InviteModal').then((m) => ({ default: m.InviteModal }))
);

interface RoomPageProps {
  slug: string;
}

export function RoomPage({ slug }: RoomPageProps) {
  const { identityId, nickname } = useIdentity();
  const { play, vibrate, patterns } = useSound();
  const { enabled: juiceEnabled } = useJuice();
  const [isControllerMode, setIsControllerMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      const synced = localStorage.getItem('pointy_isController') === 'true';
      if (isMobile && synced) {
        setIsControllerMode(true);
      }
    }
  }, []);

  const handleExitController = () => {
    localStorage.removeItem('pointy_isController');
    setIsControllerMode(false);
  };

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

  const activeTopic = topics?.find((t) => t._id === room?.currentTopicId);

  // Dynamic tab title
  useEffect(() => {
    if (!room) {
      document.title = 'Tempo - Planning Poker';
      return;
    }

    if (activeTopic) {
      const emoji = room.status === 'revealed' ? '✅' : '🤔';
      const status = room.status === 'revealed' ? 'Revealed' : 'Voting';
      document.title = `${emoji} ${status}: ${activeTopic.title} | Tempo`;
    } else {
      document.title = 'Tempo - Planning Poker';
    }

    return () => {
      document.title = 'Tempo - Planning Poker';
    };
  }, [room?.status, activeTopic?.title, room]);

  // Accessibility Announcements for State Changes
  useEffect(() => {
    if (room?.status === 'revealed') {
      announce('Votes Revealed');
    }
  }, [room?.status]);

  useEffect(() => {
    if (activeTopic?.title) {
      announce(`New Topic: ${activeTopic.title}`);
    }
  }, [activeTopic?._id, activeTopic?.title]);

  // Local state to track if we've joined this session
  const [hasJoined, setHasJoined] = useState(() => !!nickname);
  const [isBatchAddOpen, setIsBatchAddOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
  usePresence(room?._id, identityId!, hasJoined, players);
  // Celebration Effect
  useEffect(() => {
    if (room?.status === 'revealed' && votes) {
      const voteValues = votes.map((v) => v.value);
      if (isUnanimous(voteValues)) {
        play('confetti');
        vibrate(patterns.success); // Celebrate consensus!
        announce('Consensus Reached! Everyone agreed.');
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
  }, [room?.status, votes, play, vibrate, patterns.success, juiceEnabled]);

  const handleJoin = async (nickname: string) => {
    if (!room) return;
    try {
      await joinRoom({
        roomId: room._id,
        identityId: identityId!,
        name: nickname,
      });
      setHasJoined(true);
    } catch {
      toast.error('Failed to join room');
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
      toast.success('Vote cast!');
    } catch {
      toast.error('Failed to cast vote');
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
      toast.success('Topics added!');
    } catch {
      toast.error('Failed to add topics');
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
      toast.success('Votes revealed!');
    } catch {
      toast.error('Failed to reveal votes');
    }
  };

  const handleConfirmNext = () => {
    if (!room || !votes) return;
    const stats = calculateStats(votes.map((v) => v.value));
    setConfirmEstimateState({
      isOpen: true,
      suggested: String(stats.average),
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
      toast.success('Topic advanced!');
    } catch {
      toast.error('Failed to advance topic');
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

  if (isControllerMode) {
    return <MobileController slug={slug} onExit={handleExitController} />;
  }

  // If we don't have a nickname, show the join modal immediately
  if (!nickname && !hasJoined) {
    return <JoinModal roomSlug={slug} onJoin={handleJoin} />;
  }

  const isFacilitator = room.facilitatorId === identityId;
  const myVote = votes?.find((v) => v.identityId === identityId)?.value;

  // Logic to disable reveal if not everyone has voted
  const onlinePlayers = players?.filter((p) => p.isOnline) || [];
  const currentTopicVotes =
    votes?.filter((v) => v.topicId === activeTopic?._id && v.value !== null) ||
    [];
  const revealDisabled = currentTopicVotes.length < onlinePlayers.length;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden uppercase font-black bg-white">
      {/* Ticker Tape Header */}
      <div className="bg-black text-white py-2 brutal-border border-l-0 border-r-0 border-t-0 flex items-center text-base tracking-widest overflow-hidden shrink-0">
        <div className="flex whitespace-nowrap marquee-content animate-[marquee_20s_linear_infinite]">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="mx-8">
              ROOM: {slug} // {onlinePlayers.length} ONLINE // {room.status === 'revealed' ? 'VOTES REVEALED' : 'ESTIMATION IN PROGRESS'} // NO LURKERS ALLOWED // 
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex w-full min-h-0 relative overflow-hidden">
        <aside className="w-96 bg-white brutal-border border-t-0 border-l-0 border-b-0 flex flex-col shrink-0 z-10 overflow-hidden">
          <SectionErrorBoundary name="Topic Sidebar">
            <TopicSidebar
              roomId={room._id}
              facilitatorId={room.facilitatorId}
              identityId={identityId!}
              onOpenBatchAdd={() => setIsBatchAddOpen(true)}
            />
          </SectionErrorBoundary>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-grid overflow-hidden">
          <ClaimBanner
            roomId={room._id}
            facilitatorId={room.facilitatorId}
            identityId={identityId!}
          />

          {activeTopic ? (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <ActiveTopicHeader
                roomId={room._id}
                identityId={identityId!}
                roomStatus={room.status}
                timerStartedAt={room.timerStartedAt}
                activeTopic={activeTopic}
                isFacilitator={isFacilitator}
                onReveal={handleReveal}
                onConfirmNext={handleConfirmNext}
                onOpenSettings={() => setIsSettingsOpen(true)}
                revealDisabled={revealDisabled}
              />

              <div className="flex-1 flex flex-col items-center justify-center p-4 relative min-h-0 overflow-hidden">
                {room.status === 'revealed' && votes && players && (
                  <div className="w-full max-w-5xl mb-8">
                    <SectionErrorBoundary name="Statistics">
                      <Suspense
                        fallback={
                          <div className="h-64 brutal-border animate-pulse bg-white" />
                        }
                      >
                        <StatsPanel players={players} votes={votes} />
                      </Suspense>
                    </SectionErrorBoundary>
                  </div>
                )}

                <div className="w-full flex-1 flex items-center justify-center overflow-y-auto custom-scrollbar p-10">
                  <SectionErrorBoundary name="Voting Grid">
                    {players && votes ? (
                      <CardGrid
                        players={players}
                        votes={votes}
                        revealed={room.status === 'revealed'}
                      />
                    ) : (
                      <div className="text-4xl italic font-black">
                        LOADING...
                      </div>
                    )}
                  </SectionErrorBoundary>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12">
              {isFacilitator && (
                <div className="bg-white brutal-border brutal-shadow p-16 text-center max-w-2xl">
                  <h2 className="text-6xl font-black mb-6">
                    NO ACTIVE TOPIC.
                  </h2>
                  <p className="text-2xl font-bold mb-16 opacity-60">
                    CHOOSE YOUR SCALE IN SETTINGS OR HIT THE BUTTON TO COMMENCE.
                  </p>
                  <div className="flex flex-col gap-8">
                    <button
                      onClick={() =>
                        nextTopic({ roomId: room._id, identityId: identityId! })
                      }
                      className="w-full py-8 bg-retro-green text-black text-3xl font-black brutal-border brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      START ESTIMATION
                    </button>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="w-full py-6 bg-retro-yellow text-black text-2xl font-black brutal-border brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      ROOM SETTINGS
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="shrink-0">
            <CardDeck
              onSelect={handleVote}
              selectedVote={myVote}
              scaleType={room.scaleType}
            />
          </div>
        </main>

        {/* Presence Floating Sidebar */}
        <div className="absolute top-6 right-6 z-20 w-80 pointer-events-none">
           <div className="pointer-events-auto bg-white brutal-border brutal-shadow p-6">
              <div className="mb-4 flex items-center justify-between border-b-4 border-black pb-2">
                <h3 className="text-sm font-black tracking-widest">PLAYERS — {onlinePlayers.length}/{players?.length || 0}</h3>
              </div>
              <SectionErrorBoundary name="Presence Sidebar">
                <PresenceSidebar
                  roomId={room._id}
                  facilitatorId={room.facilitatorId}
                  myIdentityId={identityId!}
                  votes={votes}
                />
              </SectionErrorBoundary>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="w-full mt-6 py-4 bg-black text-white text-sm font-black uppercase brutal-border hover:bg-retro-pink transition-colors brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-sm"
              >
                Invite Players
              </button>
           </div>
        </div>
      </div>

      <div className="fixed bottom-40 right-6 z-50 pointer-events-auto">
        <EmojiActionBar onSelect={sendReaction} />
      </div>

      <EmojiBurst reactions={localReactions} />

      {isFacilitator && (
        <>
          <Suspense fallback={null}>
            <BatchAddModal
              roomId={room._id}
              isOpen={isBatchAddOpen}
              onClose={() => setIsBatchAddOpen(false)}
              onSubmit={handleBatchAdd}
            />
          </Suspense>
          <RoomSettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            roomId={room._id}
            identityId={identityId!}
            initialAutoReveal={room.autoReveal}
            initialScaleType={room.scaleType}
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

      <Suspense fallback={null}>
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          roomUrl={typeof window !== 'undefined' ? window.location.href : ''}
        />
      </Suspense>
    </div>
  );
}
