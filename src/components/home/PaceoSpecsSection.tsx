import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, PhoneCall, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export function PaceoSpecsSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section
      id="specs-section"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-24 flex flex-col items-center"
    >
      {/* Clean Action Banner Card with Official Hotlines */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full rounded-2xl p-5 sm:p-9 bg-gradient-to-br from-[#4B0076] via-[#6b119e] to-[#9366D9] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_56px_rgba(75,0,118,0.28)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-400/20 rounded-full blur-2xl -z-0 pointer-events-none" />

        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider sm:tracking-widest text-purple-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Hệ Thống Bảo Hành & Hỗ Trợ Khách Hàng
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-2 tracking-tight leading-snug">
            <span className="block sm:inline">Tra Cứu & Kích Hoạt </span>
            <span className="inline-block whitespace-nowrap">Bảo Hành K Lotus</span>
          </h3>
          <p className="text-sm sm:text-base text-purple-100/90 max-w-xl leading-relaxed mb-3">
            Nhập số khung và số máy để kiểm tra thông tin xe, kích hoạt bảo hành điện tử chính hãng
            và theo dõi lịch sử dịch vụ.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-purple-100 font-semibold">
            <a
              href="tel:1900545406"
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-purple-300" />
              Hotline: 1900 54 54 06
            </a>
            <a
              href="tel:0818545406"
              className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-purple-300" />
              Hotline: 08 18 54 54 06
            </a>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3.5 justify-center">
          <Button
            onClick={() => navigate('/bao-hanh')}
            className="bg-white text-[#4B0076] hover:bg-purple-50 font-bold px-8 h-13 rounded-full text-sm shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            {t('warranty_lookup_action')}
            <ArrowRight className="w-4 h-4 ml-2 text-[#4B0076]" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
