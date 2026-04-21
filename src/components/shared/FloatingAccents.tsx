import { motion } from 'framer-motion';

const ACCENTS = [
  { type: 'circle', color: 'bg-retro-pink' },
  { type: 'square', color: 'bg-retro-yellow' },
  { type: 'triangle', color: 'bg-retro-blue' },
  { type: 'circle', color: 'bg-retro-green' },
];

export function FloatingAccents() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      {Array.from({ length: 12 }).map((_, i) => {
        const accent = ACCENTS[i % ACCENTS.length];
        const size = 20 + Math.random() * 60;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 10 + Math.random() * 20;

        return (
          <motion.div
            key={i}
            className={`absolute brutal-border ${accent.color}`}
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              borderRadius: accent.type === 'circle' ? '50%' : '0%',
              clipPath: accent.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}
