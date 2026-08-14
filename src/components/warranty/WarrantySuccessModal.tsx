import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { WarrantyActivateResponse } from '@/src/lib/api';

interface WarrantySuccessModalProps {
  open: boolean;
  onClose: () => void;
  activationResult: WarrantyActivateResponse | null;
  sokhung: string;
  somay: string;
}

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

export function WarrantySuccessModal({
  open,
  onClose,
  activationResult,
  sokhung,
  somay,
}: WarrantySuccessModalProps) {
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
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full sm:max-w-xl md:max-w-2xl bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-2xl text-center max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="shrink-0">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>

          <DialogTitle className="text-2xl font-extrabold text-zinc-900 mb-1.5">
            {t('activation_success')}
          </DialogTitle>

          <div className="text-zinc-600 text-sm mb-4 leading-relaxed">
            {t('activation_success_msg')}
          </div>
        </div>

        {/* Scrollable details card */}
        {activationResult ? (
          <div className="flex-1 min-h-0 overflow-y-auto max-h-[320px] rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 sm:p-5 text-left text-sm text-zinc-700 mb-5 space-y-3 shadow-inner">
            <div className="font-semibold text-zinc-950 border-b border-zinc-200/60 pb-2">
              Thông tin bảo hành của bạn:
            </div>
            <ul className="space-y-2.5">
              <li
                className="flex items-center justify-between cursor-pointer group hover:bg-zinc-100/70 p-2 rounded-xl transition-all"
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
                    {formatDateTime(activationResult.activation.activated_at)}
                  </strong>
                </span>
              </li>

              <li className="flex items-start gap-2 p-2">
                <span className="text-[#4B0076] font-bold">•</span>
                <span>
                  Hiệu lực đến:{' '}
                  <strong className="font-bold text-zinc-900">
                    {formatDate(activationResult.activation.warranty_end_date)}
                  </strong>
                </span>
              </li>

              {activationResult.activation.dealer_name ? (
                <li className="flex items-start gap-2 p-2 border-t border-zinc-200/50 mt-1 pt-2">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Đại lý:{' '}
                    <strong className="font-bold text-zinc-900">
                      {activationResult.activation.dealer_name}
                    </strong>
                  </span>
                </li>
              ) : null}

              {activationResult.activation.customer_name ? (
                <li
                  className={cn(
                    'flex items-start gap-2 p-2',
                    !activationResult.activation.dealer_name &&
                      'border-t border-zinc-200/50 mt-1 pt-2'
                  )}
                >
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Khách hàng:{' '}
                    <strong className="font-bold text-zinc-900">
                      {activationResult.activation.customer_name}
                    </strong>
                  </span>
                </li>
              ) : null}

              {activationResult.activation.customer_phone ? (
                <li className="flex items-start gap-2 p-2">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    SĐT:{' '}
                    <strong className="font-bold text-zinc-900">
                      {activationResult.activation.customer_phone}
                    </strong>
                  </span>
                </li>
              ) : null}

              {activationResult.activation.customer_address ? (
                <li className="flex items-start gap-2 p-2">
                  <span className="text-[#4B0076] font-bold">•</span>
                  <span>
                    Địa chỉ:{' '}
                    <strong className="font-bold text-zinc-900">
                      {activationResult.activation.customer_address}
                    </strong>
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}

        {/* Footer - Fixed */}
        <div className="shrink-0 pt-1">
          <Button
            className="w-full bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white rounded-full h-12 hover:-translate-y-0.5 shadow-md font-bold cursor-pointer transition-transform"
            onClick={onClose}
          >
            {t('complete')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
