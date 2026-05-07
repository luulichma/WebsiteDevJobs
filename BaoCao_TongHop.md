# Báo Cáo Tổng Hợp: Trí Tuệ Doanh Nghiệp & Tuyển Dụng (DevJobs)

Dự án DevJobs là một hệ thống Website Tuyển Dụng chuyên nghiệp được phát triển để kết nối các nhà tuyển dụng (Recruiters) với ứng viên CNTT (Candidates). Hệ thống gồm 2 thành phần chính: **Frontend (React)** và **Backend (ASP.NET Core API)**.

## 1. Kiến trúc hệ thống
- **Dữ liệu / Backend**: Xây dựng bằng ASP.NET Core API, sử dụng Entity Framework Core để kết nối với SQL Server. Triển khai các pattern RESTful API với Bearer Token (JWT) authorization.
- **Frontend**: Ứng dụng ReactJS hoàn chỉnh, xử lý routing với react-router-dom, quản lý state và xác thực token cục bộ tại trình duyệt, mang đến trải nghiệm UX hiện đại.
- **Tính năng mở rộng**: 
  - Đã tích hợp tính năng **Phân trang (Pagination)** cho khu vực tìm kiếm việc làm lẫn hệ thống quản trị, tối ưu hóa việc hiển thị với hàng nghìn dữ liệu mẫu. 
  - Dashboard hiện đại thống kê CV, trạng thái ứng tuyển và phê duyệt bài viết.

## 2. Trả lời Câu Hỏi Nghiệp Vụ

### Câu hỏi: "Mỗi recruiter có thể đăng tin về nhiều công ty à?"

**Trả lời**: **KHÔNG.**
Theo thiết kế kiến trúc hiện tại của dự án này, một tài khoản `Recruiter` chỉ được quyền thiết lập và tạo Job cho **duy nhất 1 công ty**. 

**Bằng chứng (Từ code thực tế):**
1. Table `Companies` dùng chung user role gắn với `CreatedBy` (là ID của Recruiter).
2. Khi Recruiter vào chức năng tạo hồ sơ công ty (`POST /api/companies`), API sẽ thực hiện check: `var existing = await _db.Companies.AnyAsync(c => c.CreatedBy == CurrentUserId);`. Nếu đã có, hệ thống lập tức chối bỏ việc tạo mới.
3. Khi Recruiter tạo Job (`POST /api/jobs`), hệ thống tự động gán `CompanyId` thuộc về Recruiter đó, không cần Recruiter phải chọn công ty. Do vậy, họ không có quyền tạo Job trên danh nghĩa của một công ty khác.
*Điều này giúp bảo vệ tính xác thực và đơn giản hoá cấu trúc quản lý.*

## 3. Seed Dữ liệu
Hệ thống đã tích hợp REST endpoint `[POST /api/seed/seed-10-jobs]` để tự động sinh 10 bản ghi công việc (Mock Data), giúp dễ dàng tiến hành kiểm nghiệm giao diện và logic phân trang mới tại màn hình Search. 10 bài ứng tuyển này được rải ngẫu nhiên cho các Account Recruiter hiện hành.

---
*Bản báo cáo này được kết xuất qua quá trình xử lý Agentic tự động, định dạng từ `Markdown` sang `PDF` để tiện lưu trữ.*
