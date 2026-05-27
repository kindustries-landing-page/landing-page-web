# TODO List cho K Lotus App

## 1. Khôi phục Navbar & Footer
- Trong `src/components/layout/Navbar.tsx`: Bỏ comment phần render Navbar để hiển thị lại. Bỏ comment các liên kết điều hướng đến **Cửa hàng**, **Bảo hành** và nút **Đăng nhập**.
- Trong `src/components/layout/Footer.tsx`: 
  - Khôi phục phần hiển thị cột **Sản phẩm**.
  - Khôi phục phần hiển thị **Email** liên hệ hỗ trợ.

## 2. Khôi phục Trang chủ (Home)
- Trong `src/pages/Home.tsx`: 
  - Bỏ comment phần các nút bấm ở Hero Section ("Khám phá xe ngay", "Lái thử miễn phí").
  - Bỏ comment dải chữ chạy (Marquee).
  - Bỏ comment phần hiển thị Danh sách sản phẩm (Dòng sản phẩm).
  - Bỏ comment phần "Vì sao chọn chúng tôi" (Lý do chọn K Lotus).
  - Bỏ comment Component `Dialog` dùng để hiển thị chi tiết sản phẩm.

## 3. Khôi phục Trang Bảo hành
- Trong `src/pages/Warranty.tsx`: 
  - Bỏ comment phần Giao diện Đăng nhập / Đăng ký bảo hành (`#auth-sec`).
  - Khôi phục lại hiển thị thông tin **"bảo hành 3 năm"** trong Modal kích hoạt thành công.
- Phần Các card thông tin chính sách bảo hành và Điều khoản chi tiết hiện cũng đang được comment lại, có thể mở ra khi cần.

## 4. Khôi phục Trang Cửa hàng
- Trang `src/pages/Stores.tsx` hiện vẫn còn code gốc, nhưng user không thể điều hướng tới thông qua giao diện. Mở lại link trong Navbar/Footer để truy cập lại.

## 7. Đa ngôn ngữ (i18n), Đóng gói & Tối ưu
- Đổi mặc định ngôn ngữ là tiếng Việt (`vi`) và tạm ẩn nút chuyển ngôn ngữ. (Có thể khôi phục nút chuyển ngôn ngữ ở góc phải trên cùng khi cần trong `src/components/layout/Layout.tsx`).
- Hệ thống đa ngôn ngữ bằng `i18next` hỗ trợ tốt.
- Các component và layout modal Dialog đã được tối ưu hiển thị trên Mobile (cách lề hai bên khi thu gọn).
- Đã cài đặt và cấu hình ESlint, Prettier, Husky (pre-commit trigger lint-staged) và Unit Test (Vitest) cho nền tảng của dự án.

