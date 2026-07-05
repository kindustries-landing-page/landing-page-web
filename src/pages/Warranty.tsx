import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import {
  activateWarranty,
  checkWarranty,
  type WarrantyActivateResponse,
  type WarrantyCheckResponse,
} from '@/src/lib/api';

const getWarrantyQueryParams = (searchParams: URLSearchParams) => {
  const rawSokhung = searchParams.get('sokhung')?.trim() ?? '';
  const rawSomay = searchParams.get('somay')?.trim() ?? '';

  if (rawSomay) {
    return {
      sokhung: rawSokhung,
      somay: rawSomay,
    };
  }

  const malformedMatch = rawSokhung.match(/^(.*?)(?:&)?somay=(.+)$/i);
  if (malformedMatch) {
    return {
      sokhung: malformedMatch[1].trim(),
      somay: malformedMatch[2].trim(),
    };
  }

  return {
    sokhung: rawSokhung,
    somay: rawSomay,
  };
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '';
  return new Date(value).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatDate = (value?: string | null) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const DEALERS = [
  { id: 'KL0001', name: 'Đại lý Khánh Huyền' },
  { id: 'KL0002', name: 'Đại lý Trường Hiền' },
  { id: 'KL0003', name: 'Đại lý Nhật Hải' },
  { id: 'KL0005', name: 'Đại Lý Huy Hiệp' },
];

export function Warranty() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { sokhung, somay } = useMemo(() => getWarrantyQueryParams(searchParams), [searchParams]);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [activatedSuccess, setActivatedSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [alreadyActivatedModalOpen, setAlreadyActivatedModalOpen] = useState(false);
  const [activationResult, setActivationResult] = useState<WarrantyActivateResponse | null>(null);
  const [checkResult, setCheckResult] = useState<WarrantyCheckResponse | null>(null);

  const [inputSokhung, setInputSokhung] = useState('');
  const [inputSomay, setInputSomay] = useState('');

  const [dealerId, setDealerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerDob, setCustomerDob] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    setInputSokhung(sokhung);
    setInputSomay(somay);
  }, [sokhung, somay]);

  const handleManualCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSokhung.trim() && inputSomay.trim()) {
      setSearchParams({
        sokhung: inputSokhung.trim(),
        somay: inputSomay.trim(),
      });
    }
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`Đã sao chép ${label} vào clipboard!`);
      })
      .catch(() => {
        toast.error('Không thể sao chép. Vui lòng thử lại.');
      });
  };

  const hasQrParams = useMemo(() => Boolean(sokhung && somay), [sokhung, somay]);

  useEffect(() => {
    if (!hasQrParams) return;

    let cancelled = false;

    const run = async () => {
      setIsChecking(true);
      setConfirmModalOpen(false);
      setAlreadyActivatedModalOpen(false);
      setActivationResult(null);
      setCheckResult(null);

      try {
        const result = await checkWarranty(sokhung, somay);
        if (cancelled) return;

        setCheckResult(result);
        if (result.active_warranty) {
          setAlreadyActivatedModalOpen(true);
          toast.info('Phương tiện đã được kích hoạt bảo hành trước đó.');
        } else {
          setConfirmModalOpen(true);
          toast.success('Xác minh thông tin thành công. Sẵn sàng kích hoạt.');
        }
      } catch {
        if (cancelled) return;
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [hasQrParams, sokhung, somay, t]);

  const clearQueryAndState = () => {
    setConfirmModalOpen(false);
    setAlreadyActivatedModalOpen(false);
    setActivatedSuccess(false);
    setActivationResult(null);
    setCheckResult(null);
    setSearchParams({});
  };

  const handleConfirmActivate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!hasQrParams) return;
    if (!dealerId || !customerName || !customerAddress || !customerPhone) {
      toast.error('Vui lòng nhập đầy đủ các trường bắt buộc');
      return;
    }
    const dealerName = DEALERS.find((d) => d.id === dealerId)?.name || '';

    setIsActivating(true);
    try {
      const result = await activateWarranty({
        sokhung,
        somay,
        dealer_id: dealerId,
        dealer_name: dealerName,
        customer_name: customerName,
        customer_address: customerAddress,
        customer_phone: customerPhone,
        customer_dob: customerDob || undefined,
        customer_email: customerEmail || undefined,
      });
      setActivationResult(result);
      setConfirmModalOpen(false);
      setActivatedSuccess(true);
      toast.success('Kích hoạt bảo hành chính hãng thành công!');
    } catch {
      // API error intercepted globally
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="w-full relative">
      <section className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-br from-[#4B0076] via-[#9366D9] to-[#9333ea] text-white text-center relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg_width=%2260%22_height=%2260%22_viewBox=%220_0_60_60%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg_fill=%22%23ffffff%22_fill-opacity=%220.04%22%3E%3Ccircle_cx=%2230%22_cy=%2230%22_r=%2220%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 relative z-10">
          {t('warranty_policy')}
        </h1>
        <p className="text-base text-white/80 max-w-lg mx-auto mb-8 relative z-10">
          {t('warranty_subtitle')}
        </p>

        {hasQrParams ? (
          <div className="relative z-10 w-full max-w-xl rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-left">
            <div className="space-y-3">
              <div
                className="cursor-pointer group hover:bg-white/10 p-3 rounded-2xl transition-all flex items-center justify-between gap-4"
                onClick={() => handleCopyToClipboard(sokhung, 'số khung')}
                title="Click để sao chép"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-white/70 whitespace-nowrap">
                    {t('chassis_number')}:
                  </span>
                  <span className="text-base font-bold break-all">{sokhung}</span>
                </div>
                <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
              <div
                className="cursor-pointer group hover:bg-white/10 p-3 rounded-2xl transition-all flex items-center justify-between gap-4"
                onClick={() => handleCopyToClipboard(somay, 'số máy')}
                title="Click để sao chép"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-white/70 whitespace-nowrap">
                    {t('engine_number')}:
                  </span>
                  <span className="text-base font-bold break-all">{somay}</span>
                </div>
                <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </div>

            {checkResult?.vehicle ? (
              <div className="mt-4 pt-4 border-t border-white/20 text-sm text-white/90 space-y-1">
                <div>
                  Model: {checkResult.vehicle.model_name || checkResult.vehicle.model_code || 'N/A'}
                </div>
                <div>Trạng thái: {checkResult.vehicle.warranty_status}</div>
                {checkResult.active_warranty ? (
                  <div>
                    Hiệu lực đến: {formatDate(checkResult.active_warranty.warranty_end_date)}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="py-20 px-6 md:px-12 bg-white flex flex-col items-center">
        <div className="max-w-4xl w-full text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#4B0076] tracking-tight">
              Tra cứu & Kích hoạt bảo hành
            </h2>
            <p className="text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              Quý khách có thể lựa chọn một trong hai phương thức tiện lợi dưới đây để kiểm tra
              trạng thái bảo hành cũng như thực hiện kích hoạt trực tuyến cho phương tiện của mình.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left items-stretch">
            {/* Phương thức 1: Quét mã */}
            <div className="rounded-3xl border border-zinc-150 p-8 bg-zinc-50/50 hover:bg-zinc-50 transition-all duration-300 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#4B0076]/10 text-[#4B0076] flex items-center justify-center text-2xl font-bold">
                  📱
                </div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Cách 1: Quét mã trên phương tiện
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Sử dụng camera điện thoại hoặc ứng dụng quét mã để quét trực tiếp mã QR được dán
                  trên khung xe. Hệ thống sẽ tự động nhận diện thông số và hiển thị kết quả kiểm tra
                  tức thì mà không cần nhập liệu.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 text-xs text-zinc-400">
                * Mã QR thường được đặt ở vị trí cốp xe hoặc đuôi xe.
              </div>
            </div>

            {/* Phương thức 2: Nhập thông tin */}
            <div className="rounded-3xl border border-zinc-200 p-8 bg-white shadow-lg flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#9366D9]/10 text-[#9366D9] flex items-center justify-center text-2xl font-bold">
                    ✍️
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">
                    Cách 2: Nhập thông tin thủ công
                  </h3>
                </div>

                <form onSubmit={handleManualCheck} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sokhung-input" className="text-zinc-700 font-semibold">
                      Số khung xe
                    </Label>
                    <Input
                      id="sokhung-input"
                      placeholder="Nhập số khung xe (ví dụ: RL9L3...)"
                      value={inputSokhung}
                      onChange={(e) => setInputSokhung(e.target.value)}
                      className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="somay-input" className="text-zinc-700 font-semibold">
                      Số máy xe
                    </Label>
                    <Input
                      id="somay-input"
                      placeholder="Nhập số máy xe (ví dụ: VLD60...)"
                      value={inputSomay}
                      onChange={(e) => setInputSomay(e.target.value)}
                      className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-[#4B0076] to-[#9366D9] hover:from-[#3b0060] hover:to-[#8050c7] text-white rounded-xl shadow-lg hover:shadow-xl font-bold transition-all duration-300 cursor-pointer"
                  >
                    Kiểm tra bảo hành
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[500px] bg-white/95 backdrop-blur-3xl border border-white rounded-[28px] p-8 shadow-[0_48px_100px_rgba(75,0,118,0.2)] max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-2xl font-extrabold text-[#4B0076] mb-2 text-center">
            Thông tin kích hoạt
          </DialogTitle>
          <div className="text-zinc-600 text-[14px] text-center mb-4 leading-relaxed">
            Vui lòng điền thông tin để hoàn tất quá trình kích hoạt bảo hành.
          </div>
          <form onSubmit={handleConfirmActivate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-700 font-semibold text-xs uppercase tracking-wide">
                  Số khung
                </Label>
                <div className="h-10 px-3 bg-zinc-100 rounded-lg flex items-center text-sm font-bold text-zinc-900 border border-zinc-200">
                  {sokhung}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-700 font-semibold text-xs uppercase tracking-wide">
                  Số máy
                </Label>
                <div className="h-10 px-3 bg-zinc-100 rounded-lg flex items-center text-sm font-bold text-zinc-900 border border-zinc-200">
                  {somay}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dealer" className="text-zinc-700 font-semibold text-sm">
                Đại lý kích hoạt <span className="text-red-500">*</span>
              </Label>
              <select
                id="dealer"
                required
                value={dealerId}
                onChange={(e) => setDealerId(e.target.value)}
                className="w-full h-11 px-4 border border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076] text-sm bg-white"
              >
                <option value="">-- Chọn đại lý --</option>
                {DEALERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custName" className="text-zinc-700 font-semibold text-sm">
                Họ và Tên khách hàng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="custName"
                required
                placeholder="Nguyễn Văn A"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custPhone" className="text-zinc-700 font-semibold text-sm">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="custPhone"
                type="tel"
                required
                placeholder="0912345678"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custAddr" className="text-zinc-700 font-semibold text-sm">
                Địa chỉ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="custAddr"
                required
                placeholder="Số nhà, Đường, Quận/Huyện, Tỉnh/Thành"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="custDob" className="text-zinc-700 font-semibold text-sm">
                  Ngày sinh
                </Label>
                <Input
                  id="custDob"
                  type="date"
                  value={customerDob}
                  onChange={(e) => setCustomerDob(e.target.value)}
                  className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custEmail" className="text-zinc-700 font-semibold text-sm">
                  Email
                </Label>
                <Input
                  id="custEmail"
                  type="email"
                  placeholder="email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full h-12 cursor-pointer"
                onClick={clearQueryAndState}
                disabled={isActivating}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white rounded-full h-12 hover:-translate-y-0.5 shadow-md cursor-pointer"
                disabled={isActivating}
              >
                {isActivating ? 'Đang kích hoạt...' : t('confirm')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={activatedSuccess} onOpenChange={clearQueryAndState}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[420px] bg-white/95 backdrop-blur-3xl border border-white rounded-[28px] p-8 shadow-[0_48px_100px_rgba(75,0,118,0.2)] text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>
          <DialogTitle className="text-2xl font-extrabold text-zinc-900 mb-2">
            {t('activation_success')}
          </DialogTitle>
          <div className="text-zinc-600 text-[14px] mb-3 leading-relaxed">
            {t('activation_success_msg')}
          </div>
          {activationResult ? (
            <div className="rounded-2xl bg-zinc-50 border border-zinc-150 p-5 text-left text-sm text-zinc-700 mb-6 space-y-3 shadow-inner">
              <div className="font-semibold text-zinc-950 border-b border-zinc-200/60 pb-2">
                Thông tin bảo hành của bạn:
              </div>
              <ul className="space-y-2.5">
                <li
                  className="flex items-center justify-between cursor-pointer group hover:bg-zinc-100/50 p-1.5 rounded-lg transition-all"
                  onClick={() =>
                    handleCopyToClipboard(activationResult.activation.warranty_code, 'mã bảo hành')
                  }
                  title="Click để sao chép"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[#4B0076] font-bold">•</span>
                    <span>
                      Mã bảo hành:{' '}
                      <strong className="font-extrabold text-[#4B0076]">
                        {activationResult.activation.warranty_code}
                      </strong>
                    </span>
                  </div>
                  <Copy className="w-3.5 h-3.5 text-[#4B0076] opacity-60 group-hover:opacity-100 transition-opacity" />
                </li>
                <li
                  className="flex items-center justify-between cursor-pointer group hover:bg-zinc-100/50 p-1.5 rounded-lg transition-all"
                  onClick={() => handleCopyToClipboard(sokhung, 'số khung')}
                  title="Click để sao chép"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[#4B0076] font-bold">•</span>
                    <span>
                      Số khung: <strong className="font-bold text-zinc-900">{sokhung}</strong>
                    </span>
                  </div>
                  <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
                <li
                  className="flex items-center justify-between cursor-pointer group hover:bg-zinc-100/50 p-1.5 rounded-lg transition-all"
                  onClick={() => handleCopyToClipboard(somay, 'số máy')}
                  title="Click để sao chép"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[#4B0076] font-bold">•</span>
                    <span>
                      Số máy: <strong className="font-bold text-zinc-900">{somay}</strong>
                    </span>
                  </div>
                  <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
                <li className="flex items-start gap-2 p-1.5">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Kích hoạt lúc:{' '}
                    <strong className="font-bold text-zinc-900">
                      {formatDateTime(activationResult.activation.activated_at)}
                    </strong>
                  </span>
                </li>
                <li className="flex items-start gap-2 p-1.5">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Hiệu lực đến:{' '}
                    <strong className="font-bold text-zinc-900">
                      {formatDate(activationResult.activation.warranty_end_date)}
                    </strong>
                  </span>
                </li>
              </ul>
            </div>
          ) : null}
          <Button
            className="w-full bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white rounded-full h-12 hover:-translate-y-0.5 shadow-md"
            onClick={clearQueryAndState}
          >
            {t('complete')}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isChecking} onOpenChange={() => {}}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[300px] bg-white/95 backdrop-blur-3xl border border-white rounded-[24px] p-6 shadow-[0_48px_100px_rgba(75,0,118,0.2)] text-center [&>button]:hidden outline-none">
          <DialogTitle className="sr-only">{t('checking')}</DialogTitle>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border-4 border-[#4B0076]/20 border-t-[#4B0076] animate-spin"></div>
            <p className="text-zinc-600 text-[13px] font-medium">{t('checking')}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={alreadyActivatedModalOpen} onOpenChange={clearQueryAndState}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[420px] bg-white/95 backdrop-blur-3xl border border-white rounded-[28px] p-8 shadow-[0_48px_100px_rgba(75,0,118,0.2)] text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
          <DialogTitle className="text-2xl font-extrabold text-[#4B0076] mb-2">
            {t('already_activated')}
          </DialogTitle>
          <div className="text-zinc-600 text-[14px] mb-4 leading-relaxed">
            Xe có số khung <strong className="font-bold text-[#4B0076] break-all">{sokhung}</strong>{' '}
            và số máy <strong className="font-bold text-[#4B0076] break-all">{somay}</strong> đã
            được kích hoạt bảo hành trước đó.
          </div>
          {checkResult?.active_warranty ? (
            <div className="rounded-2xl bg-zinc-50 border border-zinc-150 p-5 text-left text-sm text-zinc-700 mb-6 space-y-3 shadow-inner">
              <div className="font-semibold text-zinc-950 border-b border-zinc-200/60 pb-2">
                Thông tin bảo hành đã kích hoạt:
              </div>
              <ul className="space-y-2.5">
                <li
                  className="flex items-center justify-between cursor-pointer group hover:bg-zinc-100/50 p-1.5 rounded-lg transition-all"
                  onClick={() =>
                    handleCopyToClipboard(checkResult.active_warranty!.warranty_code, 'mã bảo hành')
                  }
                  title="Click để sao chép"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[#4B0076] font-bold">•</span>
                    <span>
                      Mã bảo hành:{' '}
                      <strong className="font-extrabold text-[#4B0076]">
                        {checkResult.active_warranty.warranty_code}
                      </strong>
                    </span>
                  </div>
                  <Copy className="w-3.5 h-3.5 text-[#4B0076] opacity-60 group-hover:opacity-100 transition-opacity" />
                </li>
                <li
                  className="flex items-center justify-between cursor-pointer group hover:bg-zinc-100/50 p-1.5 rounded-lg transition-all"
                  onClick={() => handleCopyToClipboard(sokhung, 'số khung')}
                  title="Click để sao chép"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[#4B0076] font-bold">•</span>
                    <span>
                      Số khung: <strong className="font-bold text-zinc-900">{sokhung}</strong>
                    </span>
                  </div>
                  <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
                <li
                  className="flex items-center justify-between cursor-pointer group hover:bg-zinc-100/50 p-1.5 rounded-lg transition-all"
                  onClick={() => handleCopyToClipboard(somay, 'số máy')}
                  title="Click để sao chép"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[#4B0076] font-bold">•</span>
                    <span>
                      Số máy: <strong className="font-bold text-zinc-900">{somay}</strong>
                    </span>
                  </div>
                  <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
                <li className="flex items-start gap-2 p-1.5">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Kích hoạt lúc:{' '}
                    <strong className="font-bold text-zinc-900">
                      {formatDateTime(checkResult.active_warranty.activated_at)}
                    </strong>
                  </span>
                </li>
                <li className="flex items-start gap-2 p-1.5">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Hiệu lực đến:{' '}
                    <strong className="font-bold text-zinc-900">
                      {formatDate(checkResult.active_warranty.warranty_end_date)}
                    </strong>
                  </span>
                </li>
              </ul>
            </div>
          ) : null}
          <Button
            className="w-full bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white rounded-full h-12 hover:-translate-y-0.5 shadow-md"
            onClick={clearQueryAndState}
          >
            {t('close')}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
