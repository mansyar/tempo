import type { Id } from '../../../convex/_generated/dataModel';
import { Play, CheckCircle2, Settings } from 'lucide-react';
import { RoundTimer } from './RoundTimer';

interface ActiveTopicHeaderProps {
  roomId: Id<'rooms'>;
  identityId: string;
  roomStatus: 'voting' | 'revealed';
  timerStartedAt?: number;
  activeTopic?: {
    _id: Id<'topics'>;
    title: string;
    order: number;
    status: 'pending' | 'active' | 'completed';
  };
  isFacilitator: boolean;
  onReveal: () => void;
  onConfirmNext: () => void;
  onOpenSettings?: () => void;
  revealDisabled?: boolean;
}

export function ActiveTopicHeader({
  roomId,
  identityId,
  roomStatus,
  timerStartedAt,
  activeTopic,
  isFacilitator,
  onReveal,
  onConfirmNext,
  onOpenSettings,
  revealDisabled = false,
}: ActiveTopicHeaderProps) {
  if (!activeTopic) return null;

  return (
    <header className="w-full bg-retro-pink brutal-border border-t-0 border-l-0 border-r-0 p-8 sm:p-12 flex flex-col items-center justify-center relative shrink-0">
      <div className="absolute top-6 right-6 flex gap-6">
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-3 brutal-border bg-white text-black hover:bg-retro-yellow transition-all brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            title="Room Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center max-w-5xl w-full text-center">
        <div className="mb-6 bg-black text-white px-4 py-2 brutal-border text-xs font-black tracking-[0.3em] uppercase">
          {roomStatus === 'revealed' ? 'Estimation Complete' : 'Now Estimating'}
        </div>

        <h2 className="text-5xl sm:text-8xl font-black uppercase text-black border-b-8 border-black inline-block pb-4 mb-8 tracking-tighter leading-[0.9]">
          {activeTopic.title}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-10">
          <RoundTimer
            roomId={roomId}
            identityId={identityId}
            timerStartedAt={timerStartedAt}
            isFacilitator={isFacilitator}
          />

          {isFacilitator && (
            <div className="flex items-center gap-6">
              {roomStatus === 'revealed' ? (
                <button
                  onClick={onConfirmNext}
                  className="px-10 py-5 bg-black text-white text-2xl font-black uppercase brutal-border brutal-shadow hover:bg-retro-green hover:text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  Next Topic
                </button>
              ) : (
                <button
                  onClick={onReveal}
                  disabled={revealDisabled}
                  className="px-10 py-5 bg-white text-black text-2xl font-black uppercase brutal-border brutal-shadow hover:bg-retro-yellow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                >
                  Reveal Votes
                </button>
              )}
            </div>
          )}
        </div>

        {roomStatus === 'voting' && revealDisabled && (
          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] opacity-60 text-black animate-pulse">
            Waiting for all players to vote...
          </p>
        )}
      </div>
    </header>
  );
}
