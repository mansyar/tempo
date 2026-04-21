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
    <header className="w-full bg-retro-pink brutal-border border-t-0 border-l-0 border-r-0 p-6 sm:p-10 flex flex-col items-center justify-center relative shrink-0">
      <div className="absolute top-4 right-4 flex gap-4">
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-2 brutal-border bg-white text-black hover:bg-retro-yellow transition-all brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-sm"
            title="Room Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center max-w-4xl w-full text-center">
        <div className="mb-4 bg-black text-white px-3 py-1 brutal-border text-[10px] font-black tracking-widest uppercase">
          {roomStatus === 'revealed' ? 'Estimation Complete' : 'Now Estimating'}
        </div>

        <h2 className="text-4xl sm:text-6xl font-black uppercase text-black border-b-4 border-black inline-block pb-3 mb-6 tracking-tight">
          {activeTopic.title}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <RoundTimer
            roomId={roomId}
            identityId={identityId}
            timerStartedAt={timerStartedAt}
            isFacilitator={isFacilitator}
          />

          {isFacilitator && (
            <div className="flex items-center gap-4">
              {roomStatus === 'revealed' ? (
                <button
                  onClick={onConfirmNext}
                  className="px-8 py-3 bg-black text-white text-lg font-black uppercase brutal-border brutal-shadow hover:bg-retro-green hover:text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  Next Topic
                </button>
              ) : (
                <button
                  onClick={onReveal}
                  disabled={revealDisabled}
                  className="px-8 py-3 bg-white text-black text-lg font-black uppercase brutal-border brutal-shadow hover:bg-retro-yellow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                >
                  Reveal Votes
                </button>
              )}
            </div>
          )}
        </div>

        {roomStatus === 'voting' && revealDisabled && (
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-60 text-black">
            Waiting for all players to vote...
          </p>
        )}
      </div>
    </header>
  );
}
