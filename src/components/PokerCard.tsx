import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

interface PokerCardProps {
  value: string | number;
  selected?: boolean;
  disabled?: boolean;
  revealed?: boolean;
  onSelect: (value: string | number) => void;
  children?: ReactNode;
  [key: string]: unknown;
}

export function PokerCard({
  value,
  selected,
  disabled,
  revealed = true,
  onSelect,
  ...props
}: PokerCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => !disabled && onSelect(value)}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(value);
        }
      }}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-pressed={selected}
      aria-label={`Vote ${value}`}
      {...props}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        scale: selected ? 1.05 : 1,
        y: selected ? -8 : 0,
      }}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`
        relative w-20 h-28 sm:w-24 sm:h-36 rounded-xl cursor-pointer
        flex items-center justify-center text-2xl sm:text-3xl font-bold
        transition-all duration-200 outline-none
        focus-visible:ring-4 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${
          selected
            ? 'bg-[var(--accent)] text-[var(--bg-primary)] shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)]'
            : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-2 border-[var(--border-subtle)] hover:border-[var(--accent)]'
        }
      `}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 rounded-xl bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

      {revealed ? (
        <span style={{ transform: 'translateZ(20px)' }}>{value}</span>
      ) : (
        <div
          className="w-full h-full rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center"
          style={{ transform: 'translateZ(10px)' }}
        >
          <div className="w-8 h-12 rounded-sm border-2 border-[var(--accent)]/30 opacity-20" />
        </div>
      )}
    </motion.div>
  );
}
