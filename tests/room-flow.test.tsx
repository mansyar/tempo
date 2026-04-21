import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LandingPage as App } from '../src/components/shared/LandingPage';
import { describe, it, expect, vi } from 'vitest';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from 'convex/react';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
  createFileRoute: vi.fn(() => vi.fn()),
}));

vi.mock('convex/react', () => ({
  useMutation: vi.fn(),
}));

describe('Room Flow', () => {
  it('should redirect to a new room when "Create Room" is clicked', async () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    const createRoom = vi.fn().mockResolvedValue({ slug: 'test-slug' });
    vi.mocked(useMutation).mockReturnValue(createRoom as unknown as ReturnType<typeof useMutation>);

    render(<App />);

    const nicknameInput = screen.getByPlaceholderText(/your nickname/i);
    fireEvent.change(nicknameInput, { target: { value: 'Alice' } });

    const createButton = screen.getByRole('button', {
      name: /create poker room/i,
    });
    fireEvent.click(createButton);

    expect(createRoom).toHaveBeenCalled();
    // Redirect should happen after mutation
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({
        to: '/poker/$slug',
        params: { slug: expect.any(String) },
      });
    });
  });
});
