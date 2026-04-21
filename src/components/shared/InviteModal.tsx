import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share, Smartphone, Link } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useIdentity } from '../../hooks/useIdentity';

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
          title: 'Tempo - Planning Poker',
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4">
      <div className="bg-white brutal-border brutal-shadow w-full max-w-md p-8 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-black hover:text-retro-pink transition-all brutal-border brutal-shadow bg-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-6 text-3xl font-black uppercase text-black tracking-tight">
          Invite Players
        </h2>

        {/* Tabs */}
        <div className="mb-8 flex brutal-border bg-black p-1">
          <button
            onClick={() => setActiveTab('invite')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase transition-all ${
              activeTab === 'invite'
                ? 'bg-retro-yellow text-black brutal-border'
                : 'text-white hover:text-retro-yellow'
            }`}
          >
            <Link className="w-4 h-4" />
            Link
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase transition-all ${
              activeTab === 'sync'
                ? 'bg-retro-yellow text-black brutal-border'
                : 'text-white hover:text-retro-yellow'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </button>
        </div>

        {activeTab === 'invite' ? (
          <>
            <p className="mb-6 text-sm font-bold uppercase opacity-80">
              Share this room with your team
            </p>
            <div className="mb-8 flex flex-col items-center">
              <div className="bg-white p-6 brutal-border brutal-shadow mb-4 inline-block">
                <QRCodeSVG value={roomUrl} size={180} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1 brutal-border">
                Scan to Join
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 brutal-border bg-white px-6 py-4 font-black uppercase text-black transition-all hover:bg-retro-blue brutal-shadow"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
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
                  className="w-full flex items-center justify-center gap-2 brutal-border bg-retro-pink px-6 py-4 font-black uppercase text-black transition-all brutal-shadow"
                >
                  <Share className="w-5 h-5" />
                  Share
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="mb-6 text-sm font-bold uppercase opacity-80">
              Sync your session to your mobile device
            </p>
            <div className="mb-8 flex flex-col items-center">
              <div className="bg-white p-6 brutal-border brutal-shadow mb-4 inline-block relative">
                {!syncToken ? (
                  <div className="w-[180px] h-[180px] flex items-center justify-center font-black uppercase opacity-40">
                    Generating...
                  </div>
                ) : (
                  <QRCodeSVG value={syncUrl} size={180} />
                )}
              </div>
              <p className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1 brutal-border mb-3">
                Scan to Sync
              </p>
              {syncToken && (
                <p className="text-xs font-black uppercase text-black bg-retro-green px-3 py-1 brutal-border">
                  Expires in: {Math.floor(expiresIn / 60)}:
                  {(expiresIn % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>
            <p className="text-xs font-bold uppercase opacity-60 italic">
              Scanning this will automatically log you in on mobile with your
              current identity.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
