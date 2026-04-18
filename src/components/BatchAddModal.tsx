import { useState } from 'react';
import type { Id } from '../../convex/_generated/dataModel';
import { X, ListPlus } from 'lucide-react';

interface BatchAddModalProps {
  roomId: Id<'rooms'>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (titlesString: string) => void;
}

export function BatchAddModal({
  isOpen,
  onClose,
  onSubmit,
}: BatchAddModalProps) {
  const [titlesString, setTitlesString] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titlesString.trim()) {
      onSubmit(titlesString);
      setTitlesString('');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--bg-primary)] bg-opacity-80 backdrop-blur-sm px-4">
      <div className="island-shell rise-in w-full max-w-lg rounded-2xl p-8 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ListPlus className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Batch Add Topics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-4 text-left">
          Enter multiple topics, one per line. Blank lines will be ignored.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <textarea
            autoFocus
            value={titlesString}
            onChange={(e) => setTitlesString(e.target.value)}
            placeholder="Topic 1&#10;Topic 2&#10;Topic 3..."
            className="w-full flex-1 min-h-[200px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-4 py-3 text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] transition-all font-mono text-sm resize-none mb-6"
          />

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!titlesString.trim()}
              className="px-6 py-2 bg-[var(--accent)] text-white text-sm font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Topics
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
