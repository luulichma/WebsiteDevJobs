using DevJobsAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DevJobsAPI.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminController(AppDbContext db) { _db = db; }

        /// <summary>Thống kê tổng quan hệ thống dành cho Admin</summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            // Users
            var totalUsers = await _db.Users.CountAsync();
            var totalCandidates = await _db.Users.CountAsync(u => u.Role == "candidate");
            var totalRecruiters = await _db.Users.CountAsync(u => u.Role == "recruiter");
            var activeUsers = await _db.Users.CountAsync(u => u.Status == "active");

            // Jobs
            var totalJobs = await _db.Jobs.CountAsync();
            var activeJobs = await _db.Jobs.CountAsync(j => j.Status == "active");
            var pendingJobs = await _db.Jobs.CountAsync(j => j.Status == "pending");
            var closedJobs = await _db.Jobs.CountAsync(j => j.Status == "closed");

            // Applications
            var totalApplications = await _db.Applications.CountAsync();
            var pendingApps = await _db.Applications.CountAsync(a => a.Status == "pending");
            var interviewApps = await _db.Applications.CountAsync(a => a.Status == "interview");
            var acceptedApps = await _db.Applications.CountAsync(a => a.Status == "accepted");
            var rejectedApps = await _db.Applications.CountAsync(a => a.Status == "rejected");

            // Companies
            var totalCompanies = await _db.Companies.CountAsync();

            // Recent users (last 5)
            var recentUsers = await _db.Users
                .OrderByDescending(u => u.CreatedAt)
                .Take(5)
                .Select(u => new { u.UserId, u.FullName, u.Email, u.Role, u.CreatedAt })
                .ToListAsync();

            // Recent jobs (last 5)
            var recentJobs = await _db.Jobs
                .OrderByDescending(j => j.CreatedAt)
                .Take(5)
                .Select(j => new { j.JobId, j.Title, j.Status, j.CreatedAt, CompanyName = j.Company != null ? j.Company.CompanyName : "" })
                .ToListAsync();

            return Ok(new
            {
                users = new { total = totalUsers, candidates = totalCandidates, recruiters = totalRecruiters, active = activeUsers },
                jobs = new { total = totalJobs, active = activeJobs, pending = pendingJobs, closed = closedJobs },
                applications = new { total = totalApplications, pending = pendingApps, interview = interviewApps, accepted = acceptedApps, rejected = rejectedApps },
                companies = new { total = totalCompanies },
                recentUsers,
                recentJobs
            });
        }

        /// <summary>Danh sách công ty (admin)</summary>
        [HttpGet("companies")]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _db.Companies
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    c.CompanyId,
                    c.CompanyName,
                    c.Address,
                    c.Status,
                    c.CreatedAt,
                    JobCount = c.Jobs.Count
                })
                .ToListAsync();

            return Ok(companies);
        }
    }
}
