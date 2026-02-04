# UC10: Quản lý người dùng (Admin)

## Mô tả
Admin xem danh sách user và xóa tài khoản vi phạm.

## Actor
Admin (đã đăng nhập)

## Tiền điều kiện
- Admin đã đăng nhập

## Hậu điều kiện
- User bị xóa khỏi hệ thống

---

## Luồng chính

1. Admin truy cập "Quản lý người dùng"
2. Hệ thống hiển thị danh sách users (ID, Tên, Email, Vai trò, Trạng thái)
3. Admin tìm kiếm/lọc user
4. Admin chọn user vi phạm, nhấn **"Xóa"**
5. Hệ thống yêu cầu xác nhận: "Nhập email để xóa"
6. Admin nhập email
7. Hệ thống xóa user
8. Thông báo: **"Đã xóa user"**

---

## Ngoại lệ

**E1: Email xác nhận sai**
- Không cho phép xóa, yêu cầu nhập lại
