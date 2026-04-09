using Microsoft.AspNetCore.Mvc;
using DevJobsAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DevJobsAPI.Controllers
{
    [ApiController]
    [Route("api/seed")]
    public class SeedController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SeedController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> SeedData()
        {
            if (await _db.Users.AnyAsync(u => u.Email == "candidate2026@devjobs.vn"))
                return BadRequest(new { message = "Dữ liệu mẫu đợt 2 đã tồn tại!" });

            var passHash = BCrypt.Net.BCrypt.HashPassword("123456");

            // 1. Users
            var u1 = new User { Email = "candidate2026@devjobs.vn", PasswordHash = passHash, FullName = "Nguyễn Văn B (Mới)", Phone = "0987111222", Role = "candidate", Status = "active", CvUrl = "/uploads/cv_b.pdf", Skills = "Vue.js, PHP, Laravel", CreatedAt = DateTime.Now };
            var u2 = new User { Email = "recruiter2026@devjobs.vn", PasswordHash = passHash, FullName = "Trần Thị C (Mới)", Phone = "0912111222", Role = "recruiter", Status = "active", CreatedAt = DateTime.Now };
            
            _db.Users.AddRange(u1, u2);
            await _db.SaveChangesAsync();

            // 2. Companies
            var c1 = new Company { CompanyName = "TechNova Solutions", Description = "Startup công nghệ AI mới nổi", Website = "https://technova.vn", Address = "Đà Nẵng", Status = "active", CreatedBy = u2.UserId, CreatedAt = DateTime.Now };

            _db.Companies.Add(c1);
            await _db.SaveChangesAsync();

            // 3. Skills (Chỉ thêm nếu chưa có)
            var newSkillsList = new[] { "Vue.js", "PHP", "Laravel", "Ruby", "C#" };
            var existingSkills = await _db.Skills.Select(s => s.SkillName).ToListAsync();
            var skillsToAdd = newSkillsList.Except(existingSkills).Select(s => new Skill { SkillName = s }).ToList();
            if (skillsToAdd.Any())
            {
                _db.Skills.AddRange(skillsToAdd);
                await _db.SaveChangesAsync();
            }

            // 4. Jobs
            var j1 = new Job { CompanyId = c1.CompanyId, RecruiterId = u2.UserId, Title = "Senior Vue.js Developer", Description = "Làm việc với framework Vue3 ecosystem...", Requirements = "4 năm kinh nghiệm Vue", SalaryMin = 1800, SalaryMax = 2800, Location = "Đà Nẵng", JobType = "full-time", Status = "active", ExpiryDate = DateOnly.FromDateTime(DateTime.Now.AddDays(45)), CreatedAt = DateTime.Now, ApprovedBy = await _db.Users.Where(u => u.Role == "admin").Select(u => u.UserId).FirstOrDefaultAsync() };
            
            _db.Jobs.Add(j1);
            await _db.SaveChangesAsync();

            // Gán skill
            var vueSkill = await _db.Skills.FirstOrDefaultAsync(s => s.SkillName == "Vue.js");
            if (vueSkill != null) {
                j1.Skills.Add(vueSkill);
                await _db.SaveChangesAsync();
            }

            // 5. Applications
            var a1 = new Application { JobId = j1.JobId, CandidateId = u1.UserId, CvUrl = u1.CvUrl, CoverLetter = "Tôi có kinh nghiệm Vue3 Composition API...", Status = "pending", AppliedAt = DateTime.Now };

            _db.Applications.Add(a1);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Seeding dữ liệu đợt 2 thành công!" });
        }
        [HttpPost("fix-unicode")]
        public async Task<IActionResult> FixUnicode()
        {
            // Fix corrupted location data
            await _db.Database.ExecuteSqlRawAsync("UPDATE JOBS SET location = N'Đà Nẵng' WHERE location LIKE '%N_ng%'");
            await _db.Database.ExecuteSqlRawAsync("UPDATE JOBS SET location = N'Hà Nội' WHERE location LIKE '%N_i%'");
            await _db.Database.ExecuteSqlRawAsync("UPDATE JOBS SET location = N'TP. Hồ Chí Minh' WHERE location LIKE '%H_ Ch%'");
            
            // Fix corrupted full_name data
            await _db.Database.ExecuteSqlRawAsync("UPDATE USERS SET full_name = N'Nguyễn Văn A' WHERE email='candidate@devjobs.vn'");
            await _db.Database.ExecuteSqlRawAsync("UPDATE USERS SET full_name = N'Nguyễn Văn B' WHERE email='candidate2026@devjobs.vn'");
            await _db.Database.ExecuteSqlRawAsync("UPDATE USERS SET full_name = N'Trần Thị C' WHERE email='recruiter2026@devjobs.vn'");

            return Ok(new { message = "Đã sửa dữ liệu Unicode thành công!" });
        }

        [HttpPost("fix-names")]
        public async Task<IActionResult> FixNames()
        {
            // Fix corrupted Vietnamese names for all seeded users
            await _db.Database.ExecuteSqlRawAsync("UPDATE USERS SET full_name = N'Nguyễn Văn A' WHERE email='candidate@devjobs.vn'");
            await _db.Database.ExecuteSqlRawAsync("UPDATE USERS SET full_name = N'Trần Thị Bình' WHERE email='recruiter@devjobs.vn'");
            await _db.Database.ExecuteSqlRawAsync("UPDATE USERS SET full_name = N'Phạm Minh Tuấn' WHERE email='ung_vien2@devjobs.vn'");
            await _db.Database.ExecuteSqlRawAsync("UPDATE USERS SET full_name = N'Hoàng Thị Mai' WHERE email='recruiter2@devjobs.vn'");
            await _db.Database.ExecuteSqlRawAsync("UPDATE USERS SET full_name = N'Nguyễn Văn B (Mới)' WHERE email='candidate2026@devjobs.vn'");
            await _db.Database.ExecuteSqlRawAsync("UPDATE USERS SET full_name = N'Trần Thị C (Mới)' WHERE email='recruiter2026@devjobs.vn'");

            return Ok(new { message = "Đã sửa tên tiếng Việt thành công!" });
        }

        [HttpPost("seed-10-jobs")]
        public async Task<IActionResult> Seed10Jobs()
        {
            var admin = await _db.Users.FirstOrDefaultAsync(u => u.Role == "admin");
            var recruiters = await _db.Users.Where(u => u.Role == "recruiter").Take(2).ToListAsync();
            var companies = await _db.Companies.ToListAsync();
            
            if (companies.Count == 0 || recruiters.Count == 0) 
                return BadRequest(new { message = "Chưa có company hoặc recruiter nào trong DB" });

            var skills = await _db.Skills.Take(5).ToListAsync();
            var rand = new Random();
            var locations = new[] { "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Remote" };
            var jobTypes = new[] { "full-time", "part-time", "remote", "contract" };
            
            var newJobs = new List<Job>();

            for (int i = 1; i <= 10; i++)
            {
                var company = companies[rand.Next(companies.Count)];
                
                var job = new Job {
                    CompanyId = company.CompanyId,
                    RecruiterId = company.CreatedBy,
                    Title = $"Kỹ sư Phần Mềm (Mẫu #{i}) - {DateTime.Now.Ticks.ToString().Substring(0, 4)}",
                    Description = $"Đây là bài đăng mẫu số {i} sinh tự động. Chi tiết công việc sẽ trao đổi khi phỏng vấn.",
                    Requirements = "- Có kinh nghiệm làm việc thực tế\n- Chịu khó học hỏi, thái độ tốt\n- Có khả năng đọc hiểu tài liệu tiếng Anh",
                    SalaryMin = rand.Next(500, 1000),
                    SalaryMax = rand.Next(1100, 3000),
                    Location = locations[rand.Next(locations.Length)],
                    JobType = jobTypes[rand.Next(jobTypes.Length)],
                    Status = "active",
                    ExpiryDate = DateOnly.FromDateTime(DateTime.Now.AddDays(rand.Next(10, 60))),
                    CreatedAt = DateTime.Now.AddDays(-rand.Next(0, 15)),
                    ApprovedBy = admin?.UserId
                };
                
                if (skills.Count > 0)
                {
                    job.Skills.Add(skills[rand.Next(skills.Count)]);
                }
                
                newJobs.Add(job);
            }

            _db.Jobs.AddRange(newJobs);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Seeding thành công 10 bài tuyền dụng mới!" });
        }
        [HttpPost("fix-all-jobs")]
        public async Task<IActionResult> FixAllJobs()
        {
            var jobs = await _db.Jobs.ToListAsync();
            var locations = new[] { "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Remote" };
            var rand = new Random();
            foreach (var job in jobs)
            {
                if (job.Location != null && (job.Location.Contains("Ã") || job.Location.Contains("Ä") || job.Location.Contains("NÃ") || job.Location.Contains("Â")))
                {
                    job.Location = locations[rand.Next(locations.Length)];
                }
                
                if (job.Title != null && (job.Title.Contains("Ã") || job.Title.Contains("Ä") || job.Title.Contains("NÃ") || job.Title.Contains("Â")))
                {
                   job.Title = "Lập trình viên (Đã sửa lỗi font)";
                }
            }
            await _db.SaveChangesAsync();
            return Ok(new { message = "Đã sửa toàn bộ lỗi font!" });
        }
    }
}
