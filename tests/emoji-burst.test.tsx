import { render, screen } from '@testing-library/react';
import { EmojiBurst } from '../src/components/EmojiBurst';
import { describe, it, expect, vi } from 'vitest';
import * as framerMotion from 'framer-motion';

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  };
});

describe('EmojiBurst', () => {
  it('should render emojis from the list', () => {
    const reactions = [
      { id: '1', emoji: '❤️', senderId: 'user1', isOptimistic: true },
    ];
    render(<EmojiBurst reactions={reactions} />);

    expect(screen.getByText('❤️')).toBeDefined();
  });

  it('should render multiple emojis', () => {
    const reactions = [
      { id: '1', emoji: '❤️', senderId: 'user1', isOptimistic: true },
      { id: '2', emoji: '👏', senderId: 'user2', isOptimistic: false },
    ];
    render(<EmojiBurst reactions={reactions} />);

    expect(screen.getByText('❤️')).toBeDefined();
    expect(screen.getByText('👏')).toBeDefined();
  });

  it('should respect reduced motion', () => {
    vi.mocked(framerMotion.useReducedMotion).mockReturnValue(true);

    const reactions = [
      { id: '1', emoji: '🔥', senderId: 'user1', isOptimistic: true },
    ];
    render(<EmojiBurst reactions={reactions} />);

    expect(screen.getByText('🔥')).toBeDefined();
    // In reduced motion, it should still render the emoji
  });
});
