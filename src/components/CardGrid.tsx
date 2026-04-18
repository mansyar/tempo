import { PokerCard } from './PokerCard';
import { motion, AnimatePresence } from 'framer-motion';

interface CardGridProps {
  players: Array<{ identityId: string; name: string }>;
  votes: Array<{ identityId: string; value: string | number | null }>;
  revealed: boolean;
}

export function CardGrid({ players, votes, revealed }: CardGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
      <AnimatePresence>
        {players.map((player, index) => {
          const vote = votes.find((v) => v.identityId === player.identityId);
          const hasVoted = !!vote;

          return (
            <motion.div
              key={player.identityId}
              data-testid="player-card-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-3"
            >
              <PokerCard
                value={vote?.value ?? ''}
                disabled={!hasVoted}
                revealed={revealed}
                onSelect={() => {}}
              />
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[100px]">
                  {player.name}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-tighter ${hasVoted ? 'text-[var(--success)]' : 'text-[var(--text-tertiary)]'}`}
                >
                  {hasVoted ? 'Ready' : 'Thinking...'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
