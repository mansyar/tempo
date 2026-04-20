import { render, screen } from '@testing-library/react';
import { ActiveTopicHeader } from '../src/components/ActiveTopicHeader';
import { describe, it, expect, vi } from 'vitest';
import type { Id } from '../convex/_generated/dataModel';
import React from 'react';

// Mock convex
vi.mock('convex/react', () => ({
  useMutation: vi.fn().mockReturnValue(vi.fn()),
}));

describe('ActiveTopicHeader', () => {
  const roomId = 'room-1' as Id<'rooms'>;
  const identityId = 'user-1';

  it('renders active topic details', () => {
    render(
      <ActiveTopicHeader
        roomId={roomId}
        identityId={identityId}
        roomStatus="voting"
        activeTopic={{
          _id: '1' as Id<'topics'>,
          title: 'Current Topic',
          order: 1,
          status: 'active',
        }}
        isFacilitator={false}
        onReveal={vi.fn()}
        onConfirmNext={vi.fn()}
      />
    );

    expect(screen.getByText(/Current Topic/i)).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
  });

  it('shows Reveal button for facilitator when voting', () => {
    render(
      <ActiveTopicHeader
        roomId={roomId}
        identityId={identityId}
        roomStatus="voting"
        activeTopic={{
          _id: '1' as Id<'topics'>,
          title: 'T1',
          order: 1,
          status: 'active',
        }}
        isFacilitator={true}
        onReveal={vi.fn()}
        onConfirmNext={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Reveal Votes/i })).toBeDefined();
  });

  it('can disable Reveal button via prop', () => {
    render(
      <ActiveTopicHeader
        roomId={roomId}
        identityId={identityId}
        roomStatus="voting"
        activeTopic={{
          _id: '1' as Id<'topics'>,
          title: 'T1',
          order: 1,
          status: 'active',
        }}
        isFacilitator={true}
        onReveal={vi.fn()}
        onConfirmNext={vi.fn()}
        revealDisabled={true}
      />
    );

    const btn = screen.getByRole('button', {
      name: /Reveal Votes/i,
    }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('shows Confirm & Next button for facilitator when revealed', () => {
    render(
      <ActiveTopicHeader
        roomId={roomId}
        identityId={identityId}
        roomStatus="revealed"
        activeTopic={{
          _id: '1' as Id<'topics'>,
          title: 'T1',
          order: 1,
          status: 'active',
        }}
        isFacilitator={true}
        onReveal={vi.fn()}
        onConfirmNext={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: /Confirm & Next/i })
    ).toBeDefined();
  });

  it('renders nothing if no active topic', () => {
    const { container } = render(
      <ActiveTopicHeader
        roomId={roomId}
        identityId={identityId}
        roomStatus="voting"
        activeTopic={undefined}
        isFacilitator={true}
        onReveal={vi.fn()}
        onConfirmNext={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
