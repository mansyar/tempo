import React, { createContext, useContext, useEffect, useState } from 'react';

interface JuiceContextType {
  enabled: boolean;
  toggle: () => void;
}

const JuiceContext = createContext<JuiceContextType | undefined>(undefined);

export function JuiceProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <JuiceContext.Provider value={{ enabled, toggle }}>
      {children}
    </JuiceContext.Provider>
  );
}

export function useJuice() {
  const context = useContext(JuiceContext);
  if (context === undefined) {
    throw new Error('useJuice must be used within a JuiceProvider');
  }
  return context;
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
      {enabled ? 'Juice On' : 'Juice Off'}
    </button>
  );
}
