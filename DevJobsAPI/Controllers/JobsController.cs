using DevJobsAPI.Models;
using DevJobsAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DevJobsAPI.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _db;

        // Collation hỗ trợ tìm kiếm tiếng Việt không phân biệt dấu (Accent Insensitive)
        private const string ViCollation = "Vietnamese_CI_AI";

        public JobsController(AppDbContext db) => _db = db;

        private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        /// <summary>Tìm kiếm / lấy danh sách tin tuyển dụng (public)</summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetJobs([FromQuery] JobQueryParams q)
        {
            var query = _db.Jobs
                .Include(j => j.Company)
                .Include(j => j.Skills)
                .Include(j => j.Applications)
                .Where(j => j.Status == "active")
                .AsQueryable();

            // Tìm kiếm tiếng Việt không phân biệt dấu (Vietnamese_CI_AI)
            if (!string.IsNullOrEmpty(q.Keyword))
                query = query.Where(j =>
                    EF.Functions.Collate(j.Title, ViCollation).Contains(q.Keyword) ||
                    EF.Functions.Collate(j.Description, ViCollation).Contains(q.Keyword) ||
                    EF.Functions.Collate(j.Company.CompanyName, ViCollation).Contains(q.Keyword));

            if (!string.IsNullOrEmpty(q.Location))
                query = query.Where(j => EF.Functions.Collate(j.Location, ViCollation).Contains(q.Location));

            if (!string.IsNullOrEmpty(q.JobType))
                query = query.Where(j => j.JobType == q.JobType);

            if (q.SalaryMin.HasValue)
                query = query.Where(j => j.SalaryMax >= q.SalaryMin.Value);

            if (q.SalaryMax.HasValue)
                query = query.Where(j => j.SalaryMin <= q.SalaryMax.Value);

            if (!string.IsNullOrEmpty(q.Skill))
                query = query.Where(j => j.Skills.Any(s => EF.Functions.Collate(s.SkillName, ViCollation).Contains(q.Skill)));

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(j => j.CreatedAt)
                .Skip((q.Page - 1) * q.PageSize)
                .Take(q.PageSize)
                .ToListAsync();

            return Ok(new PagedResult<JobDto>
            {
                Total = total,
                Page = q.Page,
                PageSize = q.PageSize,
                Items = items.Select(MapToDto).ToList()
            });
        }

        /// <summary>Chi tiết một tin tuyển dụng (public)</summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _db.Jobs
                .Include(j => j.Company)
                .Include(j => j.Skills)
                .Include(j => j.Applications)
                .FirstOrDefaultAsync(j => j.JobId == id);

            if (job == null) return NotFound();
            return Ok(MapToDto(job));
        }

        /// <summary>Tin tuyển dụng của recruiter đang đăng nhập</summary>
        [HttpGet("my")]
        [Authorize(Roles = "recruiter")]
        public async Task<IActionResult> GetMyJobs()
        {
            var jobs = await _db.Jobs
                .Include(j => j.Company)
                .Include(j => j.Skills)
                .Include(j => j.Applications)
                .Where(j => j.RecruiterId == CurrentUserId)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return Ok(jobs.Select(MapToDto));
        }

        /// <summary>Đăng tin tuyển dụng mới (recruiter)</summary>
        [HttpPost]
        [Authorize(Roles = "recruiter")]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
        {
            var companyId = await _db.Companies.Where(c => c.CreatedBy == CurrentUserId).Select(c => c.CompanyId).FirstOrDefaultAsync();
            if (companyId == 0)
                return BadRequest(new { message = "Bạn chưa có thông tin công ty" });

            var skills = await _db.Skills.Where(s => dto.SkillIds.Contains(s.SkillId)).ToListAsync();

            var job = new Job
            {
                CompanyId = companyId,
                RecruiterId = CurrentUserId,
                Title = dto.Title,
                Description = dto.Description,
                Requirements = dto.Requirements,
                SalaryMin = dto.SalaryMin,
                SalaryMax = dto.SalaryMax,
                Location = dto.Location,
                JobType = dto.JobType,
                Status = "pending", // cần admin duyệt
                ExpiryDate = dto.ExpiryDate,
                Skills = skills
            };

            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetJob), new { id = job.JobId }, new { message = "Đăng tin thành công, chờ admin duyệt", jobId = job.JobId });
        }

        /// <summary>Cập nhật tin tuyển dụng (recruiter - chủ sở hữu)</summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "recruiter")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] UpdateJobDto dto)
        {
            var job = await _db.Jobs.Include(j => j.Skills).FirstOrDefaultAsync(j => j.JobId == id);
            if (job == null) return NotFound();
            if (job.RecruiterId != CurrentUserId) return Forbid();

            job.Title = dto.Title;
            job.Description = dto.Description;
            job.Requirements = dto.Requirements;
            job.SalaryMin = dto.SalaryMin;
            job.SalaryMax = dto.SalaryMax;
            job.Location = dto.Location;
            job.JobType = dto.JobType;
            job.ExpiryDate = dto.ExpiryDate;

            job.Skills.Clear();
            var skills = await _db.Skills.Where(s => dto.SkillIds.Contains(s.SkillId)).ToListAsync();
            foreach (var s in skills) job.Skills.Add(s);

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật tin thành công" });
        }

        /// <summary>Đóng tin tuyển dụng (recruiter)</summary>
        [HttpPut("{id}/close")]
        [Authorize(Roles = "recruiter")]
        public async Task<IActionResult> CloseJob(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound();
            if (job.RecruiterId != CurrentUserId) return Forbid();

            job.Status = "closed";
            await _db.SaveChangesAsync();
            return Ok(new { message = "Đã đóng tin tuyển dụng" });
        }

        /// <summary>Gia hạn tin tuyển dụng (recruiter)</summary>
        [HttpPut("{id}/renew")]
        [Authorize(Roles = "recruiter")]
        public async Task<IActionResult> RenewJob(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound();
            if (job.RecruiterId != CurrentUserId) return Forbid();

            job.Status = "active";
            job.ExpiryDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30));
            await _db.SaveChangesAsync();
            return Ok(new { message = "Gia hạn tin thành công thêm 30 ngày" });
        }

        /// <summary>Danh sách tin chờ duyệt (admin)</summary>
        [HttpGet("pending")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetPendingJobs()
        {
            var jobs = await _db.Jobs
                .Include(j => j.Company)
                .Include(j => j.Skills)
                .Include(j => j.Applications)
                .Where(j => j.Status == "pending")
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return Ok(jobs.Select(MapToDto));
        }

        /// <summary>Duyệt tin tuyển dụng (admin)</summary>
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> ApproveJob(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            job.Status = "active";
            await _db.SaveChangesAsync();
            return Ok(new { message = "Đã duyệt tin tuyển dụng" });
        }

        /// <summary>Từ chối tin tuyển dụng (admin)</summary>
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> RejectJob(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            job.Status = "closed";
            await _db.SaveChangesAsync();
            return Ok(new { message = "Đã từ chối tin tuyển dụng" });
        }

        /// <summary>Duyệt hàng loạt tin tuyển dụng (admin)</summary>
        [HttpPut("bulk-approve")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> BulkApprove([FromBody] List<int> ids)
        {
            var jobs = await _db.Jobs.Where(j => ids.Contains(j.JobId) && j.Status == "pending").ToListAsync();
            foreach (var job in jobs)
            {
                job.Status = "active";
            }
            await _db.SaveChangesAsync();
            return Ok(new { message = $"Đã duyệt {jobs.Count} tin tuyển dụng" });
        }

        /// <summary>Từ chối hàng loạt tin tuyển dụng (admin)</summary>
        [HttpPut("bulk-reject")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> BulkReject([FromBody] List<int> ids)
        {
            var jobs = await _db.Jobs.Where(j => ids.Contains(j.JobId) && j.Status == "pending").ToListAsync();
            foreach (var job in jobs)
            {
                job.Status = "closed";
            }
            await _db.SaveChangesAsync();
            return Ok(new { message = $"Đã từ chối {jobs.Count} tin tuyển dụng" });
        }

        private static JobDto MapToDto(Job j) => new JobDto
        {
            JobId = j.JobId,
            CompanyId = j.CompanyId,
            CompanyName = j.Company?.CompanyName ?? "",
            CompanyLogo = j.Company?.LogoUrl,
            RecruiterId = j.RecruiterId,
            Title = j.Title,
            Description = j.Description,
            Requirements = j.Requirements,
            SalaryMin = j.SalaryMin,
            SalaryMax = j.SalaryMax,
            Location = j.Location,
            JobType = j.JobType,
            Status = j.Status,
            ExpiryDate = j.ExpiryDate,
            CreatedAt = j.CreatedAt,
            Skills = j.Skills?.Select(s => s.SkillName ?? "").ToList() ?? new(),
            ApplicationCount = j.Applications?.Count ?? 0
        };
    }
}
