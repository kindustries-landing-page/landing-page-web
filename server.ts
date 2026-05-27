import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const prods = [
  { id: '1', n: 'KL Urban S', m: 'KL-U01 · Xe đô thị', p: '22.500.000đ', s: [['Tầm hoạt động', '80km/sạc'], ['Tốc độ tối đa', '45 km/h'], ['Trọng lượng', '82 kg'], ['Thời gian sạc', '4 giờ']], d: 'KL Urban S – nhỏ gọn, linh hoạt trong phố, pin bền cho cả ngày đi làm.' },
  { id: '2', n: 'KL Pro Max', m: 'KL-P02 · Flagship', p: '35.900.000đ', s: [['Tầm hoạt động', '120km/sạc'], ['Tốc độ tối đa', '60 km/h'], ['Kết nối', 'Bluetooth / App'], ['Sạc nhanh', '3 giờ đầy']], d: 'Flagship của K Lotus – kết nối thông minh, màn hình LCD, khóa từ xa, GPS chống trộm tích hợp.', isStar: true },
  { id: '3', n: 'KL Mini Go', m: 'KL-M03 · Nhỏ gọn', p: '18.000.000đ', s: [['Tầm hoạt động', '60km/sạc'], ['Tốc độ tối đa', '35 km/h'], ['Đặc biệt', 'Gấp gọn 3 giây'], ['Trọng lượng', '48 kg']], d: 'KL Mini Go – gấp gọn 3 giây, dễ đưa lên thang máy hoặc để trong ô tô.' },
  { id: '4', n: 'KL Sport X', m: 'KL-S04 · Thể thao', p: '42.000.000đ', s: [['Tầm hoạt động', '100km/sạc'], ['Tốc độ tối đa', '70 km/h'], ['Chế độ lái', 'Eco/Sport/Turbo'], ['Phanh', 'ABS 2 kênh']], d: '3 chế độ lái, phanh ABS, thiết kế thể thao và hệ thống đèn LED chiếu xa.' },
  { id: '5', n: 'KL Family Plus', m: 'KL-F05 · Gia đình', p: '29.500.000đ', s: [['Tầm hoạt động', '90km/sạc'], ['Tốc độ tối đa', '50 km/h'], ['Cốp chứa đồ', '28 lít'], ['Yên sau', 'Siêu rộng']], d: 'Tối ưu cho cả gia đình – cốp 28 lít, yên rộng, tay nắm an toàn và hệ thống treo êm ái.' }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // API endpoints
  app.get("/api/products", (req, res) => {
    res.json(prods);
  });

  app.post("/api/contact", (req, res) => {
    // Fake submit
    setTimeout(() => {
      res.json({ success: true, message: 'Đăng ký thành công!' });
    }, 1000);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
