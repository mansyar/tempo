import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useIdentity } from '../hooks/useIdentity';
import { CardDeck } from './CardDeck';
import { EmojiActionBar } from './EmojiActionBar';
import { useSound } from '../hooks/useSound';
import { RoundTimer } from './RoundTimer';
import { toast } from 'sonner';
import type { Id } from '../../convex/_generated/dataModel';
import { Smartphone, LogOut, Play, RotateCcw, Eye } from 'lucide-react';

interface MobileControllerProps {
  slug: string;
  onExit: () => void;
}

export function MobileController({ slug, onExit }: MobileControllerProps) {
  const { identityId, nickname } = useIdentity();
  const { play } = useSound();
  const room = useQuery(api.rooms.getBySlug, { slug });
  const votes = useQuery(api.votes.listByRoom, {
    roomId: room?._id as Id<'rooms'>,
    identityId: identityId!,
  });
  const topics = useQuery(api.topics.listByRoom, {
    roomId: room?._id as Id<'rooms'>,
  });

  const castVote = useMutation(api.votes.cast);
  const revealVotes = useMutation(api.rooms.reveal);
  const resetRound = useMutation(api.rooms.reset);
  const nextTopic = useMutation(api.rooms.nextTopic);

  const activeTopic = topics?.find((t) => t._id === room?.currentTopicId);
  const myVote = votes?.find((v) => v.identityId === identityId)?.value;
  const isFacilitator = room?.facilitatorId === identityId;

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
      // Haptic feedback
      if (window.navigator.vibrate) window.navigator.vibrate(50);
      toast.success('Vote cast!');
    } catch {
      toast.error('Failed to cast vote');
    }
  };

  const handleAction = async (
    action: () => Promise<unknown>,
    successMsg: string
  ) => {
    try {
      await action();
      if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
      toast.success(successMsg);
    } catch {
      toast.error('Action failed');
    }
  };

  if (!room) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[var(--bg-primary)] p-6 overflow-hidden safe-area-inset">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--bg-tertiary)] rounded-xl">
            <Smartphone className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold truncate max-w-[150px]">{slug}</h1>
            <p className="text-xs text-[var(--text-tertiary)] font-mono">
              {nickname}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {room.status === 'voting' && (
            <RoundTimer
              roomId={room._id}
              identityId={identityId!}
              timerStartedAt={room.timerStartedAt}
              isFacilitator={isFacilitator}
            />
          )}
          <button
            onClick={onExit}
            className="p-3 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-tertiary)] active:bg-[var(--bg-glass)]"
            aria-label="Exit Controller"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center">
        {activeTopic ? (
          <div className="w-full">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] bg-[var(--accent)] bg-opacity-10 px-3 py-1 rounded-full mb-4 inline-block">
              {room.status === 'voting' ? '🤔 Voting' : '✅ Revealed'}
            </span>
            <h2 className="text-2xl font-bold mb-2 leading-tight">
              {activeTopic.title}
            </h2>
            <p className="text-sm text-[var(--text-tertiary)] mb-12">
              {myVote ? `Your vote: ${myVote}` : 'Ready to vote?'}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold text-[var(--text-tertiary)] mb-8">
              No active topic
            </h2>
            {isFacilitator && (
              <button
                onClick={() =>
                  handleAction(
                    () =>
                      nextTopic({ roomId: room._id, identityId: identityId! }),
                    'Round started!'
                  )
                }
                className="flex items-center justify-center gap-3 w-64 mx-auto py-5 bg-[var(--accent)] text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all"
              >
                <Play className="fill-current w-5 h-5" />
                Start Round
              </button>
            )}
          </div>
        )}

        {isFacilitator && activeTopic && (
          <div className="grid grid-cols-2 gap-4 w-full mt-auto mb-12">
            {room.status === 'voting' ? (
              <button
                onClick={() =>
                  handleAction(
                    () =>
                      revealVotes({
                        roomId: room._id,
                        identityId: identityId!,
                      }),
                    'Votes revealed!'
                  )
                }
                className="flex items-center justify-center gap-2 py-4 bg-[var(--success)] text-white font-bold rounded-2xl active:scale-95 transition-all"
              >
                <Eye className="w-5 h-5" />
                Reveal
              </button>
            ) : (
              <button
                onClick={() =>
                  handleAction(
                    () =>
                      nextTopic({ roomId: room._id, identityId: identityId! }),
                    'Topic advanced!'
                  )
                }
                className="flex items-center justify-center gap-2 py-4 bg-[var(--accent)] text-white font-bold rounded-2xl active:scale-95 transition-all"
              >
                <Play className="fill-current w-5 h-5" />
                Next
              </button>
            )}
            <button
              onClick={() =>
                handleAction(
                  () =>
                    resetRound({ roomId: room._id, identityId: identityId! }),
                  'Round reset!'
                )
              }
              className="flex items-center justify-center gap-2 py-4 bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-bold rounded-2xl border border-[var(--border-subtle)] active:scale-95 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pt-12">
        <CardDeck
          onSelect={handleVote}
          selectedVote={myVote}
          isController
          scaleType={room.scaleType}
        />
      </div>

      <div className="fixed top-1/2 -translate-y-1/2 right-4">
        <EmojiActionBar
          onSelect={(_emoji) => {
            // Placeholder for emoji reaction logic
            if (window.navigator.vibrate) window.navigator.vibrate(20);
          }}
        />
      </div>
    </div>
  );
}
