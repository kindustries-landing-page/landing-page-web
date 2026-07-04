/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Stores } from './pages/Stores';
import { Warranty } from './pages/Warranty';
import { useAppStore } from '@/src/store';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function App() {
  const { isTestDriveOpen, setTestDriveOpen } = useAppStore();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/bao-hanh" element={<Warranty />} />
        </Routes>
      </Layout>

      {/* Global Test Drive Modal */}
      <Dialog open={isTestDriveOpen} onOpenChange={setTestDriveOpen}>
        <DialogContent className="max-w-[460px] bg-white/95 backdrop-blur-3xl border border-white rounded-[28px] p-10 shadow-[0_48px_100px_rgba(75,0,118,0.2)]">
          <DialogTitle className="text-[22px] font-extrabold text-[#4B0076] mb-1.5">
            Đặt lịch lái thử
          </DialogTitle>
          <p className="text-[14px] text-zinc-600 mb-6">
            Điền thông tin – chúng tôi xác nhận trong 30 phút.
          </p>

          <form
            className="space-y-3.5"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Đã đặt lịch thành công! Chúng tôi sẽ gọi xác nhận sớm nhất.');
              setTestDriveOpen(false);
            }}
          >
            <Input
              required
              placeholder="Họ và tên"
              className="h-12 bg-white/80 border-[#4B0076]/10 focus-visible:ring-purple-400 rounded-xl"
            />
            <Input
              required
              type="tel"
              placeholder="Số điện thoại"
              className="h-12 bg-white/80 border-[#4B0076]/10 focus-visible:ring-purple-400 rounded-xl"
            />

            <Select required>
              <SelectTrigger className="h-12 bg-white/80 border-[#4B0076]/10 focus:ring-purple-400 rounded-xl content-start">
                <SelectValue placeholder="-- Chọn dòng xe --" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="KL Urban S">KL Urban S</SelectItem>
                <SelectItem value="KL Pro Max">KL Pro Max</SelectItem>
                <SelectItem value="KL Mini Go">KL Mini Go</SelectItem>
                <SelectItem value="KL Sport X">KL Sport X</SelectItem>
                <SelectItem value="KL Family Plus">KL Family Plus</SelectItem>
              </SelectContent>
            </Select>

            <Input
              required
              type="date"
              className="h-12 bg-white/80 border-[#4B0076]/10 focus-visible:ring-purple-400 rounded-xl"
            />

            <Select required>
              <SelectTrigger className="h-12 bg-white/80 border-[#4B0076]/10 focus:ring-purple-400 rounded-xl">
                <SelectValue placeholder="-- Cửa hàng gần nhất --" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1">K Lotus Quận 7 – TP.HCM</SelectItem>
                <SelectItem value="2">K Lotus Bình Dương</SelectItem>
                <SelectItem value="3">K Lotus Đồng Nai</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="w-full bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white font-bold h-12 rounded-full shadow-[0_8px_32px_rgba(75,0,118,0.35)] hover:-translate-y-0.5 mt-2 transition-transform"
            >
              Xác nhận đặt lịch
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Router>
  );
}
