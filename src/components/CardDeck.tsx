import { PokerCard } from './PokerCard';

interface CardDeckProps {
  onSelect: (value: string | number) => void;
  selectedVote?: string | number | null;
  isController?: boolean;
  scaleType?: 'fibonacci' | 'tshirt';
}

const FIBONACCI_VALUES = [0, 1, 2, 3, 5, 8, 13, 21, '?', '☕'];
const TSHIRT_VALUES = ['XS', 'S', 'M', 'L', 'XL', '?', '☕'];

export function CardDeck({
  onSelect,
  selectedVote,
  isController = false,
  scaleType = 'fibonacci',
}: CardDeckProps) {
  const deckValues = scaleType === 'tshirt' ? TSHIRT_VALUES : FIBONACCI_VALUES;

  if (isController) {
    return (
      <div className="w-full">
        <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-4">
          Cast your vote
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {deckValues.map((val) => (
            <button
              key={val}
              onClick={() => onSelect(val)}
              className={`aspect-square flex items-center justify-center rounded-2xl text-lg font-bold transition-all active:scale-90 ${
                selectedVote === val
                  ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--shadow-glow)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--bg-secondary)]/50 backdrop-blur-sm border-t border-[var(--border-subtle)] p-6 sm:p-8">
      <div className="page-wrap max-w-5xl mx-auto">
        <h3 className="text-center text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6">
          Choose your estimate
        </h3>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {deckValues.map((val) => (
            <PokerCard
              key={val}
              value={val}
              selected={selectedVote === val}
              onSelect={onSelect}
              data-testid="poker-card"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
