import { render, screen } from '@testing-library/react';
import { LandingPage as App } from '../src/components/shared/LandingPage';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
  createFileRoute: vi.fn(() => vi.fn()),
}));

vi.mock('convex/react', () => ({
  useMutation: vi.fn(),
}));

describe('Landing Page', () => {
  it('should render a "Create Room" button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /create poker room/i });
    expect(button).toBeDefined();
  });

  it('should render a nickname input', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/your nickname/i);
    expect(input).toBeDefined();
  });
});
