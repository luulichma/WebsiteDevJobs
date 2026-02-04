# HƯỚNG DẪN SỬ DỤNG DIAGRAMS TÁCH NHỎ

## 📌 Lý do tách diagram

Các file `UC08_ManageJobPosts.mmd` và `UC10_ManageUsers.mmd` gốc có quá nhiều luồng chi tiết, khiến ảnh export bị quá to và khó đọc. Do đó, các diagram này đã được **tách thành các file nhỏ hơn** theo từng luồng con (sub-flow).

---

## 📂 UC08: Quản lý tin tuyển dụng (Manage Job Posts)

### File gốc (có thể giữ lại để tham khảo)
- **`UC08_ManageJobPosts.mmd`** - Diagram đầy đủ tất cả luồng

### Files đã tách:

| File | Mô tả | Nội dung |
|------|-------|----------|
| [`UC08_1_EditJob.mmd`](UC08_1_EditJob.mmd) | **Xem danh sách & Chỉnh sửa** | Main flow: GET danh sách jobs → Click Edit → Update job → Validate → Save |
| [`UC08_2_RenewJob.mmd`](UC08_2_RenewJob.mmd) | **Gia hạn tin** | Alternative flow: Click Renew → Check credits → Extend expiry_date (+30 days) |
| [`UC08_3_CloseJob.mmd`](UC08_3_CloseJob.mmd) | **Đóng tin** | Alternative flow: Click Close → Confirm → Update status = 'Closed' → Email notification |
| [`UC08_4_DeleteJob.mmd`](UC08_4_DeleteJob.mmd) | **Xóa tin** | Alternative flow: Click Delete → Check applications → Soft delete (nếu không có ứng viên) |

### Cách export riêng từng ảnh:

```bash
# Ví dụ export UC08_1_EditJob
python export_mermaid.py mermaid_diagrams/UC08_1_EditJob.mmd

# Export tất cả UC08
python export_mermaid.py mermaid_diagrams/UC08_1_EditJob.mmd
python export_mermaid.py mermaid_diagrams/UC08_2_RenewJob.mmd
python export_mermaid.py mermaid_diagrams/UC08_3_CloseJob.mmd
python export_mermaid.py mermaid_diagrams/UC08_4_DeleteJob.mmd
```

---

## 📂 UC10: Quản lý người dùng (Manage Users)

### File gốc (có thể giữ lại để tham khảo)
- **`UC10_ManageUsers.mmd`** - Diagram đầy đủ tất cả luồng

### Files đã tách:

| File | Mô tả | Nội dung |
|------|-------|----------|
| [`UC10_1_ViewUsers.mmd`](UC10_1_ViewUsers.mmd) | **Xem danh sách & Tìm kiếm** | Main flow: GET users (pagination 50/page) → Search/Filter by role/status |
| [`UC10_2_ViewDetail.mmd`](UC10_2_ViewDetail.mmd) | **Xem chi tiết user** | Flow: Click "Xem chi tiết" → GET user info + history + activities (Applications/Jobs) |
| [`UC10_3_SuspendUser.mmd`](UC10_3_SuspendUser.mmd) | **Khóa tài khoản** | Flow: Click "Khóa" → Nhập lý do → Update status = 'suspended' → Email |
| [`UC10_4_ActivateUser.mmd`](UC10_4_ActivateUser.mmd) | **Mở khóa tài khoản** | Flow: Click "Mở khóa" → Confirm → Update status = 'active' → Email |
| [`UC10_5_EditUser.mmd`](UC10_5_EditUser.mmd) | **Chỉnh sửa thông tin** | Flow: Click "Sửa" → Edit form → Validate email unique → Update → Email |
| [`UC10_6_DeleteUser.mmd`](UC10_6_DeleteUser.mmd) | **Xóa user** | Flow: Click "Xóa" → Check activities → Confirm email → Soft delete |

### Cách export riêng từng ảnh:

```bash
# Export tất cả UC10
python export_mermaid.py mermaid_diagrams/UC10_1_ViewUsers.mmd
python export_mermaid.py mermaid_diagrams/UC10_2_ViewDetail.mmd
python export_mermaid.py mermaid_diagrams/UC10_3_SuspendUser.mmd
python export_mermaid.py mermaid_diagrams/UC10_4_ActivateUser.mmd
python export_mermaid.py mermaid_diagrams/UC10_5_EditUser.mmd
python export_mermaid.py mermaid_diagrams/UC10_6_DeleteUser.mmd
```

---

## 🎯 Lợi ích của việc tách diagram

✅ **Ảnh nhỏ hơn** - Dễ đọc, dễ in, dễ nhúng vào tài liệu  
✅ **Tập trung vào từng luồng** - Dễ hiểu logic, dễ review  
✅ **Dễ maintain** - Sửa 1 luồng không ảnh hưởng các luồng khác  
✅ **Tái sử dụng** - Có thể chọn lọc diagram theo nhu cầu  

---

## 📝 Lưu ý

- **File gốc** (`UC08_ManageJobPosts.mmd`, `UC10_ManageUsers.mmd`) có thể giữ lại hoặc xóa tùy ý
- **Naming convention:** `UC{số}_{số phụ}_{TênLuồng}.mmd`
- Tất cả file đều export được sang PNG bằng script `export_mermaid.py`

---

## 🔄 Auto-export tất cả (script tùy chọn)

Tạo file batch/shell script để export tất cả cùng lúc:

### Windows (batch script)
```batch
@echo off
echo Exporting UC08 diagrams...
python export_mermaid.py mermaid_diagrams/UC08_1_EditJob.mmd
python export_mermaid.py mermaid_diagrams/UC08_2_RenewJob.mmd
python export_mermaid.py mermaid_diagrams/UC08_3_CloseJob.mmd
python export_mermaid.py mermaid_diagrams/UC08_4_DeleteJob.mmd

echo Exporting UC10 diagrams...
python export_mermaid.py mermaid_diagrams/UC10_1_ViewUsers.mmd
python export_mermaid.py mermaid_diagrams/UC10_2_ViewDetail.mmd
python export_mermaid.py mermaid_diagrams/UC10_3_SuspendUser.mmd
python export_mermaid.py mermaid_diagrams/UC10_4_ActivateUser.mmd
python export_mermaid.py mermaid_diagrams/UC10_5_EditUser.mmd
python export_mermaid.py mermaid_diagrams/UC10_6_DeleteUser.mmd

echo Done!
pause
```

### Linux/Mac (bash script)
```bash
#!/bin/bash
echo "Exporting UC08 diagrams..."
for file in UC08_*.mmd; do
    python export_mermaid.py "mermaid_diagrams/$file"
done

echo "Exporting UC10 diagrams..."
for file in UC10_*.mmd; do
    python export_mermaid.py "mermaid_diagrams/$file"
done

echo "Done!"
```
