# PHÂN TÍCH THỰC THỂ VÀ QUAN HỆ - DEVJOBS

## I. CÁC THỰC THỂ CHÍNH (ENTITIES)

### 1. Users (Người dùng)
**Mô tả:** Lưu trữ tài khoản tất cả người dùng (Candidates, Recruiters, Admins)

**Thuộc tính:**
- user_id (PK) - INT, AUTO_INCREMENT
- email - VARCHAR(255), UNIQUE, NOT NULL
- password_hash - VARCHAR(255), NOT NULL
- full_name - VARCHAR(255), NOT NULL
- phone - VARCHAR(20)
- role - ENUM('candidate', 'recruiter', 'admin'), NOT NULL
- status - ENUM('active', 'suspended', 'deleted'), DEFAULT 'active'
- cv_url - VARCHAR(500) - chỉ cho Candidate
- skills - TEXT - JSON array kỹ năng
- created_at - DATETIME
- updated_at - DATETIME
- last_login - DATETIME

---

### 2. Companies (Công ty)
**Mô tả:** Thông tin công ty của Recruiter

**Thuộc tính:**
- company_id (PK) - INT, AUTO_INCREMENT
- company_name - VARCHAR(255), NOT NULL
- description - TEXT
- website - VARCHAR(255)
- logo_url - VARCHAR(500)
- address - VARCHAR(500)
- status - ENUM('pending', 'active', 'suspended'), DEFAULT 'pending'
- created_by (FK) - INT - user_id của Recruiter
- created_at - DATETIME

---

### 3. Jobs (Tin tuyển dụng)
**Mô tả:** Tin tuyển dụng do Recruiter đăng

**Thuộc tính:**
- job_id (PK) - INT, AUTO_INCREMENT
- company_id (FK) - INT, NOT NULL
- recruiter_id (FK) - INT, NOT NULL
- title - VARCHAR(255), NOT NULL
- description - TEXT, NOT NULL
- requirements - TEXT
- salary_min - DECIMAL(10,2)
- salary_max - DECIMAL(10,2)
- location - VARCHAR(255)
- job_type - ENUM('full-time', 'part-time', 'remote', 'contract')
- status - ENUM('pending', 'active', 'closed', 'rejected', 'expired'), DEFAULT 'pending'
- expiry_date - DATE
- approved_by (FK) - INT - user_id của Admin
- created_at - DATETIME

---

### 4. Applications (Đơn ứng tuyển)
**Mô tả:** Hồ sơ ứng tuyển của Candidate

**Thuộc tính:**
- application_id (PK) - INT, AUTO_INCREMENT
- job_id (FK) - INT, NOT NULL
- candidate_id (FK) - INT, NOT NULL
- cv_url - VARCHAR(500), NOT NULL
- cover_letter - TEXT
- status - ENUM('pending', 'viewed', 'shortlisted', 'interview', 'accepted', 'rejected'), DEFAULT 'pending'
- applied_at - DATETIME
- reviewed_by (FK) - INT - user_id của Recruiter

**Unique:** (job_id, candidate_id) - 1 Candidate chỉ nộp 1 lần/job

---

### 5. Skills (Kỹ năng)
**Mô tả:** Danh sách kỹ năng trong hệ thống

**Thuộc tính:**
- skill_id (PK) - INT, AUTO_INCREMENT
- skill_name - VARCHAR(100), UNIQUE, NOT NULL
- category - VARCHAR(50)
- created_at - DATETIME

---

### 6. Job_Skills (Quan hệ Jobs ↔ Skills)
**Mô tả:** Liên kết Jobs và Skills (Many-to-Many)

**Thuộc tính:**
- job_id (PK, FK) - INT
- skill_id (PK, FK) - INT

**Composite PK:** (job_id, skill_id)

---

## II. CÁC QUAN HỆ (RELATIONSHIPS)

### 1. Users → Companies (1-N)
- Một Recruiter quản lý nhiều công ty
- FK: Companies.created_by → Users.user_id
- ON DELETE: SET NULL

### 2. Companies → Jobs (1-N)
- Một công ty đăng nhiều jobs
- FK: Jobs.company_id → Companies.company_id
- ON DELETE: CASCADE

### 3. Users (Recruiter) → Jobs (1-N)
- Một Recruiter đăng nhiều jobs
- FK: Jobs.recruiter_id → Users.user_id
- ON DELETE: SET NULL

### 4. Jobs → Applications (1-N)
- Một job nhận nhiều applications
- FK: Applications.job_id → Jobs.job_id
- ON DELETE: CASCADE

### 5. Users (Candidate) → Applications (1-N)
- Một Candidate nộp nhiều applications
- FK: Applications.candidate_id → Users.user_id
- ON DELETE: CASCADE

### 6. Jobs ↔ Skills (M-N)
- Many-to-Many qua Job_Skills
- FK: Job_Skills.job_id → Jobs.job_id (CASCADE)
- FK: Job_Skills.skill_id → Skills.skill_id (CASCADE)

### 7. Users (Admin) → Jobs (1-N)
- Admin duyệt jobs
- FK: Jobs.approved_by → Users.user_id
- ON DELETE: SET NULL

### 8. Users (Recruiter) → Applications (1-N)
- Recruiter xem xét applications
- FK: Applications.reviewed_by → Users.user_id
- ON DELETE: SET NULL

---

## III. CONSTRAINTS & INDEXES

### Unique Constraints:
1. Users.email - UNIQUE
2. Skills.skill_name - UNIQUE
3. (Applications.job_id, Applications.candidate_id) - UNIQUE

### Indexes:
1. Users(email) - login nhanh
2. Users(role, status) - filter users
3. Jobs(status, expiry_date) - tìm jobs active
4. Jobs(company_id) - jobs của company
5. Applications(candidate_id) - lịch sử ứng tuyển
6. Applications(job_id) - ứng viên của job

### Check Constraints:
1. Jobs.salary_min <= Jobs.salary_max
2. Users.role IN ('candidate', 'recruiter', 'admin')

---

## IV. MAPPING USE CASES

### UC01: Login
- Tables: Users
- Query: SELECT WHERE email = ?

### UC02: Search Jobs
- Tables: Jobs, Companies, Skills, Job_Skills
- Query: JOIN để tìm kiếm

### UC03: Apply Job
- Tables: Applications, Jobs, Users
- Query: INSERT Applications

### UC04: Manage Profile
- Tables: Users
- Query: UPDATE Users

### UC05: Manage Company
- Tables: Companies, Users
- Query: INSERT/UPDATE Companies

### UC06: Post Job
- Tables: Jobs, Job_Skills, Skills
- Query: INSERT Jobs + Job_Skills

### UC07: Manage Applications
- Tables: Applications, Jobs, Users
- Query: SELECT Applications JOIN

### UC08: Manage Job Posts
- Tables: Jobs
- Query: SELECT/UPDATE/DELETE Jobs

### UC09: Approve Job
- Tables: Jobs
- Query: UPDATE Jobs SET status, approved_by

### UC10: Manage Users
- Tables: Users, Applications, Jobs
- Query: SELECT/UPDATE Users

---

## V. KẾT LUẬN

**Tổng số bảng:** 6 bảng cốt lõi
- 5 bảng thực thể: Users, Companies, Jobs, Applications, Skills
- 1 bảng quan hệ: Job_Skills (M-N)

**Thiết kế:**
- ✅ Third Normal Form (3NF)
- ✅ Foreign Key Constraints
- ✅ Unique Constraints
- ✅ Indexes cho performance
- ✅ Tối giản, dễ bảo trì
