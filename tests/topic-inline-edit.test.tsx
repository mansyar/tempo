import { render, screen, fireEvent, act } from '@testing-library/react';
import { TopicSidebar } from '../src/components/TopicSidebar';
import { describe, it, expect, vi } from 'vitest';
import { useQuery, useMutation } from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe('TopicSidebar Inline Editing', () => {
  it('allows facilitator to enter edit mode by clicking title', () => {
    vi.mocked(useQuery).mockReturnValue([
      {
        _id: '1' as Id<'topics'>,
        title: 'Pending Topic',
        order: 1,
        status: 'pending',
      },
    ]);
    vi.mocked(useMutation).mockReturnValue(vi.fn());

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user1"
        onOpenBatchAdd={vi.fn()}
      />
    );

    const title = screen.getByText('Pending Topic');
    fireEvent.click(title);

    const input = screen.getByDisplayValue('Pending Topic');
    expect(input).toBeDefined();
  });

  it('saves changes on Enter key', async () => {
    const updateMutation = vi.fn();
    vi.mocked(useQuery).mockReturnValue([
      {
        _id: '1' as Id<'topics'>,
        title: 'Original Title',
        order: 1,
        status: 'pending',
      },
    ]);
    vi.mocked(useMutation).mockReturnValue(updateMutation);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user1"
        onOpenBatchAdd={vi.fn()}
      />
    );

    const title = screen.getByText('Original Title');
    fireEvent.click(title);

    const input = screen.getByDisplayValue('Original Title');
    fireEvent.change(input, { target: { value: 'New Title' } });

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    expect(updateMutation).toHaveBeenCalledWith({
      topicId: '1',
      identityId: 'user1',
      title: 'New Title',
    });

    // Should exit edit mode
    expect(screen.queryByDisplayValue('New Title')).toBeNull();
  });

  it('saves changes on blur', async () => {
    const updateMutation = vi.fn();
    vi.mocked(useQuery).mockReturnValue([
      {
        _id: '1' as Id<'topics'>,
        title: 'Original Title',
        order: 1,
        status: 'pending',
      },
    ]);
    vi.mocked(useMutation).mockReturnValue(updateMutation);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user1"
        onOpenBatchAdd={vi.fn()}
      />
    );

    const title = screen.getByText('Original Title');
    fireEvent.click(title);

    const input = screen.getByDisplayValue('Original Title');
    fireEvent.change(input, { target: { value: 'Blurred Title' } });

    await act(async () => {
      fireEvent.blur(input);
    });

    expect(updateMutation).toHaveBeenCalledWith({
      topicId: '1',
      identityId: 'user1',
      title: 'Blurred Title',
    });
  });

  it('prevents non-facilitators from entering edit mode', () => {
    vi.mocked(useQuery).mockReturnValue([
      {
        _id: '1' as Id<'topics'>,
        title: 'Pending Topic',
        order: 1,
        status: 'pending',
      },
    ]);
    vi.mocked(useMutation).mockReturnValue(vi.fn());

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user2"
        onOpenBatchAdd={vi.fn()}
      />
    );

    const title = screen.getByText('Pending Topic');
    fireEvent.click(title);

    expect(screen.queryByDisplayValue('Pending Topic')).toBeNull();
  });
});
