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

> ⚠️ **LƯU Ý CỰC KỲ QUAN TRỌNG:** Dự án này được quản lý và phục vụ qua GitHub Pages. **MỖI KHI BẠN CHỈNH SỬA BẤT KỲ ĐIỀU GÌ TRONG MÃ NGUỒN**, dù là nhỏ nhất, bạn **BẮT BUỘC** phải đẩy (push) thay đổi lên GitHub để ứng dụng được cập nhật. Nếu không thực hiện, các thay đổi của bạn sẽ bị mất hoặc không có tác dụng. Dự án **KHÔNG** dùng GitHub Actions tự động cho bước build (hoặc có thể có nhưng quy trình hiện tại yêu cầu chạy lệnh build thủ công trước khi push lên gh-pages). Hãy tuân thủ nghiêm ngặt quy trình dưới đây.

### Quy trình cập nhật đúng (Bắt buộc thực hiện đủ 2 bước sau mỗi lần chỉnh sửa):


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

### Phiên bản v14052026.1108 (Mới nhất)
- **Hệ thống Quản lý Phiên bản (Version Manager):** Triển khai component `VersionManager.tsx` tự động fetch `changelog.json` từ GitHub Pages, so sánh version hiện tại vs mới nhất, và hiện badge đỏ nhấp nháy trên nút "Cập nhật" khi có bản mới.
- **Modal Changelog:** Mở modal đẹp khi nhấn "Cập nhật", hiển thị danh sách thay đổi, nút Cập nhật ngay và danh sách phiên bản cũ có nút Rollback.
- **Script Deploy nâng cấp:** `deploy_gh_pages.ps1` tự động lưu bản build vào `dist/versions/vXXX/`, fetch changelog cũ từ gh-pages, tạo/cập nhật `changelog.json`, giữ tối đa 5 phiên bản gần nhất.

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
> Mỗi khi thực hiện cập nhật mã nguồn (đặc biệt trước khi đẩy lên GitHub), phải thay đổi phiên bản trong file `src/components/Topbar.tsx` theo cấu trúc: `vDDMMYYYY.HHMM` (Ví dụ: `v14052026.0855`). Ghi chú lại thay đổi vào phần Lịch sử cập nhật bên dưới.


### v14052026.1108 (14/05/2026)
- **Hệ thống Quản lý Phiên bản (Version Manager)**: Triển khai component `VersionManager.tsx` tự động fetch `changelog.json`, so sánh version, hiện badge đỏ nhấp nháy và modal Rollback.
- **Script Deploy nâng cấp**: `deploy_gh_pages.ps1` tự động lưu bản cũ vào `/versions/vXXX/`, tạo/cập nhật `changelog.json`, giữ tối đa 5 phiên bản.

### v14052026.1055 (14/05/2026)
- **Cập nhật Bảng Thành phần tham gia (Tạo mẫu)**: Sửa lỗi không xóa viền bảng (No Border) bằng cách áp dụng `Table Normal` và vòng lặp gỡ viền tuyệt đối. Layout các nút chèn bảng được chia thành 4 cột thống nhất.
- **Thêm biến dữ liệu**: Bổ sung Tag (Content Control) cho "Đại diện Tư vấn thiết kế" (designRep) vào mục Dự án để chèn vào Word.

### v14052026.1035 (14/05/2026)
- **Tính năng Mới**: Hỗ trợ tạo **Đơn vị ký Tùy chỉnh**. Người dùng giờ đây có thể thêm các nhóm ký tự do (như Sở ban ngành, Quản lý dự án, v.v.), có thể đổi tên và xóa nhóm.
- **Tối ưu Bảng Thành phần tham gia (Tạo mẫu)**: Tự động sinh nút chèn bảng cho các đơn vị tùy chỉnh. Các biến dữ liệu (Content Controls) của nhóm tùy chỉnh cũng được tự động thêm vào danh sách thả xuống.
- **Tối ưu Form Ký Trống**: Khi thông tin người ký để trống, hệ thống sẽ tự động chèn dải dấu chấm cứng `..............................` để in form chờ điền tay. Xưng hô tự động chuyển thành `Ông (Bà): ` khi trống thông tin.

### v14052026.1009 (14/05/2026)
- **Thiết kế lại UI (Redesign)**: Lột xác toàn bộ giao diện tab Ký hồ sơ (`RecordsModule.tsx`). Áp dụng thiết kế thẻ Card cho từng nhóm ký có tính năng đóng/mở (Collapse/Expand). Ép giao diện người ký thành 1 dòng siêu gọn nhẹ bằng CSS Grid, thêm tính năng Kéo & Thả (Drag & Drop) để đổi thứ tự, đưa thanh hành động thành Sticky Bottom Bar nổi trên nội dung.

### v14052026.0954 (14/05/2026)
- **Sửa lỗi Nghiêm trọng (Regression)**: Khắc phục lỗi bảng Thành phần tham gia bị trống ("Click or tap here to enter text") do dùng tham số Replace trên một Content Control rỗng hoặc lỗi API trên bản Word tiếng Việt. Khôi phục lại hàm `hideTableBorders` với cách xóa viền an toàn bằng thuộc tính `type = 'None'`. Xóa bỏ khung bọc (Wrapper) để triệt để loại bỏ dấu enter thừa.
- **Tính năng Mới**: Thêm vai trò **Tư vấn thiết kế (TVTK)** vào module Ký hồ sơ và Tạo mẫu. Người dùng giờ đây có thể cấu hình và chèn bảng ký cho Tư vấn thiết kế.

### v14052026.0918 (14/05/2026)
- **Sửa lỗi Giao diện**: Thay thế hàm tự động xóa viền bằng cách sử dụng style `Table Normal` của Word để đảm bảo bảng Thành phần tham gia thực sự không có viền.
- **Sửa lỗi Khoảng trắng**: Sửa lỗi sinh ra 2 dòng trống (dấu enter) dư thừa dưới bảng khi chèn liên tục. Bảng giờ đây sẽ thay thế (Replace) khoảng trống mặc định của Content Control thay vì chèn vào đầu (Start).

### v14052026.0855 (14/05/2026)
- **Sửa lỗi & Tối ưu hóa**: Hoàn tất việc sửa lỗi các nút chèn "Bảng Thành phần tham gia" trong module Tạo mẫu. Tách biệt logic API, xử lý an toàn lỗi nạp Font, và tinh chỉnh cấu trúc Component. Cải thiện độ ổn định khi tương tác với Word API.
- **Hệ thống**: Cập nhật lại README để nhấn mạnh yêu cầu bắt buộc phải đẩy code lên GitHub sau mỗi lần chỉnh sửa.


### v12052026.1642 (12/05/2026)
- **Sửa lỗi & Ổn định**: Khắc phục lỗi nút "Thành phần tham gia" không phản hồi. Tăng cường khả năng bắt lỗi và tương thích Word API.
- **Tính năng mới – Liên danh (Joint Venture)**: 
    - Tab **Ký hồ sơ** tự động tạo các nhóm quản lý nhân sự riêng biệt cho từng thành viên liên danh.
    - **Bảng thi công** trong Word hỗ trợ bố cục đa cột, tự động điền thông tin người ký cho từng đơn vị thành viên liên danh.
- **Cải tiến Word API**: Thay thế phương thức `.set()` bằng gán trực tiếp thuộc tính để hoạt động ổn định trên mọi phiên bản Word.

### v11052026.1744 (11/05/2026)
- **Sửa lỗi cực kỳ quan trọng**: Khắc phục triệt để lỗi không chèn được bảng Thành phần tham gia bằng cách bọc khối xử lý Font trong `try-catch` và kiểm tra giá trị `null` kỹ lưỡng hơn. Đảm bảo tính ổn định trên mọi phiên bản Word.

### v11052026.1736 (11/05/2026)
- **Sửa lỗi – Bảng Thành phần tham gia**: Khắc phục lỗi không chèn được bảng Thành phần tham gia do xung đột định dạng Font trong Word API. Bổ sung thông báo phản hồi sau khi chèn bảng thành công.

### v11052026.1731 (11/05/2026)
- **Tính năng mới – Bảng Tổng hợp PTN**: Tab **Tạo mẫu** bổ sung nút chèn bảng tổng hợp Phòng thí nghiệm (PTN). Dữ liệu được tổng hợp tự động từ tab PTN.
- **Tính năng mới – Địa điểm dự án**: Bổ sung trường "Địa điểm" vào danh sách Content Control của tab **Tạo mẫu** để chèn vị trí xây dựng vào biên bản.
- **Sửa lỗi UI**: Sửa lỗi các nút trong phần **VÙNG DỮ LIỆU BẢNG** không hoạt động. Các nút này giờ đây sẽ chèn đúng bảng tổng hợp tương ứng (Nhân sự, Vật liệu, Máy móc, PTN).

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
