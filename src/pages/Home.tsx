import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PaceoVideoShowcase } from '@/src/components/home/PaceoVideoShowcase';
import { PaceoSpecsSection } from '@/src/components/home/PaceoSpecsSection';
import { ShieldCheck, Sparkles, ArrowDown } from 'lucide-react';

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToVideo = () => {
    const videoElem = document.getElementById('paceo-showcase');
    if (videoElem) {
      videoElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      {/* Hero Header Section with Generous Breathing Space */}
      <section className="relative w-full pt-32 sm:pt-36 pb-12 sm:pb-16 px-6 max-w-5xl flex flex-col items-center text-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-xl border border-purple-400/35 rounded-full px-5 py-2 text-[12px] font-extrabold text-[#4B0076] tracking-widest uppercase mb-8 shadow-sm shadow-purple-500/10"
        >
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          {t('paceo_badge')}
        </motion.div>

        {/* Dynamic Title with Airy Spacing */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight mb-12 drop-shadow-sm">
          <span className="block overflow-hidden pb-1">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-zinc-900"
            >
              K Lotus
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-4">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block bg-gradient-to-br from-[#4B0076] via-[#9366D9] to-[#c084fc] bg-clip-text text-transparent"
            >
              PACEO 2026
            </motion.span>
          </span>
        </h1>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex gap-5 flex-wrap justify-center items-center"
        >
          <Button
            onClick={scrollToVideo}
            className="bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white px-8 h-13 rounded-full text-sm font-bold shadow-[0_8px_32px_rgba(75,0,118,0.35)] hover:shadow-[0_16px_40px_rgba(75,0,118,0.45)] hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            {t('explore_paceo')}
            <ArrowDown className="w-4 h-4 ml-2 animate-bounce" />
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/bao-hanh')}
            className="bg-white/85 backdrop-blur-xl border-[#4B0076]/20 text-[#4B0076] px-8 h-13 rounded-full text-sm font-bold hover:bg-white hover:border-purple-400 shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 mr-2 text-purple-600" />
            {t('warranty_lookup_action')}
          </Button>
        </motion.div>
      </section>

      {/* Centerpiece Video Showcase Section */}
      <div id="paceo-showcase" className="w-full mb-12 sm:mb-16">
        <PaceoVideoShowcase
          videoSrc="/media/paceo-keyvisual.mp4"
          posterSrc="/media/paceo-poster.webp"
        />
      </div>

      {/* Action Banner Section */}
      <PaceoSpecsSection />
    </div>
  );
}
