import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

interface ClaimBannerProps {
  roomId: Id<'rooms'>;
  facilitatorId: string;
  identityId: string;
}

export function ClaimBanner({
  roomId,
  facilitatorId,
  identityId,
}: ClaimBannerProps) {
  // We need to check if the current facilitator is online
  const players = useQuery(api.players.listByRoom, { roomId });
  const claimFacilitator = useMutation(api.players.claimFacilitator);

  if (!players) return null;

  const facilitator = players.find((p) => p.identityId === facilitatorId);
  const isFacilitatorOnline = facilitator?.isOnline ?? false;

  if (isFacilitatorOnline || facilitatorId === identityId) {
    return null;
  }

  return (
    <div className="bg-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-xl p-4 flex items-center justify-between mb-8 rise-in">
      <div className="flex items-center gap-3">
        <span className="text-xl">👑</span>
        <div>
          <h3 className="text-sm font-bold text-[var(--warning)]">
            Facilitator is offline
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            The current facilitator has left. You can take over the room.
          </p>
        </div>
      </div>
      <button
        onClick={() => claimFacilitator({ roomId, identityId })}
        className="px-4 py-2 bg-[var(--warning)] text-[var(--bg-primary)] text-xs font-bold rounded-lg hover:brightness-110 transition-all"
      >
        Claim
      </button>
    </div>
  );
}
