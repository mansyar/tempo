import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TopicSidebar } from '../src/components/TopicSidebar';

// Mock convex
vi.mock('convex/react', () => {
  const mockMutation = Object.assign(vi.fn().mockResolvedValue({}), {
    withOptimisticUpdate: vi.fn().mockReturnThis(),
  });
  return {
    useQuery: vi.fn(),
    useMutation: vi.fn(() => mockMutation),
  };
});

import { useQuery } from 'convex/react';

describe('TopicSidebar Export UI', () => {
  // @ts-expect-error - testing with mock Id
  const roomId: Id<'rooms'> = 'room-1';
  const facId = 'fac-1';

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock URL and Download
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
    global.URL.revokeObjectURL = vi.fn();

    // Better way to mock anchor click without breaking other elements
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          vi.spyOn(element as HTMLAnchorElement, 'click').mockImplementation(
            () => {}
          );
        }
        return element;
      }
    );
  });

  it('should show export button for facilitator when history exists', () => {
    vi.mocked(useQuery).mockImplementation((...args: unknown[]) => {
      const a = args[1] as Record<string, unknown>;
        if (a && a.roomId) {
          return [
            {
              _id: 't1',
              title: 'T1',
              status: 'completed',
              finalEstimate: '5',
              order: 1,
            },
          ];
        }
        if (a && a.slug) {
          return { slug: 'test-room' };
        }
        return null;
      }
    );

    render(
      <TopicSidebar
        roomId={roomId}
        facilitatorId={facId}
        identityId={facId}
        onOpenBatchAdd={vi.fn()}
      />
    );

    expect(screen.getByTitle(/Export Session/i)).toBeDefined();
  });

  it('should open export menu when button is clicked', () => {
    vi.mocked(useQuery).mockImplementation((...args: unknown[]) => {
      const a = args[1] as Record<string, unknown>;
      if (a && a.roomId) {
          return [
            {
              _id: 't1',
              title: 'T1',
              status: 'completed',
              finalEstimate: '5',
              order: 1,
            },
          ];
        }
        if (a && a.slug) {
          return { slug: 'test-room' };
        }
        return null;
      }
    );

    render(
      <TopicSidebar
        roomId={roomId}
        facilitatorId={facId}
        identityId={facId}
        onOpenBatchAdd={vi.fn()}
      />
    );

    const exportBtn = screen.getByTitle(/Export Session/i);
    fireEvent.click(exportBtn);

    expect(screen.getByText(/Export Format/i)).toBeDefined();
    expect(screen.getByText(/Markdown Table/i)).toBeDefined();
    expect(screen.getByText(/CSV Data/i)).toBeDefined();
  });

  it('should trigger download when a format is selected', async () => {
    vi.mocked(useQuery).mockImplementation((...args: unknown[]) => {
      const a = args[1] as Record<string, unknown>;
        if (a && a.roomId) {
          return [
            {
              _id: 't1',
              title: 'T1',
              status: 'completed',
              finalEstimate: '5',
              order: 1,
            },
          ];
        }
        return { slug: 'test-room' };
      }
    );

    render(
      <TopicSidebar
        roomId={roomId}
        facilitatorId={facId}
        identityId={facId}
        onOpenBatchAdd={vi.fn()}
      />
    );

    // Open menu
    fireEvent.click(screen.getByTitle(/Export Session/i));

    // Click Markdown
    fireEvent.click(screen.getByText(/Markdown Table/i));

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });
});
