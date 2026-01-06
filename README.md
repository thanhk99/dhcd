# Quy tắc Thiết kế & Phát triển Frontend (dhcd)

## 1. Hệ thống Màu sắc (Color System)
Dự án hỗ trợ Dark/Light mode thông qua biến CSS định nghĩa tại `src/app/globals.css`.

### Chế độ Sáng (Light Mode - Mặc định)
- `var(--bg-primary)`: `#FFFFFF` - Trắng tinh khiết, sạch sẽ và sáng sủa.
- `var(--text-primary)`: `#212121` - Xám đen đậm, dễ đọc trên nền sáng.
- `var(--text-secondary)`: `#757575` - Xám trung bình, tạo phân cấp thông tin.
- `var(--accent)`: `#1976D2` - Xanh lam đậm, mạnh mẽ và chuyên nghiệp.
- `var(--success)`: `#00C853` - Xanh lá cây tươi, biểu thị thành công.
- `var(--error)`: `#D32F2F` - Đỏ tươi, rõ ràng cho các thông báo lỗi.

### Chế độ Tối (Dark Mode)
- `var(--bg-primary)`: `#121212` - Đen mềm, hiện đại và dễ chịu.
- `var(--text-primary)`: `#FFFFFF` - Trắng tinh khiết, tương phản cao.
- `var(--text-secondary)`: `#B0B0B0` - Xám nhạt, tạo phân cấp.
- `var(--accent)`: `#00BFFF` - Xanh lam rực rỡ, nổi bật trên nền tối.
- `var(--success)`: `#03DAC5` - Xanh ngọc, báo hiệu thành công.
- `var(--error)`: `#CF6679` - Đỏ hồng, chỉ ra lỗi.

## 2. Hệ thống Icon (Icon System)
Dự án sử dụng các thư viện icon phổ biến để thay thế cho SVG thủ công.

### Cài đặt
```bash
npm install lucide-react react-icons
```
*(Đã cài đặt sẵn trong dự án)*

### Sử dụng
**1. Lucide React (Ưu tiên)**
Bộ icon hiện đại, nét mảnh, rất phù hợp với giao diện sạch sẽ.
```tsx
import { ChevronLeft, User, Lock } from 'lucide-react';

<ChevronLeft size={24} />
```

**2. React Icons (Đa dạng)**
Sử dụng khi cần các icon đặc biệt không có trong Lucide (ví dụ: FontAwesome, Material Design).
```tsx
import { FaBeer } from 'react-icons/fa';

<FaBeer />
```

## 3. Quy tắc CSS & Giao diện
- **CSS thuần & Module.css**: Không dùng thư viện ngoài. Mỗi component có tệp `.module.css` riêng.
- **Mobile First**: 
  - Ưu tiên viết CSS cho điện thoại trước (ngoài media query).
  - Sử dụng `@media (min-width: 768px)` để bổ sung các điều chỉnh cho máy tính (Desktop).

## 4. Cấu hình Environment
Dự án sử dụng biến môi trường để cấu hình kết nối API.

1. Tạo file `.env` tại thư mục gốc của dự án.
2. Thêm biến `NEXT_PUBLIC_API_URL` (Mặc định là `http://localhost:8085/api`).

```env
NEXT_PUBLIC_API_URL=http://localhost:8085/api
```
- **Phân cấp Component**:
    - `src/components/ui`: Atom components (Button, Input).
    - `src/components/features`: Business components (LoginForm, UserTable).
    - `src/components/layout`: Layout foundations (Header, Footer).

## 3. Kết nối API (Spring Boot)
- Sử dụng **Axios Instance** trong `src/lib/api-client.ts`.
- Tự động gắn **JWT Token** thông qua Interceptors.
- Quản lý trạng thái bằng TypeScript interfaces trong `src/types`.
