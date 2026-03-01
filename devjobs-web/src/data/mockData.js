// ============================================
// DevJobs — Mock Data
// ============================================

export const USERS = [
    {
        user_id: 1,
        email: 'candidate@devjobs.vn',
        password: '123456',
        full_name: 'Nguyễn Văn An',
        phone: '0987654321',
        role: 'candidate',
        status: 'active',
        cv_url: '/uploads/cv_nguyenvanan.pdf',
        skills: ['React', 'JavaScript', 'Node.js', 'CSS'],
        created_at: '2026-01-15',
    },
    {
        user_id: 2,
        email: 'recruiter@devjobs.vn',
        password: '123456',
        full_name: 'Trần Thị Bình',
        phone: '0912345678',
        role: 'recruiter',
        status: 'active',
        company_id: 1,
        created_at: '2026-01-10',
    },
    {
        user_id: 3,
        email: 'admin@devjobs.vn',
        password: '123456',
        full_name: 'Lê Quang Minh',
        phone: '0901234567',
        role: 'admin',
        status: 'active',
        created_at: '2026-01-01',
    },
    {
        user_id: 4,
        email: 'ung_vien2@devjobs.vn',
        password: '123456',
        full_name: 'Phạm Minh Tuấn',
        phone: '0977888999',
        role: 'candidate',
        status: 'active',
        skills: ['Java', 'Spring Boot', 'MySQL'],
        created_at: '2026-02-01',
    },
    {
        user_id: 5,
        email: 'recruiter2@devjobs.vn',
        password: '123456',
        full_name: 'Hoàng Thị Mai',
        phone: '0933444555',
        role: 'recruiter',
        status: 'suspended',
        company_id: 2,
        created_at: '2026-01-20',
    },
];

export const COMPANIES = [
    {
        company_id: 1,
        company_name: 'ABC Technology Vietnam',
        description: 'ABC Technology là công ty phát triển phần mềm hàng đầu tại Việt Nam, chuyên cung cấp các giải pháp công nghệ cho thị trường quốc tế.',
        website: 'https://abc-tech.vn',
        logo_url: '',
        address: 'Tầng 10, Tòa nhà A, Cầu Giấy, Hà Nội',
        status: 'active',
        created_by: 2,
        created_at: '2026-01-10',
    },
    {
        company_id: 2,
        company_name: 'XYZ Solutions',
        description: 'XYZ Solutions cung cấp giải pháp phần mềm ERP cho doanh nghiệp vừa và nhỏ tại Đông Nam Á.',
        website: 'https://xyz-solutions.com',
        logo_url: '',
        address: 'Quận 1, TP. Hồ Chí Minh',
        status: 'active',
        created_by: 5,
        created_at: '2026-01-20',
    },
    {
        company_id: 3,
        company_name: 'DEF Digital Agency',
        description: 'Agency chuyên thiết kế và phát triển web, mobile app cho khách hàng quốc tế.',
        website: 'https://def-digital.vn',
        logo_url: '',
        address: 'Đà Nẵng',
        status: 'active',
        created_by: 2,
        created_at: '2026-02-01',
    },
];

export const JOBS = [
    {
        job_id: 1,
        company_id: 1,
        recruiter_id: 2,
        title: 'Senior React Developer',
        description: 'Chúng tôi đang tìm kiếm một Senior React Developer tài năng để tham gia vào đội ngũ phát triển sản phẩm. Bạn sẽ chịu trách nhiệm xây dựng và phát triển các ứng dụng web hiện đại với React và các công nghệ liên quan.',
        requirements: '3+ năm kinh nghiệm phát triển với React.js\nThành thạo TypeScript và JavaScript ES6+\nKinh nghiệm với Redux, Context API\nHiểu biết về RESTful APIs và GraphQL\nKinh nghiệm với testing (Jest, React Testing Library)\nCó khả năng làm việc nhóm và giao tiếp tốt',
        benefits: 'Mức lương cạnh tranh, thưởng theo hiệu suất\nBảo hiểm sức khỏe cao cấp\n13 ngày nghỉ phép/năm\nMôi trường làm việc hiện đại, năng động\nCơ hội phát triển nghề nghiệp và đào tạo',
        salary_min: 1500,
        salary_max: 2500,
        location: 'Hà Nội',
        job_type: 'full-time',
        status: 'active',
        expiry_date: '2026-04-01',
        skills: ['React', 'TypeScript', 'Redux', 'Next.js'],
        created_at: '2026-02-26',
    },
    {
        job_id: 2,
        company_id: 2,
        recruiter_id: 5,
        title: 'Backend Engineer (Node.js)',
        description: 'Tham gia xây dựng hệ thống backend cho ứng dụng SaaS phục vụ hàng triệu người dùng. Bạn sẽ thiết kế API, tối ưu database và đảm bảo hệ thống chạy ổn định.',
        requirements: '2+ năm kinh nghiệm với Node.js\nThành thạo Express.js hoặc NestJS\nKinh nghiệm với MongoDB và Redis\nHiểu biết về Docker và CI/CD\nKỹ năng giải quyết vấn đề tốt',
        benefits: 'Lương tháng 13, review 2 lần/năm\nLàm việc remote 2 ngày/tuần\nTeam building hàng quý',
        salary_min: 1200,
        salary_max: 2000,
        location: 'TP. Hồ Chí Minh',
        job_type: 'full-time',
        status: 'active',
        expiry_date: '2026-03-25',
        skills: ['Node.js', 'Express', 'MongoDB', 'AWS'],
        created_at: '2026-02-23',
    },
    {
        job_id: 3,
        company_id: 3,
        recruiter_id: 2,
        title: 'Full Stack Developer (MERN)',
        description: 'Vị trí full stack developer sử dụng MERN stack, làm việc với nhiều dự án đa dạng từ web app đến mobile app.',
        requirements: '2+ năm kinh nghiệm Full Stack\nThành thạo React và Node.js\nKinh nghiệm với MongoDB\nBiết về responsive design\nKhả năng tự học và nghiên cứu',
        benefits: 'Được đào tạo công nghệ mới\nLương hấp dẫn theo năng lực\nMôi trường trẻ trung, sáng tạo',
        salary_min: 1000,
        salary_max: 1800,
        location: 'Đà Nẵng',
        job_type: 'full-time',
        status: 'active',
        expiry_date: '2026-03-20',
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        created_at: '2026-02-20',
    },
    {
        job_id: 4,
        company_id: 1,
        recruiter_id: 2,
        title: 'Junior Java Developer',
        description: 'Cơ hội cho fresher/junior muốn phát triển sự nghiệp với Java. Được mentor bởi senior developers và tham gia các dự án thực tế.',
        requirements: 'Có kiến thức về Java Core, OOP\nBiết cơ bản Spring Boot\nHiểu về SQL và RDBMS\nHam học hỏi, chịu khó',
        benefits: 'Được đào tạo từ đầu\nLương thử việc 85%\nBảo hiểm đầy đủ',
        salary_min: 500,
        salary_max: 800,
        location: 'Hà Nội',
        job_type: 'full-time',
        status: 'pending',
        expiry_date: '2026-04-15',
        skills: ['Java', 'Spring Boot', 'MySQL', 'Git'],
        created_at: '2026-02-28',
    },
    {
        job_id: 5,
        company_id: 2,
        recruiter_id: 5,
        title: 'DevOps Engineer',
        description: 'Quản lý hạ tầng cloud, CI/CD pipeline và đảm bảo hệ thống vận hành ổn định 24/7.',
        requirements: 'Kinh nghiệm với AWS/GCP/Azure\nThành thạo Docker, Kubernetes\nBiết Terraform hoặc Ansible\nKinh nghiệm với CI/CD (Jenkins, GitLab CI)',
        benefits: 'Lương cao nhất thị trường\nĐược cấp thiết bị làm việc\nLàm việc remote hoàn toàn',
        salary_min: 2000,
        salary_max: 3500,
        location: 'Remote',
        job_type: 'remote',
        status: 'pending',
        expiry_date: '2026-04-10',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
        created_at: '2026-02-27',
    },
    {
        job_id: 6,
        company_id: 1,
        recruiter_id: 2,
        title: 'UI/UX Designer',
        description: 'Thiết kế giao diện người dùng cho các sản phẩm web và mobile app. Làm việc chặt chẽ với team frontend.',
        requirements: 'Thành thạo Figma hoặc Adobe XD\nHiểu về UX principles\nCó portfolio ấn tượng\nBiết cơ bản HTML/CSS là một plus',
        benefits: 'Sáng tạo không giới hạn\nĐược tham gia các dự án lớn\nTeam design chuyên nghiệp',
        salary_min: 800,
        salary_max: 1500,
        location: 'Hà Nội',
        job_type: 'full-time',
        status: 'closed',
        expiry_date: '2026-02-15',
        skills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'],
        created_at: '2026-01-15',
    },
];

export const APPLICATIONS = [
    {
        application_id: 1,
        job_id: 1,
        candidate_id: 1,
        cv_url: '/uploads/cv_nguyenvanan.pdf',
        cover_letter: 'Tôi rất quan tâm đến vị trí Senior React Developer tại ABC Technology. Với 3 năm kinh nghiệm làm việc với React, tôi tin rằng mình có thể đóng góp tích cực cho đội ngũ của quý công ty.',
        status: 'pending',
        applied_at: '2026-02-27',
    },
    {
        application_id: 2,
        job_id: 2,
        candidate_id: 1,
        cv_url: '/uploads/cv_nguyenvanan.pdf',
        cover_letter: 'Tôi muốn chuyển hướng sang Backend và vị trí này rất phù hợp với định hướng của tôi.',
        status: 'viewed',
        applied_at: '2026-02-25',
    },
    {
        application_id: 3,
        job_id: 1,
        candidate_id: 4,
        cv_url: '/uploads/cv_phamminhtuan.pdf',
        cover_letter: 'Mặc dù kinh nghiệm chính của tôi là Java nhưng tôi đã tự học React 6 tháng và muốn thử thách bản thân.',
        status: 'shortlisted',
        applied_at: '2026-02-26',
    },
    {
        application_id: 4,
        job_id: 3,
        candidate_id: 4,
        cv_url: '/uploads/cv_phamminhtuan.pdf',
        cover_letter: 'Tôi rất thích vị trí Full Stack tại DEF Digital Agency.',
        status: 'interview',
        applied_at: '2026-02-22',
    },
    {
        application_id: 5,
        job_id: 6,
        candidate_id: 1,
        cv_url: '/uploads/cv_nguyenvanan.pdf',
        cover_letter: 'Tôi muốn thử sức với UI/UX.',
        status: 'rejected',
        applied_at: '2026-01-20',
    },
];

export const SKILLS = [
    { skill_id: 1, skill_name: 'React', category: 'Frontend' },
    { skill_id: 2, skill_name: 'Node.js', category: 'Backend' },
    { skill_id: 3, skill_name: 'JavaScript', category: 'Language' },
    { skill_id: 4, skill_name: 'TypeScript', category: 'Language' },
    { skill_id: 5, skill_name: 'Java', category: 'Language' },
    { skill_id: 6, skill_name: 'Python', category: 'Language' },
    { skill_id: 7, skill_name: 'Spring Boot', category: 'Backend' },
    { skill_id: 8, skill_name: 'Express', category: 'Backend' },
    { skill_id: 9, skill_name: 'MongoDB', category: 'Database' },
    { skill_id: 10, skill_name: 'MySQL', category: 'Database' },
    { skill_id: 11, skill_name: 'PostgreSQL', category: 'Database' },
    { skill_id: 12, skill_name: 'Docker', category: 'DevOps' },
    { skill_id: 13, skill_name: 'AWS', category: 'Cloud' },
    { skill_id: 14, skill_name: 'Redux', category: 'Frontend' },
    { skill_id: 15, skill_name: 'Next.js', category: 'Frontend' },
    { skill_id: 16, skill_name: 'Figma', category: 'Design' },
    { skill_id: 17, skill_name: 'Git', category: 'Tool' },
    { skill_id: 18, skill_name: 'CSS', category: 'Frontend' },
    { skill_id: 19, skill_name: 'Kubernetes', category: 'DevOps' },
    { skill_id: 20, skill_name: 'Terraform', category: 'DevOps' },
];

// Helper functions
export function getCompanyById(id) {
    return COMPANIES.find(c => c.company_id === id);
}

export function getUserById(id) {
    return USERS.find(u => u.user_id === id);
}

export function getJobsByCompany(companyId) {
    return JOBS.filter(j => j.company_id === companyId);
}

export function getJobsByRecruiter(recruiterId) {
    return JOBS.filter(j => j.recruiter_id === recruiterId);
}

export function getApplicationsByJob(jobId) {
    return APPLICATIONS.filter(a => a.job_id === jobId);
}

export function getApplicationsByCandidate(candidateId) {
    return APPLICATIONS.filter(a => a.candidate_id === candidateId);
}

export function getStatusLabel(status) {
    const map = {
        active: 'Đang hoạt động',
        pending: 'Chờ duyệt',
        closed: 'Đã đóng',
        rejected: 'Từ chối',
        expired: 'Hết hạn',
        viewed: 'Đã xem',
        shortlisted: 'Vào danh sách ngắn',
        interview: 'Mời phỏng vấn',
        accepted: 'Đã chấp nhận',
        suspended: 'Tạm khóa',
        deleted: 'Đã xóa',
    };
    return map[status] || status;
}

export function getStatusBadge(status) {
    const map = {
        active: 'badge-success',
        pending: 'badge-warning',
        closed: 'badge-default',
        rejected: 'badge-danger',
        expired: 'badge-default',
        viewed: 'badge-info',
        shortlisted: 'badge-info',
        interview: 'badge-warning',
        accepted: 'badge-success',
        suspended: 'badge-danger',
        deleted: 'badge-danger',
    };
    return map[status] || 'badge-default';
}
