# CÁCH IMPORT ERD VÀO LUCIDCHART

## ✅ File mới: ERD_drawio.xml

Đã tạo file **ERD_drawio.xml** theo đúng format Draw.io để import vào Lucidchart!

---

## 🚀 CÁCH IMPORT VÀO LUCIDCHART

### **Bước 1: Import file**
1. Mở Lucidchart: https://www.lucidchart.com
2. Đăng nhập tài khoản
3. Click **"+ New"** → **"Import"**
4. Chọn **"Lucidchart/draw.io"**
5. Upload file **ERD_drawio.xml**
6. Click **"Import"**

### **Bước 2: Chỉnh sửa**
- Diagram sẽ hiển thị với:
  - 🟦 **Rectangles** = Entities (USERS, COMPANIES, JOBS, APPLICATIONS, SKILLS)
  - 🔵 **Ovals** = Attributes (user_id, email, title...)
  - 🔶 **Diamonds** = Relationships (creates, posts, submits, requires...)
- Kéo thả để sắp xếp lại cho đẹp
- Thêm màu sắc, format text

---

## 📋 DANH SÁCH FILES HIỆN CÓ

| File | Công cụ web | Trạng thái |
|------|-------------|-----------|
| **ERD_drawio.xml** | Lucidchart, Draw.io | ✅ Hoạt động |
| ERD_chen.xml | ERDPlus (có thể không work) | ⚠️ Generic XML |
| ERD_chen.csv | Draw.io CSV import | ✅ Hoạt động |
| schema.sql | ERDPlus, MySQL Workbench | ✅ Relational Schema |
| schema.dbml | dbdiagram.io | ✅ Relational Schema |

---

## 💡 TIP

Nếu Lucidchart vẫn không nhận **ERD_drawio.xml**, bạn có thể:

### **Plan B: Import qua Draw.io trước**
1. Mở Draw.io: https://app.diagrams.net
2. **File** → **Open from** → **Device**
3. Chọn **ERD_drawio.xml**
4. Diagram sẽ hiển thị
5. **File** → **Export as** → **XML**
6. Lưu file mới
7. Import file XML này vào Lucidchart

### **Plan C: Dùng SQL (nếu có tài khoản Lucidchart trả phí)**
1. Trong Lucidchart, tạo **ERD** document mới
2. Click **"Import Data"** → **"SQL Script"**
3. Copy nội dung file **schema.sql**
4. Paste và click **"Import"**
5. Lucidchart tự động tạo ERD

---

## 🎯 KHUYẾN NGHỊ

**Nếu Lucidchart không work:**
👉 Dùng **Draw.io** (https://app.diagrams.net)
- Miễn phí 100%
- Import **ERD_drawio.xml** trực tiếp
- Tất cả tính năng giống Lucidchart
- Export PNG/PDF/SVG chất lượng cao

Thử import file **ERD_drawio.xml** vào Lucidchart xem nhé! Nếu vẫn lỗi, hãy dùng Draw.io hoặc cho tôi biết để tôi thử cách khác! 🎨
