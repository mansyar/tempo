import type { Id } from '../../convex/_generated/dataModel';
import { Play, CheckCircle2 } from 'lucide-react';
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
  revealDisabled = false,
}: ActiveTopicHeaderProps) {
  if (!activeTopic) return null;

  return (
    <div className="mb-12 island-shell p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-6 rise-in">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent)] text-white font-mono font-bold shadow-lg shadow-[var(--accent)]/20 shrink-0">
          {activeTopic.order}
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--text-tertiary)] mb-1 block">
            Currently Estimating
          </span>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] leading-tight">
            {activeTopic.title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {roomStatus === 'voting' && (
          <RoundTimer
            roomId={roomId}
            identityId={identityId}
            timerStartedAt={timerStartedAt}
            isFacilitator={isFacilitator}
          />
        )}

        {isFacilitator && (
          <div className="flex items-center gap-3 shrink-0">
            {roomStatus === 'voting' ? (
              <button
                onClick={onReveal}
                disabled={revealDisabled}
                className="group flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                title={
                  revealDisabled
                    ? 'Waiting for all players to vote'
                    : 'Reveal votes'
                }
              >
                <Play className="w-4 h-4 fill-current transition-transform group-hover:translate-x-0.5" />
                Reveal Votes
              </button>
            ) : (
              <button
                onClick={onConfirmNext}
                className="group flex items-center gap-2 px-6 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-bold rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] transition-transform group-hover:scale-110" />
                Confirm & Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
