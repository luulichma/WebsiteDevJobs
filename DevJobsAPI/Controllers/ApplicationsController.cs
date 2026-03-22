using DevJobsAPI.Models;
using DevJobsAPI.DTOs;
using DevJobsAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DevJobsAPI.Controllers
{
    [ApiController]
    [Route("api/applications")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ApplicationsController(AppDbContext db) => _db = db;

        private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        /// <summary>Nộp hồ sơ ứng tuyển (candidate)</summary>
        [HttpPost]
        [Authorize(Roles = "candidate")]
        public async Task<IActionResult> Apply([FromBody] CreateApplicationDto dto)
        {
            // Kiểm tra đã ứng tuyển chưa
            var existing = await _db.Applications
                .AnyAsync(a => a.JobId == dto.JobId && a.CandidateId == CurrentUserId);
            if (existing)
                return BadRequest(new { message = "Bạn đã ứng tuyển vị trí này rồi" });

            // Kiểm tra job còn active không
            var job = await _db.Jobs.FindAsync(dto.JobId);
            if (job == null || job.Status != "active")
                return BadRequest(new { message = "Tin tuyển dụng không còn hoạt động" });

            var application = new Application
            {
                JobId = dto.JobId,
                CandidateId = CurrentUserId,
                CvUrl = dto.CvUrl,
                CoverLetter = dto.CoverLetter,
                Status = "pending"
            };

            _db.Applications.Add(application);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Nộp hồ sơ thành công", applicationId = application.ApplicationId });
        }

        /// <summary>Lịch sử ứng tuyển của candidate (candidate)</summary>
        [HttpGet("my-applications")]
        [Authorize(Roles = "candidate")]
        public async Task<IActionResult> GetMyApplications()
        {
            var apps = await _db.Applications
                .Include(a => a.Job).ThenInclude(j => j!.Company)
                .Include(a => a.Candidate)
                .Where(a => a.CandidateId == CurrentUserId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return Ok(apps.Select(MapToDto));
        }

        /// <summary>Danh sách ứng viên của một tin (recruiter)</summary>
        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "recruiter")]
        public async Task<IActionResult> GetApplicationsByJob(int jobId)
        {
            // Kiểm tra recruiter là chủ sở hữu tin
            var job = await _db.Jobs.FindAsync(jobId);
            if (job == null) return NotFound();
            if (job.RecruiterId != CurrentUserId) return Forbid();

            var apps = await _db.Applications
                .Include(a => a.Job).ThenInclude(j => j!.Company)
                .Include(a => a.Candidate)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

            return Ok(apps.Select(MapToDto));
        }

        /// <summary>Cập nhật trạng thái ứng viên (recruiter)</summary>
        [HttpPut("{id}/status")]
        [Authorize(Roles = "recruiter")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateApplicationStatusDto dto)
        {
            var app = await _db.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.ApplicationId == id);

            if (app == null) return NotFound();
            if (app.Job?.RecruiterId != CurrentUserId) return Forbid();

            var validStatuses = new[] { "pending", "viewed", "shortlisted", "interview", "accepted", "rejected" };
            if (!validStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Trạng thái không hợp lệ" });

            app.Status = dto.Status;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật trạng thái thành công", status = app.Status });
        }

        private static ApplicationDto MapToDto(Application a) => new ApplicationDto
        {
            ApplicationId = a.ApplicationId,
            JobId = a.JobId,
            JobTitle = a.Job?.Title ?? "",
            CompanyName = a.Job?.Company?.CompanyName ?? "",
            CandidateId = a.CandidateId,
            CandidateName = a.Candidate?.FullName ?? "",
            CandidateEmail = a.Candidate?.Email ?? "",
            CvUrl = a.CvUrl,
            CoverLetter = a.CoverLetter,
            Status = a.Status,
            AppliedAt = a.AppliedAt
        };
    }
}
