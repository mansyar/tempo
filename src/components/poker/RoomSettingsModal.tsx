import { useState } from 'react';
import { X, Settings, Zap, Layers } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 px-4">
      <div className="bg-white brutal-border brutal-shadow w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-black hover:text-retro-pink transition-all brutal-border brutal-shadow bg-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-retro-yellow brutal-border">
            <Settings className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-3xl font-black uppercase text-black tracking-tight">
            Settings
          </h2>
        </div>

        <div className="space-y-10 text-left">
          {/* Auto-Reveal */}
          <div className="flex items-center justify-between gap-6 bg-retro-blue/10 p-4 brutal-border">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="font-black uppercase text-sm text-black">
                  Auto-Reveal
                </p>
                <p className="text-[10px] font-bold uppercase opacity-60">
                  Instant results on final vote.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoReveal(!autoReveal)}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer brutal-border transition-colors duration-100 focus:outline-none ${
                autoReveal ? 'bg-retro-green' : 'bg-white'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform brutal-border bg-black transition duration-100 ${
                  autoReveal ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Scale Type */}
          <div>
            <div className="flex items-start gap-3 mb-6 bg-black text-white px-2 py-1 brutal-border w-fit">
              <Layers className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">
                Estimation Scale
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setScaleType('fibonacci')}
                className={`p-4 brutal-border text-sm font-black uppercase transition-all brutal-shadow ${
                  scaleType === 'fibonacci'
                    ? 'bg-retro-yellow translate-x-0.5 translate-y-0.5 shadow-none'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                🔢 Fibonacci
                <p className="text-[10px] font-bold mt-2 opacity-60">
                  0, 1, 2, 3, 5, 8...
                </p>
              </button>
              <button
                onClick={() => setScaleType('tshirt')}
                className={`p-4 brutal-border text-sm font-black uppercase transition-all brutal-shadow ${
                  scaleType === 'tshirt'
                    ? 'bg-retro-yellow translate-x-0.5 translate-y-0.5 shadow-none'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                👕 T-Shirt
                <p className="text-[10px] font-bold mt-2 opacity-60">
                  XS, S, M, L, XL...
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 brutal-border bg-white text-xs font-black uppercase text-black hover:bg-gray-100 transition-all brutal-shadow"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-4 brutal-border bg-black text-xs font-black uppercase text-white hover:bg-retro-pink transition-all brutal-shadow"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
