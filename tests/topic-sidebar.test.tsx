import { render, screen, fireEvent } from '@testing-library/react';
import { TopicSidebar } from '../src/components/TopicSidebar';
import { describe, it, expect, vi } from 'vitest';
import { useQuery, useMutation } from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe('TopicSidebar', () => {
  it('renders a list of pending and completed topics', () => {
    vi.mocked(useQuery).mockReturnValue([
      {
        _id: '1' as Id<'topics'>,
        title: 'Pending Topic',
        order: 1,
        status: 'pending',
      },
      {
        _id: '2' as Id<'topics'>,
        title: 'Completed Topic',
        order: 2,
        status: 'completed',
        finalEstimate: '5',
      },
    ]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user2"
        onOpenBatchAdd={vi.fn()}
      />
    );

    expect(screen.getByText('Pending Topic')).toBeDefined();
    expect(screen.getByText('Completed Topic')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined(); // Estimate for completed topic
  });

  it('hides management controls from non-facilitators', () => {
    vi.mocked(useQuery).mockReturnValue([]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="facilitator-id"
        identityId="player-id"
        onOpenBatchAdd={vi.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: /add topic/i })).toBeNull();
  });

  it('shows management controls to facilitators', () => {
    vi.mocked(useQuery).mockReturnValue([]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="facilitator-id"
        identityId="facilitator-id"
        onOpenBatchAdd={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/Add a topic/i)).toBeDefined();
    expect(screen.getByLabelText(/Batch Add/i)).toBeDefined();
  });

  it('renders empty states when there are no topics', () => {
    vi.mocked(useQuery).mockReturnValue([]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user2"
        onOpenBatchAdd={vi.fn()}
      />
    );

    expect(screen.getByText(/No topics in queue/i)).toBeDefined();
    expect(screen.getByText(/Empty history/i)).toBeDefined();
  });

  it('allows facilitator to add a topic', () => {
    const addMutation = vi.fn();
    vi.mocked(useQuery).mockReturnValue([]);
    vi.mocked(useMutation).mockReturnValue(addMutation);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user1"
        onOpenBatchAdd={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/Add a topic/i);
    fireEvent.change(input, { target: { value: 'New Topic' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(addMutation).toHaveBeenCalledWith({
      roomId: 'room1',
      identityId: 'user1',
      title: 'New Topic',
    });
  });

  it('allows facilitator to remove a topic', () => {
    const removeMutation = vi.fn();
    vi.mocked(useQuery).mockReturnValue([
      {
        _id: '1' as Id<'topics'>,
        title: 'Topic to Delete',
        order: 1,
        status: 'pending',
      },
    ]);
    vi.mocked(useMutation).mockReturnValue(removeMutation);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user1"
        onOpenBatchAdd={vi.fn()}
      />
    );

    const deleteButton = screen.getByLabelText(/Remove Topic/i);
    fireEvent.click(deleteButton);

    expect(removeMutation).toHaveBeenCalledWith({
      topicId: '1',
      identityId: 'user1',
    });
  });

  it('allows facilitator to reorder topics', () => {
    const reorderMutation = vi.fn();
    vi.mocked(useQuery).mockReturnValue([
      { _id: '1' as Id<'topics'>, title: 'T1', order: 1, status: 'pending' },
      { _id: '2' as Id<'topics'>, title: 'T2', order: 2, status: 'pending' },
    ]);
    vi.mocked(useMutation).mockReturnValue(reorderMutation);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user1"
        onOpenBatchAdd={vi.fn()}
      />
    );

    const moveDownButton = screen.getAllByLabelText(/Move Down/i)[0];
    fireEvent.click(moveDownButton);

    expect(reorderMutation).toHaveBeenCalledWith({
      topicId: '1',
      identityId: 'user1',
      newOrder: 2,
    });
  });

  it('calls onOpenBatchAdd when batch add button is clicked', () => {
    const onOpenBatchAdd = vi.fn();
    vi.mocked(useQuery).mockReturnValue([]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user1"
        onOpenBatchAdd={onOpenBatchAdd}
      />
    );

    const batchAddButton = screen.getByLabelText(/Batch Add/i);
    fireEvent.click(batchAddButton);

    expect(onOpenBatchAdd).toHaveBeenCalled();
  });
});
