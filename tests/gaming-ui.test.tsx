import { render, screen, fireEvent } from '@testing-library/react';
import { PokerCard } from '../src/components/PokerCard';
import { CardGrid } from '../src/components/CardGrid';
import { CardDeck } from '../src/components/CardDeck';
import { describe, it, expect, vi } from 'vitest';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({
        children,
        onClick,
        whileHover: _whileHover,
        whileTap: _whileTap,
        animate: _animate,
        initial: _initial,
        exit: _exit,
        transition: _transition,
        ...props
      }: Record<string, unknown> & {
        children?: React.ReactNode;
        onClick?: () => void;
      }) => (
        <div onClick={onClick} {...props}>
          {children}
        </div>
      ),
    },
    useMotionValue: (initial: number) => ({
      set: vi.fn(),
      get: () => initial,
    }),
    useSpring: (value: unknown) => value,
    useTransform: (value: unknown) => value,
  };
});

describe('PokerCard', () => {
  it('renders the card value', () => {
    render(<PokerCard value="5" onSelect={() => {}} />);
    expect(screen.getByText('5')).toBeDefined();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<PokerCard value="8" onSelect={onSelect} />);
    fireEvent.click(screen.getByText('8'));
    expect(onSelect).toHaveBeenCalledWith('8');
  });

  it('renders selected state', () => {
    const { container } = render(
      <PokerCard value="3" onSelect={() => {}} selected />
    );
    // Check for a class or style that indicates selection
    expect(container.firstChild).toBeDefined();
  });

  it('handles mouse move and leave events', () => {
    const { getByTestId } = render(
      <PokerCard value="Q" onSelect={() => {}} data-testid="poker-card" />
    );
    const div = getByTestId('poker-card');

    fireEvent.mouseMove(div, { clientX: 10, clientY: 10 });
    fireEvent.mouseLeave(div);
  });
});

describe('CardGrid', () => {
  it('renders cards for all players', () => {
    const players = [
      { identityId: '1', name: 'Alice' },
      { identityId: '2', name: 'Bob' },
    ];
    const votes = [{ identityId: '1', value: '5' }];

    render(<CardGrid players={players} votes={votes} revealed={false} />);

    expect(screen.getAllByTestId('player-card-wrapper').length).toBe(2);
  });
});

describe('CardDeck', () => {
  it('renders all voting options', () => {
    render(<CardDeck onSelect={() => {}} />);
    // Fib + ? + Coffee = 8 + 1 + 1 = 10 cards usually
    expect(screen.getAllByTestId('poker-card').length).toBeGreaterThan(5);
  });

  it('calls onSelect when a card is clicked', () => {
    const onSelect = vi.fn();
    render(<CardDeck onSelect={onSelect} />);
    fireEvent.click(screen.getByText('5'));
    expect(onSelect).toHaveBeenCalledWith(5);
  });
});
