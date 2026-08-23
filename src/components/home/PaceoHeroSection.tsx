import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface FullscreenElement extends HTMLDivElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface WebKitVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void;
  webkitEnterFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitExitFullScreen?: () => void;
  webkitSupportsFullscreen?: boolean;
  webkitDisplayingFullscreen?: boolean;
}

export function PaceoHeroSection({
  videoSrc = '/media/paceo-keyvisual.mp4',
  posterSrc = '/media/paceo-poster.webp',
}: {
  videoSrc?: string;
  posterSrc?: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(61.8);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current as WebKitVideoElement | null;
    const handleFullscreenChange = () => {
      const doc = document as FullscreenDocument;
      const isCurrentlyFullscreen = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement ||
        video?.webkitDisplayingFullscreen
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    const handleVideoBeginFullscreen = () => setIsFullscreen(true);
    const handleVideoEndFullscreen = () => setIsFullscreen(false);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    if (video) {
      video.addEventListener('webkitbeginfullscreen', handleVideoBeginFullscreen);
      video.addEventListener('webkitendfullscreen', handleVideoEndFullscreen);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);

      if (video) {
        video.removeEventListener('webkitbeginfullscreen', handleVideoBeginFullscreen);
        video.removeEventListener('webkitendfullscreen', handleVideoEndFullscreen);
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const container = containerRef.current as FullscreenElement | null;
      const video = videoRef.current as WebKitVideoElement | null;
      if (!container) return;

      const doc = document as FullscreenDocument;
      const isCurrentlyFullscreen = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        video?.webkitDisplayingFullscreen ||
        isFullscreen
      );

      const isIOS =
        typeof navigator !== 'undefined' &&
        (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

      if (!isCurrentlyFullscreen) {
        if (isIOS && video?.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        } else if (container.requestFullscreen) {
          container.requestFullscreen().catch(() => {
            if (video?.webkitEnterFullscreen) video.webkitEnterFullscreen();
            else if (video?.requestFullscreen) video.requestFullscreen().catch(() => {});
          });
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen().catch(() => {
            if (video?.webkitEnterFullscreen) video.webkitEnterFullscreen();
          });
        } else if (video?.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      } else {
        if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen().catch(() => {});
        else if (video?.webkitExitFullscreen) video.webkitExitFullscreen();
      }
    },
    [isFullscreen]
  );

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
    setCurrentTime(pos * duration);
  };

  const scrollToNextSection = () => {
    const target = document.getElementById('specs-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatTime = (timeInSec: number) => {
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full overflow-hidden select-none bg-black transition-all duration-500 z-10 ${
        isFullscreen
          ? 'w-screen h-screen rounded-none'
          : 'h-[82vh] sm:h-[86vh] lg:h-[88vh] rounded-none'
      }`}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        loop
        muted={isMuted}
        playsInline
        autoPlay
        onLoadedMetadata={handleTimeUpdate}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        className={`absolute inset-0 w-full h-full cursor-pointer ${
          isFullscreen ? 'object-contain' : 'object-cover'
        }`}
      />

      {/* Cinematic Multi-Layer Gradient Overlays (Toned down in Fullscreen) */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-black/75 via-black/30 to-black/85 pointer-events-none transition-opacity duration-500 ${
          isFullscreen ? 'opacity-30' : 'opacity-100'
        }`}
      />
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.18),transparent_65%)] pointer-events-none transition-opacity duration-500 ${
          isFullscreen ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Center Play Indicator (when paused) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-30"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/25 backdrop-blur-2xl border border-white/40 flex items-center justify-center text-white shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform">
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white translate-x-0.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Typography & CTAs (Vertically and Horizontally Centered in Hero Viewport) */}
      <AnimatePresence>
        {!isFullscreen && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-8 pb-12 sm:pb-16 text-center text-white pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center max-w-4xl mx-auto pointer-events-auto"
            >
              {/* Brand Badge with Glowing K LOTUS */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-xl border border-purple-300/40 rounded-full pl-3 pr-5 py-1.5 text-[11px] sm:text-xs font-extrabold uppercase mb-4 sm:mb-5 shadow-lg shadow-purple-500/10"
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm">
                  <img src="/favicon.png" alt="K Lotus" className="w-full h-full object-contain" />
                </div>
                <span className="text-white font-black tracking-[0.2em] text-xs sm:text-[13px]">
                  K LOTUS
                </span>
                <span className="text-purple-300/50">|</span>
                <span className="text-purple-200 tracking-[0.14em]">
                  RA MẮT 2026 · MADE IN VIETNAM
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-5 sm:mb-7 drop-shadow-md"
              >
                <span className="text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
                  {t('hero_title_1')}{' '}
                </span>
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-200 bg-clip-text text-transparent drop-shadow">
                  {t('hero_title_2')}
                </span>
              </motion.h1>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center"
              >
                <Button
                  onClick={() => navigate('/bao-hanh')}
                  className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white px-7 sm:px-9 h-11 sm:h-13 rounded-full text-xs sm:text-sm font-bold shadow-[0_8px_32px_rgba(124,58,237,0.45)] hover:scale-105 transition-all cursor-pointer border border-white/20"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  {t('warranty_lookup_action')}
                </Button>

                <Button
                  variant="outline"
                  onClick={scrollToNextSection}
                  className="bg-black/40 hover:bg-black/60 backdrop-blur-xl border-white/25 text-white px-6 sm:px-8 h-11 sm:h-13 rounded-full text-xs sm:text-sm font-bold shadow-sm hover:scale-105 transition-all cursor-pointer"
                >
                  {t('explore_paceo')}
                  <ChevronDown className="w-4 h-4 ml-1.5 animate-bounce" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom HUD Controls & Scroll Cue */}
      <div className="absolute bottom-0 inset-x-0 z-20 w-full px-3 sm:px-8 pb-3 sm:pb-5 pointer-events-auto">
        <div
          className={`w-full max-w-5xl mx-auto transition-opacity duration-300 ${
            isHovered || !isPlaying || !isFullscreen ? 'opacity-100' : 'opacity-0 sm:opacity-90'
          }`}
        >
          {/* Scrubber */}
          <div
            onClick={handleSeek}
            className="w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden backdrop-blur-md transition-all mb-2.5"
          >
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-purple-300 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Bottom Actions Row */}
          <div className="flex items-center justify-between text-white text-xs font-semibold">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xl flex items-center justify-center transition-all cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                )}
              </button>

              <span className="font-mono text-zinc-300 text-[10px] sm:text-[11px]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Center Scroll Indicator Cue (Hidden in Fullscreen) */}
            {!isFullscreen && (
              <button
                onClick={scrollToNextSection}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-[11px] text-purple-200 backdrop-blur-md transition-all cursor-pointer group shadow-sm"
              >
                <ChevronDown className="w-3.5 h-3.5 text-purple-300 group-hover:translate-y-0.5 transition-transform animate-bounce" />
                <span>{t('scroll_to_explore')}</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              {/* Sound Toggle */}
              <button
                onClick={toggleMute}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xl border border-white/20 transition-all cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-zinc-300" />
                    <span className="text-[10px] sm:text-[11px]">{t('unmute')}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] text-purple-200">{t('mute')}</span>
                  </>
                )}
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xl border border-white/20 transition-all cursor-pointer"
                title={isFullscreen ? t('exit_fullscreen') : t('fullscreen')}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px] sm:text-[11px]">
                      {t('exit_fullscreen')}
                    </span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px] sm:text-[11px]">
                      {t('fullscreen')}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
