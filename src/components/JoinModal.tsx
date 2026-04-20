import { useState } from 'react';
import { useIdentity } from '../hooks/useIdentity';

interface JoinModalProps {
  roomSlug: string;
  playerCount?: number;
  onJoin: (nickname: string) => void;
}

export function JoinModal({
  roomSlug,
  playerCount = 0,
  onJoin,
}: JoinModalProps) {
  const { nickname: savedNickname, setNickname: saveNickname } = useIdentity();
  const [nickname, setNicknameState] = useState(savedNickname || '');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      saveNickname(nickname);
      onJoin(nickname);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--bg-primary)] bg-opacity-80 backdrop-blur-sm px-4">
      <div className="island-shell rise-in w-full max-w-md rounded-2xl p-8 text-center">
        <div className="mb-4 text-3xl">♠</div>
        <h2 className="display-title mb-2 text-2xl font-bold text-[var(--text-primary)]">
          Welcome to Pointy
        </h2>
        <p className="mb-6 text-sm text-[var(--text-secondary)]">
          Room:{' '}
          <span className="font-mono text-[var(--accent)]">{roomSlug}</span>
          {playerCount > 0 && ` · ${playerCount} players in room`}
        </p>

        <form onSubmit={handleJoin} className="space-y-4">
          <div className="text-left">
            <label
              htmlFor="nickname"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-2 ml-1"
            >
              Enter your nickname:
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="e.g., Alice"
              value={nickname}
              onChange={(e) => setNicknameState(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-4 py-3 text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] transition-all"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!nickname.trim()}
            className="w-full rounded-lg bg-[var(--accent)] px-6 py-3.5 font-bold text-white transition hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎯 Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
