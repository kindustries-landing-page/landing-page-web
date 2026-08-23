import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

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

interface PaceoVideoShowcaseProps {
  videoSrc?: string;
  posterSrc?: string;
}

export function PaceoVideoShowcase({
  videoSrc = '/media/paceo-keyvisual.mp4',
  posterSrc = '/media/paceo-poster.webp',
}: PaceoVideoShowcaseProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(61.8);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync fullscreen state with document
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as FullscreenDocument;
      const isCurrentlyFullscreen = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // IntersectionObserver: auto-play when in viewport, auto-pause when scrolled away
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
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

  const toggleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current as FullscreenElement | null;
    if (!container) return;

    const doc = document as FullscreenDocument;
    const isCurrentlyFullscreen = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);

    if (!isCurrentlyFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
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

  const formatTime = (timeInSec: number) => {
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-6 sm:my-10 relative flex flex-col items-center">
      {/* Ambient Neon Purple Glow behind video */}
      <div className="absolute -inset-4 sm:-inset-8 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.3),rgba(75,0,118,0.1)_50%,transparent_75%)] rounded-[40px] blur-3xl -z-10 pointer-events-none" />

      {/* Video Container Card */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        className={`relative w-full overflow-hidden bg-black select-none group cursor-pointer ${
          isFullscreen
            ? 'w-screen h-screen rounded-none border-none'
            : 'aspect-[16/9] rounded-3xl sm:rounded-[32px] border border-white/60 dark:border-purple-500/30 shadow-[0_32px_90px_rgba(75,0,118,0.22)]'
        }`}
      >
        {/* Video Element */}
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
          className={`w-full h-full transition-transform duration-700 ${
            isFullscreen ? 'object-contain' : 'object-cover group-hover:scale-[1.01]'
          }`}
        />

        {/* Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Center Play/Pause Indicator (Fades out when playing) */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/25 backdrop-blur-2xl border border-white/40 flex items-center justify-center text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white translate-x-0.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Floating Glass HUD Controls */}
        <div
          className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 flex flex-col gap-3 transition-opacity duration-300 ${
            isHovered || !isPlaying || isFullscreen ? 'opacity-100' : 'opacity-0 sm:opacity-90'
          }`}
        >
          {/* Progress Scrubber Bar */}
          <div
            onClick={handleSeek}
            className="w-full h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer relative overflow-hidden backdrop-blur-md transition-all"
          >
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-purple-300 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Control Bar Actions */}
          <div className="flex items-center justify-between text-white text-xs font-semibold">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xl flex items-center justify-center transition-all cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                )}
              </button>

              <span className="font-mono text-zinc-300 tracking-wider text-[11px]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Sound Toggle Pill with Animated Wave */}
              <button
                onClick={toggleMute}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xl border border-white/20 transition-all cursor-pointer shadow-sm"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-zinc-300" />
                    <span className="text-[11px]">{t('unmute')}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                    <span className="text-[11px] text-purple-200">{t('mute')}</span>
                  </>
                )}
              </button>

              {/* Real Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-xl border border-white/20 transition-all cursor-pointer"
                title={isFullscreen ? t('exit_fullscreen') : t('fullscreen')}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">{t('exit_fullscreen')}</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">{t('fullscreen')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
