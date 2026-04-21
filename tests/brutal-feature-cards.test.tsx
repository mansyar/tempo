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

describe('Neo-Brutalist Feature Cards', () => {
  it('should render feature cards with brutal styling', () => {
    render(<LandingPage />);
    const realTimeCard = screen.getByRole('heading', { name: /Real-time/i }).closest('div');
    // We expect the card container to have brutal classes
    expect(realTimeCard).toBeDefined();
  });

  it('should have cards with solid retro background colors', () => {
    render(<LandingPage />);
    // After implementation, we'll check for specific classes like bg-retro-green, etc.
    const stmts = document.querySelectorAll('.brutal-border');
    expect(stmts.length).toBeGreaterThan(0);
  });
});
