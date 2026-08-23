import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X, Volume2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaceoTheaterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoSrc?: string;
  posterSrc?: string;
}

export function PaceoTheaterModal({
  open,
  onOpenChange,
  videoSrc = '/media/paceo-keyvisual.mp4',
  posterSrc = '/media/paceo-poster.webp',
}: PaceoTheaterModalProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If unmuted autoplay is blocked by browser policy, fallback to muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    } else if (!open && videoRef.current) {
      videoRef.current.pause();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-5xl bg-zinc-950/95 backdrop-blur-3xl border border-purple-500/30 rounded-[28px] p-0 overflow-hidden shadow-[0_48px_140px_rgba(75,0,118,0.4)] text-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <DialogTitle className="text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />K Lotus Paceo — Official Keyvisual
              2026
            </DialogTitle>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <Volume2 className="w-3 h-3 text-purple-400" />
              1080p FHD · Stereo
            </span>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label={t('close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
