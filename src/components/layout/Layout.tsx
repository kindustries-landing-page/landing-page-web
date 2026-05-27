import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAppStore } from '@/src/store';
import { useTranslation } from 'react-i18next';

export function Layout({ children }: { children: React.ReactNode }) {
  const setTestDriveOpen = useAppStore(state => state.setTestDriveOpen);
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
  };
  
  return (
    <div className="min-h-screen relative text-zinc-900 font-sans flex flex-col items-center overflow-x-hidden">
      {/* Global Background from demo.html */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#fdf4ff_0%,#f0e6ff_40%,#ede0ff_70%,#fdf4ff_100%)]" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.25),transparent_70%)] -top-[100px] -right-[100px] animate-[float1_8s_ease-in-out_infinite]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(75,0,118,0.15),transparent_70%)] -bottom-[80px] -left-[60px] animate-[float2_10s_ease-in-out_infinite]" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(216,180,254,0.4),transparent_70%)] top-[30%] left-[20%] animate-[float1_6s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(75,0,118,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(75,0,118,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* TODO: Khôi phục nút chuyển ngôn ngữ ở góc phải trên cùng khi cần
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 backdrop-blur-md border border-[#4B0076]/20 rounded-full text-[13px] font-bold text-[#4B0076] hover:bg-[#4B0076]/5 transition-all shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
          {i18n.language === 'vi' ? 'EN' : 'VI'}
        </button>
      </div>
      */}
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <div className="w-full">
        <Footer />
      </div>

      {/* TODO: Khôi phục Floating Action Buttons khi cần
      <div className="fixed right-5 bottom-5 z-40 flex flex-col gap-2.5">
        <button 
          onClick={() => alert('Gọi ngay: 0908801567')}
          className="group relative w-12 h-12 rounded-full border-none cursor-pointer flex items-center justify-center transition-transform hover:scale-110 bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-[0_4px_16px_rgba(34,197,94,0.4)]"
        >
          <div className="absolute right-14 bg-black/75 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-md whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover:opacity-100">Gọi ngay</div>
          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        </button>
        <button 
          onClick={() => alert('Zalo: zalo.me/klotus')}
          className="group relative w-12 h-12 rounded-full border-none cursor-pointer flex items-center justify-center transition-transform hover:scale-110 bg-gradient-to-br from-[#0068ff] to-[#0047cc] shadow-[0_4px_16px_rgba(0,104,255,0.4)]"
        >
          <div className="absolute right-14 bg-black/75 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-md whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover:opacity-100">Chat Zalo</div>
          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>
        </button>
        <button 
          onClick={() => alert('Messenger: m.me/klotus')}
          className="group relative w-12 h-12 rounded-full border-none cursor-pointer flex items-center justify-center transition-transform hover:scale-110 bg-gradient-to-br from-[#0099ff] to-[#a033ff] shadow-[0_4px_16px_rgba(160,51,255,0.4)]"
        >
          <div className="absolute right-14 bg-black/75 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-md whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover:opacity-100">Messenger</div>
          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-white"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.34.27.56l.05 1.75c.02.55.58.9 1.08.65l1.95-.86c.17-.07.36-.09.53-.05.7.19 1.45.29 2.22.29 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1 13.06l-2.58-2.76-5.03 2.76 5.53-5.88 2.64 2.76 4.97-2.76-5.53 5.88z"/></svg>
        </button>
        <button 
          onClick={() => setTestDriveOpen(true)}
          className="group relative w-12 h-12 rounded-full border-none cursor-pointer flex items-center justify-center transition-transform hover:scale-110 bg-gradient-to-br from-[#4B0076] to-[#a855f7] shadow-[0_4px_16px_rgba(75,0,118,0.4)]"
        >
          <div className="absolute right-14 bg-black/75 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-md whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover:opacity-100">Lái thử</div>
          <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-white"><path d="M12 2L13.5 8.5H20L14.5 12.5L16.5 19L12 15L7.5 19L9.5 12.5L4 8.5H10.5L12 2Z"/></svg>
        </button>
      </div>
      */}
    </div>
  );
}
