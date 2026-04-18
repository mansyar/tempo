import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Footer from '../src/components/Footer';
import Header from '../src/components/Header';
import ThemeToggle from '../src/components/ThemeToggle';
import { RoomPage } from '../src/components/RoomPage';
import { Route as RootLayout } from '../src/routes/__root';
import { ReactNode } from 'react';
import * as convex from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';

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
vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: () => ({
    nickname: 'Tester',
    identityId: 'tester-id',
    setNickname: vi.fn(),
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
    render(<Header />);
    expect(screen.getByText('Pointy')).toBeDefined();
    expect(screen.getByRole('link', { name: /Pointy/ })).toBeDefined();
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
  __esModule: true,
  default: ({ onJoin }: { onJoin: (nickname: string) => void }) => (
    <button onClick={() => onJoin('Tester')}>Mock Join</button>
  ),
}));

describe('RoomPage Component', () => {
  it('renders room loading state', () => {
    vi.mocked(convex.useQuery).mockReturnValue(undefined); // Loading
    render(<RoomPage slug="test-room" />);
    expect(screen.getByText(/Loading room/)).toBeDefined();
  });

  it('renders room content when loaded and joined', async () => {
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
        if (a && a.roomId !== undefined) {
          return [
            {
              _id: '1' as unknown as Id<'players'>,
              identityId: 'tester-id',
              name: 'Tester',
              isOnline: true,
            },
          ];
        }
        return null;
      }
    );

    render(<RoomPage slug="test-room" />);

    const joinBtn = screen.getByText('Mock Join');
    await act(async () => {
      fireEvent.click(joinBtn);
    });

    expect(await screen.findByText(/test-room/)).toBeDefined();
    expect(screen.getByText(/Choose your estimate/)).toBeDefined();
  });

  it('handles join error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(convex.useQuery).mockReturnValue({
      _id: 'room-id',
      slug: 'test-room',
      status: 'voting',
    });
    vi.mocked(convex.useMutation).mockReturnValue(() => {
      return Promise.reject(new Error('Join failed'));
    });

    render(<RoomPage slug="test-room" />);
    const joinBtn = screen.getByText('Mock Join');
    await act(async () => {
      fireEvent.click(joinBtn);
    });

    expect(screen.getByText('Mock Join')).toBeDefined();
  });

  it('renders 404 if room not found', () => {
    vi.mocked(convex.useQuery).mockReturnValue(null); // Not found
    render(<RoomPage slug="test-room" />);
    expect(screen.getByText(/Room not found/)).toBeDefined();
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
    render(<Shell>Test Content</Shell>);
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
    expect(screen.getByText(/Create Room/)).toBeDefined();
  });
});

describe('RoomRoute', () => {
  it('renders room route', async () => {
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
        if (a && a.roomId !== undefined) {
          return [
            {
              _id: '1' as unknown as Id<'players'>,
              identityId: 'tester-id',
              name: 'Tester',
              isOnline: true,
            },
          ];
        }
        return null;
      }
    );
    const route = RoomRoute as unknown as {
      options: { component: React.ComponentType };
    };
    const Component = route.options.component;
    render(<Component />);

    const joinBtn = screen.getByText('Mock Join');
    await act(async () => {
      fireEvent.click(joinBtn);
    });

    expect(await screen.findByText(/test-room/)).toBeDefined();
  });
});
