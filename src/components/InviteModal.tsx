import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share } from 'lucide-react';
import { toast } from 'sonner';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomUrl: string;
}

export default function InviteModal({
  isOpen,
  onClose,
  roomUrl,
}: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pointy Planning Poker',
          text: 'Join my planning poker room!',
          url: roomUrl,
        });
      } catch {
        // Share was likely cancelled
      }
    }
  };

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-primary)] bg-opacity-80 backdrop-blur-sm px-4">
      <div className="island-shell rise-in w-full max-w-md rounded-2xl p-8 text-center relative border border-[var(--border-subtle)] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="display-title mb-2 text-2xl font-bold text-[var(--text-primary)]">
          Invite Players
        </h2>
        <p className="mb-8 text-sm text-[var(--text-secondary)]">
          Share this room with your team
        </p>

        <div className="mb-8 flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl shadow-inner mb-4 inline-block">
            <QRCodeSVG value={roomUrl} size={180} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Scan for Mobile Controller
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--bg-tertiary)] px-6 py-3.5 font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-glass)] active:scale-95 border border-[var(--border-subtle)]"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-[var(--success)]" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Link
              </>
            )}
          </button>

          {canShare && (
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3.5 font-bold text-white transition hover:bg-[var(--accent-hover)] active:scale-95 shadow-lg shadow-[var(--shadow-glow)]"
            >
              <Share className="w-5 h-5" />
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
