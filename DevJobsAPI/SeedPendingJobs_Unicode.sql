DECLARE @Company1Id INT, @Recruiter1Id INT;
SELECT TOP 1 @Company1Id = company_id, @Recruiter1Id = created_by FROM Companies;

IF @Company1Id IS NOT NULL
BEGIN
    INSERT INTO Jobs (company_id, recruiter_id, title, description, requirements, salary_min, salary_max, location, job_type, status, expiry_date, created_at)
    VALUES 
    (@Company1Id, @Recruiter1Id, N'Lập trình viên .NET Core (Senior)', N'Thiết kế và xây dựng các APIs có hiệu suất cao.', N'- 3+ năm kinh nghiệm ASP.NET Core\n- Hiểu biết về SQL Server', 1200, 2500, N'Hà Nội', 'full-time', 'pending', DATEADD(day, 30, GETDATE()), GETDATE()),
    (@Company1Id, @Recruiter1Id, N'Frontend Developer (ReactJS)', N'Phát triển UI/UX hiện đại cho hệ thống quản lý.', N'- Sử dụng thành thạo ReactJS\n- Hiểu biết REST API', 800, 1500, N'Đà Nẵng', 'full-time', 'pending', DATEADD(day, 25, GETDATE()), GETDATE()),
    (@Company1Id, @Recruiter1Id, N'UI/UX Designer', N'Chịu trách nhiệm thiết kế giao diện.', N'- Sử dụng Figma\n- Tư duy sáng tạo', 700, 1200, N'Hồ Chí Minh', 'full-time', 'pending', DATEADD(day, 45, GETDATE()), GETDATE()),
    (@Company1Id, @Recruiter1Id, N'DevOps Engineer', N'Quản trị hệ thống cloud AWS.', N'- Thành thạo Docker, K8s', 1500, 3000, N'Hà Nội', 'full-time', 'pending', DATEADD(day, 60, GETDATE()), GETDATE()),
    (@Company1Id, @Recruiter1Id, N'Data Analyst', N'Phân tích dữ liệu người dùng.', N'- Thành thạo SQL, PowerBI', 900, 1800, N'Remote', 'remote', 'pending', DATEADD(day, 15, GETDATE()), GETDATE()),
    (@Company1Id, @Recruiter1Id, N'Mobile Developer (Flutter)', N'Phát triển ứng dụng Mobile.', N'- Kinh nghiệm Flutter 2 năm', 1000, 2200, N'Đà Nẵng', 'full-time', 'pending', DATEADD(day, 20, GETDATE()), GETDATE()),
    (@Company1Id, @Recruiter1Id, N'QA Tester', N'Kiểm thử ứng dụng.', N'- Kinh nghiệm Automation Test', 600, 1100, N'Hà Nội', 'full-time', 'pending', DATEADD(day, 30, GETDATE()), GETDATE()),
    (@Company1Id, @Recruiter1Id, N'Business Analyst', N'Làm cầu nối khách hàng và kỹ thuật.', N'- Kỹ năng giao tiếp tốt', 800, 1700, N'Hà Nội', 'full-time', 'pending', DATEADD(day, 10, GETDATE()), GETDATE()),
    (@Company1Id, @Recruiter1Id, N'NodeJS Backend Developer', N'Phát triển server-side với NodeJS.', N'- Thành thạo Express, MongoDB', 1100, 2400, N'Hồ Chí Minh', 'full-time', 'pending', DATEADD(day, 35, GETDATE()), GETDATE()),
    (@Company1Id, @Recruiter1Id, N'Project Manager', N'Quản lý tiến độ dự án.', N'- Kinh nghiệm Agile/Scrum', 1800, 3500, N'Hồ Chí Minh', 'full-time', 'pending', DATEADD(day, 50, GETDATE()), GETDATE());
END
