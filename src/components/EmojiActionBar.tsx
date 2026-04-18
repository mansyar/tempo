import React from 'react';

const EMOJIS = ['❤️', '👏', '🔥', '😂', '🎉'];

interface EmojiActionBarProps {
  onSelect: (emoji: string) => void;
}

export function EmojiActionBar({ onSelect }: EmojiActionBarProps) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-full shadow-lg">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className="w-10 h-10 flex items-center justify-center text-2xl transition-all hover:scale-125 hover:-translate-y-1 active:scale-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-full"
          aria-label={`Send ${emoji} reaction`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
