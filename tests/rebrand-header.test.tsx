import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { type ReactNode, type ReactElement } from 'react';
import Header from '../src/components/shared/Header';
import { JuiceProvider } from '../src/components/shared/JuiceToggle';
import { useLocation } from '@tanstack/react-router';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    className,
  }: {
    children: ReactNode;
    to: string;
    className?: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useLocation: vi.fn(() => ({ pathname: '/' })),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithJuice = (ui: ReactElement) => {
  return render(<JuiceProvider>{ui}</JuiceProvider>);
};

describe('Header Rebranding', () => {
  it('renders header with Tempo branding', () => {
    renderWithJuice(<Header />);

    // Check for "Tempo" text
    expect(screen.queryByText('Tempo')).toBeTruthy();

    // Check for the new logo ◈
    expect(screen.queryByText('◈')).toBeTruthy();

    // Check that "Pointy" is NO LONGER present
    expect(screen.queryByText('Pointy')).toBeNull();
  });

  it('updates GitHub link to Tempo repository', () => {
    renderWithJuice(<Header />);
    const githubLink = screen.getByRole('link', { name: /Go to GitHub/i });
    expect(githubLink.getAttribute('href')).toBe(
      'https://github.com/mansyar/tempo'
    );
  });

  it('shows tool context breadcrumb on room pages', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/room/test-slug',
    } as unknown as ReturnType<typeof useLocation>);
    renderWithJuice(<Header />);
    // Spec says: "◈ Tempo ▸ Poker"
    expect(screen.queryByText('Tempo')).toBeTruthy();
    expect(screen.queryByText('Poker')).toBeTruthy();
    expect(screen.queryByText('▸')).toBeTruthy();
  });
});
