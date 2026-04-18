import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

export function usePresence(
  roomId: Id<'rooms'> | undefined,
  identityId: string | null,
  hasJoined: boolean
) {
  const heartbeat = useMutation(api.players.heartbeat);
  const leave = useMutation(api.players.leave);

  useEffect(() => {
    if (!hasJoined || !identityId) return;

    // 1. Set up heartbeat interval (10s)
    const interval = setInterval(() => {
      heartbeat({ roomId, identityId });
    }, 10000);

    // 2. Handle instant disconnect on page leave
    const handleUnload = () => {
      // Use sendBeacon for more reliability if possible,
      // but Convex mutations are async and might be cancelled.
      // Alternatively, we just try to call the mutation.
      leave({ roomId, identityId });
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      // Also try to leave on unmount
      leave({ roomId, identityId });
    };
  }, [roomId, identityId, hasJoined, heartbeat, leave]);
}
