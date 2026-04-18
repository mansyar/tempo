import { useEffect, useState } from 'react';

export function useJuice() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('sensory-juice');
    if (stored !== null) {
      setEnabled(stored === 'true');
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem('sensory-juice', String(next));
  };

  return { enabled, toggle };
}

export default function JuiceToggle() {
  const { enabled, toggle } = useJuice();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      title={enabled ? 'Disable sensory juice' : 'Enable sensory juice'}
      className={`rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-sm ${
        enabled
          ? 'bg-[var(--bg-tertiary)] text-[var(--accent)]'
          : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] opacity-60'
      }`}
    >
      {enabled ? '≡ƒìä Juice On' : '≡ƒìä Juice Off'}
    </button>
  );
}
