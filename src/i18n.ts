import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const en = {
  translation: {
    title: 'New Generation Electric Vehicles',
    subtitle: 'K Lotus – Advanced green technology, breakthrough design. Your journey, your way.',
    warranty_policy: 'Warranty Policy',
    warranty_subtitle:
      'K Lotus is committed to comprehensive warranty – so you always have peace of mind on every journey',
    warranty_confirm: 'Confirm activation',
    warranty_confirm_msg: 'Do you want to activate the warranty for the vehicle:',
    chassis_number: 'Chassis number',
    engine_number: 'Engine number',
    cancel: 'Cancel',
    confirm: 'Confirm',
    activation_success: 'Activation successful!',
    activation_success_msg: 'Your vehicle has been successfully activated with genuine warranty.',
    activation_success_detail:
      'Warranty code {{code}} · activated at {{date}} · valid until {{endDate}}.',
    complete: 'Complete',
    checking: 'Checking vehicle information...',
    already_activated: 'Already activated',
    already_activated_msg:
      'The vehicle with chassis number <1>{{sokhung}}</1> was previously activated on <2>{{date}}</2>.',
    close: 'Close',
    warranty_not_found: 'Vehicle information not found.',
    warranty_not_found_msg:
      'Please verify the chassis number and engine number, or contact K Lotus support.',
    warranty_lookup_error: 'Unable to check warranty information. Please try again.',
    warranty_activation_error: 'Warranty activation failed. Please try again.',
    company_name: 'K LOTUS PRODUCTION TRADING AND SERVICES COMPANY LIMITED',
    footer_desc:
      'Vietnam electric motorcycle brand - Pioneering green technology, modern design, sustainable journey.',
    contact: 'Contact',
    address_1: 'No. 776, Provincial Road 43, Tam Binh Ward',
    address_2: 'Ho Chi Minh City, Vietnam',
    designed_by: 'Designed by K Lotus Team',
    explore_now: 'Explore the collection',
    free_test_drive: 'Free test drive',
  },
};

const vi = {
  translation: {
    title: 'Xe Điện Thế Hệ Mới',
    subtitle:
      'K Lotus – Công nghệ xanh tiên tiến, thiết kế đột phá. Hành trình của bạn, theo cách bạn muốn.',
    warranty_policy: 'Chính Sách Bảo Hành',
    warranty_subtitle:
      'K Lotus cam kết bảo hành toàn diện – để bạn luôn yên tâm trên mọi hành trình',
    warranty_confirm: 'Xác nhận kích hoạt',
    warranty_confirm_msg: 'Bạn có muốn kích hoạt bảo hành cho xe:',
    chassis_number: 'Số khung',
    engine_number: 'Số máy',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    activation_success: 'Kích hoạt thành công!',
    activation_success_msg: 'Xe của bạn đã được kích hoạt bảo hành chính hãng.',
    activation_success_detail:
      'Mã bảo hành {{code}} · kích hoạt lúc {{date}} · hiệu lực đến {{endDate}}.',
    complete: 'Hoàn tất',
    checking: 'Đang kiểm tra thông tin xe...',
    already_activated: 'Đã được kích hoạt',
    already_activated_msg:
      'Xe có số khung <1>{{sokhung}}</1> đã được kích hoạt bảo hành trước đó vào lúc <2>{{date}}</2>.',
    close: 'Đóng',
    warranty_not_found: 'Không tìm thấy thông tin xe.',
    warranty_not_found_msg:
      'Vui lòng kiểm tra lại số khung và số máy hoặc liên hệ bộ phận hỗ trợ K Lotus.',
    warranty_lookup_error: 'Không thể kiểm tra thông tin bảo hành. Vui lòng thử lại.',
    warranty_activation_error: 'Kích hoạt bảo hành thất bại. Vui lòng thử lại.',
    company_name: 'CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI VÀ DỊCH VỤ K LOTUS',
    footer_desc:
      'Thương hiệu xe máy điện Việt Nam – Tiên phong công nghệ xanh, thiết kế hiện đại, hành trình bền vững.',
    contact: 'Liên hệ',
    address_1: 'Số 776, Đường Tỉnh Lộ 43, Phường Tam Bình',
    address_2: 'TP. Hồ Chí Minh, Việt Nam',
    designed_by: 'Thiết kế bởi K Lotus Team',
    explore_now: 'Khám phá xe ngay',
    free_test_drive: 'Lái thử miễn phí',
  },
};

i18n.use(initReactI18next).init({
  resources: {
    en,
    vi,
  },
  lng: 'vi',
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
