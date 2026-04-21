import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

interface PresenceSidebarProps {
  roomId: Id<'rooms'>;
  facilitatorId: string;
  myIdentityId: string;
  votes?: { identityId: string; value: string | number | null }[];
}

export function PresenceSidebar({
  roomId,
  facilitatorId,
  myIdentityId,
  votes,
}: PresenceSidebarProps) {
  const players = useQuery(api.players.listByRoom, { roomId });
  const nudgePlayer = useMutation(api.players.nudge);

  if (!players) return null;

  const handleNudge = async (targetId: string, name: string) => {
    try {
      await nudgePlayer({
        roomId,
        identityId: myIdentityId,
        targetIdentityId: targetId,
      });
      toast.success(`Nudged ${name}!`);
    } catch {
      toast.error('Failed to nudge player');
    }
  };

  const isFacilitator = myIdentityId === facilitatorId;

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

            {isFacilitator &&
              player.isOnline &&
              player.identityId !== myIdentityId &&
              !votes?.some(
                (v) => v.identityId === player.identityId && v.value !== null
              ) && (
                <button
                  onClick={() => handleNudge(player.identityId, player.name)}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--bg-tertiary)] transition-all opacity-0 group-hover:opacity-100"
                  title={`Nudge ${player.name}`}
                >
                  <Bell className="w-3.5 h-3.5" />
                </button>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
}
