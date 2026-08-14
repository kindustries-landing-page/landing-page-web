import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerInput } from './DatePickerInput';
import { DealerSelect } from './DealerSelect';
import { toast } from 'sonner';

export interface Dealer {
  id: string;
  name: string;
}

export const DEALERS: Dealer[] = [
  { id: 'KL0001', name: 'Đại lý Khánh Huyền' },
  { id: 'KL0002', name: 'Đại lý Trường Hiền' },
  { id: 'KL0003', name: 'Hộ kinh doanh Nhật Hải' },
  { id: 'KL0005', name: 'Hộ kinh doanh Xe đạp điện Huy Hiệp' },
  { id: 'KL0006', name: 'Đại lý Hạnh Phúc' },
];

export interface ActivationFormPayload {
  vin_no: string;
  engine_no: string;
  dealer_id: string;
  dealer_name: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_dob?: string;
  customer_email?: string;
}

interface WarrantyActivationModalProps {
  open: boolean;
  sokhung: string;
  somay: string;
  isActivating: boolean;
  onConfirm: (payload: ActivationFormPayload) => Promise<void>;
  onCancel: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function WarrantyActivationModal({
  open,
  sokhung,
  somay,
  isActivating,
  onConfirm,
  onCancel,
}: WarrantyActivationModalProps) {
  const { t } = useTranslation();

  // Internal form state to isolate renders and eliminate typing lag
  const [dealerId, setDealerId] = React.useState('');
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerAddress, setCustomerAddress] = React.useState('');
  const [customerDob, setCustomerDob] = React.useState<Date | undefined>(undefined);
  const [customerEmail, setCustomerEmail] = React.useState('');

  // Unsaved changes confirmation dialog state
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);

  // Check if form is dirty
  const isDirty = Boolean(
    dealerId ||
    customerName.trim() ||
    customerPhone.trim() ||
    customerAddress.trim() ||
    customerDob ||
    customerEmail.trim()
  );

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setDealerId('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setCustomerDob(undefined);
      setCustomerEmail('');
      setShowExitConfirm(false);
    }
  }, [open]);

  const handleRequestClose = () => {
    if (isDirty) {
      setShowExitConfirm(true);
    } else {
      onCancel();
    }
  };

  const handleForceExit = () => {
    setShowExitConfirm(false);
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealerId || !customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      toast.error('Vui lòng nhập đầy đủ các trường bắt buộc');
      return;
    }

    const dealerName = DEALERS.find((d) => d.id === dealerId)?.name || '';

    await onConfirm({
      vin_no: sokhung,
      engine_no: somay,
      dealer_id: dealerId,
      dealer_name: dealerName,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_address: customerAddress.trim(),
      customer_dob: customerDob ? format(customerDob, 'yyyy-MM-dd') : undefined,
      customer_email: customerEmail.trim() || undefined,
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            handleRequestClose();
          }
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full sm:max-w-2xl md:max-w-3xl bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-2xl font-extrabold text-[#4B0076] mb-1 text-center">
            Thông tin kích hoạt
          </DialogTitle>
          <p className="text-zinc-600 text-sm text-center mb-6 leading-relaxed">
            Vui lòng kiểm tra và điền thông tin để hoàn tất quá trình kích hoạt bảo hành.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Readonly info: Số khung & Số máy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-purple-50/60 border border-purple-100 rounded-xl">
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-purple-900/70">
                  Số khung xe
                </Label>
                <div className="min-h-[38px] flex items-center px-3 py-1.5 bg-white border border-purple-200/60 rounded-lg text-zinc-900 font-bold text-sm break-all">
                  {sokhung || 'Chưa có thông tin'}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase tracking-wider text-purple-900/70">
                  Số máy xe
                </Label>
                <div className="min-h-[38px] flex items-center px-3 py-1.5 bg-white border border-purple-200/60 rounded-lg text-zinc-900 font-bold text-sm break-all">
                  {somay || 'Chưa có thông tin'}
                </div>
              </div>
            </div>

            {/* Form fields in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Đại lý kích hoạt */}
              <div className="space-y-1.5">
                <Label htmlFor="dealer" className="text-zinc-700 font-semibold text-sm">
                  Đại lý kích hoạt <span className="text-red-500">*</span>
                </Label>
                <DealerSelect
                  id="dealer"
                  dealers={DEALERS}
                  value={dealerId}
                  onChange={setDealerId}
                />
              </div>

              {/* Họ và Tên khách hàng */}
              <div className="space-y-1.5">
                <Label htmlFor="custName" className="text-zinc-700 font-semibold text-sm">
                  Họ và Tên khách hàng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="custName"
                  required
                  placeholder="Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076] bg-white text-zinc-900"
                />
              </div>

              {/* Số điện thoại */}
              <div className="space-y-1.5">
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
                  className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076] bg-white text-zinc-900"
                />
              </div>

              {/* Địa chỉ */}
              <div className="space-y-1.5">
                <Label htmlFor="custAddr" className="text-zinc-700 font-semibold text-sm">
                  Địa chỉ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="custAddr"
                  required
                  placeholder="Số nhà, Đường, Quận/Huyện, Tỉnh/Thành"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076] bg-white text-zinc-900"
                />
              </div>

              {/* Ngày sinh (Hybrid DatePicker) */}
              <div className="space-y-1.5">
                <Label htmlFor="custDob" className="text-zinc-700 font-semibold text-sm">
                  Ngày sinh
                </Label>
                <DatePickerInput
                  id="custDob"
                  value={customerDob}
                  onChange={setCustomerDob}
                  placeholder="dd/mm/yyyy"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="custEmail" className="text-zinc-700 font-semibold text-sm">
                  Email
                </Label>
                <Input
                  id="custEmail"
                  type="email"
                  placeholder="email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="h-11 px-4 border-zinc-300 rounded-xl focus:border-[#4B0076] focus:ring-1 focus:ring-[#4B0076] bg-white text-zinc-900"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 sm:pt-6 border-t border-zinc-100">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full h-12 cursor-pointer font-semibold border-zinc-300 hover:bg-zinc-100"
                onClick={handleRequestClose}
                disabled={isActivating}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-br from-[#4B0076] to-[#9366D9] text-white rounded-full h-12 hover:-translate-y-0.5 shadow-md cursor-pointer font-bold transition-transform"
                disabled={isActivating}
              >
                {isActivating ? 'Đang kích hoạt...' : t('confirm')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[400px] bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xl text-center outline-none z-[110]">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
            ⚠️
          </div>
          <DialogTitle className="text-xl font-extrabold text-zinc-900 mb-1.5">
            Huỷ thao tác kích hoạt?
          </DialogTitle>
          <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
            Thông tin bạn đã nhập sẽ không được lưu nếu bạn rời đi bây giờ.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full h-11 border-zinc-300 font-semibold cursor-pointer hover:bg-zinc-100"
              onClick={() => setShowExitConfirm(false)}
            >
              Tiếp tục nhập
            </Button>
            <Button
              type="button"
              className="flex-1 rounded-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer shadow-md transition-colors"
              onClick={handleForceExit}
            >
              Xác nhận rời đi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
