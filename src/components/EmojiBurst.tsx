import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FloatingEmoji } from '../hooks/useEmojiReactions';

interface EmojiItemProps {
  reaction: FloatingEmoji;
}

function EmojiItem({ reaction }: EmojiItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Find the player card element
    const element = document.querySelector(
      `[data-player-id="${reaction.senderId}"]`
    );
    if (element) {
      const rect = element.getBoundingClientRect();
      setStartPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    } else {
      // Fallback to center if element not found
      setStartPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  }, [reaction.senderId]);

  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: startPos.x, y: startPos.y }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="fixed text-4xl -translate-x-1/2 -translate-y-1/2"
      >
        {reaction.emoji}
      </motion.div>
    );
  }

  // Random burst direction
  const angle = Math.random() * Math.PI * 2;
  const distance = 100 + Math.random() * 100;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance - 100; // Prefer upwards

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
        x: startPos.x,
        y: startPos.y,
        rotate: 0,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.5, 1.2, 0],
        x: startPos.x + x,
        y: startPos.y + y,
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: 2,
        ease: 'easeOut',
      }}
      className="fixed text-4xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      {reaction.emoji}
    </motion.div>
  );
}

export function EmojiBurst({ reactions }: { reactions: FloatingEmoji[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {reactions.map((r) => (
        <EmojiItem key={r.id} reaction={r} />
      ))}
    </div>
  );
}
