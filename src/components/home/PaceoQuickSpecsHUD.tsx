import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Gauge, BatteryCharging, Droplets, Smartphone } from 'lucide-react';

export function PaceoQuickSpecsHUD() {
  const { t } = useTranslation();

  const specs = [
    {
      icon: Zap,
      label: t('specs_power'),
      value: t('specs_power_val'),
      highlight: true,
    },
    {
      icon: Gauge,
      label: t('specs_speed'),
      value: t('specs_speed_val'),
    },
    {
      icon: BatteryCharging,
      label: t('specs_range'),
      value: t('specs_range_val'),
    },
    {
      icon: Droplets,
      label: t('specs_waterproof'),
      value: t('specs_waterproof_val'),
    },
    {
      icon: Smartphone,
      label: t('specs_nfc'),
      value: t('specs_nfc_val'),
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6">
      {/* Horizontal scroll container on mobile, flex row on tablet/desktop */}
      <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x snap-mandatory">
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`snap-start shrink-0 flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl backdrop-blur-xl border transition-all duration-300 select-none ${
                item.highlight
                  ? 'bg-purple-950/40 border-purple-400/40 text-purple-100 shadow-[0_4px_20px_rgba(168,85,247,0.15)]'
                  : 'bg-black/35 border-white/15 text-white/90 hover:bg-black/45 hover:border-white/30'
              }`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                  item.highlight ? 'bg-purple-500/25 text-purple-300' : 'bg-white/10 text-white/80'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] sm:text-[11px] font-medium tracking-tight text-zinc-300/80 leading-none mb-1">
                  {item.label}
                </span>
                <span className="text-[11px] sm:text-sm font-extrabold tracking-tight text-white leading-none">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
