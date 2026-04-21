import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LandingPage } from '../src/components/shared/LandingPage';
import { JuiceProvider } from '../src/components/shared/JuiceToggle';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from 'convex/react';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

// Mock Convex
vi.mock('convex/react', () => ({
  useMutation: vi.fn(),
}));

// Mock useIdentity
vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: vi.fn(() => ({
    nickname: 'Tester',
    setNickname: vi.fn(),
    identityId: 'test-id',
  })),
}));

const renderWithJuice = (ui: React.ReactElement) => {
  return render(
    <JuiceProvider>
      {ui}
    </JuiceProvider>
  );
};


describe('Landing Page Rebranding', () => {
  it('renders landing page with Tempo branding', () => {
    renderWithJuice(<LandingPage />);

    // Check for "Tempo" title
    expect(screen.queryByText('Tempo')).toBeTruthy();

    // Check for new tagline
    expect(screen.queryByText(/Scrum Tools for Modern Teams/i)).toBeTruthy();

    // Check that "Pointy Poker" is NO LONGER present
    expect(screen.queryByText('Pointy Poker')).toBeNull();
  });

  it('shows Poker tool with updated CTA and navigates to /poker/', async () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    const createRoom = vi.fn().mockResolvedValue({ slug: 'new-poker-room' });
    vi.mocked(useMutation).mockReturnValue(createRoom as unknown as ReturnType<typeof useMutation>);

    renderWithJuice(<LandingPage />);

    const button = screen.getByText(/Create Poker Room/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({
        to: '/poker/$slug',
        params: { slug: 'new-poker-room' },
      });
    });
  });

  it('shows Standup tool as Coming Soon', () => {
    renderWithJuice(<LandingPage />);
    expect(screen.getByText(/Daily Standup/i)).toBeTruthy();
    expect(screen.getByText(/Coming Soon/i)).toBeTruthy();
  });
});
