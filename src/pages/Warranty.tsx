import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useTranslation, Trans } from 'react-i18next';
import {
  activateWarranty,
  checkWarranty,
  extractApiError,
  type WarrantyActivateResponse,
  type WarrantyCheckResponse,
} from '@/src/lib/api';

type WarrantyErrorState = {
  title: string;
  message: string;
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

export function Warranty() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const sokhung = searchParams.get('sokhung')?.trim() ?? '';
  const somay = searchParams.get('somay')?.trim() ?? '';

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [activatedSuccess, setActivatedSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [alreadyActivatedModalOpen, setAlreadyActivatedModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [activationDate, setActivationDate] = useState('');
  const [activationResult, setActivationResult] = useState<WarrantyActivateResponse | null>(null);
  const [checkResult, setCheckResult] = useState<WarrantyCheckResponse | null>(null);
  const [errorState, setErrorState] = useState<WarrantyErrorState | null>(null);

  const hasQrParams = useMemo(() => Boolean(sokhung && somay), [sokhung, somay]);

  useEffect(() => {
    if (!hasQrParams) return;

    let cancelled = false;

    const run = async () => {
      setIsChecking(true);
      setConfirmModalOpen(false);
      setAlreadyActivatedModalOpen(false);
      setErrorModalOpen(false);
      setActivationResult(null);
      setCheckResult(null);

      try {
        const result = await checkWarranty(sokhung, somay);
        if (cancelled) return;

        setCheckResult(result);
        if (result.active_warranty) {
          setActivationDate(formatDateTime(result.active_warranty.activated_at));
          setAlreadyActivatedModalOpen(true);
        } else {
          setConfirmModalOpen(true);
        }
      } catch (error) {
        if (cancelled) return;
        setErrorState({
          title: t('warranty_not_found'),
          message: extractApiError(error, t('warranty_not_found_msg')),
        });
        setErrorModalOpen(true);
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
    setErrorModalOpen(false);
    setActivationResult(null);
    setCheckResult(null);
    setErrorState(null);
    setSearchParams({});
  };

  const handleConfirmActivate = async () => {
    if (!hasQrParams) return;

    setIsActivating(true);
    try {
      const result = await activateWarranty({ sokhung, somay });
      setActivationResult(result);
      setActivationDate(formatDateTime(result.activation.activated_at));
      setConfirmModalOpen(false);
      setActivatedSuccess(true);
    } catch (error) {
      setConfirmModalOpen(false);
      setErrorState({
        title: t('warranty_activation_error'),
        message: extractApiError(error, t('warranty_activation_error')),
      });
      setErrorModalOpen(true);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-bold tracking-widest uppercase text-white/70">
                  {t('chassis_number')}
                </div>
                <div className="text-lg font-bold break-all">{sokhung}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-widest uppercase text-white/70">
                  {t('engine_number')}
                </div>
                <div className="text-lg font-bold break-all">{somay}</div>
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
        <div className="max-w-2xl text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#4B0076]">
            Kích hoạt bảo hành bằng QR code
          </h2>
          <p className="text-zinc-600 leading-relaxed">
            Khách quét QR từ xe sẽ được kiểm tra trạng thái bảo hành ngay lập tức. Nếu chưa kích
            hoạt, hệ thống sẽ cho xác nhận kích hoạt. Nếu đã kích hoạt, landing page sẽ hiển thị
            thời gian kích hoạt gần nhất.
          </p>
          {!hasQrParams ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-6 bg-zinc-50 text-zinc-500 text-sm">
              Chưa có dữ liệu QR. Vui lòng truy cập link dạng
              <div className="mt-2 font-mono text-xs break-all">
                /bao-hanh?sokhung=RL9L3ABKPTAFS0010&somay=VLD60V800WN-008274
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[420px] bg-white/95 backdrop-blur-3xl border border-white rounded-[28px] p-8 shadow-[0_48px_100px_rgba(75,0,118,0.2)]">
          <DialogTitle className="text-2xl font-extrabold text-[#4B0076] mb-2 text-center">
            {t('warranty_confirm')}
          </DialogTitle>
          <div className="text-zinc-600 text-[14px] text-center mb-6 leading-relaxed">
            {t('warranty_confirm_msg')}
            <div className="mt-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-left space-y-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">
                  {t('chassis_number')}
                </span>
                <span className="font-bold text-[#4B0076] text-base break-all">{sokhung}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">
                  {t('engine_number')}
                </span>
                <span className="font-bold text-[#4B0076] text-base break-all">{somay}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-full h-12"
              onClick={clearQueryAndState}
              disabled={isActivating}
            >
              {t('cancel')}
            </Button>
            <Button
              className="flex-1 bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white rounded-full h-12 hover:-translate-y-0.5 shadow-md"
              onClick={() => void handleConfirmActivate()}
              disabled={isActivating}
            >
              {isActivating ? 'Đang kích hoạt...' : t('confirm')}
            </Button>
          </div>
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
            <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4 text-left text-sm text-zinc-700 mb-6 space-y-1">
              <div>
                {t('activation_success_detail', {
                  code: activationResult.activation.warranty_code,
                  date: formatDateTime(activationResult.activation.activated_at),
                  endDate: formatDate(activationResult.activation.warranty_end_date),
                })}
              </div>
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
          <div className="text-zinc-600 text-[14px] mb-3 leading-relaxed">
            <Trans
              i18nKey="already_activated_msg"
              values={{ sokhung, date: activationDate }}
              components={{
                1: <strong className="font-bold text-[#4B0076]" />,
                2: <strong className="font-bold text-[#4B0076]" />,
              }}
            />
          </div>
          {checkResult?.active_warranty ? (
            <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4 text-left text-sm text-zinc-700 mb-6 space-y-1">
              <div>Mã bảo hành: {checkResult.active_warranty.warranty_code}</div>
              <div>Hiệu lực đến: {formatDate(checkResult.active_warranty.warranty_end_date)}</div>
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

      <Dialog open={errorModalOpen} onOpenChange={clearQueryAndState}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[420px] bg-white/95 backdrop-blur-3xl border border-white rounded-[28px] p-8 shadow-[0_48px_100px_rgba(75,0,118,0.2)] text-center">
          <DialogTitle className="text-2xl font-extrabold text-red-600 mb-2">
            {errorState?.title}
          </DialogTitle>
          <div className="text-zinc-600 text-[14px] mb-6 leading-relaxed">
            {errorState?.message}
          </div>
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
