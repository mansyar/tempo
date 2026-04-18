import { render, screen, fireEvent } from '@testing-library/react';
import { LandingPage } from '../src/components/LandingPage';
import { describe, it, expect, vi } from 'vitest';
import { useNavigate } from '@tanstack/react-router';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../hooks/useIdentity', () => ({
  useIdentity: vi.fn(() => ({
    nickname: '',
    setNickname: vi.fn(),
    identityId: 'user1',
  })),
}));

vi.mock('convex/react', () => ({
  useMutation: vi.fn(() => vi.fn()),
}));

describe('LandingPage Feature Cards', () => {
  it('renders all feature highlight cards', () => {
    render(<LandingPage />);
    expect(screen.getByText('Real-time')).toBeDefined();
    expect(screen.getByText('Fibonacci Scale')).toBeDefined();
    expect(screen.getByText('Ephemeral')).toBeDefined();
  });

  it('allows joining a room by slug', () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    render(<LandingPage />);

    const input = screen.getByPlaceholderText(/Paste room link or slug/i);
    fireEvent.change(input, { target: { value: 'test-slug' } });

    const joinButton = screen.getByRole('button', { name: /Join/i });
    fireEvent.click(joinButton);

    expect(navigate).toHaveBeenCalledWith({
      to: '/room/$slug',
      params: { slug: 'test-slug' },
    });
  });

  it('allows joining a room by full URL', () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    render(<LandingPage />);

    const input = screen.getByPlaceholderText(/Paste room link or slug/i);
    fireEvent.change(input, {
      target: { value: 'http://localhost:3000/room/abc-123' },
    });

    const joinButton = screen.getByRole('button', { name: /Join/i });
    fireEvent.click(joinButton);

    expect(navigate).toHaveBeenCalledWith({
      to: '/room/$slug',
      params: { slug: 'abc-123' },
    });
  });
});
