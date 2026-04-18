import { useState, useCallback, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { ReactionBatcher } from '../utils/batcher';

export interface FloatingEmoji {
  id: string;
  emoji: string;
  senderId: string;
  isOptimistic: boolean;
}

export function useEmojiReactions(
  roomId: Id<'rooms'> | undefined,
  identityId: string | null
) {
  const [localReactions, setLocalReactions] = useState<FloatingEmoji[]>([]);
  const sendBatch = useMutation(api.reactions.sendBatch);

  const batcher = useMemo(() => {
    return new ReactionBatcher((emojis) => {
      if (roomId && identityId) {
        sendBatch({ roomId, identityId, reactions: emojis }).catch(
          console.error
        );
      }
    }, 1000);
  }, [roomId, identityId, sendBatch]);

  const sendReaction = useCallback(
    (emoji: string) => {
      if (!identityId) return;

      // 1. Add to local state for immediate feedback
      const id = `${Date.now()}-${Math.random()}`;
      setLocalReactions((prev) => [
        ...prev,
        { id, emoji, senderId: identityId, isOptimistic: true },
      ]);

      // 2. Add to batcher for Convex
      batcher.add(emoji);

      // 3. Remove from local state after 5 seconds
      setTimeout(() => {
        setLocalReactions((prev) => prev.filter((r) => r.id !== id));
      }, 5000);
    },
    [identityId, batcher]
  );

  return {
    localReactions,
    sendReaction,
  };
}
