import React from 'react';
import { PaceoHeroSection } from '@/src/components/home/PaceoHeroSection';
import { PaceoSpecsSection } from '@/src/components/home/PaceoSpecsSection';

export function Home() {
  return (
    <div className="w-full relative flex flex-col items-center">
      {/* Full-Width Cinematic Hero Section at Top */}
      <PaceoHeroSection
        videoSrc="/media/paceo-keyvisual.mp4"
        posterSrc="/media/paceo-poster.webp"
      />

      {/* Customer Support & Warranty Action Banner */}
      <PaceoSpecsSection />
    </div>
  );
}
