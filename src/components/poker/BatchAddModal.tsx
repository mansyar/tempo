import { useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4">
      <div className="bg-white brutal-border brutal-shadow w-full max-w-lg p-8 flex flex-col overflow-hidden relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-retro-yellow brutal-border">
              <ListPlus className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-black uppercase text-black tracking-tight">
              Batch Add
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-black hover:text-retro-pink transition-all brutal-border brutal-shadow bg-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm font-bold uppercase opacity-80 mb-6 text-left">
          Enter topics, one per line. Blank lines ignored.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <textarea
            autoFocus
            value={titlesString}
            onChange={(e) => setTitlesString(e.target.value)}
            placeholder="TOPIC 1&#10;TOPIC 2&#10;TOPIC 3..."
            className="w-full flex-1 min-h-[200px] brutal-border bg-white px-4 py-4 text-black focus:bg-retro-yellow focus:outline-none transition-all font-black uppercase text-sm resize-none mb-8 brutal-shadow"
          />

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-xs font-black uppercase text-black hover:underline decoration-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!titlesString.trim()}
              className="px-8 py-4 bg-black text-white text-xs font-black uppercase brutal-border brutal-shadow transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add Topics
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
