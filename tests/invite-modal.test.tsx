import { render, screen, fireEvent } from '@testing-library/react';
import { InviteModal } from '../src/components/InviteModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock useIdentity
vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: () => ({
    identityId: 'test-identity-id',
    nickname: 'Test User',
  }),
}));

// Mock convex
vi.mock('convex/react', () => ({
  useMutation: vi.fn().mockReturnValue(vi.fn().mockResolvedValue('test-token')),
}));

describe('InviteModal component', () => {
  const mockOnClose = vi.fn();
  const roomUrl = 'http://localhost:3000/room/test-room';

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    // Mock Share API
    Object.assign(navigator, {
      share: vi.fn().mockImplementation(() => Promise.resolve()),
      canShare: vi.fn().mockReturnValue(true),
    });
  });

  it('should render correctly when open', () => {
    render(
      <InviteModal isOpen={true} onClose={mockOnClose} roomUrl={roomUrl} />
    );
    expect(screen.getByText(/Invite Players/i)).toBeDefined();
    expect(screen.getByText(/Copy Link/i)).toBeDefined();
  });

  it('should not render when closed', () => {
    const { container } = render(
      <InviteModal isOpen={false} onClose={mockOnClose} roomUrl={roomUrl} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should copy link to clipboard', async () => {
    render(
      <InviteModal isOpen={true} onClose={mockOnClose} roomUrl={roomUrl} />
    );
    const copyButton = screen.getByRole('button', { name: /copy link/i });
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(roomUrl);
  });

  it('should use Share API when available', async () => {
    render(
      <InviteModal isOpen={true} onClose={mockOnClose} roomUrl={roomUrl} />
    );
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    expect(navigator.share).toHaveBeenCalledWith({
      title: 'Pointy Planning Poker',
      text: 'Join my planning poker room!',
      url: roomUrl,
    });
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <InviteModal isOpen={true} onClose={mockOnClose} roomUrl={roomUrl} />
    );
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
