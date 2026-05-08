# Construction Quality Add-in Pro (Hồ sơ quản lý chất lượng)

Hệ thống quản lý hồ sơ chất lượng công trình chuyên nghiệp dưới dạng Microsoft Office Add-in (Excel & Word).

## Công nghệ sử dụng
- **Office.js**: Tích hợp trực tiếp vào Word và Excel.
- **React + Vite + TypeScript**: Giao diện hiện đại, tốc độ cao.
- **TailwindCSS**: Thiết kế UI premium, responsive.
- **Docxtemplater**: Xử lý mẫu Word (.docx) chuyên nghiệp.

## Cấu trúc thư mục
- `src/office/`: Chứa các service tương tác với Office API.
- `src/pages/`: Các module quản lý (Dự án, Nhân sự, Công việc, Vật liệu, v.v.).
- `src/services/`: Logic nghiệp vụ (Workflow, Auto-numbering, Template engine).
- `src/components/`: Các UI component dùng chung.

## Hướng dẫn cài đặt và chạy
1. **Cài đặt thư viện**:
   ```powershell
   npm install
   ```
2. **Chạy môi trường phát triển**:
   ```powershell
   npm run dev
   ```
3. **Cài đặt vào Office (Sideload)**:
   - Mở Word hoặc Excel.
   - Chọn tab **Insert** > **My Add-ins** > **Upload My Add-in**.
   - Chọn file `manifest.xml` trong thư mục gốc của dự án.
   - Lưu ý: Đảm bảo server đang chạy tại `https://localhost:3000`.

## Các tính năng chính
- Quản lý thông tin dự án, nhân sự và vai trò ký tên.
- Quản lý danh mục công việc, vật liệu, thiết bị và phòng thí nghiệm (LAS-XD).
- Tự động tạo hồ sơ chất lượng từ mẫu Word.
- Tự động đánh số hồ sơ và kiểm tra quy trình (Workflow).
- Nhật ký thi công tự động tổng hợp từ dữ liệu công việc.

## Lưu ý
- Để xuất file Word thực tế, bạn cần chuẩn bị các file mẫu `.docx` với các placeholder như `{{TEN_DU_AN}}`, `{{TEN_CONG_VIEC}}`.
- Add-in đã được cấu hình để chạy đồng thời trên cả Word và Excel.

## Lịch sử cập nhật

### v08052026.1229 (08/05/2026)
- **Tính năng mới**: Thêm nút **Cập nhật** trên Topbar để làm mới Add-in từ GitHub.
- **Phiên bản**: Hiển thị version dạng `ddMMyyyy.hhmm` để dễ quản lý.
- **Tối ưu UI**: Loại bỏ toàn bộ cột và thông tin **Trạng thái** trong các module (Dashboard, Công việc, Vật liệu, Máy móc) theo yêu cầu.
- **Kích hoạt nút**: Đã gán sự kiện click cho các nút "Thêm nhân sự", "Nhập vật liệu", "Thêm máy móc", "Thêm PTN", "Thêm công việc" (hiện thông báo phản hồi).

### v08052026.1243 (08/05/2026)
- **Tính năng mới**: Triển khai toàn bộ các form nhập liệu (Modals) cho các nút "Thêm".
- **Dữ liệu**: Cho phép người dùng nhập thông tin và lưu tạm thời vào danh sách hiển thị trên giao diện (Local State).
- **Nhật ký thi công**: Kích hoạt nút "Tạo nhật ký mới" (làm mới form) và "Lưu nhật ký" (hiện trạng thái đã lưu).
- **Công nghệ**: Thêm component `Modal` dùng chung cho toàn bộ ứng dụng.
