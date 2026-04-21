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
  layout?: 'vertical' | 'horizontal';
}

export function PresenceSidebar({
  roomId,
  facilitatorId,
  myIdentityId,
  votes,
  layout = 'vertical',
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

  if (layout === 'horizontal') {
    return (
      <ul className="flex items-center gap-2">
        {players.map((player) => {
          const hasVoted = votes?.some(
            (v) => v.identityId === player.identityId && v.value !== null
          );
          return (
            <li
              key={player._id}
              className={`flex items-center gap-2 px-2 py-1 brutal-border transition-all shrink-0 ${player.isOnline ? 'bg-white' : 'bg-gray-100 opacity-40'}`}
              title={player.name}
            >
              <div className="relative">
                <div className={`w-6 h-6 brutal-border flex items-center justify-center text-[10px] font-black ${hasVoted ? 'bg-retro-green' : 'bg-retro-yellow'}`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>
                {player.identityId === facilitatorId && (
                   <div className="absolute -top-1.5 -right-1.5 text-[8px]">👑</div>
                )}
              </div>
              <span className="text-[10px] font-black uppercase max-w-[60px] truncate">
                {player.name}
              </span>
              
              {isFacilitator && player.isOnline && player.identityId !== myIdentityId && !hasVoted && (
                <button
                  onClick={() => handleNudge(player.identityId, player.name)}
                  className="p-0.5 brutal-border bg-white hover:bg-retro-pink transition-all"
                >
                  <Bell className="w-2.5 h-2.5" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

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
