import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { WarrantyCheckResponse } from '@/src/lib/api';

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

interface CheckingModalProps {
  open: boolean;
}

export function CheckingModal({ open }: CheckingModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[300px] bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xl text-center [&>button]:hidden outline-none">
        <DialogTitle className="sr-only">{t('checking')}</DialogTitle>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-[#4B0076]/20 border-t-[#4B0076] animate-spin"></div>
          <p className="text-zinc-600 text-[13px] font-medium">{t('checking')}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface NotFoundModalProps {
  open: boolean;
  onClose: () => void;
}

export function NotFoundModal({ open, onClose }: NotFoundModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[420px] bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-2xl text-center outline-none">
        <div className="w-16 h-16 shrink-0 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <DialogTitle className="text-2xl font-extrabold text-red-600 mb-2">
          {t('warranty_not_found')}
        </DialogTitle>
        <div className="text-zinc-600 text-[14px] mb-6 leading-relaxed">
          {t('warranty_not_found_msg')}
        </div>
        <Button
          className="w-full bg-zinc-900 text-white rounded-full h-12 hover:bg-zinc-800 shadow-md font-bold cursor-pointer"
          onClick={onClose}
        >
          {t('close')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

interface NotDeliveredModalProps {
  open: boolean;
  onClose: () => void;
}

export function NotDeliveredModal({ open, onClose }: NotDeliveredModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[420px] bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-2xl text-center outline-none">
        <div className="w-16 h-16 shrink-0 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <DialogTitle className="text-2xl font-extrabold text-orange-600 mb-2">
          {t('not_delivered')}
        </DialogTitle>
        <div className="text-zinc-600 text-[14px] mb-6 leading-relaxed">
          {t('not_delivered_msg')}
        </div>
        <Button
          className="w-full bg-zinc-900 text-white rounded-full h-12 hover:bg-zinc-800 shadow-md font-bold cursor-pointer"
          onClick={onClose}
        >
          {t('close')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

interface AlreadyActivatedModalProps {
  open: boolean;
  onClose: () => void;
  checkResult: WarrantyCheckResponse | null;
  sokhung: string;
  somay: string;
}

export function AlreadyActivatedModal({
  open,
  onClose,
  checkResult,
  sokhung,
  somay,
}: AlreadyActivatedModalProps) {
  const { t } = useTranslation();

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[420px] sm:max-w-xl bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-2xl text-center max-h-[90vh] overflow-y-auto">
        <div className="w-16 h-16 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
        <DialogTitle className="text-2xl font-extrabold text-[#4B0076] mb-2">
          {t('already_activated')}
        </DialogTitle>

        {checkResult?.active_warranty ? (
          <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-5 text-left text-sm text-zinc-700 mb-6 space-y-3 shadow-inner">
            <div className="font-semibold text-zinc-950 border-b border-zinc-200/60 pb-2">
              Thông tin bảo hành đã kích hoạt:
            </div>
            <ul className="space-y-2.5">
              <li
                className="flex items-center justify-between cursor-pointer group hover:bg-zinc-100/70 p-2 rounded-xl transition-all"
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
                <Copy className="w-4 h-4 text-[#4B0076] opacity-60 group-hover:opacity-100 transition-opacity" />
              </li>
              <li
                className="flex items-center justify-between cursor-pointer group hover:bg-zinc-100/70 p-2 rounded-xl transition-all"
                onClick={() => handleCopyToClipboard(sokhung, 'số khung')}
                title="Click để sao chép"
              >
                <div className="flex items-start gap-2">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Số khung: <strong className="font-bold text-zinc-900">{sokhung}</strong>
                  </span>
                </div>
                <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
              <li
                className="flex items-center justify-between cursor-pointer group hover:bg-zinc-100/70 p-2 rounded-xl transition-all"
                onClick={() => handleCopyToClipboard(somay, 'số máy')}
                title="Click để sao chép"
              >
                <div className="flex items-start gap-2">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Số máy: <strong className="font-bold text-zinc-900">{somay}</strong>
                  </span>
                </div>
                <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
              <li className="flex items-start gap-2 p-2">
                <span className="text-[#4B0076] font-bold">•</span>
                <span>
                  Kích hoạt lúc:{' '}
                  <strong className="font-bold text-zinc-900">
                    {formatDateTime(checkResult.active_warranty.activated_at)}
                  </strong>
                </span>
              </li>
              <li className="flex items-start gap-2 p-2">
                <span className="text-[#4B0076] font-bold">•</span>
                <span>
                  Hiệu lực đến:{' '}
                  <strong className="font-bold text-zinc-900">
                    {formatDate(checkResult.active_warranty.warranty_end_date)}
                  </strong>
                </span>
              </li>
              {checkResult.active_warranty.dealer_name ? (
                <li className="flex items-start gap-2 p-2 border-t border-zinc-200/50 mt-1 pt-2">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Đại lý:{' '}
                    <strong className="font-bold text-zinc-900">
                      {checkResult.active_warranty.dealer_name}
                    </strong>
                  </span>
                </li>
              ) : null}
              {checkResult.active_warranty.customer_name ? (
                <li
                  className={cn(
                    'flex items-start gap-2 p-2',
                    !checkResult.active_warranty.dealer_name &&
                      'border-t border-zinc-200/50 mt-1 pt-2'
                  )}
                >
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Khách hàng:{' '}
                    <strong className="font-bold text-zinc-900">
                      {checkResult.active_warranty.customer_name}
                    </strong>
                  </span>
                </li>
              ) : null}
              {checkResult.active_warranty.customer_phone ? (
                <li className="flex items-start gap-2 p-2">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    SĐT:{' '}
                    <strong className="font-bold text-zinc-900">
                      {checkResult.active_warranty.customer_phone}
                    </strong>
                  </span>
                </li>
              ) : null}
              {checkResult.active_warranty.customer_address ? (
                <li className="flex items-start gap-2 p-2">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Địa chỉ:{' '}
                    <strong className="font-bold text-zinc-900">
                      {checkResult.active_warranty.customer_address}
                    </strong>
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}

        <Button
          className="w-full bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white rounded-full h-12 hover:-translate-y-0.5 shadow-md font-bold cursor-pointer"
          onClick={onClose}
        >
          {t('close')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
