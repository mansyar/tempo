import { render, screen, fireEvent } from '@testing-library/react';
import { PresenceSidebar } from '../src/components/PresenceSidebar';
import { ClaimBanner } from '../src/components/ClaimBanner';
import { describe, it, expect, vi } from 'vitest';
import { useQuery, useMutation } from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe('PresenceSidebar', () => {
  it('renders a list of players with their online status', () => {
    vi.mocked(useQuery).mockReturnValue([
      { _id: '1' as Id<'players'>, name: 'Alice', isOnline: true },
      { _id: '2' as Id<'players'>, name: 'Bob', isOnline: false },
    ]);

    render(<PresenceSidebar roomId={'room1' as unknown as Id<'rooms'>} />);

    expect(screen.getByText('Alice')).toBeDefined();
    expect(screen.getByText('Bob')).toBeDefined();
    // Assuming status indicators exist
  });
});

describe('ClaimBanner', () => {
  it('renders when the facilitator is offline', () => {
    const claimMutation = vi.fn();
    vi.mocked(useMutation).mockReturnValue(claimMutation);

    // Mock players list where facilitator is offline
    vi.mocked(useQuery).mockReturnValue([
      { identityId: 'user1', isOnline: false },
      { identityId: 'user2', isOnline: true },
    ]);

    render(
      <ClaimBanner
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user2"
      />
    );

    expect(screen.getByText(/facilitator is offline/i)).toBeDefined();
    const button = screen.getByRole('button', { name: /claim/i });
    fireEvent.click(button);
    expect(claimMutation).toHaveBeenCalled();
  });

  it('does not render when the facilitator is online', () => {
    vi.mocked(useQuery).mockReturnValue([
      { identityId: 'user1', isOnline: true },
    ]);
    const { container } = render(
      <ClaimBanner
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user2"
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
