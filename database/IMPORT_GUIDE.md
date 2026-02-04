# HƯỚNG DẪN IMPORT ERD VÀO CÁC CÔNG CỤ TRỰC TUYẾN

## 🎯 Các công cụ vẽ ERD online phổ biến

### 1. **dbdiagram.io** ⭐ KHUYẾN NGHỊ
**Link:** https://dbdiagram.io

**Ưu điểm:**
- ✅ Miễn phí, không cần đăng ký
- ✅ Hỗ trợ DBML format (rất đơn giản)
- ✅ Giao diện đẹp, export PNG/PDF/SQL
- ✅ Chia sẻ diagram dễ dàng

**Cách import:**
1. Truy cập https://dbdiagram.io
2. Click "Go to App"
3. Xóa code mẫu
4. Copy toàn bộ nội dung file **`schema.dbml`**
5. Paste vào editor
6. Diagram tự động hiển thị bên phải!

**Export:**
- Click "Export" → chọn PNG/PDF/SQL/DBML

---

### 2. **ERDPlus** (erdplus.com)
**Link:** https://erdplus.com

**Ưu điểm:**
- ✅ Chuyên về ERD
- ✅ Hỗ trợ import SQL
- ✅ Convert sang Relational Schema tự động

**Cách import:**
1. Truy cập https://erdplus.com
2. Click "ER Diagram" hoặc "Relational Schema"
3. Click menu ☰ → "Convert" → "ER to Relational" hoặc "Import from SQL"
4. Copy nội dung file **`schema.sql`**
5. Paste vào và click "Convert"

**Lưu ý:** ERDPlus có thể cần chỉnh sửa thủ công một chút do khác biệt SQL dialect

---

### 3. **Draw.io / Diagrams.net**
**Link:** https://app.diagrams.net

**Ưu điểm:**
- ✅ Hoàn toàn miễn phí
- ✅ Không cần đăng ký
- ✅ Lưu trữ trên Google Drive/OneDrive
- ✅ Rất linh hoạt

**Cách làm:**
1. Truy cập https://app.diagrams.net
2. Chọn "Create New Diagram"
3. Chọn template "Entity Relation"
4. Kéo thả các bảng từ sidebar
5. Tạo relationships bằng cách kéo nối

**Import SQL (qua plugin):**
- Không hỗ trợ import SQL trực tiếp
- Cần vẽ thủ công hoặc dùng plugin third-party

---

### 4. **MySQL Workbench** (Desktop app)
**Link:** https://www.mysql.com/products/workbench/

**Ưu điểm:**
- ✅ Công cụ chuyên nghiệp
- ✅ Import SQL script hoàn hảo
- ✅ Reverse Engineering từ database thật
- ✅ Export PNG/PDF chất lượng cao

**Cách import:**
1. Tải và cài MySQL Workbench
2. Mở Workbench → "File" → "Open SQL Script"
3. Chọn file **`schema.sql`**
4. Chạy script (⚡ Execute)
5. Click "Database" → "Reverse Engineer"
6. Chọn connection (hoặc tạo local database)
7. ERD tự động được tạo!

---

### 5. **Lucidchart**
**Link:** https://www.lucidchart.com

**Ưu điểm:**
- ✅ Giao diện đẹp, chuyên nghiệp
- ✅ Import SQL script
- ✅ Collaboration tốt

**Nhược điểm:**
- ❌ Cần đăng ký (free plan có giới hạn)

**Cách import:**
1. Đăng ký tài khoản miễn phí
2. Tạo "ERD" document mới
3. Click "Import Data" → "Import from SQL"
4. Paste nội dung file **`schema.sql`**
5. Click "Import"

---

### 6. **QuickDBD** (quickdatabasediagrams.com)
**Link:** https://www.quickdatabasediagrams.com

**Ưu điểm:**
- ✅ Rất nhanh
- ✅ Syntax đơn giản
- ✅ Export SQL/PNG

**Syntax tương tự DBML:**
```
Users
-
user_id int PK
email varchar(255) UK
role varchar(20)

Jobs
-
job_id int PK
company_id int FK >- Companies.company_id
```

---

## 📁 Files đã tạo sẵn

| File | Format | Dùng cho công cụ |
|------|--------|------------------|
| **schema.sql** | SQL DDL | ERDPlus, MySQL Workbench, Lucidchart, pgAdmin |
| **schema.dbml** | DBML | **dbdiagram.io** ⭐ |
| **ERD_diagram.mmd** | Mermaid | Xem trực tiếp, không cần import |
| **ERD_diagram.png** | PNG | Xem, in, chèn vào báo cáo |

---

## 🎯 Khuyến nghị của tôi

### **Nếu muốn NHANH và ĐƠN GIẢN:**
👉 Dùng **dbdiagram.io** + file **schema.dbml**
- Mở trình duyệt → Copy/Paste → Xong!
- Không cần cài đặt gì
- Chỉnh sửa diagram bằng code (rất nhanh)

### **Nếu muốn CHỈNH SỬA CHI TIẾT:**
👉 Dùng **Draw.io**
- Hoàn toàn miễn phí
- Linh hoạt nhất
- Lưu trữ cloud

### **Nếu CẦN CHUYÊN NGHIỆP:**
👉 Dùng **MySQL Workbench**
- Import SQL script hoàn hảo
- Tự động generate diagram
- Export chất lượng cao

---

## 🚀 Demo nhanh với dbdiagram.io

1. Mở https://dbdiagram.io
2. Copy toàn bộ file **schema.dbml**
3. Paste vào editor
4. Click "Auto Arrange" để sắp xếp đẹp
5. Click "Export" → PNG

✅ **XONG! Diagram đẹp sẵn sàng dùng!**

---

## 💡 Tips

- **dbdiagram.io** tốt nhất cho presentation và báo cáo nhanh
- **MySQL Workbench** tốt nhất cho development thực tế
- **Draw.io** tốt nhất khi cần tùy biến cao
- **ERDPlus** tốt cho học thuật (chuyển đổi ER ↔ Relational)

Nếu bạn muốn chỉnh sửa nhiều, tôi khuyến nghị **dbdiagram.io** vì:
- Syntax đơn giản (giống code)
- Thay đổi nhanh (edit text → diagram tự update)
- Không cần kéo thả phức tạp
