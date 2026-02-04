# UC03: Ứng tuyển công việc (Apply Job)

## Mô tả
Ứng viên nộp hồ sơ ứng tuyển cho công việc, bao gồm tải CV và viết thư giới thiệu. Hệ thống cho phép cập nhật hồ sơ nếu chưa được xử lý.

## Actor
Candidate (đã đăng nhập)

## Tiền điều kiện
- Candidate đã đăng nhập
- Đang xem Job có status = 'active'

## Hậu điều kiện
- Hồ sơ lưu vào bảng Applications
- CV upload lên cloud storage (Cloudinary/S3)

---

## Luồng chính

1. Tại trang chi tiết Job, Candidate nhấn **"Apply Now"**
2. Hệ thống hiển thị Form nộp hồ sơ
3. Candidate tải file CV (PDF) và viết Cover Letter
4. Candidate nhấn **"Nộp hồ sơ"**
5. Hệ thống kiểm tra định dạng (PDF) và dung lượng (<5MB)
6. Hệ thống kiểm tra Candidate đã nộp đơn chưa
7. Hệ thống upload CV lên cloud storage
8. Hệ thống lưu vào Applications (job_id, candidate_id, cv_url, cover_letter, status='pending')
9. Thông báo: **"Nộp hồ sơ thành công!"**

---

## Luồng thay thế

### A1: Cập nhật hồ sơ
Điều kiện: Đã nộp, status = 'pending'

1. Candidate vào lại trang Job
2. Hệ thống hiển thị "Đã ứng tuyển" + nút **"Cập nhật hồ sơ"**
3. Candidate nhấn, tải CV mới
4. Hệ thống upload CV mới, xóa CV cũ
5. Hệ thống cập nhật Applications (cv_url mới, applied_at = NOW())
6. Thông báo: **"Cập nhật thành công"**

---

## Ngoại lệ

### E1: File không hợp lệ
- File không phải PDF hoặc > 5MB
- Hệ thống báo lỗi, yêu cầu tải lại

### E2: Không thể cập nhật
- Status ≠ 'pending' (đang xử lý)
- Ẩn nút "Cập nhật", hiển thị: **"Hồ sơ đang được xem xét"**

### E3: Đã nộp đơn
- Phát hiện duplicate (job_id, candidate_id)
- Hiển thị: **"Bạn đã nộp hồ sơ"**, chuyển sang cập nhật
