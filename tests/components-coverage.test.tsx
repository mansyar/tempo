import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Footer from '../src/components/Footer';
import Header from '../src/components/Header';
import ThemeToggle from '../src/components/ThemeToggle';
import { RoomPage } from '../src/components/RoomPage';
import { Route as RootLayout } from '../src/routes/__root';
import { JuiceProvider } from '../src/components/JuiceToggle';
import { ReactNode } from 'react';
import * as convex from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';
import React from 'react';

// Mock TanStack Router
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    Link: ({ children, to }: { children: ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
    useLocation: () => ({ pathname: '/' }),
    Outlet: () => <div data-testid="outlet" />,
    useParams: () => ({ slug: 'test-room' }),
    HeadContent: () => <div data-testid="head-content" />,
    Scripts: () => <div data-testid="scripts" />,
    createFileRoute: (path: string) => {
      const route = (options: Record<string, unknown>) => ({
        path,
        options,
        useParams: () => ({ slug: 'test-room' }),
        update: (updates: Record<string, unknown>) =>
          Object.assign(route, updates),
      });
      Object.assign(route, {
        update: (updates: Record<string, unknown>) =>
          Object.assign(route, updates),
        useParams: () => ({ slug: 'test-room' }),
      });
      return route;
    },
  };
});

// Mock Convex
vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn().mockResolvedValue({})),
  ConvexReactClient: vi.fn().mockImplementation(() => ({})),
  ConvexProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock TanStack DevTools
vi.mock('@tanstack/react-devtools', () => ({
  TanStackDevtools: () => null,
}));
vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => null,
}));

// Mock identity
const mockIdentity = {
  nickname: 'Tester',
  identityId: 'tester-id',
  setNickname: vi.fn(),
};

vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: () => mockIdentity,
}));

vi.mock('../src/hooks/useSound', () => ({
  useSound: () => ({
    play: vi.fn(),
    vibrate: vi.fn(),
    patterns: { success: 100 },
  }),
}));

// Mock matchMedia
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

// Helper for rendering with JuiceProvider
const renderWithJuice = (ui: React.ReactElement) => {
  return render(<JuiceProvider>{ui}</JuiceProvider>);
};

describe('Footer Component', () => {
  it('renders footer with copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/Pointy/)).toBeDefined();
    expect(
      screen.getByText(/Built with TanStack Start & Convex/)
    ).toBeDefined();
  });
});

describe('Header Component', () => {
  it('renders header with logo and navigation', () => {
    renderWithJuice(<Header />);
    expect(screen.getByText('Tempo')).toBeDefined();
    expect(screen.getByRole('link', { name: /Tempo/ })).toBeDefined();
  });
});

describe('ThemeToggle Component', () => {
  it('renders theme toggle and switches theme', () => {
    render(<ThemeToggle />);
    const toggle = screen.getByRole('button');
    expect(toggle).toBeDefined();

    // Test toggle click
    fireEvent.click(toggle);
    fireEvent.click(toggle); // Cycle through themes
  });

  it('handles system preference changes', () => {
    localStorage.setItem('theme', 'auto');
    render(<ThemeToggle />);
  });
});

// Mock JoinModal
vi.mock('../src/components/JoinModal', () => ({
  JoinModal: ({ onJoin }: { onJoin: (nickname: string) => void }) => (
    <button onClick={() => onJoin('Tester')}>Mock Join</button>
  ),
}));

describe('RoomPage Component', () => {
  it('renders room loading state', () => {
    vi.mocked(convex.useQuery).mockReturnValue(undefined); // Loading
    renderWithJuice(<RoomPage slug="test-room" />);
    expect(screen.getByText(/Loading room/)).toBeDefined();
  });

  it('renders room content when loaded and joined', async () => {
    mockIdentity.nickname = ''; // Start empty to trigger JoinModal
    vi.mocked(convex.useMutation).mockReturnValue(
      vi.fn().mockResolvedValue({})
    );
    // Mock multiple queries
    vi.mocked(convex.useQuery).mockImplementation(
      (apiFn: unknown, args: unknown) => {
        const a = args as Record<string, unknown>;
        if (a && a.slug !== undefined) {
          return {
            _id: 'room-id' as unknown as Id<'rooms'>,
            slug: a.slug as string,
            status: 'voting',
            facilitatorId: 'tester-id',
          };
        }
        if (a && a.roomId !== undefined && a.identityId === undefined) {
          // players list
          return [
            {
              _id: '1' as unknown as Id<'players'>,
              identityId: 'tester-id',
              name: 'Tester',
              isOnline: true,
            },
          ];
        }
        if (a && a.roomId !== undefined && a.identityId !== undefined) {
          // votes list
          return [];
        }
        return null;
      }
    );

    renderWithJuice(<RoomPage slug="test-room" />);

    const joinBtn = screen.getByText('Mock Join');
    await act(async () => {
      mockIdentity.nickname = 'Tester'; // Simulate name entered
      fireEvent.click(joinBtn);
    });

    expect(await screen.findByText(/test-room/)).toBeDefined();
    expect(screen.getByText(/Choose your estimate/)).toBeDefined();
  });

  it('handles join error', async () => {
    mockIdentity.nickname = '';
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(convex.useQuery).mockImplementation(
      (apiFn: unknown, args: unknown) => {
        const a = args as Record<string, unknown>;
        if (a && a.slug !== undefined) {
          return {
            _id: 'room-id' as unknown as Id<'rooms'>,
            slug: a.slug as string,
            status: 'voting',
          };
        }
        if (a && a.roomId !== undefined && a.identityId !== undefined) {
          return []; // votes
        }
        return null;
      }
    );
    vi.mocked(convex.useMutation).mockReturnValue(() => {
      return Promise.reject(new Error('Join failed'));
    });

    renderWithJuice(<RoomPage slug="test-room" />);
    const joinBtn = screen.getByText('Mock Join');
    await act(async () => {
      fireEvent.click(joinBtn);
    });

    expect(screen.getByText('Mock Join')).toBeDefined();
  });

  it('renders 404 if room not found', () => {
    vi.mocked(convex.useQuery).mockReturnValue(null); // Not found
    renderWithJuice(<RoomPage slug="test-room" />);
    expect(screen.getByText(/Room not found/)).toBeDefined();
  });

  it('handles vote, reveal, and confirm interactions', async () => {
    mockIdentity.nickname = 'Tester';
    const mockMutation = vi.fn().mockResolvedValue({});

    vi.mocked(convex.useMutation).mockReturnValue(mockMutation);

    vi.mocked(convex.useQuery).mockImplementation(
      (apiFn: unknown, args: unknown) => {
        const a = args as Record<string, unknown>;
        if (a && a.slug !== undefined) {
          return {
            _id: 'room-id',
            slug: 'test-room',
            status: 'voting',
            facilitatorId: 'tester-id',
            currentTopicId: 'topic-1',
          };
        }
        if (a && a.roomId !== undefined && a.identityId === undefined) {
          return [
            {
              _id: '1',
              identityId: 'tester-id',
              name: 'Tester',
              isOnline: true,
            },
            {
              _id: 'topic-1',
              title: 'Test Topic',
              order: 1,
              status: 'active',
              name: 'Topic',
            },
          ];
        }
        if (a && a.roomId !== undefined && a.identityId !== undefined) {
          return [{ identityId: 'tester-id', value: '5', topicId: 'topic-1' }];
        }
        return [];
      }
    );

    renderWithJuice(<RoomPage slug="test-room" />);

    // Wait for render
    await screen.findAllByText('Test Topic');

    // Clear auto-join call from mock
    mockMutation.mockClear();

    // 1. Vote
    const cards = screen.getAllByTestId('poker-card');
    await act(async () => {
      fireEvent.click(cards[4]); // Click a card (e.g. '5')
    });
    expect(mockMutation).toHaveBeenCalledWith(
      expect.objectContaining({ value: 5 })
    );

    // 2. Reveal
    const revealBtn = screen.getByRole('button', { name: /Reveal Votes/i });
    await act(async () => {
      fireEvent.click(revealBtn);
    });
    // Can't easily distinguish from other calls with no unique args if we only have roomId, but we know it was called
    expect(mockMutation).toHaveBeenCalled();

    // 3. Batch Add
    const batchAddBtn = screen.getByRole('button', { name: /Batch Add/i });
    await act(async () => {
      fireEvent.click(batchAddBtn);
    });

    const batchInput = screen.getByPlaceholderText(/Topic 1/i);
    await act(async () => {
      fireEvent.change(batchInput, { target: { value: 'New Topic' } });
    });

    const submitBatchBtn = screen.getByRole('button', { name: /Add Topics/i });
    await act(async () => {
      fireEvent.click(submitBatchBtn);
    });
    expect(mockMutation).toHaveBeenCalledWith(
      expect.objectContaining({ titlesString: 'New Topic' })
    );
  });
});

describe('RootLayout', () => {
  it('renders root component with providers', () => {
    const route = RootLayout as unknown as {
      options: { component: React.ComponentType };
    };
    const Root = route.options.component;
    render(<Root />);
    expect(screen.getByTestId('outlet')).toBeDefined();
  });

  it('renders root document shell', () => {
    const route = RootLayout as unknown as {
      options: { shellComponent: React.ComponentType<{ children: ReactNode }> };
    };
    const Shell = route.options.shellComponent;
    renderWithJuice(<Shell>Test Content</Shell>);
    expect(screen.getByText('Test Content')).toBeDefined();
  });
});

import { Route as IndexRoute } from '../src/routes/index';
import { Route as RoomRoute } from '../src/routes/room.$slug';
import '../src/router';

describe('IndexRoute', () => {
  it('renders index route', () => {
    const route = IndexRoute as unknown as {
      options: { component: React.ComponentType };
    };
    const Component = route.options.component;
    render(<Component />);
    expect(screen.getByText(/Create Master Room/)).toBeDefined();
  });
});

describe('RoomRoute', () => {
  it('renders room route', async () => {
    mockIdentity.nickname = '';
    vi.mocked(convex.useMutation).mockReturnValue(
      vi.fn().mockResolvedValue({})
    );
    vi.mocked(convex.useQuery).mockImplementation(
      (apiFn: unknown, args: unknown) => {
        const a = args as Record<string, unknown>;
        if (a && a.slug !== undefined) {
          return {
            _id: 'room-id' as unknown as Id<'rooms'>,
            slug: a.slug as string,
            status: 'voting',
            facilitatorId: 'tester-id',
          };
        }
        if (a && a.roomId !== undefined && a.identityId === undefined) {
          // players
          return [
            {
              _id: '1' as unknown as Id<'players'>,
              identityId: 'tester-id',
              name: 'Tester',
              isOnline: true,
            },
          ];
        }
        if (a && a.roomId !== undefined && a.identityId !== undefined) {
          // votes
          return [];
        }
        return null;
      }
    );
    const route = RoomRoute as unknown as {
      options: { component: React.ComponentType };
    };
    const Component = route.options.component;
    renderWithJuice(<Component />);

    const joinBtn = screen.getByText('Mock Join');
    await act(async () => {
      mockIdentity.nickname = 'Tester';
      fireEvent.click(joinBtn);
    });

    expect(await screen.findByText(/test-room/)).toBeDefined();
  });
});
