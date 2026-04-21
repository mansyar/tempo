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
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-3">
        {players.map((player) => (
          <li
            key={player._id}
            className={`flex items-center justify-between p-3 brutal-border transition-all ${player.isOnline ? 'bg-white' : 'bg-gray-100 opacity-60'}`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 brutal-border bg-retro-yellow flex items-center justify-center text-xl font-black">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                {player.isOnline && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 brutal-border bg-retro-green" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black uppercase text-black">
                  {player.name}
                </span>
                {player.identityId === facilitatorId && (
                  <span className="text-[10px] uppercase font-black text-retro-pink">
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
                  className="p-2 brutal-border bg-white text-black hover:bg-retro-pink transition-all brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                  title={`Nudge ${player.name}`}
                >
                  <Bell className="w-4 h-4" />
                </button>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
}
