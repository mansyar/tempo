import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

interface PresenceSidebarProps {
  roomId: Id<'rooms'>;
  facilitatorId: string;
}

export function PresenceSidebar({
  roomId,
  facilitatorId,
}: PresenceSidebarProps) {
  const players = useQuery(api.players.listByRoom, { roomId });

  if (!players) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
        Players — {players.filter((p) => p.isOnline).length}/{players.length}
      </h2>
      <ul className="flex flex-col gap-2">
        {players.map((player) => (
          <li
            key={player._id}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-bold border border-[var(--border-subtle)]">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] ${
                    player.isOnline
                      ? 'bg-[var(--success)]'
                      : 'bg-[var(--text-tertiary)]'
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${player.isOnline ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}
                >
                  {player.name}
                </span>
                {player.identityId === facilitatorId && (
                  <span className="text-[10px] uppercase tracking-tighter text-[var(--warning)] font-bold">
                    👑 Facilitator
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
