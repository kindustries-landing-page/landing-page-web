import React from 'react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gradient-to-br from-[#0a0010] to-[#4B0076] text-white pt-16 px-12 pb-7">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 max-w-7xl mx-auto">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#4B0076] to-[#a855f7] flex items-center justify-center">
              <svg viewBox="0 0 15 15" fill="none" className="w-[15px] h-[15px]">
                <circle cx="7.5" cy="7.5" r="6" stroke="white" strokeWidth="1.2" opacity=".8" />
                <path
                  d="M7.5 2.5v10M2.5 7.5h10"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="7.5" cy="7.5" r="1.8" fill="white" />
              </svg>
            </div>
            <span className="font-extrabold tracking-wide text-base">K LOTUS</span>
          </div>
          <p className="text-[13px] opacity-60 leading-relaxed max-w-xs">
            {t('company_name')}
            <br />
            {t('footer_desc')}
          </p>
        </div>

        {/* TODO: Khôi phục lại khi cần
        <div>
          <h4 className="text-[11px] font-bold tracking-wider uppercase opacity-40 mb-4">Sản phẩm</h4>
          <div className="flex flex-col gap-2.5 text-[13px] opacity-70">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:opacity-100 transition-opacity">KL Urban S</Link>
            <Link to="/" className="hover:opacity-100 transition-opacity">KL Pro Max</Link>
            <Link to="/" className="hover:opacity-100 transition-opacity">KL Mini Go</Link>
            <Link to="/" className="hover:opacity-100 transition-opacity">KL Sport X</Link>
            <Link to="/" className="hover:opacity-100 transition-opacity">KL Family Plus</Link>
          </div>
        </div>
        */}

        <div>
          <h4 className="text-[11px] font-bold tracking-wider uppercase opacity-40 mb-4">
            {t('contact')}
          </h4>
          <div className="flex flex-col gap-2 text-[13px] opacity-70">
            <p>{t('address_1')}</p>
            <p>{t('address_2')}</p>
            <p className="font-semibold text-white mt-1 opacity-100">0908801567</p>
            {/* <p>support@klotus.vn</p> */}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row items-center justify-between text-xs opacity-40 max-w-7xl mx-auto">
        <span>© 2025 {t('company_name')} · MST: 0319289900</span>
        <span className="mt-2 md:mt-0">{t('designed_by')}</span>
      </div>
    </footer>
  );
}
