import { PokerCard } from './PokerCard';
import { motion, AnimatePresence } from 'framer-motion';

interface CardGridProps {
  players: Array<{ identityId: string; name: string }>;
  votes: Array<{ identityId: string; value: string | number | null }>;
  revealed: boolean;
}

export function CardGrid({ players, votes, revealed }: CardGridProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 w-full max-w-5xl py-10">
      <AnimatePresence>
        {players.map((player, index) => {
          const vote = votes.find((v) => v.identityId === player.identityId);
          const hasVoted = !!vote;
          
          // Pseudo-random rotations for raw feel
          const rotations = ['-rotate-3', 'rotate-3', '-rotate-6', 'rotate-6', '-rotate-2', 'rotate-2'];
          const rotation = rotations[index % rotations.length];

          return (
            <motion.div
              key={player.identityId}
              data-testid="player-card-wrapper"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex flex-col items-center group ${rotation}`}
            >
              {/* Card Representation */}
              <div
                className={`
                  w-24 h-36 brutal-border transition-all duration-150 brutal-shadow
                  flex items-center justify-center text-4xl font-black
                  ${
                    revealed
                      ? 'bg-white text-black'
                      : hasVoted
                        ? 'bg-retro-green translate-x-1 translate-y-1 shadow-none'
                        : 'bg-white/10 brutal-border border-dashed'
                  }
                `}
              >
                {revealed ? (
                  <span className="uppercase">{vote?.value ?? '?'}</span>
                ) : hasVoted ? (
                  <span className="text-2xl font-black">✓</span>
                ) : (
                  <span className="text-2xl font-black opacity-20">?</span>
                )}
              </div>

              {/* Player Name Badge */}
              <div className={`mt-4 px-3 py-1 brutal-border bg-black text-white text-[10px] font-black uppercase tracking-widest transition-all ${hasVoted ? 'bg-retro-green text-black' : ''}`}>
                {player.name}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
