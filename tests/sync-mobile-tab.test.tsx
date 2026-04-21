import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InviteModal } from '../src/components/InviteModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useIdentity
vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: () => ({
    identityId: 'test-identity-id',
    nickname: 'Test User',
  }),
}));

// Mock convex
vi.mock('convex/react', () => ({
  useMutation: vi.fn(),
}));

import { useMutation } from 'convex/react';

describe('InviteModal Sync Controller Tab', () => {
  const mockOnClose = vi.fn();
  const roomUrl = 'http://localhost:3000/room/test-room';
  const mockCreateSyncToken = Object.assign(
    vi.fn().mockResolvedValue('test-token-123'),
    { withOptimisticUpdate: vi.fn().mockReturnThis() }
  );

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMutation).mockReturnValue(mockCreateSyncToken);
  });

  it('should have two tabs: Invite Link and Sync Controller', () => {
    render(
      <InviteModal isOpen={true} onClose={mockOnClose} roomUrl={roomUrl} />
    );
    expect(screen.getByText(/Invite Link/i)).toBeDefined();
    expect(screen.getByText(/Sync Controller/i)).toBeDefined();
  });

  it('should call sync:create and show QR code when Sync Controller tab is selected', async () => {
    render(
      <InviteModal isOpen={true} onClose={mockOnClose} roomUrl={roomUrl} />
    );

    const syncTab = screen.getByText(/Sync Controller/i);
    fireEvent.click(syncTab);

    await waitFor(() => {
      expect(mockCreateSyncToken).toHaveBeenCalledWith({
        identityId: 'test-identity-id',
      });
    });

    expect(screen.getByText(/Scan to Sync/i)).toBeDefined();
    expect(screen.getByText(/Expires in:/i)).toBeDefined();
  });
});
