# UC10: Quản lý người dùng (Admin)

## Mô tả
Admin quản lý danh sách người dùng (Candidates và Recruiters), có thể xem, tìm kiếm, chỉnh sửa thông tin, khóa/mở khóa và xóa tài khoản.

## Actor
Admin (đã đăng nhập)

## Tiền điều kiện
- Admin đã đăng nhập
- Có quyền truy cập Admin Dashboard

## Hậu điều kiện
- Thông tin/trạng thái người dùng được cập nhật
- Email thông báo gửi đến người dùng bị ảnh hưởng

---

## Luồng chính

1. Admin truy cập "Quản lý người dùng" từ Admin Dashboard
2. Hệ thống hiển thị danh sách người dùng với thông tin:
   - ID, Tên, Email, Vai trò (Candidate/Recruiter)
   - Trạng thái, Ngày đăng ký, Lần đăng nhập cuối
3. Danh sách phân trang (50 users/page)
4. Admin có thể tìm kiếm, lọc theo vai trò/trạng thái
5. Admin chọn user và thực hiện hành động

---

## Các hành động

### 1. Xem chi tiết
- Hiển thị thông tin đầy đủ: thông tin cơ bản, lịch sử đăng nhập
- Nếu Candidate: CV, danh sách đơn ứng tuyển
- Nếu Recruiter: Công ty, danh sách tin đăng

### 2. Chỉnh sửa thông tin
- Sửa: Họ tên, SĐT, Vai trò, Trạng thái
- Validate: Email unique, SĐT hợp lệ
- Gửi email thông báo cho user

### 3. Khóa tài khoản
Điều kiện: User đang "Hoạt động"

- Chọn lý do: Vi phạm chính sách, Spam, Gian lận, Khác
- Cập nhật trạng thái → "Bị khóa"
- Gửi email thông báo kèm lý do
- User không thể đăng nhập

### 4. Mở khóa tài khoản
Điều kiện: User đang "Bị khóa"

- Xác nhận mở khóa
- Cập nhật trạng thái → "Hoạt động"
- Gửi email thông báo

### 5. Xóa người dùng
Điều kiện: User không có hoạt động hoặc đã bị khóa

- Kiểm tra hoạt động (applications/jobs)
- Nếu có hoạt động → từ chối, đề xuất "Khóa"
- Nếu không → yêu cầu nhập email xác nhận
- Xóa khỏi hệ thống (soft delete)

---

## Ngoại lệ

**E1: Không có quyền**
- Hệ thống từ chối, chuyển về trang chủ

**E2: Không thể xóa user có hoạt động**
- Hiển thị thông báo
- Đề xuất "Khóa" thay vì "Xóa"

**E3: Email đã tồn tại**
- Hiển thị lỗi khi sửa email

---

## Ghi chú

- Hành động nguy hiểm yêu cầu xác nhận bổ sung
- Ưu tiên soft delete thay vì xóa vĩnh viễn
- Email phải unique trong hệ thống
