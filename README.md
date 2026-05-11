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

## Triển khai (Deployment) lên GitHub Pages

> ⚠️ **Lưu ý quan trọng**: Dự án **KHÔNG** dùng GitHub Actions tự động. Mỗi lần cập nhật phải chạy script deploy thủ công theo quy trình dưới đây.

### Quy trình cập nhật đúng (Bắt buộc thực hiện đủ 2 bước):

**Bước 1 – Lưu code lên GitHub (nhánh `main`):**
```powershell
git add -A
git commit -m "vDDMMYYYY.HHMM"
git push origin main
```

**Bước 2 – Build và deploy lên GitHub Pages (nhánh `gh-pages`):**
```powershell
# Chạy lệnh này từ thư mục gốc dự án (không dùng PowerShell bị restrict)
cmd /c "npm run build && cd dist && git init && git config user.email "buiquangtrung2012@gmail.com" && git config user.name "buiquangtrung2012-ops" && git add . && git commit -m "Deploy vDDMMYYYY.HHMM" && git push --force https://github.com/buiquangtrung2012-ops/HoSoQuanLyChatLuong.git HEAD:gh-pages && cd .."
```

Hoặc dùng script có sẵn (cần bật PowerShell execution policy):
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\deploy_gh_pages.ps1
```

**Bước 3 – Cập nhật Add-in trong Word:**
- Đợi ~30 giây để GitHub Pages refresh.
- Nhấn nút **"Cập nhật"** trên giao diện Add-in để tải phiên bản mới.

> 💡 **Tại sao phải 2 bước?** Bước 1 chỉ lưu source code lên `main`. Bước 2 mới thực sự **build** ra file tĩnh và **deploy** lên `gh-pages` — là nhánh mà GitHub Pages phục vụ. Thiếu Bước 2 thì Add-in vẫn cũ.

### Phiên bản v11052026.1316 (Mới nhất)
- **Tắt kiểm tra chính tả:** Bổ sung `spellCheck={false}` trên toàn bộ các input/textarea.
- **Tính năng Chỉnh sửa:** Triển khai nút "Sửa" và logic cập nhật dữ liệu cho tất cả các module (Nhân sự, Công việc, Vật liệu, Máy móc, PTN).
- **Gộp Chức vụ/Vai trò:** Trong quản lý nhân sự, gộp 2 trường này thành một để tối ưu giao diện.
- **Bảng ký tên chuyên nghiệp:** 
    - Chuyển sang bố cục 2 cột mỗi hàng (2x2, 2x3...).
    - Ẩn viền bảng (Style Table Normal).
    - Tự động lấy tên đơn vị từ tab Dự án (Chủ đầu tư, Nhà thầu, Tư vấn).

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
> **QUY ƯỚC ĐÁNH VERSION:**
> Mỗi khi thực hiện cập nhật mã nguồn (đặc biệt trước khi đẩy lên GitHub), phải thay đổi phiên bản trong file `src/components/Topbar.tsx` theo cấu trúc: `vDDMMYYYY.HHMM` (Ví dụ: `v11052026.1021`). Ghi chú lại thay đổi vào phần Lịch sử cập nhật bên dưới.

### v11052026.1200 (11/05/2026)
- **Tính năng mới – Nhận diện giới tính**: Thêm hàm `detectGender()` tự động nhận diện tên nữ tiếng Việt để chọn xưng hô **Ông/Bà** thay vì hardcode "Ông: ". Tab **Ký hồ sơ** cho phép override thủ công (Ông / Bà / Tự động) cho từng người ký.
- **Tính năng mới – Sidebar thu gọn mặc định**: Khi mở Add-in lần đầu, sidebar sẽ hiển thị ở chế độ thu gọn (chỉ icon) để tiết kiệm không gian.
- **Tính năng mới – Chèn bảng Ký tên**: Tab **Tạo mẫu** bổ sung nút **"Chèn bảng Ký tên..."** (màu tím). Nhấn vào sẽ mở modal cho phép chọn các bên tham gia (Chủ đầu tư, Tư vấn TK, Thi công, Giám sát) rồi tự động chèn bảng có viền chuẩn biên bản vào Word. Tự động tách cột khi đơn vị thi công là Liên danh.
- **Tính năng mới – Chế độ Liên danh**: Tab **Dự án** bổ sung toggle **"Chế độ Liên danh"** cho trường Nhà thầu thi công. Khi bật, cho phép nhập danh sách các thành viên liên danh. Dữ liệu này được dùng tự động khi chèn bảng Ký tên.

### v11052026.1035 (11/05/2026)
- **Hệ thống (DevOps)**: Sửa lỗi cập nhật phiên bản. Khởi tạo quy trình **GitHub Actions** (`.github/workflows/deploy.yml`) để tự động `build` và `deploy` thư mục `dist` sang nhánh `gh-pages` mỗi khi đẩy code lên `main`.
- **Sửa lỗi Code**: Khắc phục các lỗi TypeScript build failure (Lỗi biến `null` trong `Dashboard.tsx` và lỗi kiểu dữ liệu viền bảng trong `TemplateModule.tsx`).

### v11052026.1021 (11/05/2026)
- **Tái cấu trúc (Refactor)**: 
  - Tách tính năng xuất file Word ra một module riêng (Tab **Xuất file**), giữ lại Tab **Ký hồ sơ** chuyên để cấu hình thành phần tham gia nghiệm thu.
  - Xóa bỏ nút **Cài đặt** ở dưới cùng Sidebar để gọn gàng giao diện.
- **Tính năng mới**: Tab **Tạo mẫu** được bổ sung chức năng chèn bảng Thành phần tham gia tự động. Bảng chèn vào file Word sẽ được ẩn viền (No Border) và chứa sẵn các Content Control định dạng `Ông: [Họ tên]` và `Chức vụ: [Chức vụ]` phù hợp với quy chuẩn biên bản.

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

### v08052026.1528 (08/05/2026)
- **Topbar**: Cập nhật phiên bản, loại bỏ thông tin Admin User để gọn giao diện.
- **Nhật ký thi công**: Thêm tính năng "Lấy từ công việc" giúp tự động tổng hợp nội dung thi công từ danh sách công việc nghiệm thu cùng ngày.
- **Tạo mẫu (Template)**: Triển khai trang "Tạo mẫu" hoàn chỉnh với các nút chèn Content Control (Tên dự án, Số HĐ...) và Bookmark (Bảng nhân sự, vật liệu...) trực tiếp vào Word.
- **Xuất file**: Kích hoạt tính năng "Xuất file Word" thực tế (điền dữ liệu vào các Content Control trong văn bản).
- **Tối ưu**: Loại bỏ phần xem trước (Word Style) không cần thiết trong module Hồ sơ.
