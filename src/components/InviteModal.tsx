import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share, Smartphone, Link } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useIdentity } from '../hooks/useIdentity';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomUrl: string;
}

export function InviteModal({ isOpen, onClose, roomUrl }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'invite' | 'sync'>('invite');
  const [syncToken, setSyncToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number>(120);

  const createSyncToken = useMutation(api.sync.create);
  const { identityId } = useIdentity();

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTab === 'sync' && expiresIn > 0) {
      timer = setInterval(() => {
        setExpiresIn((prev) => prev - 1);
      }, 1000);
    } else if (expiresIn === 0) {
      setSyncToken(null);
    }
    return () => clearInterval(timer);
  }, [activeTab, expiresIn]);

  useEffect(() => {
    if (activeTab === 'sync' && !syncToken && identityId) {
      createSyncToken({ identityId }).then(setSyncToken);
      setExpiresIn(120);
    }
  }, [activeTab, syncToken, identityId, createSyncToken]);

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
  const syncUrl = syncToken ? `${roomUrl}?sync=${syncToken}` : '';

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

        <h2 className="display-title mb-6 text-2xl font-bold text-[var(--text-primary)]">
          Invite Players
        </h2>

        {/* Tabs */}
        <div className="mb-8 flex p-1 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-subtle)]">
          <button
            onClick={() => setActiveTab('invite')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'invite'
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <Link className="w-4 h-4" />
            Invite Link
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'sync'
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Sync Controller
          </button>
        </div>

        {activeTab === 'invite' ? (
          <>
            <p className="mb-6 text-sm text-[var(--text-secondary)]">
              Share this room with your team
            </p>
            <div className="mb-8 flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-inner mb-4 inline-block">
                <QRCodeSVG value={roomUrl} size={180} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                Scan to Join Room
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
          </>
        ) : (
          <>
            <p className="mb-6 text-sm text-[var(--text-secondary)]">
              Sync your session to your mobile device
            </p>
            <div className="mb-8 flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-inner mb-4 inline-block relative">
                {!syncToken ? (
                  <div className="w-[180px] h-[180px] flex items-center justify-center text-[var(--text-tertiary)]">
                    Generating...
                  </div>
                ) : (
                  <QRCodeSVG value={syncUrl} size={180} />
                )}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                Scan to Sync Identity
              </p>
              {syncToken && (
                <p className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded">
                  Expires in: {Math.floor(expiresIn / 60)}:
                  {(expiresIn % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] italic">
              Scanning this will automatically log you in on mobile with your
              current identity.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
