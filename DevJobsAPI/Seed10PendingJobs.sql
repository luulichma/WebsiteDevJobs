DECLARE @AdminId INT;
SELECT TOP 1 @AdminId = user_id FROM Users WHERE role = 'admin';

DECLARE @Company1Id INT, @Recruiter1Id INT;
SELECT TOP 1 @Company1Id = company_id, @Recruiter1Id = created_by FROM Companies;

IF @Company1Id IS NULL
BEGIN
    PRINT 'ERROR: Không tìm thấy Công ty nào trong database để đăng bài.';
    RETURN;
END

INSERT INTO Jobs (company_id, recruiter_id, title, description, requirements, salary_min, salary_max, location, job_type, status, expiry_date, created_at, approved_by)
VALUES 
(@Company1Id, @Recruiter1Id, N'Senior ASP.NET Core Developer', N'Thiết kế và xây dựng các APIs có hiệu suất cao, sẵn sàng xử lý hàng ngàn request mỗi giây.', N'- 3+ năm kinh nghiệm ASP.NET Core\n- Hiểu biết về Entity Framework Core, SQL Server\n- Ưu tiên biết làm dự án liên quan đến Microservices', 1200, 2500, N'Hà Nội', 'full-time', 'pending', DATEADD(day, 30, GETDATE()), GETDATE(), NULL),

(@Company1Id, @Recruiter1Id, N'ReactJS Frontend Developer', N'Phát triển UI/UX hiện đại cho hệ thống quản lý nhân sự. Môi trường làm việc cởi mở.', N'- Sử dụng thành thạo ReactJS (Hooks, Redux / Context)\n- Hiểu biết REST API\n- Tư duy sáng tạo, chủ động', 800, 1500, N'Đà Nẵng', 'full-time', 'pending', DATEADD(day, 25, GETDATE()), GETDATE(), NULL),

(@Company1Id, @Recruiter1Id, N'UI/UX Designer', N'Chịu trách nhiệm thiết kế giao diện cho web và ứng dụng mobile.', N'- Sử dụng Figma hoặc Adobe XD\n- Hiểu về thiết kế User-centric\n- Giao tiếp tốt', 700, 1200, N'Hồ Chí Minh', 'full-time', 'pending', DATEADD(day, 45, GETDATE()), GETDATE(), NULL),

(@Company1Id, @Recruiter1Id, N'DevOps Engineer (AWS/Docker)', N'Quản trị và duy trì hện thống cloud, đảm bảo tỷ lệ lỗi (downtime) ở mức cực nhỏ.', N'- Thành thạo AWS, Docker, Kubernetes\n- Viết script CI/CD tốt', 1500, 3000, N'Hà Nội', 'full-time', 'pending', DATEADD(day, 60, GETDATE()), GETDATE(), NULL),

(@Company1Id, @Recruiter1Id, N'Data Analyst', N'Phân tích dữ liệu người dùng nhằm tối ưu chiến lược kinh doanh.', N'- Thành thạo Excel, SQL\n- Biết sử dụng PowerBI / Tableau', 900, 1800, N'Remote', 'remote', 'pending', DATEADD(day, 15, GETDATE()), GETDATE(), NULL),

(@Company1Id, @Recruiter1Id, N'Mobile App Developer (Flutter)', N'Phát triển ứng dụng Mobile cross-platform cho start-up.', N'- Có kinh nghiệm đẩy app lên Store\n- Hiểu State Management trong Flutter (Bloc/Provider)', 1000, 2200, N'Đà Nẵng', 'full-time', 'pending', DATEADD(day, 20, GETDATE()), GETDATE(), NULL),

(@Company1Id, @Recruiter1Id, N'QA/QC Tester (Manual & Auto)', N'Kiểm thử ứng dụng định kỳ, hỗ trợ ghi nhận và báo cáo lỗi.', N'- Kinh nghiệm Manual Test 2 năm\n- Biết thêm Automation (Selenium) là lợi thế lớn', 600, 1100, N'Hà Nội', 'full-time', 'pending', DATEADD(day, 30, GETDATE()), GETDATE(), NULL),

(@Company1Id, @Recruiter1Id, N'Fullstack JS Developer (MERN)', N'Đảm nhận cả vai trò front-end và back-end sử dụng MERN stack.', N'- Nắm vững NodeJS, Express JS, MongoDB và ReactJS\n- Tư duy logic tốt', 1100, 2600, N'Hồ Chí Minh', 'full-time', 'pending', DATEADD(day, 35, GETDATE()), GETDATE(), NULL),

(@Company1Id, @Recruiter1Id, N'Business Analyst (IT BA)', N'Làm cầu nối giữa khách hàng và team kỹ thuật.', N'- Có chứng chỉ BA\n- Tiếng anh giao tiếp cực tốt', 800, 1700, N'Hà Nội', 'full-time', 'pending', DATEADD(day, 10, GETDATE()), GETDATE(), NULL),

(@Company1Id, @Recruiter1Id, N'Project Manager (Scrum Master)', N'Quản lý tiến độ dự án theo quy trình Agile/Scrum.', N'- Giao tiếp, giải quyết vấn đề hiệu quả\n- >3 năm quản lý', 1800, 3500, N'Hồ Chí Minh', 'full-time', 'pending', DATEADD(day, 50, GETDATE()), GETDATE(), NULL);
PRINT 'XONG';
