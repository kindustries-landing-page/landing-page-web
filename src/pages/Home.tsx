import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PaceoVideoShowcase } from '@/src/components/home/PaceoVideoShowcase';
import { PaceoSpecsSection } from '@/src/components/home/PaceoSpecsSection';
import { ShieldCheck, ArrowDown } from 'lucide-react';

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
        {/* Top Badge matching Image 2 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 bg-white/85 backdrop-blur-xl border border-purple-300/50 rounded-full px-6 py-2 text-[12px] sm:text-[13px] font-extrabold text-[#4B0076] tracking-[0.14em] uppercase mb-8 shadow-sm shadow-purple-500/5"
        >
          <span className="w-2 h-2 rounded-full bg-purple-600" />
          {t('hero_badge')}
        </motion.div>

        {/* Dynamic Title matching Image 2 */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.5rem] font-black leading-[1.02] tracking-tight mb-6 sm:mb-8 drop-shadow-sm">
          <span className="block overflow-hidden pb-1">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[#18181b] tracking-[-0.03em]"
            >
              {t('hero_title_1')}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-3">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block bg-gradient-to-r from-[#4B0076] via-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent tracking-[-0.03em]"
            >
              {t('hero_title_2')}
            </motion.span>
          </span>
        </h1>

        {/* Subtitle matching Image 2 */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed mb-10 sm:mb-12 font-medium"
        >
          {t('hero_subtitle')}
        </motion.p>

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
