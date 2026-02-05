# PHÂN TÍCH DATABASE - DEVJOBS

## I. THỰC THỂ (ENTITIES)

### 1. USERS (Người dùng)
**Mô tả:** Lưu tài khoản tất cả người dùng (Candidates, Recruiters, Admins)

**Thuộc tính:**
- **user_id** (PK) - INT, AUTO_INCREMENT
- email - VARCHAR(255), UNIQUE, NOT NULL
- password_hash - VARCHAR(255), NOT NULL
- full_name - VARCHAR(255), NOT NULL
- phone - VARCHAR(20)
- **role** - ENUM('candidate', 'recruiter', 'admin'), NOT NULL
- **status** - ENUM('active', 'suspended', 'deleted'), DEFAULT 'active'
- cv_url - VARCHAR(500) - cho Candidate
- skills - TEXT - JSON array
- created_at - DATETIME

**Business Rules:**
- Email phải unique
- Role xác định quyền truy cập
- Status 'deleted' = soft delete

---

### 2. COMPANIES (Công ty)
**Mô tả:** Thông tin công ty của Recruiter

**Thuộc tính:**
- **company_id** (PK) - INT, AUTO_INCREMENT
- company_name - VARCHAR(255), NOT NULL
- description - TEXT
- website - VARCHAR(255)
- logo_url - VARCHAR(500)
- address - VARCHAR(500)
- **status** - ENUM('pending', 'active', 'suspended'), DEFAULT 'pending'
- **created_by** (FK) - INT → Users.user_id
- created_at - DATETIME

**Business Rules:**
- Mỗi company được tạo bởi 1 Recruiter
- Status 'pending' cần admin duyệt

---

### 3. JOBS (Tin tuyển dụng)
**Mô tả:** Tin tuyển dụng do Recruiter đăng

**Thuộc tính:**
- **job_id** (PK) - INT, AUTO_INCREMENT
- **company_id** (FK) - INT, NOT NULL → Companies.company_id
- **recruiter_id** (FK) - INT, NOT NULL → Users.user_id
- title - VARCHAR(255), NOT NULL
- description - TEXT, NOT NULL
- requirements - TEXT
- salary_min - DECIMAL(10,2)
- salary_max - DECIMAL(10,2)
- location - VARCHAR(255)
- job_type - ENUM('full-time', 'part-time', 'remote', 'contract')
- **status** - ENUM('pending', 'active', 'closed', 'rejected', 'expired'), DEFAULT 'pending'
- expiry_date - DATE
- **approved_by** (FK) - INT → Users.user_id (Admin)
- created_at - DATETIME

**Business Rules:**
- Mỗi job thuộc 1 company
- Mỗi job do 1 recruiter quản lý
- Admin duyệt job (approved_by)
- salary_min ≤ salary_max

---

### 4. APPLICATIONS (Đơn ứng tuyển)
**Mô tả:** Hồ sơ ứng tuyển của Candidate

**Thuộc tính:**
- **application_id** (PK) - INT, AUTO_INCREMENT
- **job_id** (FK) - INT, NOT NULL → Jobs.job_id
- **candidate_id** (FK) - INT, NOT NULL → Users.user_id
- cv_url - VARCHAR(500), NOT NULL
- cover_letter - TEXT
- **status** - ENUM('pending', 'viewed', 'shortlisted', 'interview', 'accepted', 'rejected'), DEFAULT 'pending'
- applied_at - DATETIME
- **reviewed_by** (FK) - INT → Users.user_id (Recruiter)

**Unique Constraint:** (job_id, candidate_id)

**Business Rules:**
- 1 Candidate chỉ nộp 1 đơn/job
- CV upload lên cloud storage
- Recruiter review applications

---

### 5. SKILLS (Kỹ năng)
**Mô tả:** Danh sách kỹ năng trong hệ thống

**Thuộc tính:**
- **skill_id** (PK) - INT, AUTO_INCREMENT
- skill_name - VARCHAR(100), UNIQUE, NOT NULL
- category - VARCHAR(50)
- created_at - DATETIME

**Business Rules:**
- Skill_name phải unique
- Dùng để tag jobs và profiles

---

### 6. JOB_SKILLS (Bảng trung gian)
**Mô tả:** Liên kết Jobs ↔ Skills (M-N)

**Thuộc tính:**
- **job_id** (PK, FK) - INT → Jobs.job_id
- **skill_id** (PK, FK) - INT → Skills.skill_id

**Composite PK:** (job_id, skill_id)

---

## II. QUAN HỆ (RELATIONSHIPS)

### R1: Users → Companies (1:N)
- **Tên:** creates
- **Mô tả:** Recruiter tạo công ty
- **FK:** Companies.created_by → Users.user_id
- **Cardinality:** 1 User : N Companies
- **ON DELETE:** SET NULL

### R2: Companies → Jobs (1:N)
- **Tên:** posts
- **Mô tả:** Công ty đăng jobs
- **FK:** Jobs.company_id → Companies.company_id
- **Cardinality:** 1 Company : N Jobs
- **ON DELETE:** CASCADE

### R3: Users (Recruiter) → Jobs (1:N)
- **Tên:** manages
- **Mô tả:** Recruiter quản lý jobs
- **FK:** Jobs.recruiter_id → Users.user_id
- **Cardinality:** 1 User : N Jobs
- **ON DELETE:** SET NULL

### R4: Jobs → Applications (1:N)
- **Tên:** receives
- **Mô tả:** Job nhận applications
- **FK:** Applications.job_id → Jobs.job_id
- **Cardinality:** 1 Job : N Applications
- **ON DELETE:** CASCADE

### R5: Users (Candidate) → Applications (1:N)
- **Tên:** submits
- **Mô tả:** Candidate nộp applications
- **FK:** Applications.candidate_id → Users.user_id
- **Cardinality:** 1 User : N Applications
- **ON DELETE:** CASCADE

### R6: Jobs ↔ Skills (M:N)
- **Tên:** requires
- **Mô tả:** Job yêu cầu skills
- **Bảng trung gian:** Job_Skills
- **Cardinality:** M Jobs : N Skills
- **ON DELETE:** CASCADE (cả 2 FK)

### R7: Users (Admin) → Jobs (1:N)
- **Tên:** approves
- **Mô tả:** Admin duyệt jobs
- **FK:** Jobs.approved_by → Users.user_id
- **Cardinality:** 1 Admin : N Jobs
- **ON DELETE:** SET NULL

### R8: Users (Recruiter) → Applications (1:N)
- **Tên:** reviews
- **Mô tả:** Recruiter xem xét applications
- **FK:** Applications.reviewed_by → Users.user_id
- **Cardinality:** 1 Recruiter : N Applications
- **ON DELETE:** SET NULL

---

## III. CHUẨN HÓA DATABASE (NORMALIZATION)

### ✅ Đạt Third Normal Form (3NF)

**1NF (First Normal Form):**
- ✅ Mỗi cell chứa atomic value
- ✅ Mỗi row unique (có PK)
- ✅ Không có repeating groups

**2NF (Second Normal Form):**
- ✅ Đạt 1NF
- ✅ Không có partial dependency
- ✅ Tất cả non-key attributes phụ thuộc hoàn toàn vào PK

**3NF (Third Normal Form):**
- ✅ Đạt 2NF
- ✅ Không có transitive dependency
- ✅ Non-key attributes chỉ phụ thuộc PK

---

## IV. CONSTRAINTS & INDEXES

### Unique Constraints:
1. Users.email
2. Skills.skill_name
3. (Applications.job_id, Applications.candidate_id)

### Foreign Keys:
1. Companies.created_by → Users.user_id
2. Jobs.company_id → Companies.company_id
3. Jobs.recruiter_id → Users.user_id
4. Jobs.approved_by → Users.user_id
5. Applications.job_id → Jobs.job_id
6. Applications.candidate_id → Users.user_id
7. Applications.reviewed_by → Users.user_id
8. Job_Skills.job_id → Jobs.job_id
9. Job_Skills.skill_id → Skills.skill_id

### Indexes:
- Users(email) - login
- Users(role, status) - filter
- Jobs(status, expiry_date) - tìm jobs active
- Jobs(company_id) - jobs của company
- Applications(candidate_id) - lịch sử ứng tuyển
- Applications(job_id) - ứng viên của job

---

## V. KẾT LUẬN

**Tổng số bảng:** 6
- 5 Entity tables: Users, Companies, Jobs, Applications, Skills
- 1 Junction table: Job_Skills

**Tổng số quan hệ:** 8
- 7 one-to-many
- 1 many-to-many (qua Job_Skills)

**Đặc điểm:**
- ✅ Chuẩn hóa 3NF
- ✅ Foreign Key constraints
- ✅ Unique constraints
- ✅ Indexes cho performance
- ✅ Soft delete (status='deleted')
- ✅ Tối giản, dễ bảo trì
