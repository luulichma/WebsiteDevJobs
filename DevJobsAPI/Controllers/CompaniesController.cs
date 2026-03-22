using DevJobsAPI.Models;
using DevJobsAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DevJobsAPI.Controllers
{
    [ApiController]
    [Route("api/companies")]
    public class CompaniesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CompaniesController(AppDbContext db) => _db = db;

        private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        /// <summary>Xem thông tin công ty theo ID (public)</summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCompany(int id)
        {
            var company = await _db.Companies
                .Include(c => c.Jobs)
                .FirstOrDefaultAsync(c => c.CompanyId == id);

            if (company == null) return NotFound();

            return Ok(new CompanyDto
            {
                CompanyId = company.CompanyId,
                CompanyName = company.CompanyName,
                Description = company.Description,
                Website = company.Website,
                LogoUrl = company.LogoUrl,
                Address = company.Address,
                Status = company.Status,
                CreatedAt = company.CreatedAt.GetValueOrDefault(),
                JobCount = company.Jobs.Count(j => j.Status == "active")
            });
        }

        /// <summary>Cập nhật thông tin công ty (recruiter)</summary>
        [HttpPut("my")]
        [Authorize(Roles = "recruiter")]
        public async Task<IActionResult> UpdateMyCompany([FromBody] UpdateCompanyDto dto)
        {
            var company = await _db.Companies.FirstOrDefaultAsync(c => c.CreatedBy == CurrentUserId);
            if (company == null)
                return BadRequest(new { message = "Bạn chưa có công ty. Hãy liên hệ admin." });

            company.CompanyName = dto.CompanyName;
            company.Description = dto.Description;
            company.Website = dto.Website;
            company.LogoUrl = dto.LogoUrl;
            company.Address = dto.Address;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thông tin công ty thành công" });
        }
        /// <summary>Tạo công ty mới (recruiter chưa có công ty)</summary>
        [HttpPost]
        [Authorize(Roles = "recruiter")]
        public async Task<IActionResult> CreateCompany([FromBody] UpdateCompanyDto dto)
        {
            var existing = await _db.Companies.AnyAsync(c => c.CreatedBy == CurrentUserId);
            if (existing)
                return BadRequest(new { message = "Bạn đã có công ty rồi" });

            var company = new Company
            {
                CompanyName = dto.CompanyName,
                Description = dto.Description,
                Website = dto.Website,
                LogoUrl = dto.LogoUrl,
                Address = dto.Address,
                Status = "active",
                CreatedBy = CurrentUserId
            };

            _db.Companies.Add(company);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Tạo công ty thành công", companyId = company.CompanyId });
        }
    }
}
