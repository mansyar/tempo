import { useState } from 'react';
import { X, Settings, Zap, Layers } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';

interface RoomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: Id<'rooms'>;
  identityId: string;
  initialAutoReveal?: boolean;
  initialScaleType?: 'fibonacci' | 'tshirt';
}

export function RoomSettingsModal({
  isOpen,
  onClose,
  roomId,
  identityId,
  initialAutoReveal = false,
  initialScaleType = 'fibonacci',
}: RoomSettingsModalProps) {
  const [autoReveal, setAutoReveal] = useState(initialAutoReveal);
  const [scaleType, setScaleType] = useState(initialScaleType);
  const updateSettings = useMutation(api.rooms.updateSettings);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await updateSettings({
        roomId,
        identityId,
        autoReveal,
        scaleType,
      });
      toast.success('Room settings updated!');
      onClose();
    } catch {
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[var(--bg-primary)] bg-opacity-80 backdrop-blur-sm px-4">
      <div className="island-shell rise-in w-full max-w-md rounded-2xl p-8 relative border border-[var(--border-subtle)] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[var(--bg-tertiary)] rounded-xl">
            <Settings className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <h2 className="display-title text-2xl font-bold text-[var(--text-primary)]">
            Room Settings
          </h2>
        </div>

        <div className="space-y-8 text-left">
          {/* Auto-Reveal */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Zap className="w-5 h-5 text-[var(--success)]" />
              </div>
              <div>
                <p className="font-bold text-[var(--text-primary)]">
                  Auto-Reveal
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Automatically show results when everyone has voted.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoReveal(!autoReveal)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoReveal ? 'bg-[var(--success)]' : 'bg-[var(--bg-tertiary)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoReveal ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Scale Type */}
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-1">
                <Layers className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-bold text-[var(--text-primary)]">
                  Estimation Scale
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Choose the values for your planning cards.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScaleType('fibonacci')}
                className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                  scaleType === 'fibonacci'
                    ? 'border-[var(--accent)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm'
                    : 'border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-[var(--accent)]/50'
                }`}
              >
                🔢 Fibonacci
                <p className="text-[10px] font-normal mt-1 opacity-60">
                  0, 1, 2, 3, 5, 8, 13...
                </p>
              </button>
              <button
                onClick={() => setScaleType('tshirt')}
                className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                  scaleType === 'tshirt'
                    ? 'border-[var(--accent)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm'
                    : 'border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-[var(--accent)]/50'
                }`}
              >
                👕 T-Shirt
                <p className="text-[10px] font-normal mt-1 opacity-60">
                  XS, S, M, L, XL...
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-[var(--border-subtle)] text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-bold hover:brightness-110 shadow-lg shadow-[var(--accent)]/20 active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
