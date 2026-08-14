import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
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
import {
  WarrantyActivationModal,
  type ActivationFormPayload,
} from '@/src/components/warranty/WarrantyActivationModal';
import { WarrantySuccessModal } from '@/src/components/warranty/WarrantySuccessModal';
import {
  CheckingModal,
  NotFoundModal,
  NotDeliveredModal,
  AlreadyActivatedModal,
} from '@/src/components/warranty/WarrantyStatusModals';

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

const formatDate = (value?: string | null) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export function Warranty() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { sokhung, somay } = useMemo(() => getWarrantyQueryParams(searchParams), [searchParams]);

  // Modal open states
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [activatedSuccess, setActivatedSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [alreadyActivatedModalOpen, setAlreadyActivatedModalOpen] = useState(false);
  const [notFoundModalOpen, setNotFoundModalOpen] = useState(false);
  const [notDeliveredModalOpen, setNotDeliveredModalOpen] = useState(false);

  // API responses
  const [activationResult, setActivationResult] = useState<WarrantyActivateResponse | null>(null);
  const [checkResult, setCheckResult] = useState<WarrantyCheckResponse | null>(null);

  // Manual input fields on page
  const [inputSokhung, setInputSokhung] = useState('');
  const [inputSomay, setInputSomay] = useState('');
  const [checkTrigger, setCheckTrigger] = useState(0);

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
      setCheckTrigger((prev) => prev + 1);
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
      setNotFoundModalOpen(false);
      setNotDeliveredModalOpen(false);
      setActivationResult(null);
      setCheckResult(null);

      try {
        const result = await checkWarranty(sokhung, somay);
        if (cancelled) return;

        setCheckResult(result);
        if (!result.found) {
          setNotFoundModalOpen(true);
          toast.error(t('warranty_not_found'));
        } else if (result.eligible === false) {
          setNotDeliveredModalOpen(true);
          toast.error(t('not_delivered'));
        } else if (result.active_warranty) {
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
  }, [hasQrParams, sokhung, somay, t, checkTrigger]);

  const clearQueryAndState = () => {
    setConfirmModalOpen(false);
    setAlreadyActivatedModalOpen(false);
    setNotFoundModalOpen(false);
    setNotDeliveredModalOpen(false);
    setActivatedSuccess(false);
    setActivationResult(null);
    setCheckResult(null);
    setSearchParams({});
  };

  const handleConfirmActivate = async (payload: ActivationFormPayload) => {
    setIsActivating(true);
    try {
      const result = await activateWarranty(payload);
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
      <div className="w-full max-w-5xl mx-auto px-6 md:px-12 py-8 flex justify-start">
        <Button
          variant="ghost"
          className="hover:bg-transparent text-[#4B0076] font-bold px-4 py-2 h-auto cursor-pointer flex items-center rounded-xl"
          onClick={() => navigate('/')}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Về Trang Chủ
        </Button>
      </div>

      <section className="py-6 md:py-10 px-6 md:px-12 bg-white flex flex-col items-center">
        <div className="max-w-4xl w-full text-center space-y-8 md:space-y-10">
          {hasQrParams ? (
            <div className="w-full max-w-xl rounded-xl bg-purple-50/50 border border-purple-100 p-6 text-left mx-auto shadow-sm">
              <div className="space-y-3">
                <div
                  className="cursor-pointer group hover:bg-white p-3 rounded-2xl transition-all flex items-center justify-between gap-4 border border-transparent hover:border-purple-100 hover:shadow-sm"
                  onClick={() => handleCopyToClipboard(sokhung, 'số khung')}
                  title="Click để sao chép"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-purple-900/60 whitespace-nowrap">
                      {t('chassis_number')}:
                    </span>
                    <span className="text-base font-bold text-zinc-900 break-all">{sokhung}</span>
                  </div>
                  <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-[#4B0076]" />
                </div>

                <div
                  className="cursor-pointer group hover:bg-white p-3 rounded-2xl transition-all flex items-center justify-between gap-4 border border-transparent hover:border-purple-100 hover:shadow-sm"
                  onClick={() => handleCopyToClipboard(somay, 'số máy')}
                  title="Click để sao chép"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-purple-900/60 whitespace-nowrap">
                      {t('engine_number')}:
                    </span>
                    <span className="text-base font-bold text-zinc-900 break-all">{somay}</span>
                  </div>
                  <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-[#4B0076]" />
                </div>
              </div>

              {checkResult?.vehicle ? (
                <div className="mt-4 pt-4 border-t border-purple-200/50 text-sm text-zinc-700 space-y-1 px-3">
                  <div className="hidden">
                    <span className="font-semibold text-zinc-900">Model:</span>{' '}
                    {checkResult.vehicle.model_name || checkResult.vehicle.model_code || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900">Trạng thái:</span>{' '}
                    {checkResult.vehicle.warranty_status}
                  </div>
                  {checkResult.active_warranty ? (
                    <div>
                      <span className="font-semibold text-zinc-900">Hiệu lực đến:</span>{' '}
                      {formatDate(checkResult.active_warranty.warranty_end_date)}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

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
            <div className="rounded-xl border border-zinc-150 p-8 bg-zinc-50/50 hover:bg-zinc-50 transition-all duration-300 flex flex-col justify-between shadow-sm">
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
            <div className="rounded-xl border border-zinc-200 p-8 bg-white shadow-lg flex flex-col justify-between">
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

      {/* Modal 1: Kích hoạt bảo hành */}
      <WarrantyActivationModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        sokhung={sokhung}
        somay={somay}
        isActivating={isActivating}
        onConfirm={handleConfirmActivate}
        onCancel={clearQueryAndState}
      />

      {/* Modal 2: Kích hoạt thành công */}
      <WarrantySuccessModal
        open={activatedSuccess}
        onClose={clearQueryAndState}
        activationResult={activationResult}
        sokhung={sokhung}
        somay={somay}
      />

      {/* Modal 3: Đang kiểm tra */}
      <CheckingModal open={isChecking} />

      {/* Modal 4: Không tìm thấy */}
      <NotFoundModal open={notFoundModalOpen} onClose={clearQueryAndState} />

      {/* Modal 5: Chưa xuất kho */}
      <NotDeliveredModal open={notDeliveredModalOpen} onClose={clearQueryAndState} />

      {/* Modal 6: Đã kích hoạt trước đó */}
      <AlreadyActivatedModal
        open={alreadyActivatedModalOpen}
        onClose={clearQueryAndState}
        checkResult={checkResult}
        sokhung={sokhung}
        somay={somay}
      />
    </div>
  );
}
