import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitContact } from '@/src/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Stores() {
  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      alert('Đã gửi đăng ký! Chúng tôi liên hệ sớm nhất.');
    },
  });

  return (
    <div className="w-full">
      <div className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-br from-[#fdf4ff] to-[#f0e6ff] text-center">
        <div className="text-[11px] font-bold tracking-widest uppercase text-purple-500 mb-2.5">
          Hệ thống phân phối
        </div>
        <h1 className="text-5xl font-black tracking-tight text-[#4B0076] mb-3">Cửa Hàng K Lotus</h1>
        <p className="text-zinc-600 text-base max-w-lg mx-auto">
          Tìm cửa hàng gần bạn để trải nghiệm xe trực tiếp
        </p>
      </div>

      <section className="py-20 px-6 md:px-12 bg-white flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full">
          {[
            {
              n: '01',
              t: 'K Lotus – Quận 7',
              a: '123 Nguyễn Văn Linh, P. Tân Phú, Q.7, TP.HCM',
              p: '028 3456 7890',
              h: '8:00–17:30 (Thứ 2–Thứ 7)',
              b: 'Showroom chính',
            },
            {
              n: '02',
              t: 'K Lotus – Bình Dương',
              a: '456 Đại lộ Bình Dương, TP. Thủ Dầu Một',
              p: '0274 123 4567',
              h: '8:00–17:30 (Thứ 2–Thứ 7)',
              b: 'Đại lý chính thức',
            },
            {
              n: '03',
              t: 'K Lotus – Đồng Nai',
              a: '789 Phạm Văn Thuận, TP. Biên Hoà, Đồng Nai',
              p: '0251 987 6543',
              h: '8:00–17:30 (Thứ 2–Thứ 7)',
              b: 'Đại lý chính thức',
            },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 bg-white/65 backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(75,0,118,0.06)] hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(75,0,118,0.12)] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4B0076] to-purple-500 text-white text-sm font-extrabold flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(75,0,118,0.3)]">
                {s.n}
              </div>
              <h3 className="text-[15px] font-bold mb-2">{s.t}</h3>
              <div className="text-[13px] text-zinc-600 leading-relaxed mb-3 space-y-1">
                <div>📍 {s.a}</div>
                <div>📞 {s.p}</div>
                <div>🕐 {s.h}</div>
              </div>
              <span className="inline-block bg-[#4B0076]/10 text-[#4B0076] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                {s.b}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-[#fdf4ff] to-[#f5eeff] flex flex-col items-center">
        <div className="text-center text-[11px] font-bold tracking-widest uppercase text-purple-500 mb-2.5">
          Mở rộng cùng K Lotus
        </div>
        <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
          Đăng ký hợp tác đại lý
        </h2>
        <p className="text-center text-zinc-400 text-[15px] mb-12">
          Trở thành đối tác phân phối – cùng chúng tôi phủ sóng toàn quốc
        </p>

        <div className="max-w-2xl w-full rounded-3xl p-10 bg-white/60 backdrop-blur-xl border border-white/90 shadow-[0_8px_40px_rgba(75,0,118,0.1)]">
          <h3 className="text-2xl font-extrabold text-[#4B0076] mb-1.5">Thông tin đăng ký</h3>
          <p className="text-sm text-zinc-600 mb-6">Phản hồi trong vòng 1–2 ngày làm việc</p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate({});
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                required
                placeholder="Tên doanh nghiệp / cá nhân"
                className="h-12 bg-white/80 border-[#4B0076]/10 focus-visible:ring-purple-400 rounded-xl"
              />
              <Input
                required
                placeholder="Người đại diện"
                className="h-12 bg-white/80 border-[#4B0076]/10 focus-visible:ring-purple-400 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                required
                type="tel"
                placeholder="Số điện thoại"
                className="h-12 bg-white/80 border-[#4B0076]/10 focus-visible:ring-purple-400 rounded-xl"
              />
              <Input
                required
                type="email"
                placeholder="Email liên hệ"
                className="h-12 bg-white/80 border-[#4B0076]/10 focus-visible:ring-purple-400 rounded-xl"
              />
            </div>
            <Input
              required
              placeholder="Địa chỉ dự kiến mở đại lý"
              className="h-12 bg-white/80 border-[#4B0076]/10 focus-visible:ring-purple-400 rounded-xl"
            />

            <Select required>
              <SelectTrigger className="h-12 bg-white/80 border-[#4B0076]/10 focus:ring-purple-400 rounded-xl">
                <SelectValue placeholder="-- Quy mô dự kiến --" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="s">Nhỏ (dưới 50m²)</SelectItem>
                <SelectItem value="m">Vừa (50–100m²)</SelectItem>
                <SelectItem value="l">Lớn (trên 100m²)</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Kinh nghiệm kinh doanh / ghi chú..."
              className="bg-white/80 border-[#4B0076]/10 focus-visible:ring-purple-400 rounded-xl min-h-[100px] resize-none"
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white font-bold h-12 rounded-full shadow-[0_8px_32px_rgba(75,0,118,0.35)] hover:-translate-y-0.5 mt-2 transition-transform"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Đang gửi...' : 'Gửi đăng ký hợp tác'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
