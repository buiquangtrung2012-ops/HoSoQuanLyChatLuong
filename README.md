# Construction Quality Add-in Pro (Hồ sơ quản lý chất lượng)

> 🚀 **THÔNG BÁO QUAN TRỌNG:** Mọi thay đổi trong mã nguồn **BẮT BUỘC** phải được đẩy (push) lên GitHub và chạy quy trình Deploy để cập nhật Add-in. Vui lòng xem kỹ phần [Quy trình cập nhật đúng](#quy-trình-cập-nhật-đúng-bắt-buộc-thực hiện-đủ-2-bước-sau-mỗi-lần-chỉnh-sửa).

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
> Mỗi khi thực hiện cập nhật mã nguồn (đặc biệt trước khi đẩy lên GitHub), phải thay đổi phiên bản trong file `src/components/VersionManager.tsx` theo cấu trúc: `vDDMMYYYY.HHMM` (Ví dụ: `v16052026.0945`). Ghi chú lại thay đổi vào phần Lịch sử cập nhật bên dưới.

### v18052026.1708 (18/05/2026)
- **Xuất Hồ Sơ (Mailings 1 File)**: Thay đổi hành vi tính năng "Xuất Toàn Bộ Công Việc" (Mailings). Thay vì tạo file ZIP chứa nhiều file Word nhỏ, hệ thống tự động gom tất cả bản ghi vào chung **1 file Word duy nhất**, tách biệt bằng ngắt trang.
  - Sử dụng cơ chế Auto-Loop Injection (`{#workItems}`) trực tiếp vào mã XML, giúp người dùng không cần sửa đổi file mẫu.
  - Đảm bảo tương thích hoàn toàn với Header/Footer của tài liệu (thông tin dự án).

### v16052026.0945 (16/05/2026)
- **Chuẩn hóa Ngày tháng (dd/MM/yyyy)**: Chuyển đổi toàn bộ hiển thị ngày tháng trên giao diện và khi xuất file Word sang định dạng `dd/MM/yyyy` chuẩn Việt Nam.
- **Nâng cấp Xuất hồ sơ hàng loạt (Mailings)**:
  - Tự động gán **Số thứ tự (STT)** cho từng biên bản trong bộ hồ sơ.
  - Đảm bảo dữ liệu (Nội dung, Mã hiệu, Ngày tháng, Nhân sự) thay đổi tương ứng theo từng STT công việc trong danh sách (Mail Merge).
- **Khôi phục Nhân sự theo Chức vụ**: 
  - Tự động tạo các nút chèn tag `title_[Chức vụ]` trong tab Tạo mẫu dựa trên danh sách nhân sự thực tế.
  - Hỗ trợ chèn tên kèm xưng hô Ông/Bà tự động qua tag `_full`.
- **Đồng bộ hóa dữ liệu**: Cập nhật logic ánh xạ cho các trường ngày tháng và chức vụ mới trong dịch vụ WordApiService.


### v15052026.1725 (15/05/2026)
- **Cập nhật Tab Công việc**: Đổi tên trường "Ngày bắt đầu" thành **"Ngày yêu cầu nghiệm thu"** để khớp với thực tế hồ sơ.
- **Bổ sung Nút chèn Ngày dạng chữ**: 
  - Đã thêm nút chèn **Ngày yêu cầu NT (Chữ)** và **Ngày nghiệm thu (Chữ)** trong Tab Tạo mẫu.
  - Bổ sung nút chèn ngày dạng chữ cho cả Hạn kiểm định máy móc và Hạn chứng chỉ PTN.
- **Tối ưu hóa Tab Tạo mẫu**: 
  - Loại bỏ các nút dư thừa (Nhân sự chung cũ).
  - Sắp xếp lại danh mục nút giúp việc thiết kế mẫu nhanh chóng và logic hơn.
- **Đồng bộ Dữ liệu**: Cập nhật logic ánh xạ cho các trường ngày tháng mới.

### v15052026.1720 (15/05/2026)
- **Đồng bộ Dữ liệu Toàn diện (Triệt để)**:
  - Cho phép tự động mở khóa (Unlock) Content Control nếu đang ở chế độ `cannotEdit` để ghi dữ liệu, sau đó khóa lại như cũ.
  - Hỗ trợ không phân biệt chữ hoa/chữ thường (Case-insensitive) cho các thẻ Tag.
  - Bổ sung hàng loạt variant cho Tag: `project_[tên_trường]`, `work_[tên_trường]` và phiên bản viết thường của tất cả các tag chức danh.
  - Cải tiến hiệu năng đồng bộ theo lô (Batching) giúp quá trình đổ dữ liệu mượt mà và ổn định hơn.

### v15052026.1715 (15/05/2026)
- **Vá lỗi Đồng bộ Content Control**: Mở rộng phạm vi ánh xạ dữ liệu, đảm bảo mọi trường nhập liệu trong các Tab (Dự án, Công việc, Ký hồ sơ...) đều được ghi nhận chính xác vào các ô Content Control tương ứng trong Word.
- **Bổ sung Mapping thông minh**: Tự động nhận diện cả các tag rút gọn (Ví dụ: thay vì chỉ nhận `investorRep`, hệ thống giờ nhận diện cả tag `investor`).
- **Tối ưu hóa vòng lặp xử lý**: Thêm các bước kiểm tra an toàn cho tag để tránh lỗi gián đoạn quá trình đổ dữ liệu.

### v15052026.1705 (15/05/2026)
- **Tái cấu trúc Topbar**: Mở rộng không gian làm việc, đưa thông tin phiên bản xuống dưới nút Cập nhật để giao diện thoáng hơn.
- **Hệ thống Ngày tháng tiếng Việt**: Tự động chuyển đổi `dd/mm/yyyy` sang định dạng chuẩn văn bản Việt Nam (Ví dụ: "ngày 03 tháng 10 năm 2025") qua tag `workInspectDateVN`.
- **Nhân sự theo Chức danh**: Hỗ trợ chèn tên nhân sự thông qua chức danh (Ví dụ: tag `title_Chỉ Huy Trưởng` sẽ tự động lấy tên người tương ứng).
- **Cải tiến Quản lý Công việc**:
  - Thay thế cột Mã CV bằng **STT** tự động.
  - Cho phép **di chuyển thứ tự công việc** (Lên/Xuống) linh hoạt.
- **Tối ưu Bảng Thành phần**:
  - Tự động điều chỉnh số hàng theo số lượng nhân sự thực tế (không còn mặc định 3 hàng).
  - Cố định chiều rộng cột STT bằng cách ép chiều rộng từng ô, đảm bảo thẩm mỹ tối đa.

### v15052026.1630 (15/05/2026)
- **Vá lỗi Đồng bộ dữ liệu**: 
  - Khắc phục triệt để lỗi mất dòng đầu tiên (header) và lỗi font chữ siêu nhỏ khi đồng bộ dữ liệu nhiều lần. 
  - Cải tiến cơ chế kế thừa font chữ thông minh: Nếu vùng chèn bị ép về 1pt, hệ thống sẽ tự động lấy định dạng từ đoạn văn bản phía trước.
  - Đảm bảo tỷ lệ phần trăm chiều rộng các cột (STT, Họ tên, Khối lượng...) hoạt động chính xác trong Word.
- **Tính năng Mới - Xuất file Hàng loạt**: 
  - Triển khai tab **Xuất Hồ Sơ** mới với khả năng xuất biên bản nghiệm thu cho **TẤT CẢ** công việc trong danh sách chỉ với 1 cú click.
  - Hệ thống tự động điền dữ liệu vào mẫu và nén toàn bộ kết quả vào một file ZIP để tải về, giúp tiết kiệm thời gian tối đa (tương tự Mail Merge).

### v15052026.1616 (15/05/2026)
- **Tối ưu Bảng Dữ liệu**: 
  - Căn giữa nội dung và thu nhỏ cột **STT** (~7%) cho tất cả các bảng tổng hợp.
  - Tự động mở rộng các cột thông tin chính (**Họ tên, Vật tư, Thiết bị, PTN**) để chiếm diện tích lớn nhất.
  - Thu nhỏ kích thước cột **Khối lượng** để tối ưu không gian hiển thị.
- **Tối ưu Giao diện (UI)**:
  - **Loại bỏ nút Đổ dữ liệu** ở Sidebar để làm gọn thanh menu.
  - **Nâng cấp Tab Tạo mẫu**: Chuyển sang bố cục 5 cột và thu nhỏ kích thước các nút bấm, giúp giao diện chuyên nghiệp và chứa được nhiều thông tin hơn trên một màn hình.

### v15052026.1545 (15/05/2026)
- **Sửa lỗi bảng bị đè/mất định dạng**: Khắc phục triệt để lỗi bảng bị co lại hoặc văn bản bị đè lên nhau khi Đồng bộ dữ liệu. Nguyên nhân do lệnh thu nhỏ cỡ chữ nhầm vào các ô trong bảng. Giờ đây chỉ thu nhỏ dòng trống cuối cùng để đảm bảo thẩm mỹ mà không làm hỏng dữ liệu.

### v15052026.1345 (15/05/2026)
- **Sửa lỗi chèn bảng**: Khắc phục lỗi Word API khiến quá trình chèn bảng bị gián đoạn (chỉ chèn được cột STT) do sử dụng sai tham số căn lề (Center thay vì Centered).

### v15052026.1340 (15/05/2026)
- **Cải tiến Bảng Nhân sự**: Hệ thống giờ đây tự động quét các "Đơn vị công tác" từ dữ liệu Nhân sự và tạo ra các nút chèn bảng riêng biệt cho từng Đơn vị (VD: Bảng Nhân sự - Coteccons). Bạn có thể chèn độc lập từng bảng vào bất kỳ vị trí nào mong muốn thay vì gộp chung vào một Content Control duy nhất.
- **Tối ưu Bảng Tổng hợp**:
  - Dòng tiêu đề (Header) của tất cả các bảng dữ liệu giờ đây tự động được **căn giữa (Center)**.
  - Khắc phục lỗi "bị đẩy dòng trắng / viền dày" khi nhấn Đồng bộ dữ liệu nhiều lần.

### v15052026.1300 (15/05/2026)
- **Tối ưu Bảng Dữ liệu (Bookmarks)**: 
  - Khôi phục lại viền (borders) cho các bảng tổng hợp dữ liệu, giúp dễ đọc hơn.
  - Sửa lỗi bôi đậm (bold) toàn bộ bảng: giờ đây chỉ bôi đậm dòng tiêu đề (header), nội dung bảng trở về định dạng nét chữ bình thường.
  - **Bảng Nhân sự**: Tự động nhóm nhân sự theo "Đơn vị công tác" và tách ra thành các bảng riêng biệt kèm tiêu đề đơn vị rõ ràng thay vì gộp chung tất cả vào một bảng.

### v15052026.1240 (15/05/2026)
- **Đồng bộ hóa Bảng Dữ liệu**: Cập nhật logic cho các Bảng Tổng hợp (Bookmarks) như Bảng Nhân sự, Vật liệu, Máy móc, PTN,... để có cơ chế hoạt động giống hệt Bảng Thành phần tham gia. Cụ thể: Bảng giờ đây sẽ tự động ẩn viền, kế thừa đúng định dạng Font chữ (Font name, size, in đậm, in nghiêng, màu sắc) tại vị trí chèn, và loại bỏ triệt để các dòng trắng (khoảng cách đoạn văn) dư thừa.

### v15052026.1150 (15/05/2026)
- **Tái thiết kế giao diện (UI)**: Nâng cấp toàn diện giao diện nhập liệu "Thông tin dự án" sang phong cách thẻ nổi (floating cards) hiện đại. Các trường dữ liệu giờ đây mang vẻ ngoài tối giản với thiết kế không viền, làm nổi bật thông tin dự án, cải thiện rõ rệt trải nghiệm người dùng (UX) và tính thẩm mỹ.

### v15052026.1130 (15/05/2026)
- **Sửa lỗi hiển thị**: Tự động điền dấu chấm ".............................." cho các trường họ tên và chức vụ bị trống khi đồng bộ dữ liệu vào bảng thành phần tham gia, thay vì để trống khiến người dùng thấy chữ Placeholder.

### v15052026.1035 (15/05/2026)
- **Tối ưu Thừa hưởng Định dạng**: Cải tiến triệt để khả năng kế thừa font chữ. Bảng hiện tại sẽ nhận diện đầy đủ các thuộc tính Bold (In đậm), Italic (Nghiêng) và Color (Màu sắc) từ văn bản mẫu.
- **Giữ vững Layout**: Duy trì cơ chế ổn định của bản v1710, đảm bảo không phát sinh lỗi dòng trống thừa trong khi vẫn hiển thị đúng định dạng nội dung bảng.

### v15052026.1025 (15/05/2026)
- **Rollback toàn diện**: Đã khôi phục chính xác 100% mã nguồn của phiên bản v14052026.1710. Toàn bộ các cải tiến và thay đổi sau bản này đã được loại bỏ để đảm bảo tính ổn định tối đa theo yêu cầu của bạn.

### v15052026.1018 (15/05/2026)
- **Sửa lỗi font 1pt**: Khắc phục triệt để việc nội dung bảng bị thu nhỏ về 1pt. Hệ thống hiện đã có cơ chế thông minh để chỉ thu nhỏ các dòng trống bên ngoài bảng, đồng thời cưỡng ép nội dung bên trong bảng luôn giữ cỡ chữ chuẩn (mặc định 13pt nếu không tìm thấy font kế thừa).
- **Cải thiện độ ổn định**: Giữ vững logic của bản v1710 nhưng được tối ưu hóa để không gây lỗi "Trắng bảng".

### v15052026.1010 (15/05/2026)
- **Khôi phục Cơ chế ổn định (Revert v1710)**: Quay trở lại toàn bộ logic chèn bảng và quản lý layout của phiên bản v1710 - vốn được xác nhận là hoạt động ổn định nhất trên máy của bạn.
- **Vá lỗi Font**: Mặc dù dùng logic v1710, tôi đã bổ sung cải tiến để khắc phục triệt để lỗi bảng bị bôi đậm hoặc bị nhảy về cỡ chữ 12pt khi đồng bộ. Bảng giờ đây sẽ kế thừa chính xác font chữ của văn bản mẫu.
- **Sửa lỗi "Trắng bảng"**: Khắc phục tình trạng bảng không có dữ liệu sau khi chèn bằng cách sử dụng lại các hàm gán dữ liệu an toàn.

### v15052026.0925 (15/05/2026)
- **Sửa lỗi Hiển thị (Vá lỗi 1720)**: Loại bỏ triệt để việc ép cỡ chữ 1pt cho toàn bộ khung bao bảng. Hệ thống hiện chỉ thu nhỏ các dòng trống thừa xung quanh bảng để tối ưu không gian, đảm bảo nội dung bảng luôn hiển thị đúng kích thước.
- **Khắc phục lỗi Đồng bộ**: Cải tiến cơ chế kế thừa font chữ thông minh bằng cách lấy định dạng trực tiếp từ đoạn văn bản ngay trước bảng. Sửa lỗi bảng bị bôi đậm và nhảy về cỡ chữ 12pt khi đồng bộ dữ liệu.
- **Sửa lỗi Nút bấm**: Khắc phục lỗi cú pháp khiến việc chèn bảng thành phần tham gia (đặc biệt là Liên danh) bị treo trên một số phiên bản Word.

### v14052026.1720 (14/05/2026)
- **Tinh chỉnh Layout**: Khắc phục lỗi font chữ trong bảng bị thu nhỏ về 1pt. Hiện tại, chỉ có các dòng trống thừa xung quanh bảng mới bị thu nhỏ để tiết kiệm không gian, nội dung bên trong bảng vẫn giữ nguyên cỡ chữ chuẩn của văn bản.

### v14052026.1715 (14/05/2026)
- **Sửa lỗi Bôi đậm**: Khắc phục tình trạng bảng bị bôi đậm mặc định. Hiện tại chỉ những phần cần thiết mới được bôi đậm.
- **Thừa hưởng Font thông minh**: Bảng hiện đã tự động nhận diện và sử dụng đúng Font chữ cũng như Cỡ chữ của đoạn văn bản nơi bảng được chèn vào, đảm bảo tính đồng nhất tuyệt đối cho tài liệu.

### v14052026.1710 (14/05/2026)
- **Hoàn thiện Layout**: Tự động rà soát và ép kích thước toàn bộ các dòng trống trong khung bao bảng xuống 1pt, đảm bảo văn bản gọn gàng nhất có thể.
- **Tăng cường Tin cậy**: Cải tiến quy trình làm mới bảng để ngăn chặn tình trạng khung bị rỗng khi đồng bộ.
- **Đổi tên nút bấm**: Đổi tên nút "ĐỔ DỮ LIỆU" thành "ĐỒNG BỘ DỮ LIỆU" để phản ánh đúng chức năng của hệ thống.

### v14052026.1700 (14/05/2026)
- **Tối ưu Layout (Ảnh 4)**: Thu nhỏ kích thước font của các dòng trống trong khung bao bảng xuống 1pt, giúp bảng bám sát nội dung văn bản hơn và chuyên nghiệp hơn.
- **Sửa lỗi Đổ dữ liệu (Ảnh 5)**: Khắc phục triệt để sự cố bảng bị xoá rỗng khi nhấn "Đổ dữ liệu". Đã thêm bước đồng bộ bắt buộc để đảm bảo dữ liệu luôn được hiển thị chính xác.
- **Cải thiện Thông báo**: Hiển thị chi tiết số lượng trường và số lượng bảng được cập nhật để bạn dễ dàng theo dõi.

### v14052026.1648 (14/05/2026)
- **Sửa lỗi Điều hướng Rollback**: Khắc phục sự cố không thể cập nhật lại bản mới sau khi đã quay về bản cũ. Hệ thống hiện có khả năng tự định vị đường dẫn thông minh để luôn tìm thấy tệp tin cập nhật.
- **Duy trì Cơ chế v1620**: Giữ nguyên cơ chế chèn bảng ổn định nhất để đảm bảo các nút bấm hoạt động 100%.

### v14052026.1645 (14/05/2026)
- **Khôi phục Cơ chế ổn định (Revert v1620)**: Quay trở lại cơ chế tạo khung bao bọc (Wrapper) trước khi chèn bảng. Đây là phương pháp đã được xác nhận hoạt động ổn định nhất trên môi trường của bạn.
- **Sửa lỗi Nút bấm**: Khắc phục triệt để tình trạng nút không phản hồi bằng cách sử dụng lại các hàm API tiêu chuẩn từ bản v1620.
- **Đồng bộ & Chẩn đoán**: Tiếp tục duy trì hệ thống chẩn đoán lỗi và cơ chế đồng bộ dữ liệu thông minh.

### v14052026.1635 (14/05/2026)
- **Sửa lỗi Rollback (404)**: Khắc phục sự cố không thể quay lại phiên bản cũ trên GitHub Pages. Hệ thống hiện đã lưu trữ đầy đủ lịch sử các phiên bản để bạn có thể rollback an toàn bất cứ lúc nào.
- **Chẩn đoán lỗi thông minh**: Bổ sung thông báo (Alert) chi tiết khi có sự cố chèn bảng. Nếu vẫn không hoạt động, thông báo này sẽ giúp xác định chính xác nguyên nhân lỗi từ Word API.
- **Tăng cường ổn định**: Thêm bước đồng bộ (Sync) bắt buộc trước khi tạo khung bao bọc bảng, đảm bảo đối tượng bảng đã sẵn sàng trong tài liệu.

### v14052026.1630 (14/05/2026)
- **Sửa lỗi Nút bấm**: Khắc phục sự cố nút chèn bảng Thành phần tham gia không phản hồi do gọi sai phương thức Word API. Hệ thống hiện đã hoạt động ổn định trở lại.
- **Duy trì Cải tiến**: Tiếp tục giữ nguyên cơ chế bao bọc bảng (Wrapper) và ẩn Placeholder để đảm bảo đồng bộ dữ liệu tốt nhất.

### v14052026.1625 (14/05/2026)
- **Tối ưu Vị trí Bảng**: Loại bỏ hoàn toàn các dấu xuống dòng thừa khi chèn bảng. Bảng hiện tại sẽ nằm sát với nội dung phía trên mà không bị tách rời.
- **Ẩn Placeholder**: Thiết lập khoảng trắng cho vùng nhắc của Content Control. Khắc phục lỗi hiển thị dòng chữ "Click or tap here to enter text" khi bảng đang được làm mới hoặc khi dữ liệu trống.
- **Cải tiến Logic chèn**: Thay đổi trình tự (Chèn bảng trước -> Bao bọc sau) để đảm bảo Content Control ôm khít bảng dữ liệu, không tạo ra khoảng trắng dư thừa.

### v14052026.1620 (14/05/2026)
- **Cấu trúc Bảng mới**: Chuyển đổi toàn bộ cơ chế chèn Bảng Thành phần tham gia thành dạng Content Control bao bọc (Wrapper). Điều này giúp hệ thống định vị chính xác toàn bộ khối bảng để xoá và chèn lại dữ liệu mới một cách tin cậy nhất.
- **Đồng bộ hóa Hoàn hảo**: Khắc phục lỗi bảng không cập nhật sau lần chèn đầu tiên do thiếu định danh (Tag) trên Word.
- **Cải tiến Giao diện**: Tự động căn giữa tiêu đề đơn vị trong bảng Liên danh để tăng tính thẩm mỹ.

### v14052026.1615 (14/05/2026)
- **Quét dữ liệu Toàn diện**: Mở rộng khả năng tìm kiếm Content Control ra toàn bộ tài liệu, bao gồm cả Header, Footer và tất cả các Section. Đảm bảo không bỏ sót bất kỳ vị trí dữ liệu nào.
- **Sửa lỗi đồng bộ**: Khắc phục các lỗi kỹ thuật khiến việc đổ dữ liệu vào bảng Thành phần tham gia bị gián đoạn hoặc không tìm thấy vị trí.
- **Báo cáo kết quả chính xác**: Cập nhật thông báo trạng thái cuối cùng hiển thị đầy đủ số lượng cả trường văn bản và số lượng bảng đã được làm mới thành công.

### v14052026.1610 (14/05/2026)
- **Cơ chế Mở khoá thông minh**: Tự động phát hiện và tạm thời mở khoá (unlock) các Content Control bị thiết lập "Chống chỉnh sửa" trong Word để đảm bảo việc làm mới bảng luôn thành công.
- **Tăng cường làm sạch dữ liệu**: Bổ sung bước kiểm tra và xoá các bảng rác còn sót lại trong quá trình đổ dữ liệu, giúp bảng Thành phần tham gia luôn khớp 100% với cấu hình trong ứng dụng.
- **Cập nhật trạng thái chi tiết**: Hiển thị rõ ràng tên từng bảng đang được xử lý để người dùng dễ dàng theo dõi tiến độ.

### v14052026.1600 (14/05/2026)
- **Sửa nút Xoá tất cả**: Chuyển sang xác nhận trực tiếp trên giao diện để đảm bảo hoạt động trong mọi môi trường (Word, Browser).
- **Đổ dữ liệu bảng linh hoạt**: Tự động nhận diện và làm mới tất cả các bảng thành phần ký (CĐT, TVGS, Đơn vị thi công, TVTK và cả các nhóm ký tự tạo).
- **Làm sạch bảng triệt để**: Sử dụng cơ chế xoá bảng mạnh mẽ hơn trước khi chèn bảng mới, đảm bảo số dòng trong Word luôn khớp chính xác với số người ký đã chọn trong ứng dụng.

### v14052026.1550 (14/05/2026)
- **Hệ thống Tự động lưu (Auto-save)**: Loại bỏ hoàn toàn các nút "Lưu" thủ công. Mọi thay đổi trong Thông tin dự án, Cấu hình ký và Nhật ký thi công đều được lưu ngay lập tức vào bộ nhớ.
- **Nút Xoá tất cả (Clear All)**: Thêm biểu tượng thùng rác trên Topbar cho phép xoá sạch dữ liệu để bắt đầu dự án mới (có xác nhận bảo mật).
- **Sửa lỗi Nhóm ký tùy chỉnh**: Khắc phục lỗi mất nhóm ký tự tạo khi chuyển tab. Giờ đây các nhóm ký "Khác" sẽ được bảo toàn tuyệt đối.
- **Cải thiện UI/UX**: Thêm các chỉ báo "Đã lưu tự động" mượt mà để người dùng yên tâm về dữ liệu.

### v14052026.1528 (14/05/2026)
- **Cơ chế Safe-Sync đột phá**: Khắc phục triệt để lỗi `InvalidArgument` bằng cách kiểm tra thuộc tính `cannotEdit` (Chống chỉnh sửa) của từng ô dữ liệu trước khi điền.
- **Xử lý lỗi theo thời gian thực**: Thực hiện đồng bộ API ngay sau mỗi ô dữ liệu. Nếu một ô bị lỗi, hệ thống sẽ phát hiện ngay và bỏ qua để điền tiếp các ô còn lại, không còn tình trạng bị treo ngay từ ô thứ hai.
- **Tăng cường khả năng tương thích**: Bỏ qua các loại Content Control không tương thích (như Group) để tránh gây lỗi hệ thống.

### v14052026.1523 (14/05/2026)
- **Tối ưu hóa vòng lặp đổ dữ liệu**: Thêm cơ chế xử lý lỗi cho từng Content Control riêng biệt. Nếu một trường bị lỗi (do sai kiểu dữ liệu hoặc bị khóa), hệ thống sẽ bỏ qua và tiếp tục đổ dữ liệu cho các trường còn lại thay vì dừng toàn bộ tiến trình.
- **Tự động đồng bộ định kỳ**: Thêm bước đồng bộ API (context.sync) sau mỗi 20 trường dữ liệu để đảm bảo kết nối ổn định với Microsoft Word, đặc biệt hữu ích cho các hồ sơ dài.

### v14052026.1517 (14/05/2026)
- **Sửa lỗi InvalidArgument**: Khắc phục triệt để lỗi "InvalidArgument" khi đổ dữ liệu vào Word bằng cách thêm các bước kiểm tra kích thước bảng và xử lý lỗi cục bộ cho từng bảng.
- **Tối ưu hóa mã nguồn**: Viết lại bộ xử lý WordApiService để đảm bảo cấu trúc lệnh chính xác, tránh các lỗi cú pháp làm treo ứng dụng.
- **Phản hồi chi tiết**: Hiển thị chính xác bảng nào đang được xử lý trên thanh trạng thái.

### v14052026.1511 (14/05/2026)
- **Hệ thống thông báo trạng thái (Status Bar)**: Thay thế toàn bộ các thông báo `alert` (vốn hay bị Word chặn) bằng một thanh trạng thái mượt mà trực tiếp trên Topbar. Người dùng có thể theo dõi tiến trình "Đang chuẩn bị", "Đang đồng bộ" và "Thành công" ngay trên giao diện.
- **Tối ưu hóa phản hồi**: Khắc phục triệt để lỗi "nhấn không phản hồi" bằng cách sử dụng cơ chế phản hồi bất đồng bộ (Async status updates).
- **Khôi phục vị trí Đổ dữ liệu**: Đưa nút Đổ dữ liệu về lại Topbar với thiết kế tinh gọn và hiệu quả hơn.

### v14052026.1504 (14/05/2026)
- **Nút TEST chẩn đoán**: Thêm nút TEST CLICK màu đỏ ở góc trái Topbar để kiểm tra trực tiếp khả năng nhận lệnh của ứng dụng.
- **Toàn cục hóa WordApiService**: Đưa bộ xử lý dữ liệu Word ra biến toàn cục (window.WordApiService) để đảm bảo các nút bấm ở Sidebar và Topbar đều có thể gọi lệnh thành công, tránh lỗi phạm vi (scope).
- **Cải thiện độ tin cậy**: Sử dụng tham chiếu toàn cục cho các thao tác đổ dữ liệu quan trọng.

### v14052026.1454 (14/05/2026)
- **Chuyển nút Đổ dữ liệu sang Sidebar**: Di dời nút Đổ dữ liệu xuống dưới cùng của thanh Menu (Sidebar). Đây là vùng giao diện ổn định hơn, tránh hoàn toàn lỗi chồng lấn hoặc chặn sự kiện click thường gặp trên thanh Topbar của Word.
- **Dọn dẹp Topbar**: Loại bỏ các nút thử nghiệm lỗi trên thanh tiêu đề để giao diện gọn gàng hơn.

### v14052026.1448 (14/05/2026)
- **Đổi vị trí và phương thức Click**: Hoán đổi vị trí giữa nút Cập nhật và Đổ dữ liệu để kiểm tra vùng tương tác. Đồng thời chuyển nút Đổ dữ liệu sang thẻ `div` với nhiều sự kiện (`onMouseDown`, `onClick`) để bắt lệnh chắc chắn hơn.

### v14052026.1444 (14/05/2026)
- **Tối ưu Layout Topbar**: Thu nhỏ thanh tìm kiếm và sử dụng layout linh hoạt (Flexbox) để tránh chồng lấn các nút bấm trên màn hình hẹp.
- **Khôi phục thiết kế Cập nhật**: Trả lại giao diện chuẩn cho nút Cập nhật trong khi vẫn duy trì các thông báo gỡ lỗi cho nút Đổ dữ liệu.
- **Sửa lỗi tương tác**: Thêm lớp `z-index` và `cursor-pointer` để đảm bảo nút Đổ dữ liệu có thể click được.

### v14052026.1439 (14/05/2026)
- **Kiểm tra tương tác cơ bản (Simple Interaction Test)**: Tối giản hóa tối đa nút Đổ dữ liệu và nhãn phiên bản, sử dụng các hàm alert cơ bản nhất để kiểm tra phản hồi của Word Add-in.

### v14052026.1436 (14/05/2026)
- **Chẩn đoán sự kiện click (Click Diagnostics)**: Thêm alert vào nhãn phiên bản và nút Đổ dữ liệu để kiểm tra xem trình duyệt có ghi nhận các sự kiện click tại thanh Topbar hay không.

### v14052026.1433 (14/05/2026)
- **Thêm cảnh báo gỡ lỗi (Debug alerts)**: Thêm các thông báo alert để xác nhận lệnh click và tiến trình xử lý dữ liệu Word, giúp xác định điểm nghẽn khi nhấn nút "Đổ dữ liệu".

### v14052026.1429 (14/05/2026)
- **Thu gọn giao diện Ký hồ sơ**: Chuyển đổi dropdown chọn nhân sự thành biểu tượng thu gọn (User icon) để tối ưu không gian, nhưng vẫn giữ nguyên chức năng chọn nhanh khi nhấn vào.
- **Tăng cường ổn định Nút Đổ dữ liệu**: Thêm cơ chế bọc lỗi (Try-catch) và logging chi tiết cho chức năng Đổ dữ liệu toàn cầu để dễ dàng chẩn đoán và khắc phục sự cố.
- **Sửa lỗi Layout Bảng**: Đảm bảo tiêu đề bảng và các dòng dữ liệu luôn căn chỉnh chính xác sau khi thu gọn cột.

### v14052026.1418 (14/05/2026)
- **Nút Đổ dữ liệu Toàn cầu**: Đưa nút "Đổ dữ liệu" (Zap icon) lên thanh Topbar để người dùng có thể cập nhật dữ liệu vào văn bản Word từ bất kỳ tab nào (Công trình, Nhật ký, Nhân sự, v.v.) mà không cần quay lại tab Tạo mẫu.
- **Sửa lỗi cập nhật Bảng thành phần**: Cải tiến logic đồng bộ Word API, đảm bảo bảng Thành phần tham gia luôn được làm mới chính xác khi dữ liệu trong tab Ký hồ sơ thay đổi.
- **Tối ưu hóa kiến trúc**: Chuyển đổi logic Word API sang service dùng chung để tăng tốc độ phản hồi và tính ổn định.

### v14052026.1149 (14/05/2026)
- **Cải tiến quy trình Cập nhật**: Khi nhấn nút "Cập nhật", hệ thống sẽ tiến hành kiểm tra phiên bản mới nhất từ server (hiển thị trạng thái "Đang kiểm tra...") trước khi hiển thị bảng Quản lý phiên bản.

### v14052026.1144 (14/05/2026)
- **Cập nhật cơ chế điền dữ liệu**: Thay vì áp dụng mặc định chữ đậm và màu đen, dữ liệu khi điền vào Content Control sẽ tự động kế thừa hoàn toàn định dạng (font, cỡ chữ, màu sắc, in đậm/nghiêng) của dòng văn bản hiện tại trong mẫu Word.

### v14052026.1139 (14/05/2026)
- **Sửa lỗi layout Tab Ký hồ sơ**: Dòng người ký giờ đây luôn hiển thị thành 1 dòng gọn nhẹ bằng CSS Grid cố định, không bị xuống dòng khi cửa sổ add-in hẹp.
- **Sửa lỗi cập nhật dữ liệu**: Chữ sau khi điền vào Content Control giờ được định dạng đúng (in đậm, màu đen) thay vì chữ thường màu xám.
- **Sửa UI PTN**: Bỏ 2 nút "Chi tiết thiết bị" và "Hồ sơ năng lực" khỏi thẻ PTN.

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
