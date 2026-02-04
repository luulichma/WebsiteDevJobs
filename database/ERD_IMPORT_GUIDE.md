# HƯỚNG DẪN IMPORT ERD (CHEN NOTATION) LÊN WEB

## 📁 Files đã tạo để import ERD

### 1. **ERD_chen.xml** - XML Format
- **Dùng cho:** ERDPlus, Draw.io, Lucidchart
- **Định dạng:** XML chuẩn với entities, attributes, relationships

### 2. **ERD_chen.csv** - CSV Format  
- **Dùng cho:** Draw.io, Google Sheets → Draw.io
- **Định dạng:** 2 bảng - Entities/Attributes và Relationships

### 3. **ERD_diagram.mmd** + **ERD_diagram.png**
- **Dùng cho:** Tham khảo trực quan
- **Note:** Đây là Mermaid, không import được vào ERD tools

---

## 🎯 CÁCH IMPORT VÀO CÁC CÔNG CỤ WEB

### 1. **ERDPlus.com** ⭐ KHUYẾN NGHỊ CHO CHEN NOTATION

**Cách import XML:**
1. Truy cập: https://erdplus.com
2. Click **"ER Diagram"** để tạo diagram mới
3. Click menu **☰** (góc trên bên trái)
4. Chọn **"Open"** → **"Import"**
5. Chọn file **ERD_chen.xml**
6. Click **"Import"**

**Lưu ý:** ERDPlus có thể yêu cầu tự vẽ vì XML format của mỗi tool khác nhau.

**Cách vẽ thủ công (nếu import không được):**
1. Mở ERDPlus → ER Diagram
2. Kéo **Rectangle** từ toolbar → tạo Entity (ví dụ: USERS)
3. Double-click Entity → đặt tên
4. Kéo **Oval** → nối vào Entity → tạo Attribute
5. Kéo **Diamond** → tạo Relationship
6. Nối Relationship với các Entity
7. Click Relationship → chọn Cardinality (1:1, 1:N, M:N)

**Export:**
- Menu → Export → PNG/PDF/SQL

---

### 2. **Draw.io / Diagrams.net**

**Link:** https://app.diagrams.net

**Cách import XML:**
1. Mở Draw.io
2. Click **"File"** → **"Import from"** → **"XML"**
3. Chọn file **ERD_chen.xml**
4. Click **"Import"**

**Cách import CSV:**
1. Click **"Arrange"** → **"Insert"** → **"Advanced"** → **"CSV"**
2. Copy nội dung file **ERD_chen.csv**
3. Paste vào dialog
4. Click **"Import"**

**Cách vẽ thủ công:**
1. Mở Draw.io → chọn template **"Entity Relation"**
2. Từ sidebar bên trái, kéo:
   - **Rectangle** cho Entities
   - **Ellipse** cho Attributes
   - **Diamond** cho Relationships
3. Nối các hình bằng connector
4. Format màu sắc theo ý muốn

---

### 3. **Lucidchart.com**

**Link:** https://www.lucidchart.com (cần đăng ký)

**Cách import:**
1. Tạo tài khoản miễn phí
2. Tạo **"Blank ERD"** document
3. Click **"Import Data"**
4. Chọn **"Entity Relationship"**
5. Upload file **ERD_chen.xml** hoặc paste CSV
6. Click **"Import"**

---

### 4. **Creately.com**

**Link:** https://creately.com

**Cách làm:**
1. Đăng ký tài khoản
2. Tạo **"ER Diagram"** mới
3. Chọn template có sẵn hoặc vẽ từ đầu
4. Kéo thả:
   - Entity (rectangle)
   - Attribute (oval)
   - Relationship (diamond)

---

### 5. **Visual Paradigm Online**

**Link:** https://online.visual-paradigm.com

**Cách import:**
1. Tạo **"ERD"** project
2. Click **"Import"** → **"From Database"** hoặc **"From SQL"**
3. Paste nội dung file **schema.sql**
4. Tool tự động generate ERD

---

## 💡 KHUYẾN NGHỊ

### **Nếu muốn ERD chuẩn Chen notation:**
👉 Dùng **ERDPlus** và vẽ thủ công
- Chuyên về ERD học thuật
- Hỗ trợ đầy đủ Chen notation
- Convert ER ↔ Relational tự động

### **Nếu muốn linh hoạt và đẹp:**
👉 Dùng **Draw.io**
- Miễn phí 100%
- Tùy chỉnh tối đa
- Export nhiều format

### **Nếu có database thật:**
👉 Dùng **MySQL Workbench** reverse engineering
- Tự động generate từ database
- Chuyên nghiệp nhất

---

## 🖼️ TEMPLATE VẼ NHANH (Draw.io)

**Copy template này vào Draw.io:**

```xml
<mxGraphModel>
  <!-- Entity: Users -->
  <mxCell id="users" value="USERS" style="rounded=0;whiteSpace=wrap;" vertex="1">
    <mxGeometry x="100" y="100" width="120" height="60"/>
  </mxCell>
  <!-- Attribute: user_id -->
  <mxCell id="user_id" value="user_id" style="ellipse;whiteSpace=wrap;fillColor=#ffcccc;" vertex="1">
    <mxGeometry x="20" y="80" width="60" height="40"/>
  </mxCell>
</mxGraphModel>
```

---

## 📋 CHECKLIST TỰ VẼ ERD TRÊN WEB

Nếu bạn quyết định vẽ thủ công:

- [ ] Vào công cụ web (ERDPlus hoặc Draw.io)
- [ ] Tạo 5 **Entities**: USERS, COMPANIES, JOBS, APPLICATIONS, SKILLS
- [ ] Mỗi Entity thêm **Attributes** (theo file entity_analysis.md)
- [ ] Đánh dấu **Primary Key** bằng oval màu đỏ hoặc underline
- [ ] Tạo **Relationships** (diamond):
  - creates: USERS → COMPANIES (1:N)
  - posts: COMPANIES → JOBS (1:N)
  - manages: USERS → JOBS (1:N)
  - receives: JOBS → APPLICATIONS (1:N)
  - submits: USERS → APPLICATIONS (1:N)
  - requires: JOBS ↔ SKILLS (M:N)
  - approves: USERS → JOBS (1:N)
  - reviews: USERS → APPLICATIONS (1:N)
- [ ] Thêm **Cardinality** (1, N, M) trên mỗi line
- [ ] Format màu sắc cho đẹp
- [ ] Export PNG/PDF

---

## ✅ KẾT LUẬN

**File tốt nhất để import:** 
- **ERD_chen.xml** cho ERDPlus/Draw.io
- **ERD_chen.csv** cho công cụ hỗ trợ CSV

**Khuyến nghị:** 
Nếu các file XML/CSV không import được trực tiếp, hãy dùng **Draw.io** hoặc **ERDPlus** vẽ thủ công theo hướng dẫn. Mất ~15-20 phút nhưng kết quả sẽ chuẩn xác nhất!

Đã có file **ERD_diagram.png** sẵn để tham khảo trong khi vẽ! 🎨
