import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/src/lib/api';
import { ProductSvgs } from '@/src/lib/svgs';
import { useAppStore } from '@/src/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Product } from '@/src/types';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-next';
import { useTranslation as useTranslationRef } from 'react-i18next'; // correct import

export function Home() {
  const { t } = useTranslationRef();
  const { data: products, isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const setTestDriveOpen = useAppStore(state => state.setTestDriveOpen);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  return (
    <div className="w-full relative">
      {/* Hero Section */}
      <section className="relative min-h-[600px] h-screen overflow-hidden flex items-center justify-center">
        <div className="relative z-10 text-center px-6 max-w-3xl flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-purple-400/30 rounded-full px-5 py-2 text-[12px] font-bold text-[#4B0076] tracking-widest uppercase mb-8 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Ra mắt 2025 · Made in Vietnam
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter mb-8 drop-shadow-sm">
            <span className="block overflow-hidden"><motion.span initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }} className="inline-block text-zinc-900">{t('title') ? t('title').split(' ').slice(0, 2).join(' ') : 'Xe Điện'}</motion.span></span>
            <span className="block overflow-hidden pb-4"><motion.span initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16,1,0.3,1] }} className="inline-block bg-gradient-to-br from-[#4B0076] via-[#a855f7] to-[#e879f9] bg-clip-text text-transparent">{t('title') ? t('title').split(' ').slice(2).join(' ') : 'Thế Hệ Mới'}</motion.span></span>
          </h1>
          
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="text-lg md:text-xl text-zinc-600/90 font-medium leading-relaxed max-w-xl mx-auto mb-10">
            {t('subtitle')}
          </motion.p>

          {/* 
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.65 }} className="flex gap-3.5 flex-wrap justify-center">
            <Button 
              className="bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white px-8 h-14 rounded-full text-[15px] font-bold shadow-[0_8px_32px_rgba(75,0,118,0.35)] hover:shadow-[0_16px_40px_rgba(75,0,118,0.45)] hover:-translate-y-1 transition-all"
              onClick={() => document.getElementById('prod-sec')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('explore_now')}
            </Button>
            <Button 
              variant="outline"
              className="bg-white/70 backdrop-blur-md text-[#4B0076] border-[#4B0076]/20 px-8 h-14 rounded-full text-[15px] font-semibold hover:bg-white hover:border-purple-400 hover:shadow-[0_6px_20px_rgba(75,0,118,0.12)] transition-all"
              onClick={() => setTestDriveOpen(true)}
            >
              {t('free_test_drive')}
            </Button>
          </motion.div>
          */}
        </div>
      </section>

      {/* TODO: Khôi phục lại các section bên dưới khi cần */}
      {/* 
      <div className="overflow-hidden py-3.5 bg-gradient-to-r from-[#4B0076] via-[#9366D9] to-[#4B0076]">
        <div className="flex gap-10 whitespace-nowrap animate-mq">
          {Array(4).fill(['KHÔNG KHÍ THẢI', 'CÔNG NGHỆ XANH', 'BẢO HÀNH 3 NĂM', 'MADE IN VIETNAM', 'PIN BỀN LÂU', 'THIẾT KẾ ĐỘC ĐÁO']).flat().map((item, i) => (
             <React.Fragment key={i}>
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-white/85">{item}</span>
                <span className="text-white/40">✦</span>
             </React.Fragment>
          ))}
        </div>
      </div>

      <section id="prod-sec" className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#fdf4ff] to-white items-center flex flex-col">
        <div className="text-center text-[11px] font-bold tracking-widest uppercase text-purple-500 mb-2.5">Dòng sản phẩm</div>
        <h2 className="text-center text-4xl font-extrabold tracking-tight mb-2">5 Dòng Xe K Lotus</h2>
        <p className="text-center text-zinc-400 text-[15px] mb-14">Nhấn vào xe để xem chi tiết thông số và tính năng</p>
        
        {isLoading ? (
          <div className="text-center">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 max-w-6xl w-full">
            {products?.map(p => (
              <div 
                key={p.id} 
                onClick={() => setSelectedProduct(p)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 bg-white/60 backdrop-blur-md border border-white/90 shadow-[0_4px_24px_rgba(75,0,118,0.06)] hover:-translate-y-2.5 hover:shadow-[0_24px_56px_rgba(75,0,118,0.15)] flex flex-col ${p.isStar ? 'border-purple-400/35 bg-[#f8ecff]/60' : ''}`}
              >
                {p.isStar && (
                  <div className="absolute top-3 right-3 bg-gradient-to-br from-[#4B0076] to-purple-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wide">BÁN CHẠY</div>
                )}
                <div className="h-40 flex items-center justify-center bg-gradient-to-br from-[#f5eeff]/80 to-[#ede0ff]/80 text-[#4B0076]">
                   {ProductSvgs[p.id]}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-[15px] font-bold mb-1">{p.n}</h3>
                  <div className="text-[11px] text-zinc-400 mb-2.5 tracking-wide">{p.m}</div>
                  <div className="flex gap-1.5 flex-wrap mb-3 mt-auto">
                    {p.s.slice(0, 3).map((spec, i) => (
                      <span key={i} className="bg-[#4B0076]/5 text-[#4B0076] text-[10.5px] font-semibold px-2.5 py-1 rounded-full">{spec[1].split(' ')[0]}</span>
                    ))}
                  </div>
                  <div className="mt-auto text-lg font-extrabold text-[#4B0076]">
                    {p.p} <small className="text-[11px] font-normal text-zinc-400">/ chiếc</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-[#fdf4ff] to-[#f5eeff] flex flex-col items-center">
        <div className="text-center text-[11px] font-bold tracking-widest uppercase text-purple-500 mb-2.5">Vì sao chọn chúng tôi</div>
        <h2 className="text-center text-4xl font-extrabold tracking-tight mb-2">Lý do chọn K Lotus</h2>
        <p className="text-center text-zinc-400 text-[15px] mb-14">Không chỉ là xe – đó là trải nghiệm sống hiện đại</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full">
          {[
            { t: 'Thiết kế đột phá', d: 'Từng đường nét tỉ mỉ, táo bạo và khác biệt – tạo ấn tượng ngay từ cái nhìn đầu tiên.', i: <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg> },
            { t: 'Pin công nghệ cao', d: 'Lithium thế hệ mới – sạc nhanh 3 giờ, bền 1.000+ chu kỳ, an toàn tuyệt đối.', i: <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M13 2.05V4.05C17.39 4.59 20.5 8.58 19.96 12.97C19.5 16.61 16.64 19.5 13 19.93V21.93C18.5 21.38 22.5 16.5 21.95 11C21.5 6.25 17.73 2.5 13 2.05M11 2.06C9.05 2.25 7.19 3 5.67 4.26L7.1 5.74C8.22 4.84 9.57 4.26 11 4.06V2.06M4.26 5.67C3 7.19 2.25 9.04 2.05 11H4.05C4.24 9.58 4.8 8.23 5.69 7.1L4.26 5.67M2.06 13C2.26 14.96 3.03 16.81 4.27 18.33L5.69 16.9C4.81 15.77 4.24 14.42 4.06 13H2.06M7.1 18.37L5.67 19.74C7.18 21 9.04 21.79 11 22V20C9.58 19.82 8.23 19.25 7.1 18.37M12 7L10 11H14L12 17L16 10H12L14 7H12Z"/></svg> },
            { t: 'Bảo hành 3 năm', d: 'Chính sách toàn diện – động cơ, pin, khung xe. Bạn yên tâm đi, chúng tôi lo hậu mãi.', i: <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.1 14.8 9.5V11C15.4 11 16 11.6 16 12.3V15.8C16 16.4 15.4 17 14.7 17H9.2C8.6 17 8 16.4 8 15.7V12.2C8 11.6 8.6 11 9.2 11V9.5C9.2 8.1 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 9.5V11H13.5V9.5C13.5 8.7 12.8 8.2 12 8.2Z"/></svg> },
            { t: 'Thương hiệu Việt', d: 'Hiểu người Việt, giá tối ưu, dịch vụ bản địa nhanh chóng trên toàn quốc.', i: <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M17.9 17.39C17.64 16.59 16.89 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.77 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39M11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.78 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"/></svg> },
          ].map((w, i) => (
            <div key={i} className="rounded-3xl p-7 bg-white/55 backdrop-blur-md border border-white/85 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(75,0,118,0.12)] hover:bg-white/80 transition-all duration-300">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4B0076] to-purple-500 flex items-center justify-center mb-4 shadow-[0_6px_20px_rgba(75,0,118,0.3)]">
                 {w.i}
               </div>
               <h3 className="text-base font-bold mb-2">{w.t}</h3>
               <p className="text-[13px] text-zinc-600 leading-relaxed">{w.d}</p>
            </div>
          ))}
        </div>
      </section>
      */}

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-2xl bg-white/90 backdrop-blur-3xl border border-white/95 rounded-3xl p-0 overflow-hidden shadow-[0_48px_100px_rgba(75,0,118,0.2)]">
          {selectedProduct && (
            <>
              <div className="h-56 bg-gradient-to-br from-[#f5eeff]/90 to-[#ede0ff]/90 flex items-center justify-center relative [&>svg]:scale-150">
                {ProductSvgs[selectedProduct.id]}
              </div>
              <div className="p-7 md:p-9 pt-5">
                <DialogTitle className="text-3xl font-black text-[#4B0076]">{selectedProduct.n}</DialogTitle>
                <div className="text-xs text-zinc-400 tracking-wide mt-1 mb-3.5">{selectedProduct.m}</div>
                <div className="text-3xl font-black bg-gradient-to-br from-[#4B0076] to-purple-500 bg-clip-text text-transparent mb-5">{selectedProduct.p}</div>
                
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  {selectedProduct.s.map((spec, i) => (
                    <div key={i} className="bg-[#4B0076]/5 rounded-2xl p-3 border border-[#4B0076]/5">
                      <div className="text-[10.5px] text-purple-500 font-bold uppercase tracking-wide mb-1 flex items-center gap-1">{spec[0]}</div>
                      <div className="text-[15px] font-bold text-[#4B0076]">{spec[1]}</div>
                    </div>
                  ))}
                </div>
                
                <DialogDescription className="text-sm text-zinc-600 leading-relaxed mb-6">
                  {selectedProduct.d}
                </DialogDescription>
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white font-bold h-12 rounded-full shadow-[0_8px_32px_rgba(75,0,118,0.35)] hover:-translate-y-0.5 transition-transform"
                    onClick={() => { setSelectedProduct(null); setTestDriveOpen(true); }}
                  >
                    Đặt lịch lái thử
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#4B0076]/20 text-[#4B0076] font-semibold h-12 rounded-full hover:bg-white hover:border-purple-400 shadow-sm"
                    onClick={() => { setSelectedProduct(null); navigate('/stores'); }}
                  >
                    Tìm cửa hàng
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
