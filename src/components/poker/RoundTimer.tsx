import { useState, useEffect } from 'react';
import { Timer, RotateCcw, Play } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

interface RoundTimerProps {
  roomId: Id<'rooms'>;
  identityId: string;
  timerStartedAt?: number;
  isFacilitator: boolean;
}

export function RoundTimer({
  roomId,
  identityId,
  timerStartedAt,
  isFacilitator,
}: RoundTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const startTimer = useMutation(api.rooms.startTimer);
  const resetTimer = useMutation(api.rooms.resetTimer);

  const DURATION_SECONDS = 60;

  useEffect(() => {
    if (!timerStartedAt) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
      const remaining = Math.max(0, DURATION_SECONDS - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    // Initial calculation
    const elapsed = Math.floor((Date.now() - timerStartedAt) / 1000);
    setTimeLeft(Math.max(0, DURATION_SECONDS - elapsed));

    return () => clearInterval(interval);
  }, [timerStartedAt]);

  const handleStart = () => {
    startTimer({ roomId, identityId });
  };

  const handleReset = () => {
    resetTimer({ roomId, identityId });
  };

  if (timeLeft === null && !isFacilitator) {
    return null;
  }

  const isUrgent = timeLeft !== null && timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="flex items-center gap-4 bg-white px-6 py-3 brutal-border brutal-shadow">
      <div
        className={`flex items-center gap-3 ${isUrgent ? 'animate-pulse text-retro-pink' : 'text-black'}`}
      >
        <Timer className="w-6 h-6" />
        <span className="font-black text-2xl min-w-[3ch]">
          {timeLeft !== null ? `${timeLeft}S` : '--'}
        </span>
      </div>

      {isFacilitator && (
        <div className="flex items-center gap-2 border-l-4 border-black pl-4 ml-2">
          {timeLeft === null ? (
            <button
              onClick={handleStart}
              className="p-2 hover:bg-retro-green brutal-border transition-colors bg-white brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              title="Start Timer"
            >
              <Play className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="p-2 hover:bg-retro-pink brutal-border transition-colors bg-white brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
