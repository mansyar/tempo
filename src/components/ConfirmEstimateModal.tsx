import { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ConfirmEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (estimate: string) => void;
  suggestedEstimate: string;
  topicTitle: string;
}

export function ConfirmEstimateModal({
  isOpen,
  onClose,
  onConfirm,
  suggestedEstimate,
  topicTitle,
}: ConfirmEstimateModalProps) {
  const [estimate, setEstimate] = useState(suggestedEstimate);

  // Update local state when suggested estimate changes
  useEffect(() => {
    setEstimate(suggestedEstimate);
  }, [suggestedEstimate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (String(estimate).trim()) {
      onConfirm(String(estimate).trim());
    }
  };

  const commonValues = ['1', '2', '3', '5', '8', '13', '21', '?'];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--bg-primary)] bg-opacity-80 backdrop-blur-sm px-4">
      <div className="island-shell rise-in w-full max-w-md rounded-2xl p-8 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Confirm Estimate
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

        <div className="mb-8">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-tertiary)] mb-1 block text-left">
            Topic
          </span>
          <p className="text-lg font-bold text-[var(--text-primary)] text-left">
            {topicTitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-6">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-tertiary)] mb-2 block text-left">
              Final Points
            </label>
            <input
              autoFocus
              type="text"
              value={estimate}
              onChange={(e) => setEstimate(e.target.value)}
              className="w-full text-4xl font-black text-center py-4 bg-[var(--bg-tertiary)] border-2 border-[var(--border-subtle)] rounded-2xl focus:border-[var(--accent)] focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 mb-8">
            {commonValues.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setEstimate(v)}
                className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                  estimate === v
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent)]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!String(estimate).trim()}
              className="px-8 py-3 bg-[var(--accent)] text-white text-sm font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save & Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
