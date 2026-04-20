import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'sonner';
import { InviteModal } from '../src/components/InviteModal';
import React from 'react';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

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

describe('Sonner Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('should call toast.success when link is copied in InviteModal', async () => {
    render(
      <InviteModal isOpen={true} onClose={() => {}} roomUrl="http://test.com" />
    );

    const copyButton = screen.getByRole('button', { name: /copy link/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Link copied to clipboard!');
    });
  });
});
