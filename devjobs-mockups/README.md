# DevJobs - HTML Mockups cho Figma

Bộ mockups HTML/CSS tĩnh cho 7 use cases của hệ thống DevJobs, dễ dàng import vào Figma.

## 📁 Danh sách Files

| File | Use Case | Mô tả |
|------|----------|-------|
| `UC01_login.html` | Đăng nhập & Phân quyền | Login form với social login |
| `UC02_search.html` | Tìm kiếm việc làm | Search page với filters và job cards |
| `UC03_job_detail.html` | Chi tiết & Ứng tuyển | Job detail page + Apply form |
| `UC04_company_profile.html` | Quản lý công ty | Company profile management form |
| `UC05_post_job.html` | Đăng tin tuyển dụng | Post job form với skills selector |
| `UC06_applications.html` | Quản lý ứng viên | Applications management table |
| `UC07_admin_approve.html` | Duyệt tin (Admin) | Admin panel để duyệt jobs |

## 🎨 Design System

### Colors
- **Primary**: `#667eea` (Indigo)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)
- **Text**: `#1f2937` (Gray 900)
- **Background**: `#f3f4f6` (Gray 100)

### Typography
- Font Family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`
- Font Sizes: 13px - 32px

### Components
- Buttons với hover effects
- Form inputs với focus states
- Cards với shadows
- Tags/Badges
- Tables với zebra stripes

## 🚀 Cách sử dụng

### 1. Xem trực tiếp trong browser

```bash
# Mở bất kỳ file nào trong browser
# Windows: Double-click file hoặc
start UC01_login.html
```

### 2. Import vào Figma

**Option A: Sử dụng plugin "HTML to Design"**

1. Mở Figma
2. Plugins → Browse plugins → Tìm "HTML to Design"
3. Cài đặt plugin
4. Mở file HTML bằng text editor, copy toàn bộ code
5. Paste vào plugin "HTML to Design"
6. Click "Import"

**Option B: Sử dụng html.to.design (Online)**

1. Truy cập https://html.to.design/
2. Upload file HTML hoặc paste code
3. Convert sang Figma
4. Import file Figma vào project của bạn

**Option C: Screenshot (Đơn giản nhất)**

1. Mở file HTML trong browser
2. Screenshot từng section
3. Import ảnh vào Figma
4. Sử dụng làm reference để design

### 3. Chỉnh sửa

Mỗi file là standalone HTML với inline CSS. Bạn có thể:
- Sửa content trực tiếp trong HTML
- Thay đổi colors trong CSS (tìm `#667eea` để replace primary color)
- Thêm/bớt sections

## 📸 Screenshots

Mở từng file trong browser để xem preview:

- **UC01**: Màn hình login với gradient background
- **UC02**: Trang search với sidebar filters
- **UC03**: Chi tiết job và form ứng tuyển
- **UC04**: Form quản lý thông tin công ty
- **UC05**: Form đăng tin tuyển dụng
- **UC06**: Bảng quản lý hồ sơ ứng viên
- **UC07**: Admin panel duyệt tin

## 🛠️ Customization

### Đổi màu chính (Primary Color)

Find & Replace trong mỗi file:
- `#667eea` → Màu mới (VD: `#4f46e5`)
- `#5568d3` → Darker variant

### Đổi font

Thay đổi trong CSS:
```css
font-family: 'Inter', sans-serif;
```

### Thêm logo công ty

Trong các file, tìm:
```html
<div class="logo">DevJobs</div>
```

Thay bằng:
```html
<div class="logo">
    <img src="your-logo.png" alt="Logo" height="32">
</div>
```

## ✅ Checklist Export

Trước khi export sang Figma:

- [ ] Kiểm tra tất cả 7 files mở được trong browser
- [ ] Xác nhận design đúng ý tưởng
- [ ] Test responsive (resize browser window)
- [ ] Chọn phương án import Figma (plugin hoặc screenshot)
- [ ] Backup files HTML (copy sang folder khác)

## 📌 Lưu ý

- **Không có JavaScript**: Các mockups này chỉ là static HTML/CSS
- **Không có interaction**: Buttons, forms không hoạt động
- **Chỉ để design**: Mục đích là wireframe/mockup cho Figma
- **Mobile responsive**: CSS có responsive, nhưng chưa optimize hoàn toàn

## 🎯 Next Steps

Sau khi import vào Figma:

1. **Refine Design**: Điều chỉnh spacing, colors, typography
2. **Add Components**: Tạo Figma components từ các elements lặp lại
3. **Create Variants**: Button states, input states, etc.
4. **Prototype**: Tạo interactive prototype trong Figma
5. **Handoff**: Export specs cho developers

## 💡 Tips

- Sử dụng Figma Inspect để xem CSS values
- Tạo Design System trong Figma từ colors/fonts đã dùng
- Export assets (icons, logos) từ HTML nếu cần
- Giữ HTML files để reference sau này

## 📞 Support

Nếu gặp vấn đề:
- Kiểm tra file HTML mở được trong browser chưa
- Đảm bảo HTML valid (không có lỗi syntax)
- Thử plugin Figma khác nếu một plugin không work
- Screenshot + import manual là phương án cuối cùng

---

**Created**: 04/02/2024  
**Version**: 1.0  
**Tech Stack**: HTML5 + CSS3 (Vanilla)
