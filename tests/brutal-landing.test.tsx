import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LandingPage } from '../src/components/shared/LandingPage';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

// Mock useIdentity
vi.mock('../../hooks/useIdentity', () => ({
  useIdentity: vi.fn(() => ({
    nickname: '',
    setNickname: vi.fn(),
    identityId: 'test-id',
  })),
}));

// Mock Convex
vi.mock('convex/react', () => ({
  useMutation: vi.fn(),
}));

describe('Neo-Brutalist Landing Page', () => {
  it('should render a scrolling marquee', () => {
    render(<LandingPage />);
    const marquee = document.querySelector('.marquee-content');
    expect(marquee).toBeDefined();
  });

  it('should render hero section with high-contrast mix-blend header', () => {
    render(<LandingPage />);
    const h1 = screen.getByRole('heading', { name: /Tempo/i });
    expect(h1.classList.contains('mix-blend-multiply')).toBe(true);
  });

  it('should render floating decorative badges', () => {
    render(<LandingPage />);
    const badge = document.querySelector('.brutal-badge');
    expect(badge).toBeDefined();
  });
});
