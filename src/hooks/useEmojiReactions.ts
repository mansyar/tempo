import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
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
  const [optimisticReactions, setOptimisticReactions] = useState<
    FloatingEmoji[]
  >([]);
  const sendBatch = useMutation(api.reactions.sendBatch);

  // Subscribe to remote reactions
  const remoteReactionsRaw =
    useQuery(api.reactions.listRecent, roomId ? { roomId } : 'skip') || [];

  // Filter remote reactions:
  // 1. Only from others (to avoid duplicates with our optimistic ones)
  // 2. Map to FloatingEmoji interface
  const remoteReactions = useMemo(() => {
    return remoteReactionsRaw
      .filter((r) => r.identityId !== identityId)
      .map((r) => ({
        id: r._id,
        emoji: r.emoji,
        senderId: r.identityId,
        isOptimistic: false,
      }));
  }, [remoteReactionsRaw, identityId]);

  // Merge optimistic and remote
  const allReactions = useMemo(() => {
    return [...optimisticReactions, ...remoteReactions];
  }, [optimisticReactions, remoteReactions]);

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
      setOptimisticReactions((prev) => [
        ...prev,
        { id, emoji, senderId: identityId, isOptimistic: true },
      ]);

      // 2. Add to batcher for Convex
      batcher.add(emoji);

      // 3. Remove from local state after 5 seconds
      setTimeout(() => {
        setOptimisticReactions((prev) => prev.filter((r) => r.id !== id));
      }, 5000);
    },
    [identityId, batcher]
  );

  return {
    localReactions: allReactions,
    sendReaction,
  };
}
